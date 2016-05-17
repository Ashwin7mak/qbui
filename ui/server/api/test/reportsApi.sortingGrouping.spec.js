(function() {
    'use strict';
    var assert = require('assert');
    require('../../app');
    var config = require('../../config/environment');
    var recordBase = require('./recordApi.base')(config);
    var consts = require('../constants');
    var log = require('../../logger').getLogger();
    var testConsts = require('./api.test.constants');
    var testUtils = require('./api.test.Utils');
    var errorCodes = require('../errorCodes');

    // Bluebird Promise library
    var Promise = require('bluebird');

    // Lodash utility library
    var _ = require('lodash');

    // Generator modules
    var appGenerator = require('../../../test_generators/app.generator.js');
    var recordGenerator = require('../../../test_generators/record.generator.js');

    describe.only('API - Validate report sorting and grouping execution', function() {
        // Set global timeout for all tests in the spec file
        this.timeout(testConsts.INTEGRATION_TIMEOUT);

        // Global vars
        var generatedApp;
        var app;
        var nonBuiltInFields;
        var generatedRecords;
        var records;
        // fids to sort by
        var sortByTextFid = 6;
        var sortByNumFid = 7;
        var sortByDateFid = 8;

        /**
         * Given a table JSON object check for and return an array containing the non built-in fields
         * @Returns An array containing the non built-in fields
         */
        function getNonBuiltInFields(createdTable) {
            var nonBuiltIns = [];
            createdTable.fields.forEach(function(field) {
                if (field.builtIn !== true) {
                    nonBuiltIns.push(field);
                }
            });
            return nonBuiltIns;
        }

        /**
         * Uses the generators in the test_generators package to generate a list of record objects based on the
         * given list of fields and number of records. This list can then be passed into the addRecords function.
         * @Returns An array of generated record JSON objects
         */
        function generateRecords(fields, numRecords) {
            var genRecords = [];
            for (var i = 0; i < numRecords; i++) {
                var generatedRecord = recordGenerator.generateRecord(fields);
                genRecords.push(generatedRecord);
            }
            return genRecords;
        }

        /**
         * Given an already created app and table, create a list of generated record JSON objects via the API.
         * @Returns A promise chain.
         */
        function addRecords(createdApp, createdTable, genRecords) {
            //Resolve the proper record endpoint specific to the generated app and table
            var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(createdApp.id, createdTable.id);
            var fetchRecordPromises = [];
            genRecords.forEach(function(currentRecord) {
                fetchRecordPromises.push(recordBase.createAndFetchRecord(recordsEndpoint, currentRecord, null));
            });
            return Promise.all(fetchRecordPromises)
                .then(function(results) {
                    return results;
                }).catch(function(error) {
                    // Proper error handling, you need to rethrow not just return the error
                    throw new Error(error);
                });
        }

        /*
         * Given an array of record JSON objects sort them by a certain field(s) (specified by a list of fids)
         * @Returns An array of sorted record JSON objects
         */
        function sortRecords(fids, recordsToSort) {
            // sorts the list of records passing each record to the function that returns the value to sort with
            var sortedRecords = _.sortBy(recordsToSort, function(row)  {
                return getSortValue(row, fids);
            });

            return sortedRecords;
        }

        /*
         * This function gets the value in the record parameter (array of field value pairs), where id matches the fid specified in the parameter
         * Function is a custom sort function used by lodash from within the sortRecords function
         * @Returns The value that lodash should sort on
         */
        function getSortValue(record, fids) {
            // By default returns nothing if not found
            var val = [];
            fids.forEach(function(fid) {
                // loop through the columns (fields) in the record
                record.forEach(function(col) {
                    // find the column we are sorting on and return its value
                    if (col.id === fid) {
                        val.push(col.value);
                    }
                });
            });
            return val;
        }

        /**
         * Method to verify two arrays of Record JSON objects are equal in value and order
         */
        function verifyRecords(actualRecords, expectedRecords) {
            // Assert if records from report results matches expected records
            assert.deepStrictEqual(actualRecords, expectedRecords,
                'Unexpected sorted report records returned: ' + JSON.stringify(actualRecords) + ', Expected: ' + JSON.stringify(expectedRecords));
        }

        /**
         * Setup method. Generates JSON for an app, a table with different fields, and 10 records with different field types.
         */
        before(function(done) {
            // Create the table schema (map object) to pass into the app generator
            var tableToFieldToFieldTypeMap = {};
            tableToFieldToFieldTypeMap['table 1'] = {};
            tableToFieldToFieldTypeMap['table 1'][consts.TEXT] = {
                fieldType: consts.SCALAR,
                dataType: consts.TEXT
            };
            tableToFieldToFieldTypeMap['table 1'][consts.NUMERIC] = {
                fieldType: consts.SCALAR,
                dataType: consts.NUMERIC
            };
            tableToFieldToFieldTypeMap['table 1'][consts.DATE] = {
                fieldType: consts.SCALAR,
                dataType: consts.DATE
            };

            // Generate the app JSON object
            generatedApp = appGenerator.generateAppWithTablesFromMap(tableToFieldToFieldTypeMap);

            // Create the app from the generated App JSON
            recordBase.createApp(generatedApp).then(function(appResponse) {
                app = JSON.parse(appResponse.body);
                // Get the appropriate fields out of the Create App response (specifically the created field Ids)
                nonBuiltInFields = getNonBuiltInFields(app.tables[0]);
                // Generate some record JSON objects to add to the app
                generatedRecords = generateRecords(nonBuiltInFields, 10);
                // Add the records to the app
                addRecords(app, app.tables[0], generatedRecords).then(function(returnedRecords) {
                    // Push the created records into an array (the add record call also returns the fields used)
                    var recordData = [];
                    for (var j in returnedRecords) {
                        recordData.push(returnedRecords[j].record);
                    }
                    records = recordData;
                    done();
                }).done(null, done);
            }).done(null, function(error) {
                // the then block threw an error
                // so forward that error to Mocha
                done(error);
            });
            return app;
        });

        /**
         * Data Provider for reports and faceting results.
         */
        function sortingReportTestCases() {
            return [
                {
                    message: 'Sort by Text field',
                    sortList: ['6'],
                    sortFids: [sortByTextFid]
                },
                {
                    message: 'Sort by Text field group by Equal values',
                    sortList: ['6:V'],
                    sortFids: [sortByTextFid]
                },
                // TODO: The Reports API accepts the below sortLists but returns them empty
                //{
                //    message: 'Sort by Text field, then by Numeric field',
                //    sortList: ['6.7'],
                //    sortFids: [sortByTextFid, sortByNumFid]
                //},
                //{
                //    message: 'Sort by Text field group by Equal values, then sort by Numeric field, then by date field',
                //    sortList: ['6:V.7.8'],
                //    sortFids: [sortByTextFid, sortByNumFid, sortByDateFid]
                //},
            ];
        }

        sortingReportTestCases().forEach(function(testcase) {
            /**
             * Test to create a report with a sortList param via the Reports API (contains the sort order and groupBy properties for the report)
             * Verify the report properties after creating, then run the report and verify that the report results are sorted.
             */
            it('Should create a report: ' + testcase.message +
                ' , execute the report, and validate the resulting record sort', function(done) {

                var reportEndpoint = recordBase.apiBase.resolveReportsEndpoint(app.id, app.tables[0].id);
                var reportToCreate = {
                    name: testcase.message + ' Report',
                    description: testcase.message + 'Report description',
                    type: 'TABLE',
                    tableId: app.tables[0].id,
                    sortList: testcase.sortList
                };
                // Create a report
                recordBase.apiBase.executeRequest(reportEndpoint, consts.POST, reportToCreate).then(function(report) {
                    var r = JSON.parse(report.body);

                    // Get the report data back, check for sortList prop which also contains groupBy
                    recordBase.apiBase.executeRequest(reportEndpoint + r.id, consts.GET).then(function(reportGetResult) {
                        var reportResult = JSON.parse(reportGetResult.body);
                        assert.strictEqual(reportResult.name, reportToCreate.name, 'Unexpected report name returned');
                        assert.strictEqual(reportResult.description, reportToCreate.description, 'Unexpected report description returned');
                        assert.strictEqual(reportResult.type, reportToCreate.type, 'Unexpected report type returned');
                        assert.strictEqual(reportResult.tableId, reportToCreate.tableId, 'Unexpected tableId returned');
                        assert.deepStrictEqual(reportResult.sortList, reportToCreate.sortList, 'Unexpected sortList returned');
                    }).done(null, done); // This bubbles up errors out of the promise chain to let Mocha know there was a failure

                    // Execute a report and check sort order of records
                    recordBase.apiBase.executeRequest(reportEndpoint + r.id + '/results', consts.GET).then(function(reportResults) {
                        var results = JSON.parse(reportResults.body);
                        // Sort the expected records by text field (id 6)
                        var sortedExpectedRecords = sortRecords(testcase.sortFids, records);
                        // Verify sorted records
                        verifyRecords(results.records, sortedExpectedRecords);
                        // Everything passed (here and in the above async call)
                        done();
                    }).done(null, done);

                }).done(null, function(error) {
                    // the then block threw an error
                    // so forward that error to Mocha
                    // same as calling .done(null, done)
                    done(error);
                });
            });
        });

        /**
         * Negative test to create a report with an sortList param against the Reports API
         */
        it('Should return an empty sortList when creating a report with an invalid sortList', function(done) {

            var reportEndpoint = recordBase.apiBase.resolveReportsEndpoint(app.id, app.tables[0].id);
            var reportToCreate = {
                name: 'Invalid Sorting Report',
                description: 'Invalid sortList',
                type: 'TABLE',
                tableId: app.tables[0].id,
                sortList: ["adg!@s3"]
            };
            // Create a report
            recordBase.apiBase.executeRequest(reportEndpoint, consts.POST, reportToCreate).then(function(report) {
                var r = JSON.parse(report.body);

                // Get the report data back, check for sortList prop which also contains groupBy
                recordBase.apiBase.executeRequest(reportEndpoint + r.id, consts.GET).then(function(reportGetResult) {
                    var reportResult = JSON.parse(reportGetResult.body);
                    assert.strictEqual(reportResult.name, reportToCreate.name, 'Unexpected report name returned');
                    assert.strictEqual(reportResult.description, reportToCreate.description, 'Unexpected report description returned');
                    assert.strictEqual(reportResult.type, reportToCreate.type, 'Unexpected report type returned');
                    assert.strictEqual(reportResult.tableId, reportToCreate.tableId, 'Unexpected tableId returned');
                    assert.deepStrictEqual(reportResult.sortList, [], 'Unexpected sortList returned');
                    done();
                }).done(null, done); // This bubbles up errors out of the promise chain to let Mocha know there was a failure

            }).done(null, function(error) {
                // the then block threw an error
                // so forward that error to Mocha
                // same as calling .done(null, done)
                done(error);
            });
        });
        
        // Cleanup the test realm after all tests in the block
        after(function(done) {
            recordBase.apiBase.cleanup().then(function() {
                done();
            });
        });
    });
}());
