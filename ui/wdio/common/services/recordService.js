/**
 * Record service module which contains methods for generating record JSON objects and interacting with the Node server layer
 * Created by klabak on 9/17/15.
 */
(function() {
    'use strict';
    // Bluebird Promise library
    var promise = require('bluebird');
    // Node.js assert library
    var assert = require('assert');
    // Logging library
    var log = require('../../../server/src/logger').getLogger();
    // Record Generator library
    var recordGenerator = require('../../../test_generators/record.generator');

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
                var totalNumRecords;

                // Include a duplicate or blank record if specified in the method call
                if (addDupeRecord) {
                    totalNumRecords = numRecords - 1;
                }
                if (addEmptyRecord) {
                    totalNumRecords = numRecords - 1;
                } else {
                    totalNumRecords = numRecords;
                }

                // Get the appropriate fields out of the Create App response (specifically the created field Ids)
                var tableNonBuiltInFields = e2eBase.tableService.getNonBuiltInFields(createdApp.tables[tableIndex]);
                // Generate the record JSON objects with data
                var generatedRecords = this.generateRecords(tableNonBuiltInFields, totalNumRecords);

                // Add 1 duplicate record
                if (addDupeRecord) {
                    var clonedArray = JSON.parse(JSON.stringify(generatedRecords));
                    var dupRecord = clonedArray[0];
                    //TODO: This structure is hardcoded so need to read in the record and duplicate dynamically
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
                    var generatedEmptyRecords = this.generateEmptyRecords(tableNonBuiltInFields, 1);
                    generatedRecords.push(generatedEmptyRecords[0]);
                }

                //TODO: Fix this
                // Based on how many records we are adding either do a couple addRecord calls or one bulk add call
                //if (numRecords < MIN_RECORDSCOUNT) {
                //    // Via the API create the records, a new report, then run the report.
                //    return this.addRecords(createdApp, createdApp.tables[tableIndex], generatedRecords);
                //} else {
                    // Via the API create the bulk records
                    return this.addBulkRecords(createdApp, createdApp.tables[tableIndex], generatedRecords);
                //}
            },
            /**
             * Given an already created app and table, create a list of generated record JSON objects via the API.
             * and fetches the created records
             * Returns a promise.
             */
            addRecords: function(app, table, genRecords) {
                //Resolve the proper record endpoint specific to the generated app and table
                var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, table.id);
                var fetchRecordPromises = [];

                // If using JS for loops with promise functions make sure to use Bluebird's Promise.each function
                // otherwise errors can be swallowed!
                genRecords.forEach(function(currentRecord) {
                    fetchRecordPromises.push(function() {
                        return recordBase.createRecord(recordsEndpoint, currentRecord, null);
                    });
                });

                // Bluebird's promise.each function (executes each promise synchronously)
                return promise.each(fetchRecordPromises, function(queueItem) {
                    // This is an iterator that executes each Promise function in the array here
                    return queueItem();
                }).catch(function(error) {
                    log.error('Error adding records (possible random dataGen issue)');
                    return promise.reject(error);
                });
            },
            /**
             * Given an already created app and table, create a list of generated record JSON objects via the API.
             * Returns a promise.
             */
            addBulkRecords: function(app, table, genRecords) {
                //Resolve the proper record endpoint specific to the generated app and table
                var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, table.id);
                return recordBase.createBulkRecords(recordsEndpoint, genRecords).catch(function(error) {
                    log.error('Error adding bulk records (possible random dataGen issue)');
                    return promise.reject(error);
                });
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
                var editRecordPromises = recordEdits.map((currentRecord, idx) => {
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
                return emptyRecords.map((record, idx) => {
                    return record.map(_field => {
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
             * @param createdApp - the created app JSON object from createApp API call
             * @param recordsConfig - optional
             *  { numRecordsToCreate : number  //defaults to Consts.DEFAULT_NUM_RECORDS_TO_CREATE,
             *  tableConfig: hashmap by tablename of configs for table (numRecordsToCreate)}
             * @returns {*|promise}
             */
            createRecords : function(createdApp, recordsConfig) {
                var numberOfRecords;

                // Get the global number of records to create in each table if specified
                if (recordsConfig && recordsConfig.numRecordsToCreate) {
                    numberOfRecords = recordsConfig.numRecordsToCreate;
                }

                var recordCreatePromise = [];

                createdApp.tables.forEach(function(table, index) {
                    var tableNumOfRecords = null;

                    // Get the number of records to create if specified for each table
                    if (recordsConfig && recordsConfig.tablesConfig && recordsConfig.tablesConfig[table.name] &&
                        recordsConfig.tablesConfig[table.name].numRecordsToCreate &&
                        typeof recordsConfig.tablesConfig[table.name].numRecordsToCreate === 'number') {

                        tableNumOfRecords = recordsConfig.tablesConfig[table.name].numRecordsToCreate;
                    }

                    if (tableNumOfRecords) {
                        // Generate and add records to each table
                        recordCreatePromise.push(function() {
                            return e2eBase.recordService.addRecordsToTable(createdApp, index, tableNumOfRecords, false, false);
                        });
                    } else {
                        // Generate and add records to each table
                        recordCreatePromise.push(function() {
                            return e2eBase.recordService.addRecordsToTable(createdApp, index, numberOfRecords, false, false);
                        });
                    }

                    // Generate and add records to each table
                    recordCreatePromise.push(function() {
                        return e2eBase.recordService.addRecordsToTable(createdApp, index, numberOfRecords, false, false);
                    });
                });

                // Bluebird's promise.each function (executes each promise sequentially)
                return promise.each(recordCreatePromise, function(queueItem) {
                    // This is an iterator that executes each Promise function in the array here
                    return queueItem().catch(function(err) {
                        //TODO: Adding records is flaky due to random dataGen
                        //TODO: Need to swallow the error so the rest complete in the array and we don't stop execution
                        //TODO: Implement retry function
                        log.error('Error creating records (possible random dataGen issue)');
                    });
                });
            }
        };
        return recordService;
    };
}());
