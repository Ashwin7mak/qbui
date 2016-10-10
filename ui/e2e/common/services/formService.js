/**
 * Form service module which contains methods for generating form JSON objects and interacting with the Node server layer
 * Created by lkamineni on 6/20/17.
 */
(function() {
    'use strict';
    //Bluebird Promise library
    var promise = require('bluebird');
    var formGenerator = require('../../../test_generators/form.generator.js');
    module.exports = function(recordBase) {
        var formService = {
            /**
             * Given a created app object (returned via the API), generate default forms JSON for each table in the app based on it's table schema
             */
            generateForms: function(app) {
                var generatedForms = formGenerator.generateSingleTabAndSecForm(app);
                return generatedForms;
            },

            /**
             * Given a created app object (returned via the API), create default forms for each table in the app based on it's property
             */
            createDefaultForms: function(app) {
                var generatedForms = this.generateForms(app);
                var appId = app.id;
                var createdFormIds = [];

                for (var i = 0; i < app.tables.length; i++) {
                    var tableId = app.tables[i].id;
                    var formJSON = generatedForms[i];
                    var formsEndpoint = recordBase.apiBase.resolveFormsEndpoint(appId, tableId);
                    recordBase.apiBase.executeRequest(formsEndpoint, 'POST', formJSON).then(function(result) {
                        var id = JSON.parse(result.body);
                        createdFormIds.push(id);
                    });
                }

                return createdFormIds;
            },

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
            }
        };
        return formService;
    };
}());
