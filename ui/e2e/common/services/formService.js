/**
 * Form service module which contains methods for generating form JSON objects and interacting with the Node server layer
 * Created by lkamineni on 6/20/17.
 */
(function() {
    'use strict';
    //Bluebird Promise library
    var promise = require('bluebird');
    var formGenerator = require('../../../test_generators/form.generator.js');

    //Move this const variable to config file load by either dataGenCustomize.js or newDataGen.e2e.spec.js
    const eeEnableFlag = false;
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
                    recordBase.apiBase.executeRequest(formsEndpoint, 'POST', formJSON, null, null, true).then(function(result) {
                        var id = JSON.parse(result.body);
                        createdFormIds.push(id);
                    });
                }

                return createdFormIds;
            },

            /**
             * Given a created app object (returned via the API), create default forms for each table in the app based on it's appId and tableId
             */
            createDefaultForms: function(app) {
                var generatedForms = this.generateFormsWithAddEditDisplayOptions(app);
                var appId = app.id;
                var createdFormPromises = [];

                for (var i = 0; i < app.tables.length; i++) {
                    var tableId = app.tables[i].id;
                    var formJSON = generatedForms[i];
                    var formsEndpoint = recordBase.apiBase.resolveFormsEndpoint(appId, tableId);
                    createdFormPromises.push(recordBase.apiBase.executeRequest(formsEndpoint, 'POST', formJSON, null, null, true));
                }

                return Promise.all(createdFormPromises).then(results => {
                    return results.map(result => JSON.parse(result.body));
                });
            },

            /**
             * Given a created app object (returned via the API), create default forms for each table in the app based on it's appId and tableId
             */
            createEEDefaultForms: function(app) {
                let createdFormIds = [];

                if (!eeEnableFlag) {
                    return createdFormIds;
                }
                let appId = app.id;
                let generatedForms = this.generateFormsWithAddEditDisplayOptions(app);

                app.tables.forEach((createdTable, i) => {
                    let tableId = createdTable.id;
                    let formJSON = generatedForms[i];
                    const formsEndpoint = recordBase.apiBase.resolveFormsEndpoint(appId, tableId);

                    recordBase.apiBase.executeRequest(formsEndpoint, 'POST', formJSON, null, null, true).then(function(result) {
                        var id = JSON.parse(result.body);
                        createdFormIds.push(id);
                    });
                });

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

                return recordBase.apiBase.executeRequest(formsEndpoint, 'POST', formJSON, null, null, true).then(function(result) {
                    var id = JSON.parse(result.body);
                });
            }
        };
        return formService;
    };
}());
