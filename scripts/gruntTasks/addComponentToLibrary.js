/** Grunt task for adding a new Component to the Component Library
/* $ grunt addComponentToLibrary --name=NameOfComponent --path=client-react/components/nameOfComponent.js
/* 1. Creates doc file
/* 2. Imports component into components/Metadata.js
/* 3. Adds a basic example in src/examples
/* 4. Imports basic example into src/components/Examples.js
/* 5. Imports component for use in src/components/ReactPlayground.js
/* 6. Adds import and route in src/index.js
/* 7. Adds a link to new components in src/components/componentLibrary.js
/* After running the command, put the route in src/components/componentLibrary.js where it makes most sense
/* and improve your example in src/examples
*/
module.exports = function(grunt) {
    // The following ables hold the comments that allow this grunt task
    // to locate the appropriate places in each file where import (and other)
    // statements should be placed
    //   Common locator across files
    var IMPORT_COMMENT = '// END OF IMPORT STATEMENTS';
    //   Locator comments in Metadata.js (extra spaces are needed to match tab indentation)
    var METADATA_MERGE_COMMENT = '    // END OF METADATA MERGE';
    //   Locator comments in Examples.js (extra spaces are needed to match tab indentation)
    var EXAMPLES_END_EXPORT_COMMENT = '    // END OF EXPORT';

    function getComponentFileName(componentPath) {
        var componentPathArray = componentPath.split('/');
        return componentPathArray.pop();
    }

    function checkForRequiredOptions(componentName, componentPath) {
        // Must provide a component class name
        if (!componentName) {
            grunt.fail.fatal('Please provide a component name with the flag --name');
        }

        // Must provide a path to the component
        if (!componentPath) {
            grunt.fail.fatal('Please provide a component path with the flag --path');
        }

        // Must be an existing file
        if (!grunt.file.exists(componentPath)) {
            grunt.fail.fatal('A component file does not exist at /qbui/ui/' + componentPath);
        }
    }

    function createDocFile(componentData) {
        // ---  Create Component Doc File ---
        var docTemplate = grunt.file.read(componentData.componentLibraryTemplatePath + 'doc.tmpl');
        grunt.file.write(componentData.docFile, grunt.template.process(docTemplate, {data: componentData}));
    }

    function updateMetadataFile(componentData) {
        // --- Update Metadata.js ---
        var metaDataFile = grunt.file.read(componentData.metaDataFilePath);
        var metaDataFileArray = metaDataFile.split("\n");

        var endOfImport = metaDataFileArray.indexOf(IMPORT_COMMENT);
        if (endOfImport < 0) {
            grunt.log.error('// END OF IMPORT comment missing from Metadata.js. Import may be misplaced.');
        }
        metaDataFileArray.splice(endOfImport, 0, 'import ' + componentData.componentName + "Metadata from 'component-metadata!../../../" + componentData.componentPath + "';");

        var endOfMerge = metaDataFileArray.indexOf(METADATA_MERGE_COMMENT);
        if (endOfMerge < 0) {
            grunt.log.error('// END OF MERGE comment missing from Metadata.js. Statement may be misplaced.');
        }
        metaDataFileArray[endOfMerge - 1] = metaDataFileArray[endOfMerge - 1] + ',';
        metaDataFileArray.splice(endOfMerge, 0, '    ' + componentData.componentName + 'Metadata');

        grunt.file.write(componentData.metaDataFilePath, metaDataFileArray.join("\n"));
    }

    function createExample(componentData) {
        // --- Generate default example ---
        var exampleTemplate = grunt.file.read(componentData.componentLibraryTemplatePath + 'example.tmpl');
        grunt.file.write(componentData.exampleFile, grunt.template.process(exampleTemplate, {data: componentData}));
    }

    function addToExamples(componentData) {
        // --- Add example to Examples.js ---
        var examplesFileArray = grunt.file.read(componentData.examplesFile).split("\n");
        var endOfImport = examplesFileArray.indexOf(IMPORT_COMMENT);
        if (endOfImport < 0) {
            grunt.log.error('// END OF IMPORT comment missing from Examples.js. Import may be misplaced.');
        }
        examplesFileArray.splice(endOfImport, 0, 'import ' + componentData.componentName + "Example from 'raw!../examples/" + componentData.componentName + "Example.js';");

        var endOfExport = examplesFileArray.indexOf(EXAMPLES_END_EXPORT_COMMENT);
        if (endOfExport < 0) {
            grunt.log.error('// END OF EXPORT comment missing from Examples.js. Statement may be misplaced.');
        }
        examplesFileArray.splice(endOfExport, 0, '    ' + componentData.componentName + ': ' + componentData.componentName + 'Example,');

        grunt.file.write(componentData.examplesFile, examplesFileArray.join("\n"));
    }

    function addToPlayground(componentData) {
        // --- Import component to ReactPlayground.js ---
        var playgroundFileArray = grunt.file.read(componentData.playgroundFile).split("\n");
        var endOfImport = playgroundFileArray.indexOf(IMPORT_COMMENT);
        if (endOfImport < 0) {
            grunt.log.error('// END OF IMPORT comment missing from ReactPlayground.js. Import may be misplaced.');
        }
        playgroundFileArray.splice(endOfImport, 0, 'const ' + componentData.componentName + " = require('../../../" + componentData.componentPath + "');");
        grunt.file.write(componentData.playgroundFile, playgroundFileArray.join("\n"));
    }

    function addToIndex(componentData) {
        // --- Add a route to index.js ---
        var indexFileArray = grunt.file.read(componentData.indexFile).split("\n");

        var endOfImport = indexFileArray.indexOf(IMPORT_COMMENT);
        if (endOfImport < 0) {
            grunt.log.error('// END OF IMPORT comment missing from index.js. Import may be misplaced.');
        }
        indexFileArray.splice(endOfImport, 0, 'import ' + componentData.componentName + "Doc from './docs/" + componentData.componentFileName + "';")

        // Extra spacing here to match indentation
        var endOfRoutes = indexFileArray.indexOf('        </Route>');
        var routeTemplate = grunt.file.read(componentData.componentLibraryTemplatePath + 'route.tmpl');
        // Slice on the end removes extra newline
        indexFileArray.splice(endOfRoutes, 0, grunt.template.process(routeTemplate, {data: componentData}).slice(0, -1));

        grunt.file.write(componentData.indexFile, indexFileArray.join("\n"));
    }

    function addLinkToRoutes(componentData) {
        // --- Add link to componentLibrary.js ---
        var routesFileArray = grunt.file.read(componentData.routesFile).split("\n");
        // Extra spaces here to match indentation
        var endOfLinks = routesFileArray.indexOf('                    </nav>') - 1;
        var linkTemplate = grunt.file.read(componentData.componentLibraryTemplatePath + 'link.tmpl');
        routesFileArray.splice(endOfLinks, 0, grunt.template.process(linkTemplate, {data: componentData}).slice(0, -1));
        grunt.file.write(componentData.routesFile, routesFileArray.join("\n"));
    }

    grunt.registerTask('addComponentToLibrary', 'Add a React component to the component library', function(){
        // Current Component Info
        var componentName = grunt.option('name');
        var componentPath = grunt.option('path');
        checkForRequiredOptions(componentName, componentPath);
        var componentFileName = getComponentFileName(componentPath);

        // Create an object for passing information to templates and subfunctions
        var componentLibraryPath = 'componentLibrary/';
        var componentLibrarySrcPath = componentLibraryPath + 'src/';
        var componentData = {
            componentName: componentName,
            componentPath: componentPath,
            // Component Library Info
            componentLibraryPath: componentLibraryPath,
            componentLibrarySrcPath: componentLibrarySrcPath,
            componentLibraryTemplatePath: componentLibraryPath + 'templates/',
            docFile: componentLibrarySrcPath + 'docs/' + componentFileName,
            metaDataFilePath: componentLibrarySrcPath + 'components/Metadata.js',
            exampleFile: componentLibrarySrcPath + 'examples/' + componentName + 'Example.js',
            examplesFile: componentLibrarySrcPath + 'components/Examples.js',
            playgroundFile: componentLibrarySrcPath + 'components/ReactPlayground.js',
            indexFile: componentLibrarySrcPath + 'index.js',
            routesFile: componentLibrarySrcPath + 'components/componentLibrary.js'
        };

        createDocFile(componentData);
        updateMetadataFile(componentData);
        createExample(componentData);
        addToExamples(componentData);
        addToPlayground(componentData);
        addToIndex(componentData);
        addLinkToRoutes(componentData);

        grunt.log.ok('Completed! Your component ' + componentName + ' is now in the library.');
        grunt.log.subhead('Next steps:');
        grunt.log.writeln('1) Double check the placement of the link in the nav menu in ' + componentData.routesFile);
        grunt.log.writeln('2) Improve your example in ' + componentData.exampleFile);
    });
}
