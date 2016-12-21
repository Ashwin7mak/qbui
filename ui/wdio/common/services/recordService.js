/**
 * Record service module which contains methods for generating record JSON objects and interacting with the Node server layer
 * Created by klabak on 9/17/15.
 */
(function() {
    'use strict';
    //Bluebird Promise library
    var promise = require('bluebird');
    //Node.js assert library
    var assert = require('assert');
    var recordGenerator = require('../../../test_generators/record.generator.js');
    module.exports = function(recordBase) {
        var recordService = {
            /**
             * Given an already created app and table, create a list of generated record JSON objects via the API.
             * and fetches the created records
             * Returns a promise.
             */
            addRecords: function(app, table, genRecords) {
                //TODO: Remove deferred pattern
                var deferred = promise.pending();
                //Resolve the proper record endpoint specific to the generated app and table
                var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, table.id);
                var fetchRecordPromises = [];
                genRecords.forEach(function(currentRecord) {
                    fetchRecordPromises.push(recordBase.createAndFetchRecord(recordsEndpoint, currentRecord, null));
                });
                promise.all(fetchRecordPromises)
                    .then(function(results) {
                        deferred.resolve(results);
                    }).catch(function(error) {
                        console.log(JSON.stringify(error));
                        deferred.reject(error);
                    });
                return deferred.promise;
            },
            /**
             * Given an already created app and table, create a list of generated record JSON objects via the API.
             * Returns a promise.
             */
            addBulkRecords: function(app, table, genRecords) {
                //Resolve the proper record endpoint specific to the generated app and table
                var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, table.id);
                return recordBase.createBulkRecords(recordsEndpoint, genRecords, null);
            },
            /**
             * Uses the generators in the test_generators package to generate a list of record objects based on the
             * given list of fields and number of records. This list can then be passed into the addRecords function.
             */
            generateRecords: function(fields, numRecords) {
                var generatedRecords = [];
                for (var i = 0; i < numRecords; i++) {
                    var generatedRecord = recordGenerator.generateRecord(fields);
                    generatedRecords.push(generatedRecord);
                }
                return generatedRecords;
            },
            /**
             * Uses the generators in the test_generators package to generate a list of empty record objects based on the
             * given list of fields and number of records. This list can then be passed into the addRecords function.
             */
            generateEmptyRecords: function(fields, numRecords) {
                var generatedEmptyRecords = [];
                for (var i = 0; i < numRecords; i++) {
                    var generatedRecord = recordGenerator.generateEmptyRecord(fields);
                    generatedEmptyRecords.push(generatedRecord);
                }
                return generatedEmptyRecords;
            },
            /**
             * Function that will compare actual and expected record values
             */
            assertRecordValues: function(actualRecords, expectedRecords) {
                // Check that we have the same number of records to compare
                expect(actualRecords.length).toEqual(expectedRecords.length, 'actual and expected record length is equal');
                // Gather the record values
                var actualRecordList = [];
                // Each row of the repeater (one record) is returned as a string of values.
                // Split on the new line char and create a new array.
                actualRecords.forEach(function(recordString) {
                    var record = recordString.split('\n');
                    actualRecordList.push(record);
                });
                // Sort expected records by recordID
                expectedRecords.sort(function(a, b) {
                    return parseInt(a[0].value) - parseInt(b[0].value);
                });
                // Loop through the expected recordList
                for (var k = 0; k < expectedRecords.length; k++) {
                    // Grab the expected record
                    var expectedRecord = expectedRecords[k];
                    // Get the record Id to look for
                    var expectedRecIdValue = expectedRecord[0].value;
                    // Grab actual record to compare recordIds
                    var actualRecord = actualRecordList[k];
                    // Get the record Id
                    var actualRecIdValue = actualRecord[0];
                    // If the record Ids match, compare the other fields in the records
                    if (Number(expectedRecIdValue) === Number(actualRecIdValue)) {
                        for (var j = 1; j < expectedRecord.length; j++) {
                            if (e2eUtils.isNumeric(expectedRecord[j].value)) {
                                expect(Number(expectedRecord[j].value)).toEqual(Number(actualRecord[j]), 'Ensure number values are equivalent not including precision');
                                //TODO: QBSE-15108: Fix test expected value for precision adhering to default display DECIMAL_PLACES option
                                //expect(expectedRecord[j].value).toEqual(actualRecord[j], '1. Ensure number values are equivalent including precision');
                            } else {
                                expect(actualRecord[j]).toEqual(expectedRecord[j].value);
                            }
                        }
                    }
                }
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
                //TODO: Remove deferred pattern
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
        return recordService;
    };
}());
