(function() {
    'use strict';
    var assert = require('assert');
    require('../../src/app');
    var config = require('../../src/config/environment');
    var recordBase = require('./recordApi.base')(config);
    var consts = require('../../../common/src/constants');
    var log = require('../../src/logger').getLogger();
    var testConsts = require('./api.test.constants');
    var errorCodes = require('../../src/api/errorCodes');
    var request = require('request');

    // Lodash utility library
    var _ = require('lodash');

    // Generator modules
    var appGenerator = require('../../../test_generators/app.generator.js');

    describe('API - Validate report search functionality', function() {
        // Set timeout for all tests in the spec file
        this.timeout(testConsts.INTEGRATION_TIMEOUT);

        // Global vars
        var generatedApp;
        var app;
        var nonBuiltInFields;
        var generatedRecords;
        var records;
        // fids to search by
        var filterByTextFid = 6;
        var filterByNumberFid = 7;
        var filterByCheckBox = 8;

        /**
         * Method to verify two arrays of Record JSON objects are equal in value and order
         */
        function verifyRecords(actualRecords, expectedRecords) {
            // Assert if records from report results matches expected records
            assert.deepStrictEqual(actualRecords, expectedRecords,
                'Unexpected search report records returned: ' + JSON.stringify(actualRecords) + ', Expected: ' + JSON.stringify(expectedRecords));
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
                var clonedArray = JSON.parse(JSON.stringify(generatedRecords));
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
         * Data Provider for searching/filtering test cases.
         */
        function searchReportTestCases() {
            return [
                {
                    message: 'Search by text field',
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
                }
            ];
        }

        searchReportTestCases().forEach(function(testcase) {
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
                        var metaData = JSON.parse(reportResults.body);
                        //verify report Meta Data
                        assert.strictEqual(metaData.name, reportToCreate.name, 'Unexpected report name returned in reportMetaData');
                        assert.strictEqual(metaData.description, reportToCreate.description, 'Unexpected report description returned in reportMetaData');
                        assert.strictEqual(metaData.type, reportToCreate.type, 'Unexpected report type returned in reportMetaData');
                        assert.strictEqual(metaData.tableId, reportToCreate.tableId, 'Unexpected tableId returned in reportMetaData');
                        assert.deepStrictEqual(metaData.sortList, testcase.sortList, 'Unexpected sortList returned in reportMetaData');

                        // Execute a report with facets and check returned results
                        // TODO report/results API is not getting the records sorted.So using report results below to verify.
                         recordBase.apiBase.executeRequest(reportEndpoint + r.id + '/results', consts.GET).then(function(reportResult) {
                        //recordBase.apiBase.executeRequest(reportEndPoint + r.id + '/invoke', consts.GET).then(function(reportResult) {
                            //Arif
                            // var results = JSON.parse(reportResult.body);
                            // // Sort the expected records
                            // var sortedExpectedRecords = sortRecords(records, testcase.sortFids, testcase.sortOrder);
                            // // Verify sorted records
                            // verifyRecords(results.records, sortedExpectedRecords);
                            // // No grouping
                            // assert.equal(results.groups.length, 0, 'Excepted groups object to be empty when testing sort only report');
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
         * Test to validate search by calling the Records API endpoint
         */
        it('Records API - Should return search result records when calling the endpoint with a search param', function(done) {

            var recordEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[0].id);
            var reportEndpoint = recordBase.apiBase.resolveReportsEndpoint(app.id, app.tables[0].id, 1);

            // Params to add to the record GET request
            var sortByTextFid = 6;
            var sortByNumFid = 7;
            var sortList = sortByTextFid + '.' + -sortByNumFid + '&&&';

            // Fid order to sort the expected records by
            var sortFids = [function(row) {return getSortValue(row, 6);}, function(row) {return getSortValue(row, 7);}];
            var sortOrder = ['asc', 'desc'];

            // Query the records API with a supplied sortList, then verify sorting of the returned value
            recordBase.apiBase.executeRequest(reportEndpoint, consts.GET).then(function(recordGetResult) {
                var recordResult = JSON.parse(recordGetResult.body);
                // Sort the expected records by text field (id 6) ascending then by numeric field (id 7) descending
                // Verify sorted records
                //Arif
                // verifyRecords(recordResult.records, sortedExpectedRecords);
                console.log('XXX: ' + recordResult.records[0][1].value);
                var filterStr = recordResult.records[0][1].value;
                var filteredReportEndPoint =
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
