(function() {
    'use strict';
    var assert = require('assert');
    require('../../src/app');
    var config = require('../../src/config/environment');
    var recordBase = require('./recordApi.base')(config);
    var consts = require('../../../common/src/constants');
    var log = require('../../src/logger').getLogger();
    var testConsts = require('./api.test.constants');
    var testUtils = require('./api.test.Utils');
    var errorCodes = require('../../src/api/errorCodes');

    // Bluebird Promise library
    var Promise = require('bluebird');

    // Lodash utility library
    var _ = require('lodash');

    // Generator modules
    var appGenerator = require('../../../test_generators/app.generator.js');

    /*
     * Sorting and Grouping overview:
     *
     * In order to handle sorting and grouping for the client, Node uses BOTH the Reports and Records Java API endpoints (not just Records).
     * It uses the Java Reports API in order to store and get the report's metadata containing the sortList parameter (also known as slist in Java)
     * This parameter holds both the group by and sort by data for the set of fid (or fids).
     * sortList (in this context) is an array that contains a string (or strings) and is in the following format: ['6:V']
     * Node will use this endpoint to gather the metadata of the report, then query the Java Records API endpoint to get a sorted list of records.
     * Node will then take this record list and use the gathered report metadata to do the actual grouping of records.
     * It then returns this to the client ui.
     *
     * It's important to note that NO grouping is done on the Java side (only storing of the group by value).
     *
     * When accepting custom client side requests for sorting / grouping (example changing it via the UI), Node does not use the Java Reports endpoint
     * to query for the record set to present to the client UI (as in running the actual report). This is because the Java Reports API does not accept
     * overrides with custom parameters (like query, clist for example).
     *
     * Node calls the Java Records API to get a record set back and will supply its own sortList parameter to have Java return the sorted record list.
     * It's important to note here that here the sortList parameter is only a string of fids separated by the dot character .
     * This parameter knows nothing about grouping and is in the format '6.7.8'
     *
     * The tests below are integration tests for how Node uses these Java API endpoints. It can be argued that we could separate them into two files
     * but for now I'll leave them here as a feature set for clarity sake. When / if there is more error checking implemented on the Java Reports API for
     * the sortList parameters (see below) and the test case number increases we can break them up into separate spec files.
     *
     * - klabak
     */
    describe('API - Validate report sorting and grouping execution', function() {
        // Set timeout for all tests in the spec file
        this.timeout(testConsts.INTEGRATION_TIMEOUT);

        // Global vars
        var generatedApp;
        var app;
        var nonBuiltInFields;
        var generatedRecords;
        var records;
        // fids to sort by
        var sortByRecordIdFid = 3;
        var sortByTextFid = 6;
        var sortByNumFid = 7;
        var sortByDateFid = 8;

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
                nonBuiltInFields = recordBase.getNonBuiltInFields(app.tables[0]);
                // Generate some record JSON objects to add to the app
                generatedRecords = recordBase.generateRecords(nonBuiltInFields, 10);
                // TODO: QBSE-22522
                // TODO: Intermittent bug with duplicate records. By default Java core will sort by recordID value if no sortList specified
                // TODO: It will not default to this if sortList criteria matches on each fid specified (and no sorting takes place)
                // TODO: Sometimes 2 records with equal values (except for recordId) will come back in ascending order based on recordId
                // TODO: and sometimes they will come back in descending order
                // Duplicate and edit one of the records to have one field be different in value
                // This will actually create you a new object with cloned object values (not just references to the original array)
                //var clonedArray = JSON.parse(JSON.stringify(generatedRecords));
                //var dupRecord = clonedArray[0];
                // Edit the numeric field so we can check the second level sort (ex: 6.7)
                //dupRecord.forEach(function(field) {
                //    if (field.id === '7') {
                //        field.value = 1;
                //    }
                //});
                // Add the new record back in to create
                //generatedRecords.push(dupRecord);
                // Add the records to the app
                recordBase.addRecords(app, app.tables[0], generatedRecords).then(function(returnedRecords) {
                    // Push the created records into an array (the add record call also returns the fields used)
                    var recordData = [];
                    for (var j in returnedRecords) {
                        recordData.push(returnedRecords[j].record);
                    }
                    records = recordData;
                    done();
                });
            }).done(null, function(error) {
                // the then block threw an error
                // so forward that error to Mocha
                done(error);
            });
            return app;
        });

        /**
         * Data Provider for sorting and grouping test cases.
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
                }
            ];
        }

        /**
         * Data Provider for any tests that are failing.
         */
        function failingTestCases() {
            return [
                // TODO: QBSE-22522
                // TODO: The Java Reports API accepts the below sortLists but returns them empty (Bug)
                // TODO: Java core does throw an exception when trying to parse the sortList
                // TODO: "message":"Invalid sList entry when parsing fid.
                {
                    message: 'Sort by Text field, then by Numeric field',
                    sortList: ['6.7'],
                    sortFids: [sortByTextFid, sortByNumFid]
                },
                {
                    message: 'Sort by Text field group by Equal values, then sort by Numeric field, then by date field',
                    sortList: ['6:V.7.8'],
                    sortFids: [sortByTextFid, sortByNumFid, sortByDateFid]
                }
            ];
        }

        sortingReportTestCases().forEach(function(testcase) {
            /**
             * Test to create a report with a sortList param via the Reports API (contains the sort order and groupBy properties for the report)
             * Verify the report properties after creating, then run the report and verify that the report results are sorted.
             */
            it('Reports API - Create a report: ' + testcase.message +
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
         * We currently do not thrown a response error during the create request. Most likely needs to be fixed.
         *
         * Java core does throw an exception when trying to parse the sortList
         * "message":"Invalid sList entry when parsing fid.  sList: adg!@s3.
         */
        it('Reports API - Should return an empty sortList when creating a report with an invalid sortList', function(done) {

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

        /**
         * Test to validate sorting by calling the Records API endpoint
         */
        it('Records API - Should return sorted records when calling the endpoint with a sortList param', function(done) {

            var recordEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[0].id);

            // Params to add to the record GET request
            var sortList = sortByTextFid.toString() + '.' + sortByNumFid.toString();
            // Fid order to sort the expected records by
            var sortFids = [sortByTextFid, sortByNumFid];

            // Query the records API with a supplied sortList, then verify sorting of the returned value
            recordBase.apiBase.executeRequest(recordEndpoint, consts.GET, null, null, '?sortList=' + sortList).then(function(recordGetResult) {
                var recordResult = JSON.parse(recordGetResult.body);
                // Sort the expected records by text field (id 6)
                var sortedExpectedRecords = sortRecords(sortFids, records);
                // Verify sorted records
                verifyRecords(recordResult.records, sortedExpectedRecords);
                // Everything passed (here and in the above async call)
                done();
            }).done(null, function(error) {
                // the then block threw an error
                // so forward that error to Mocha
                // same as calling .done(null, done)
                done(error);
            });
        });

        // TODO: QBSE-22556
        // TODO: Reports API needs to throw proper errors when calling with invalid sortList param
        /**
         * Negative Test to validate 400 error when calling the Records API endpoint with invalid sortList param
         */
        it('Records API - Should return 400 error when calling the endpoint with an invalid sortList param', function(done) {

            var recordEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[0].id);

            // Invalid param to add to the record GET request
            var sortList = 'int!';

            // Query the records API with a supplied sortList, then verify sorting of the returned value
            recordBase.apiBase.executeRequest(recordEndpoint, consts.GET, null, null, '?sortList=' + sortList).then(function(recordGetError) {
                var requestResult = JSON.parse(recordGetError.body);
                assert.strictEqual(requestResult.statusCode, '400', 'Unexpected status code returned');
                assert.strictEqual(requestResult.body.httpStatus, 'BAD_REQUEST', 'Unexpected http status returned');
                assert.strictEqual(requestResult.body.message, 'The field as specified ' + sortList + ' cannot be resolved by either name or field ID.',
                    'Unexpected error message returned');
                done();
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
