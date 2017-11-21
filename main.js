/*eslint-env node, es6*/

/* Module Description */
// Removes headings on Modules in D2L to prevent Canvas creating pages for them

/* Put dependencies here */
const canvas = require('canvas-wrapper');

module.exports = (course, stepCallback) => {
    course.addModuleReport('moduleHeadings');

    var manifest = course.content.find(file => file.name === 'imsmanifest.xml');
    var modules = manifest.dom('organization').children();

    modules = modules.filter((index, element) => {
        return element.attribs.description != '';
    });

    course.newInfo('moduleHeadingContent', []);

    if (modules) {
        modules.each((index, element) => {
            var titleChild = element.children.find(child => {
                return child.name === 'title';
            });
            var moduleTitle = titleChild.children[0].data;
            course.info.moduleHeadingContent.push([moduleTitle, element.attribs.description]);
            element.attribs.description = '';
            course.success('moduleHeadings', `Stored module heading for "${moduleTitle}" in reports. Removed from Manifest.`)
        });
    } else {
        course.success(
            'moduleHeadings',
            'There are no modules containing headings. No Canvas pages will be created for these.'
        );
    }
    stepCallback(null, course);
};
