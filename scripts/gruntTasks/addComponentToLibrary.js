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
    grunt.registerTask('addComponentToLibrary', 'Add a React component to the component library', function(){
        // Current Component Info
        var componentName = grunt.option('name');
        var componentPath = grunt.option('path');
        var componentPathArray = componentPath.split('/');
        var componentFileName = componentPathArray.pop();

        // Must provide a component class name
        if(!componentName){
            grunt.fail.fatal('Please provide a component name with the flag --name');
        }

        // Must provide a path to the component
        if(!componentPath){
            grunt.fail.fatal('Please provide a component path with the flag --path');
        }

        // Must be an existing file
        if(!grunt.file.exists(componentPath)){
            grunt.fail.fatal('A component file does not exist at /qbui/ui/' + componentPath);
        }

        // Component Library Info
        var componentLibraryPath = 'componentLibrary/';
        var componentLibrarySrcPath = componentLibraryPath + 'src/'
        var componentLibraryTemplatePath = componentLibraryPath + 'templates/';
        var docFile = componentLibrarySrcPath + 'docs/' + componentFileName;
        var metaDataFilePath = componentLibrarySrcPath + 'components/Metadata.js';
        var metaDataFile = grunt.file.read(metaDataFilePath);
        var exampleFile = componentLibrarySrcPath + 'examples/' + componentName + 'Example.js';
        var examplesFile = componentLibrarySrcPath + 'components/Examples.js';
        var playgroundFile = componentLibrarySrcPath + 'components/ReactPlayground.js';
        var indexFile = componentLibrarySrcPath + 'index.js';
        var routesFile = componentLibrarySrcPath + 'components/componentLibrary.js';

        var componentData = {
            componentName: componentName,
            componentPath: componentPath
        };

        // ---  Create Component Doc File ---
        var docTemplate = grunt.file.read(componentLibraryTemplatePath + 'doc.tmpl');
        grunt.file.write(docFile, grunt.template.process(docTemplate, {data: componentData}));

        // --- Update Metadata.js ---
        var metaDataFileArray = metaDataFile.split("\n");

        var endOfImport = metaDataFileArray.indexOf('// END OF IMPORT STATEMENTS');
        metaDataFileArray.splice(endOfImport, 0, 'import ' + componentName + "Metadata from 'component-metadata!../../../" + componentPath + "';");

        var endOfMerge = metaDataFileArray.indexOf('    // END OF METADATA MERGE');
        metaDataFileArray[endOfMerge - 1] = metaDataFileArray[endOfMerge - 1] + ',';
        metaDataFileArray.splice(endOfMerge, 0, '    ' + componentName + 'Metadata');

        grunt.file.write(metaDataFilePath, metaDataFileArray.join("\n"));

        // // --- Generate default example ---
        var exampleTemplate = grunt.file.read(componentLibraryTemplatePath + 'example.tmpl');
        grunt.file.write(exampleFile, grunt.template.process(exampleTemplate, {data: componentData}));

        // // --- Add example to Examples.js ---
        var examplesFileArray = grunt.file.read(examplesFile).split("\n");
        endOfImport = examplesFileArray.indexOf('// END OF IMPORT STATEMENTS');
        examplesFileArray.splice(endOfImport, 0, 'import ' + componentName + "Example from 'raw!../examples/" + componentName + "Example.js';");

        endOfMerge = examplesFileArray.indexOf('    // END OF EXPORT');
        examplesFileArray.splice(endOfMerge, 0, '    ' + componentName + ': ' + componentName + 'Example,');

        grunt.file.write(examplesFile, examplesFileArray.join("\n"));

        // // --- Import component to ReactPlayground.js ---
        var playgroundFileArray = grunt.file.read(playgroundFile).split("\n");
        endOfImport = playgroundFileArray.indexOf('// END OF REQUIRE STATEMENTS');
        playgroundFileArray.splice(endOfImport, 0, 'const ' + componentName + " = require('../../../" + componentPath + "');");
        grunt.file.write(playgroundFile, playgroundFileArray.join("\n"));

        // // --- Add a route to index.js ---
        var indexFileArray = grunt.file.read(indexFile).split("\n");

        endOfImport = indexFileArray.indexOf('// END OF IMPORT STATEMENTS');
        indexFileArray.splice(endOfImport, 0, 'import ' + componentName + "Doc from './docs/" + componentFileName + "';")

        var endOfRoutes = indexFileArray.indexOf('        </Route>');
        var routeTemplate = grunt.file.read(componentLibraryTemplatePath + 'route.tmpl');
        // Slice on the end removes extra newline
        indexFileArray.splice(endOfRoutes, 0, grunt.template.process(routeTemplate, {data: componentData}).slice(0, -1));

        grunt.file.write(indexFile, indexFileArray.join("\n"));

        // // --- Add link to componentLibrary.js ---
        var routesFileArray = grunt.file.read(routesFile).split("\n");
        var endOfLinks = routesFileArray.indexOf('                    </nav>') - 1;
        var linkTemplate = grunt.file.read(componentLibraryTemplatePath + 'link.tmpl');
        routesFileArray.splice(endOfLinks, 0, grunt.template.process(linkTemplate, {data: componentData}).slice(0, -1));
        grunt.file.write(routesFile, routesFileArray.join("\n"));

        grunt.log.ok('Completed! Your component ' + componentName + ' is now in the library.');
        grunt.log.subhead('Next steps:');
        grunt.log.writeln('1) Double check the placement of the link in the nav menu in ' + routesFile);
        grunt.log.writeln('2) Improve your example in ' + exampleFile);
    });
}
