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
                var deferred = promise.pending();
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
                for (var i = 0; i < numRecords; i++) {
                    var generatedRecord = recordGenerator.generateRecord(fields);
                    //console.log(generatedRecord);
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
                    //console.log(generatedRecord);
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
                        //console.log('Comparing record values for records with ID: ' + expectedRecIdValue);
                        for (var j = 1; j < expectedRecord.length; j++) {
                            //console.log('Comparing expected field value:' + expectedRecord[j].value +
                            // ' with actual field value: ' + actualRecord[j]);
                            if (recordService.isNumeric(expectedRecord[j].value)) {
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
             * Function that checks to make sure a value is of Numeric type
             */
            isNumeric: function(n) {
                return !isNaN(parseFloat(n)) && isFinite(n);
            }
        };
        return recordService;
    };
}());
