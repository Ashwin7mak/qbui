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
    var request = require('request');

    // Bluebird Promise library
    var Promise = require('bluebird');

    // Lodash utility library
    var _ = require('lodash');

    // Generator modules
    var appGenerator = require('../../../test_generators/app.generator.js');

    describe('API - Validate report sorting execution', function() {
        // Set timeout for all tests in the spec file
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

        /*
         * Given an array of record JSON objects sort them by a certain field(s) (specified by a list of fids and sort direction)
         * @Returns An array of sorted record JSON objects
         */
        function sortRecords(recordsToSort, sortFids, sortOrder) {
            // sorts the list of records passed in specified sort order for a given fid.
            var sortedRecords = _.orderBy(recordsToSort, sortFids, sortOrder);

            return sortedRecords;
        }

        /*
         * This function gets the value in the record parameter (array of field value pairs), where id matches the fid specified in the parameter
         * Function is a custom sort function used by lodash from within the sortRecords function
         * @Returns The value that lodash should sort on
         */
        function getSortValue(record, fid) {
            // By default returns nothing if not found
            var val = [];
            // loop through the columns (fields) in the record
            record.forEach(function(col) {
                // find the column we are sorting on and return its value
                if (col.id === fid) {
                    val.push(col.value);
                }
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
                generatedRecords = recordBase.generateRecords(nonBuiltInFields, 5);
                var generateEmptyRecords = recordBase.generateEmptyRecords(nonBuiltInFields, 1);
                // TODO: QBSE-22522
                // TODO: Intermittent bug with duplicate records. By default Java core will sort by recordID value if no sortList specified
                // TODO: It will not default to this if sortList criteria matches on each fid specified (and no sorting takes place)
                // TODO: Sometimes 2 records with equal values (except for recordId) will come back in ascending order based on recordId
                // TODO: and sometimes they will come back in descending order
                // Duplicate and edit one of the records to have one field be different in value
                // This will actually create you a new object with cloned object values (not just references to the original array)
                var clonedArray = JSON.parse(JSON.stringify(generatedRecords));
                var dupRecord = clonedArray[0];
                // Edit the numeric field so we can check the second level sort (ex: 6.7)
                dupRecord.forEach(function(field) {
                    if (field.id === 7) {
                        field.value = 1.90;
                    }
                    if (field.id === 8) {
                        field.value = '1977-12-12';
                    }
                });
                // Add the new record back in to create
                generatedRecords.push(dupRecord);
                //Add an empaty record back in to create
                generatedRecords.push(generateEmptyRecords);
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
                    message: 'Sort by Date field in ascending order',
                    sortFids: [function(row) {return getSortValue(row, 8);}],
                    sortOrder: ['asc'],
                    sortList: [
                        {
                            "fieldId": 8,
                            "sortOrder": "asc",
                            "groupType": null
                        }
                    ]
                },
                {
                    message: 'Sort by Date field in descending order',
                    sortFids: [function(row) {return getSortValue(row, 8);}],
                    sortOrder: ['desc'],
                    sortList: [
                        {
                            "fieldId": 8,
                            "sortOrder": "desc",
                            "groupType": null
                        }
                    ]
                },
                {
                    message: 'Sort by text field in ascending then by numeric field in descending order',
                    sortFids: [function(row) {return getSortValue(row, 6);}, function(row) {return getSortValue(row, 7);}],
                    sortOrder: ['asc', 'desc'],
                    sortList: [
                        {
                            "fieldId": 6,
                            "sortOrder": "asc",
                            "groupType": null
                        },
                        {
                            "fieldId": 7,
                            "sortOrder": "desc",
                            "groupType": null
                        }
                    ]
                },
                {
                    message: 'Sort by text field in descending then by numeric field in ascending then by date field in descending order',
                    sortFids: [function(row) {return getSortValue(row, 6);}, function(row) {return getSortValue(row, 7);}, function(row) {return getSortValue(row, 8);}],
                    sortOrder: ['desc', 'desc', 'asc'],
                    sortList: [
                        {
                            "fieldId": 6,
                            "sortOrder": "desc",
                            "groupType": null
                        },
                        {
                            "fieldId": 7,
                            "sortOrder": "desc",
                            "groupType": null
                        },
                        {
                            "fieldId": 8,
                            "sortOrder": "asc",
                            "groupType": null
                        }
                    ]
                },
            ];
        }

        sortingReportTestCases().forEach(function(testcase) {
            /**
             * Test to create a report with a sortList param via the Reports API (contains the sortList parameter for the report creation)
             * Verify the report properties after creating, then run the report and verify that the report results are sorted.
             */
            it('Reports API - Create a report: ' + testcase.message +
                ' , execute the report, and validate the resulting record sort', function(done) {
                var reportEndpoint = recordBase.apiBase.resolveReportsEndpoint(app.id, app.tables[0].id);
                var reportToCreate = {
                    name: testcase.message + ' Report',
                    description: testcase.message + ' Report description',
                    type: 'TABLE',
                    tableId: app.tables[0].id,
                    sortList: testcase.sortList
                };
                //Create a report
                recordBase.apiBase.executeRequest(reportEndpoint, consts.POST, reportToCreate).then(function(report) {
                    var r = JSON.parse(report.body);
                    // Get the report data back, check for sortList prop which also contains groupBy
                    recordBase.apiBase.executeRequest(reportEndpoint + r.id, consts.GET).then(function(reportGetResult) {
                        var reportResults = JSON.parse(reportGetResult.body);
                        //verify report Meta Data
                        assert.strictEqual(reportResults.reportMetaData.data.name, reportToCreate.name, 'Unexpected report name returned in reportMetaData');
                        assert.strictEqual(reportResults.reportMetaData.data.description, reportToCreate.description, 'Unexpected report description returned in reportMetaData');
                        assert.strictEqual(reportResults.reportMetaData.data.type, reportToCreate.type, 'Unexpected report type returned in reportMetaData');
                        assert.strictEqual(reportResults.reportMetaData.data.tableId, reportToCreate.tableId, 'Unexpected tableId returned in reportMetaData');
                        assert.deepStrictEqual(reportResults.reportMetaData.data.sortList, testcase.sortList, 'Unexpected sortList returned in reportMetaData');
                        assert.deepStrictEqual(reportResults.reportData.data.records.length, records.length, 'Unexpected records returned in reportData');

                        // Execute a report and check sort order of records
                        // TODO report/results API is not getting the records sorted.So using reportComponents below to verify.
                        recordBase.apiBase.executeRequest(reportEndpoint + r.id + '/reportComponents', consts.GET).then(function(reportResult) {
                            var results = JSON.parse(reportResult.body);
                            // Sort the expected records
                            var sortedExpectedRecords = sortRecords(records, testcase.sortFids, testcase.sortOrder);
                            // Verify sorted records
                            verifyRecords(results.records.records, sortedExpectedRecords);
                            // No grouping
                            assert.equal(results.records.groups, null, 'Excepted groups object to be null when testing sort only report');
                            done();
                        });
                    });
                }).catch(function(error) {
                    log.error(JSON.stringify(error));
                    done();
                });
            });
        });

        /**
         * Negative Test to validate 400 error when calling the Reports API endpoint with invalid sortList param
         */
        it('Reports API - Should return 400 error when creating report with an invalid sortList param', function(done) {

            var reportEndpoint = recordBase.apiBase.resolveReportsEndpoint(app.id, app.tables[0].id);
            var reportToCreate = {
                name: 'Invalid Sorting Report',
                description: 'Invalid sortList',
                type: 'TABLE',
                tableId: app.tables[0].id,
                sortList: [{
                    "fieldId": 10,
                    "sortOrder": "desc",
                    "groupType": null
                }],
            };

            // Create a report with invalid sortList FID
            request(recordBase.apiBase.createRequestObject(reportEndpoint, consts.POST, reportToCreate), function(error, response) {
                var result = JSON.parse(response.body);
                assert.strictEqual(response.statusCode, 400, 'Unexpected status code.');
                assert.strictEqual(result[0].httpStatus, 'BAD_REQUEST', 'Unexpected http status returned');
                assert.strictEqual(result[0].message, 'The field id is not valid.',
                    'Unexpected error message returned');
                done();
            });
        });

        /**
         * Test to validate sorting by calling the Records API endpoint
         */
        it('Records API - Should return sorted records when calling the endpoint with a sortList param', function(done) {

            var recordEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[0].id);

            // Params to add to the record GET request
            var sortList = sortByTextFid + '.' + -sortByNumFid + '&&&';

            // Fid order to sort the expected records by
            var sortFids = [function(row) {return getSortValue(row, 6);}, function(row) {return getSortValue(row, 7);}];
            var sortOrder = ['asc', 'desc'];

            // Query the records API with a supplied sortList, then verify sorting of the returned value
            recordBase.apiBase.executeRequest(recordEndpoint, consts.GET, null, null, '?sortList=' + sortList).then(function(recordGetResult) {
                var recordResult = JSON.parse(recordGetResult.body);
                // Sort the expected records by text field (id 6) ascending then by numeric field (id 7) descending
                var sortedExpectedRecords = sortRecords(records, sortFids, sortOrder);
                // Verify sorted records
                verifyRecords(recordResult.records, sortedExpectedRecords);
                done();
            }).done(null, function(error) {
                // the then block threw an error
                // so forward that error to Mocha
                // same as calling .done(null, done)
                done(error);
            });
        });

        /**
         * Negative Test to validate 400 error when calling the Records API endpoint with invalid sortList param
         */
        it('Records API - Should return 400 error when calling records API endpoint with an invalid sortList param', function(done) {

            var recordEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[0].id);

            // Params to add to the record GET request
            var sortList = 'int!&&&';

            // Query a records API endpoint with invalid sortList FID
            request(recordBase.apiBase.createRequestObject(recordEndpoint, consts.GET, null, null, '?sortList=' + sortList), function(error, response) {
                var requestResult = JSON.parse(response.body);
                assert.strictEqual(response.statusCode, 400, 'Unexpected status code returned');
                assert.strictEqual(JSON.parse(requestResult.body)[0].httpStatus, 'BAD_REQUEST', 'Unexpected http status returned');
                assert.strictEqual(JSON.parse(requestResult.body)[0].message.replace(/[0-9]/g, ''), 'The field as specified - cannot be resolved by either name or field ID',
                    'Unexpected error message returned');
                done();
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
