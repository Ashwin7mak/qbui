/**
 * Form service module which contains methods for generating form JSON objects and interacting with the Node server layer
 * Created by lkamineni on 6/20/17.
 */
(function() {
    'use strict';
    var formGenerator = require('../../../test_generators/form.generator.js');
    module.exports = function(recordBase) {
        var formService = {
            /**
             * Given a created app object (returned via the API), generate default forms JSON for each table in the app based on it's table schema
             */
            generateForms: function(app) {
                var generatedForms = formGenerator.generateSingleTabAndSecViewOnlyForm(app);
                return generatedForms;
            },
            /**
             * Given a created app object (returned via the API), generate default forms JSON for each table in the app based on it's table schema
             */
            generateFormsWithAddEditDisplayOptions: function(app) {
                var generatedForms = formGenerator.generateSingleTabAndSecFormWithAddAndEdit(app);
                return generatedForms;
            },
            /**
             * Given a created app object (returned via the API), create default forms for each table in the app based on it's property
             */
            createViewOnlyForm: function(app) {
                var generatedForms = this.generateForms(app);
                var appId = app.id;
                var createdFormIds = [];

                for (var i = 0; i < app.tables.length; i++) {
                    var tableId = app.tables[i].id;
                    var formJSON = generatedForms[i];
                    var formsEndpoint = recordBase.apiBase.resolveFormsEndpoint(appId, tableId);
                    var formId = this.parseFormResult(formJSON, formsEndpoint);
                    createdFormIds.push(formId);
                }
                return createdFormIds;
            },
            parseFormResult: function(formJSON, formsEndpoint) {
                return recordBase.apiBase.executeRequest(formsEndpoint, 'POST', formJSON).then(function(result) {
                    return JSON.parse(result.body);
                });
            },
            /**
             * Given a created app object (returned via the API), create default forms for each table in the app based on it's property
             */
            createDefaultForms: function(app) {
                var generatedForms = this.generateFormsWithAddEditDisplayOptions(app);
                var appId = app.id;
                var createdFormIds = [];

                for (var i = 0; i < app.tables.length; i++) {
                    var tableId = app.tables[i].id;
                    var formJSON = generatedForms[i];
                    var formsEndpoint = recordBase.apiBase.resolveFormsEndpoint(appId, tableId);
                    var formId = this.parseFormResult(formJSON, formsEndpoint);
                    createdFormIds.push(formId);
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
