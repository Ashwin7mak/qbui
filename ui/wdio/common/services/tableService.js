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
            /**
             * Given an appId, tableId, tableNoun initialize a table properties object in EE.
             */
            initTableProperties: function(appId, tableId, tableNoun) {
                //TODO: Ask Aditi about this
                let propsJson = {"tableNoun":"' + tableNoun + '"};
                const tablePropertiesEndpoint = recordBase.apiBase.resolveTablePropertiesEndpoint(appId, tableId);
                // Makes use of the isEE param of the executeRequest function
                return recordBase.apiBase.executeRequest(tablePropertiesEndpoint, 'POST', propsJson, null, null, true).then(function(result) {
                    return JSON.parse(result.body);
                }).catch(function(error) {
                    log.error('Error initializing table properties');
                    return promise.reject(error);
                });
            }
        };
        return tableService;
    };
}());
