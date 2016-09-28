/**
 * Table service module which contains methods for generating app JSON objects and interacting with the Node server layer
 * Created by klabak on 9/17/15.
 */
(function() {
    'use strict';
    // TODO: Will need to add in recordBase as a parameter here when we need it in future functions
    //App generator module
    var fieldGenerator = require('../../../test_generators/field.generator.js');
    var config = require('../../../server/src/config/environment');
    var recordBase = require('../../../server/test/api/recordApi.base')(config);

    module.exports = function() {
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
            setDefaultTableHomePage : function (appId, tableId) {
                recordBase.apiBase.setDefaultTableHomePage(appId, tableId, 1);
                return true;
            }
        };
        return tableService;
    };
}());
