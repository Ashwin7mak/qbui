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
