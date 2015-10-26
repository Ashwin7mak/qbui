/**
 * app.generator.js will generate valid json for an application and allow you to create an arbitrary number of
 * tables, fields, relationships, and roles.
 * </p>
 * This generator will not build an app with relationships on it.
 * This is because relationships rely on ids that will not exist until it has been routed through to
 * the java api.
 * Created by cschneider1 on 5/28/15.
 */
(function() {
    'use strict';

    //var consts = require('../server/api/constants');
    var tableGenerator = require('./table.generator');
    var appConsts = require('./app.constants');
    var appBuilder = require('./app.builder');
    var rawValueGenerator = require('./rawValue.generator');


    module.exports = {

        /**
         *
         * @returns {*|{build, cloneIntoBuilder, withId, withName, withLastAccessed, withDateFormat, withTimeZone,
         *     withTable, withAdditionalTables, withTables, withRelationship, withAdditionalRelationships,
         *     withRelationships}} the app builder object
         */
        getAppBuilder: function() {
            var builderInstance = appBuilder.builder();
            return builderInstance;
        },


        appToJsonString: function(app) {
            return JSON.stringify(app);
        },

        /**
         * Generate an empty app with a name. Return the builder object.
         * @returns {*|{build, cloneIntoBuilder, withId, withName, withLastAccessed, withDateFormat, withTimeZone,
         *     withTable, withAdditionalTables, withTables, withRelationship, withAdditionalRelationships,
         *     withRelationships}} the builder object
         */
        getAppBuilderWithName: function() {
            var builderInstance = appBuilder.builder();
            var appName = rawValueGenerator.generateString(appConsts.APP_NAME_LENGTH);
            builderInstance.withName(appName);
            return builderInstance;
        },

        /**
         * Generate an app object with a specified number of tables. Fields on those tables will be generated at random
         * @param numTables
         * @returns {*|{singleRun, autoWatch}} the app object
         */
        generateAppWithTables: function(numTables) {
            var builderInstance = this.getAppBuilderWithName();
            var tableToAdd;
            for (var index = 0; index < numTables; index++) {
                tableToAdd = tableGenerator.generateTable();
                builderInstance.withTable(tableToAdd);
            }
            return builderInstance.build();
        },

        /**
         * Generate an app object with a specified number of tables and a specified number of fields. Fields on those
         * tables will be generated at random
         * @param numTables
         * @returns {*|{singleRun, autoWatch}} the app object
         */
        generateAppWithTablesOfSize: function(numTables, numFieldsPerTable) {
            var builderInstance = this.getAppBuilderWithName();
            var tableToAdd;
            for (var index = 0; index < numTables; index++) {
                tableToAdd = tableGenerator.generateTable(numFieldsPerTable);
                builderInstance.withTable(tableToAdd);
            }
            return builderInstance.build();
        },

        /**
         * Generate an app object with a specified number of tables and a specified number of fields . Fields on those
         * tables will be generated at random from the supplied list of types
         * @param numTables
         * @returns {*|{singleRun, autoWatch}} the app object
         */
        generateAppWithTablesOfSizeofTypes: function(numTables, numFieldsPerTable, typesAllowed) {
            var builderInstance = this.getAppBuilderWithName();
            var tableToAdd;
            for (var index = 0; index < numTables; index++) {
                tableToAdd = tableGenerator.generateTableWithFieldsOfAllowedTypes(numFieldsPerTable, typesAllowed);
                builderInstance.withTable(tableToAdd);
            }
            return builderInstance.build();
        },


        /**
         * Generate a table following the structure defined by a map from
         * table name to map of field name to field type.
         * </p>
         * For example:
         * {
         *  Table1 : {
         *      field 1 : CHECKBOX,
         *      field 2 : TEXT,
         *      numericField : NUMERIC
         *  },
         *  Table2 : {
         *      field1 : CHECKBOX,
         *      field2 : TEXT,
         *      duration : DURATION,
         *      formula user : FORMULA_USER
         *  }
         *
         */
        generateAppWithTablesFromMap: function(tableMap) {
            var builderInstance = this.getAppBuilderWithName();
            var tableNames = Object.keys(tableMap);
            var fieldList;
            var tableBuilder;
            tableNames.forEach(function(tableName) {
                tableBuilder = tableGenerator.getTableBuilder();
                tableBuilder.withName(tableName);
                fieldList = tableGenerator.generateFieldListFromMap(tableMap[tableName]);
                tableBuilder.withFields(fieldList);
                builderInstance.withTable(tableBuilder.build());
            });
            return builderInstance.build();
        },

        validateAppProperties: function(app) {
            var tables = app[appConsts.TABLES];
            //TODO: add relationship generator and validation

            var tablesValid = true;
            var appPropsValid = true;

            if (typeof app[appConsts.NAME] !== 'string') {
                appPropsValid = false;
                console.error('The name of the app was not a string. App: ' + JSON.stringify(app));
            }

            if (typeof app[appConsts.LAST_ACCESSED] !== 'undefined' && typeof app[appConsts.APP_ID] !== 'string') {
                appPropsValid = false;
                console.error('The app property last accessed was not a string. App: ' + JSON.stringify(app));
            }

            if (typeof app[appConsts.TIME_ZONE] !== 'undefined' && typeof app[appConsts.TIME_ZONE] !== 'string') {
                appPropsValid = false;
                console.error('The app property last accessed was not a string. App: ' + JSON.stringify(app));
            }

            if (typeof app[appConsts.DATE_FORMAT] !== 'undefined' && typeof app[appConsts.DATE_FORMAT] !== 'string') {
                appPropsValid = false;
                console.error('The app property date format was not a string. App: ' + JSON.stringify(app));
            }

            for (var index in tables) {
                if (!tableGenerator.validateTableProperties(tables[index])) {
                    tablesValid = false;
                    console.error('Could not validate table: ' + tableGenerator.fieldToJsonString(tables[index]) + '.');
                }
            }

            return appPropsValid && tablesValid;
        }
    };


}());
