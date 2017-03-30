/**
 * App service module which contains methods for generating app JSON objects and interacting with the Node server layer
 * Created by klabak on 9/17/15.
 */
(function() {
    'use strict';
    // Bluebird Promise library
    var promise = require('bluebird');
    // Node.js assert library
    var assert = require('assert');
    // App generator module
    var appGenerator = require('../../../test_generators/app.generator.js');
    module.exports = function(recordBase) {
        var appService = {
            /**
             * Takes a generated JSON object and creates it via the REST API. Returns the create app JSON response body.
             * Returns a promise resolving to the created app response
             */
            createApp: function(generatedApp) {
                // Call createApp function in recordBase
                return recordBase.createApp(generatedApp).then(function(appResponse) {
                    return JSON.parse(appResponse.body);
                });
            },
            /**
             * Wrapper function that calls the generator function in the test_generators folder
             */
            generateAppFromMap: function(tableToFieldToFieldTypeMap) {
                // Generate the app JSON object using the test generators
                var generatedApp = appGenerator.generateAppWithTablesFromMap(tableToFieldToFieldTypeMap);
                return generatedApp;
            },
            /**
             * Creates an application, table, and fields from map
             * @returns a promise resolving to the created app response
             */
            createAppSchema: function(tableToFieldToFieldTypeMap) {
                // Generate the app JSON object
                var generatedApp = this.generateAppFromMap(tableToFieldToFieldTypeMap);
                // Create the app via the API
                return this.createApp(generatedApp);
            }
        };
        return appService;
    };
}());
