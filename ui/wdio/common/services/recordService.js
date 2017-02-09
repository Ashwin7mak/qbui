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
             * Add the specified number of records to the table in an existing application
             * @param createdApp - App JSON object returned from the create app API call
             * @param tableIndex - Table index number in the created app object
             * @param numRecords - Total numbers of records to add
             * @param addDupeRecord - Boolean whether or not to add a duplicate record in the record set
             * @param addEmptyRecord - Boolean whether or not to add an empty record in the record set
             * @returns Promise result from the add records API call
             */
            addRecordsToTable: function(createdApp, tableIndex, numRecords, addDupeRecord, addEmptyRecord) {
                // Variable to determine whether or not we use regular or bulk add record APIs below
                var MIN_RECORDSCOUNT = 11;
                var totalNumRecords;

                // Include a duplicate or blank record if specified in the method call
                if (addDupeRecord) {
                    totalNumRecords = numRecords - 1;
                }
                if (addEmptyRecord) {
                    totalNumRecords = numRecords - 1;
                }

                // Get the appropriate fields out of the Create App response (specifically the created field Ids)
                var tableNonBuiltInFields = e2eBase.tableService.getNonBuiltInFields(createdApp.tables[tableIndex]);
                // Generate the record JSON objects with data
                var generatedRecords = e2eBase.recordService.generateRecords(tableNonBuiltInFields, totalNumRecords);

                // Add 1 duplicate record
                if (addDupeRecord) {
                    var clonedArray = JSON.parse(JSON.stringify(generatedRecords));
                    var dupRecord = clonedArray[0];
                    // Edit the numeric field so we can check the second level sort (ex: 6.7)
                    dupRecord.forEach(function(field) {
                        if (field.id === 7) {
                            field.value = 1.90;
                        }
                        if (field.id === 11) {
                            field.value = '1977-12-12';
                        }
                    });
                    // Add the new dupe record back in to create
                    generatedRecords.push(dupRecord);
                }

                // Add 1 empty record
                if (addEmptyRecord) {
                    var generatedEmptyRecords = e2eBase.recordService.generateEmptyRecords(tableNonBuiltInFields, 1);
                    generatedRecords.push(generatedEmptyRecords[0]);
                }

                if (numRecords < MIN_RECORDSCOUNT) {
                    // Via the API create the records, a new report, then run the report.
                    return e2eBase.recordService.addRecords(createdApp, createdApp.tables[tableIndex], generatedRecords);
                } else {
                    // Via the API create the bulk records
                    return e2eBase.recordService.addBulkRecords(createdApp, createdApp.tables[tableIndex], generatedRecords);
                }
            },
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
                //TODO: This function does not add records in order of the genRecords due to looping over promises
                //TODO: Investigate fix or just use bulk for add any more than 1 record
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
             * Edit a table's records.
             * @param {number} appId
             * @param {number} tableId
             * @param {Array <Array <Object> >} recordEdits an array of edits being made. Each array should contain an
             *            array of objects representing the edits to be made.
             *            [ [{ // edits to recordID 1
             *                    id    : <fieldId of field being edited>,
             *                    value : <new value for the field>
             *               }],
             *              [{ // edits to recordId 2
             *                    id    : 3,
             *                    value : 'thing'
             *               }]
             *            ]
             * @returns {Promise}
             */
            editRecords: function(appId, tableId, recordEdits) {
                //Resolve the proper record endpoint specific to the generated app and table
                var editRecordPromises = recordEdits.map(function(currentRecord, idx) {
                    var recordId = idx + 1;
                    var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(appId, tableId);
                    return recordBase.editRecord(recordsEndpoint, recordId, recordEdits[idx]);
                });
                return promise.all(editRecordPromises);
            },

            /**
             * Uses the generators in the test_generators package to generate a list of record objects based on the
             * given list of fields and number of records. This list can then be passed into the addRecords function.
             */
            generateRecords: function(fields, numRecords) {
                var generatedRecords = [];
                for (var i = 1; i < numRecords; i++) {
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
             * Generates an array of edits to be consumed by editRecords().
             * @param field
             * @param {Array} values
             * @returns {Array}
             */
            generateRecordsFromValues: function(field, values) {
                var emptyRecords = this.generateEmptyRecords([field], values.length);
                return emptyRecords.map(function(record, idx) {
                    return record.map(function(_field) {
                        _field.value = values[idx];
                        return _field;
                    });
                });
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
