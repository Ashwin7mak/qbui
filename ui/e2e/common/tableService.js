/**
 * Integration base module that defines common locators / actions / functions to be used by all Protractor tests
 * Created by klabak on 4/15/15.
 */

(function() {
    'use strict';
    module.exports = function(recordBase) {
        var tableService = {
            getNonBuiltInFields: function(createdTable) {
                var nonBuiltInFields = [];
                createdTable.fields.forEach(function(field) {
                    if (field.builtIn !== true) {
                        nonBuiltInFields.push(field);
                    }
                });
                return nonBuiltInFields;
            }
        };
        return tableService;
    };
    //exports.getNonBuiltInFields = function(createdTable) {
    //    var nonBuiltInFields = [];
    //    createdTable.fields.forEach(function(field) {
    //        if (field.builtIn !== true) {
    //            nonBuiltInFields.push(field);
    //        }
    //    });
    //    return nonBuiltInFields;
    //};
}());