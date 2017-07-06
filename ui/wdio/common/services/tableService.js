/**
 * Table service module which contains methods for generating app JSON objects and interacting with the Node server layer
 * Created by klabak on 9/17/15.
 */
(function() {
    'use strict';
    // Bluebird Promise library
    var promise = require('bluebird');
    // Logging library
    var log = require('../../../server/src/logger').getLogger();
    // Field generator module
    var fieldGenerator = require('../../../test_generators/field.generator.js');
    module.exports = function(recordBase) {
        var tableService = {
            /**
             * Given a table JSON object check for and return an array containing the non built-in fields
             */
            getNonBuiltInFields: function(createdTable) {
                var nonBuiltInFields = [];
                createdTable.fields.forEach(function(field) {
                    if (field.builtIn !== true) {
                        nonBuiltInFields.push(field);
                    }
                });
                return nonBuiltInFields;
            },
            //TODO: Create a fieldService.js and move this to there
            /**
             * Random generate a set of choices for a multi choice field
             * @param type the type of data to generate TEXT or NUMBER
             * @param numChoices - how many choices to generate
             * @param options - optional how to generate the choices
             * TEXT type options
             * {
             *      capitalize: boolean - capitalize the 1st word of each choice, default false,
             *      numWords: number - the number of words in each choice, default 1,
             *      wordType: 'realEnglishNouns' or 'realEnglishNouns' or 'randomLetters' - whether the words generated are
             *                 real english words, nouns or random letters default is realEnglishNouns
             *
             *      randNumWords: boolean - whether the number of words is same for each choice or treated as a maximum
             *                    and each is random number of words, default false,
             *
             *      if wordType is randomLetters the following options apply
             *      wordLength or syllables (optional one or the other not both, if both throws error, default 1 - 3 syllables)
             *                 wordLength : the 1-number of characters in each word
             *                 syllables : the 1-number of syllables in each word
             *
             * }
             * NUMERIC type options {
             *        int: boolean - int or float, default true,
             *        max: the larger number to randomly generate, default - MAX_INT for int or MAX_INT/10000 for float
             *        min: the smallest number to randomly generate, default - MIN_INT for int , -MAX_INT/10000 for float
             * }
             *
             * later other choice types may be added see - https://team.quickbase.com/db/bixuxqie3?a=dr&rid=12
             * @returns {*}
             */
            choicesSetUp : function(type, numChoices, options) {
                return this.generateChoices(type, numChoices, options);
            },
            generateChoices : function(type, numChoices, options) {
                return fieldGenerator.generateChoices(type, numChoices, options);
            },
            setDefaultTableHomePage : function(appId, tableId, reportId) {
                return recordBase.apiBase.setDefaultTableHomePage(appId, tableId, reportId).catch(function(error) {
                    log.error('Error setting default table homepage');
                    return promise.reject(error);
                });
            },
            deleteTable : function(appId, tableId) {
                var tablesEndpoint = recordBase.apiBase.resolveTablesEndpoint(appId, tableId, true);
                return recordBase.apiBase.executeRequest(tablesEndpoint, consts.DELETE).catch(function(error) {
                    log.error('Error deleting table');
                    return promise.reject(error);
                });
            },
            /**
             * Given an appId, tableId, tableNoun initialize a table properties object in EE.
             */
            initTableProperties: function(appId, tableId, tableNoun) {
                // Call the initTableProperties function in recordBase
                return recordBase.initTableProperties(appId, tableId, tableNoun);
            },
            /**
             * Adds a new table to the app specified by appId. This only creates a table in core.
             * @param appId
             * @param table -- table object must contain atleast a name
             * @returns {string}
             */
            createTableInCore: function(appId, table) {
                if (!table.name) {
                    return "Required field missing: tableName";
                }
                let tablesEndpoint = recordBase.apiBase.resolveTablesEndpoint(appId, null, false);
                return recordBase.apiBase.executeRequest(tablesEndpoint, 'POST', table).then(
                    (response) => {
                        return JSON.parse(response.body);
                    }
                ).catch((ex) => {
                    log.error('Unexpected exception creating table in core');
                    return promise.reject(ex);
                });
            },
            /**
             * Adds a new table using the node end point of tableComponents
             * This will create a table object in core + set up tableProperties object in EE  + add a couple of fields to the table
             * @param appId
             * @param table -- table object must contain atleast a name
             * @returns {string}
             */
            createTableInUI: function(appId, table) {
                if (!table.name) {
                    return "Required field missing: tableName";
                }
                if (!table.tableNoun) {
                    table.tableNoun = table.name;
                }
                let tablesEndpoint = recordBase.apiBase.resolveTableComponentsEndpoint(appId);
                return recordBase.apiBase.executeRequest(tablesEndpoint, 'POST', table).then(
                    (response) => {
                        return response;
                    }
                ).catch((ex) => {
                    log.error('Unexpected exception creating table in UI');
                    return promise.reject(ex);
                });
            },
            getTableFields: function(appId, tableId) {
                let tablesEndpoint = recordBase.apiBase.resolveTablesEndpoint(appId, tableId);
                return recordBase.apiBase.executeRequest(tablesEndpoint, 'GET').then(function(response) {
                    return JSON.parse(response.body);
                }).catch((ex) => {
                    log.error('Unexpected exception getting fields for the table ' + tableId);
                    return promise.reject(ex);
                });
            }
        };
        return tableService;
    };
}());
