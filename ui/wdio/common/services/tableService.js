/**
 * Table service module which contains methods for generating app JSON objects and interacting with the Node server layer
 * Created by klabak on 9/17/15.
 */
(function() {
    'use strict';
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
                return recordBase.apiBase.setDefaultTableHomePage(appId, tableId, reportId);
            },
            /**
             * Given an appId, tableId, tableNoun initialize a table properties object.
             */
            initTableProperties: function(appId, tableId, tableNoun) {
                let propsJson = {"tableNoun":"' + tableNoun + '"};
                const tablePropertiesEndpoint = recordBase.apiBase.resolveTablePropertiesEndpoint(appId, tableId);

                return recordBase.apiBase.executeEERequest(tablePropertiesEndpoint, 'POST', propsJson).then(function(result) {
                    return JSON.parse(result.body);
                });
            },
        };
        return tableService;
    };
}());
