/**
 * App service module which contains methods for generating app JSON objects and interacting with the Node server layer
 * Created by klabak on 9/17/15.
 */
(function() {
    'use strict';
    //Bluebird Promise library
    var promise = require('bluebird');
    //Node.js assert library
    var assert = require('assert');
    //App generator module
    var appGenerator = require('../../../test_generators/app.generator.js');
    module.exports = function(recordBase) {
        var appService = {
            /**
             * Takes a generated JSON object and creates it via the REST API. Returns the create app JSON response body.
             * Returns a promise.
             */
            createApp: function(generatedApp) {
                var deferred = promise.pending();
                recordBase.createApp(generatedApp).then(function(appResponse) {
                    var createdApp = JSON.parse(appResponse.body);
                    assert(createdApp, 'failed to create app via the API');
                    //console.log('Create App Response: ' + app);
                    deferred.resolve(createdApp);
                }).catch(function(error) {
                    console.log(JSON.stringify(error));
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            /**
             * Wrapper function that calls the generator function in the test_generators folder
             */
            generateAppFromMap: function(tableToFieldToFieldTypeMap) {
                //Generate the app JSON object
                var generatedApp = appGenerator.generateAppWithTablesFromMap(tableToFieldToFieldTypeMap);
                return generatedApp;
            }
        };
        return appService;
    };
}());
