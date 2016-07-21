/**
 * Form service module which contains methods for generating form JSON objects and interacting with the Node server layer
 * Created by lkamineni on 6/20/17.
 */
(function() {
    'use strict';
    //Bluebird Promise library
    var promise = require('bluebird');
    module.exports = function(recordBase) {
        var formService = {
            /**
             * Generates a form and creates it in a table via the API.
             */
            createForm: function(appId, tableId, formName) {
                var formJSON = {
                    tableId: tableId,
                    appId: appId,
                    name: formName || 'Test Form',
                };
                var formsEndpoint = recordBase.apiBase.resolveFormsEndpoint(appId, tableId);

                return recordBase.apiBase.executeRequest(formsEndpoint, 'POST', formJSON).then(function(result) {
                    var id = JSON.parse(result.body);
                });
            },

        };
        return formService;
    };
}());
