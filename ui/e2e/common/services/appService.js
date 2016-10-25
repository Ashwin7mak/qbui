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
             * creates an application, table, and fields from map
             * @returns a promise the created app
             */
            createAppSchema: function(tableToFieldToFieldTypeMap) {
                // Generate the app JSON object
                var generatedApp = this.generateAppFromMap(tableToFieldToFieldTypeMap);
                // Create the app via the API
                return this.createApp(generatedApp);
            },
            /**
             * Wrapper function that calls the generator function in the test_generators folder
             */
            generateAppFromMap: function(tableToFieldToFieldTypeMap) {
                //Generate the app JSON object
                var generatedApp = appGenerator.generateAppWithTablesFromMap(tableToFieldToFieldTypeMap);
                return generatedApp;
            },
            /**
             * given an app with schema defined in the db
             * create
             *   - records for each table
             *   - a form and
             *   - report for each table
             * @param app - the created app
             * @param recordsConfig - optional
             *  { numRecordsToCreate : number  //defaults to Consts.DEFAULT_NUM_RECORDS_TO_CREATE,
              *  tableConfig: hash by tablename of configs for table (numRecordsToCreate)}
             * @returns {*|promise}
             */
            createRecords : function(app, recordsConfig, services) {
                var deferred = promise.pending();
                var results = {allPromises:[], tablePromises:[]};
                if (app) {
                    try {
                        var createdApp = app;
                        var numberOfRecords = e2eConsts.DEFAULT_NUM_RECORDS_TO_CREATE;
                        // get the number of records to create if specified
                        if (recordsConfig && recordsConfig.numRecordsToCreate) {
                            numberOfRecords = recordsConfig.numRecordsToCreate;
                        }
                        //create records for each table in the app
                        createdApp.tables.forEach(function(table, index) {
                            // get the number of records to create if specified for this table
                            if (recordsConfig && recordsConfig.tablesConfig && recordsConfig.tablesConfig[table.name] &&
                                recordsConfig.tablesConfig[table.name].numRecordsToCreate &&
                                typeof recordsConfig.tablesConfig[table.name].numRecordsToCreate === 'number') {
                                numberOfRecords = recordsConfig.tablesConfig[table.name].numRecordsToCreate;
                            }
                            // Get the created non builtin field Ids
                            var nonBuiltInFields = services.tableService.getNonBuiltInFields(table);
                            // Generate the record JSON input objects
                            var generatedRecords = services.recordService.generateRecords(nonBuiltInFields, numberOfRecords);

                            // Via the serices API create the records, a new report and form
                            var reportPromise = services.reportService.createReport(createdApp.id, table.id);
                            var recordsPromise = services.recordService.addBulkRecords(createdApp, table, generatedRecords);
                            reportPromise.then(function() {
                                // Set default table homepage for Table
                                return services.tableService.setDefaultTableHomePage(createdApp.id, table.id, 1);
                            });

                            results.allPromises.push(reportPromise);
                            results.allPromises.push(recordsPromise);

                            results.tablePromises[index] = {
                                reportPromise: reportPromise,
                                recordsPromise: recordsPromise,
                                nonBuiltInFields: nonBuiltInFields
                            };
                        });
                        deferred.resolve(results);
                    } catch (error) {
                        console.error(JSON.stringify(error));
                        deferred.reject(error);
                    }
                } else {
                    var error = new Error("No app to generate records for");
                    console.error(JSON.stringify(error));
                    deferred.reject(error);
                }
                return deferred.promise;
            }
        };
        return appService;
    };
}());
