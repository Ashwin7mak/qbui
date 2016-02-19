(function() {
    'use strict';
    var assert = require('assert');
    require('../../app');
    var config = require('../../config/environment');
    var recordBase = require('./recordApi.base')(config);
    var consts = require('../constants');
    var log = require('../../logger').getLogger();
    var testConsts = require('./api.test.constants');

    describe('API - Validate report execution', function() {
        var app;
        var testRecord = '[{"id": 6 , "value": "abcdef"},{"id": 7 , "value": "2016-04-12"},{"id": 8,"value": "2016-04-12T05:51:19Z"},{"id": 9 , "value": "first_name_last_name@quickbase.com"},{"id": 10 , "value": true},{"id": 11 , "value": ""},{"id": 12 , "value": ""},{"id": 13 , "value": "2016-08-08"}]';
        var expectedRecords = [[
            {"id":3, "value":1, "display":"1"},
            {"id":6, "value":"abcdef", "display":"abcdef"},
            {"id":7, "value":"2016-04-12", "display":"04-12-2016"},
            {"id":8, "value":"2016-04-12T05:51:19Z[UTC]", "display":"04-11-2016 10:51 PM"},
            {"id":9, "value":"first_name_last_name@quickbase.com", "display":"first_name_last_name@quickbase.com"},
            {"id":10, "value":true, "display":true},
            {"id":11, "value":null, "display":""},
            {"id":12, "value":null, "display":""},
            {"id":13, "value":"2016-08-08", "display":"08-08-2016"},
        ]];

        var FORMAT = 'display';
        /**
         * Generates and returns a random string of specified length
         */
        function generateRandomString(size) {
            var possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
            var text = '';
            for (var i = 0; i < size; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        }


        // App variable with different data fields
        var appWithNoFlags = {
            name: 'Percent App - no flags',
            tables: [
                {
                    name: 'table1', fields: [
                    {name: 'Text Field', datatypeAttributes: {type: 'TEXT'}, type: 'SCALAR'},
                    {name: 'Date Field', datatypeAttributes: {type: 'DATE'}, type: 'SCALAR'},
                    {name: 'Date Time Field', datatypeAttributes: {type: 'DATE_TIME'}, type: 'SCALAR'},
                    {name: 'Email Field', datatypeAttributes: {type: 'EMAIL_ADDRESS'}, type: 'SCALAR'},
                    {name: 'Checkbox Field', datatypeAttributes: {type: 'CHECKBOX'}, type: 'SCALAR'},
                    {name: 'Null Field', datatypeAttributes: {type: 'TEXT'}, type: 'SCALAR'},
                    {name: 'Empty Field', datatypeAttributes: {type: 'TEXT'}, type: 'SCALAR'},
                    {name: 'Date Field', datatypeAttributes: {type: 'DATE'}, type: 'SCALAR'},
                    ]
                },
                {
                    name: 'table2', fields: [
                    {name: 'Text Field', datatypeAttributes: {type: 'TEXT'}, type: 'SCALAR'}
                    ]
                }
            ]

        };

        /**
         * Setup method. Generates JSON for an app, a table with different fields, and a single record with different field types.
         */
        before(function(done) {
            //var record = '[{"id": 6 , "value": "abcdef"},{"id": 7 , "value": 0.74765432}]';
            this.timeout(testConsts.INTEGRATION_TIMEOUT * appWithNoFlags.length);
            recordBase.createApp(appWithNoFlags).then(function(appResponse) {
                app = JSON.parse(appResponse.body);
                var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[0].id);
                recordBase.createAndFetchRecord(recordsEndpoint, JSON.parse(testRecord), '?format=' + FORMAT);
                //second table records
                for (var i = 0; i <= 210; i++) {
                    var value = generateRandomString(10);
                    var record = '[{"id": 6 , "value": "' + value + '"}]';
                    var recordsEndpoint2 = recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[1].id);
                    recordBase.createAndFetchRecord(recordsEndpoint2, JSON.parse(record), '?format=' + FORMAT);
                }
                done();
            });
            return app;
        });


        /**
         * Test to create a report with all fields and verify the results.
         */
        it('Should create a report, execute the report, and validate the resulting ' +
            'record matches the created record in setup', function(done) {
            this.timeout(testConsts.INTEGRATION_TIMEOUT * appWithNoFlags.length);
            var actualReportResults = [];
            var expectedTestRecords = [];
            var reportEndpoint = recordBase.apiBase.resolveReportsEndpoint(app.id, app.tables[0].id);
            var reportToCreate = {
                name: 'test report',
                type: 'TABLE',
                tableId: app.tables[0].id
            };
            //Create a report
            recordBase.apiBase.executeRequest(reportEndpoint, consts.POST, reportToCreate).then(function(report) {
                var r = JSON.parse(report.body);
                //Execute a report
                recordBase.apiBase.executeRequest(reportEndpoint + r.id + '/results?format=' + FORMAT, consts.GET).then(function(reportResults) {
                    var results = JSON.parse(reportResults.body);
                    //For each report record results push to an array.
                    for (var i in results.records) {
                        actualReportResults.push(results.records[i]);
                    }
                    //Push the expected records to an array.
                    for (var j in expectedRecords) {
                        expectedTestRecords.push(expectedRecords[j]);
                    }
                    //Assert if records from report results matches expected records
                    assert.deepEqual(JSON.stringify(actualReportResults), JSON.stringify(expectedTestRecords), 'Unexpected report result returned: ' + JSON.stringify(actualReportResults) + ', ' + JSON.stringify(expectedTestRecords));
                    done();
                });
            }).catch(function(error) {
                log.error(JSON.stringify(error));
                done();
            });
        });

        /**
         * Data Provider for reports and faceting results.
         */
        function facetTestCases() {
            return [
                {
                    message: 'text facet',
                    facetFId: [6],
                    expectedFacets: '[{"id":6,"name":"Text Field","type":"TEXT","values":["abcdef"],"hasBlanks":false}]'
                },
                {
                    message: 'Text and Date facet',
                    facetFId: [6, 7],
                    expectedFacets: '[{"id":6,"name":"Text Field","type":"TEXT","values":["abcdef"],"hasBlanks":false},' +
                    '{"id":7,"name":"Date Field","type":"DATE","values":["04-12-2016","04-12-2016"],"hasBlanks":false}]'
                },
                {
                    message: 'Multiple Dates facet',
                    facetFId: [7, 13],
                    expectedFacets: '[{"id":7,"name":"Date Field","type":"DATE","values":["04-12-2016","04-12-2016"],"hasBlanks":false},' +
                    '{"id":13,"name":"Date Field2","type":"DATE","values":["08-08-2016","08-08-2016"],"hasBlanks":false}]'
                },
                {
                    message: 'Text Date and Date Time',
                    facetFId: [6, 7, 8],
                    expectedFacets: '[{"id":6,"name":"Text Field","type":"TEXT","values":["abcdef"],"hasBlanks":false},' +
                    '{"id":7,"name":"Date Field","type":"DATE","values":["04-12-2016","04-12-2016"],"hasBlanks":false},' +
                    '{"id":8,"name":"Date Time Field","type":"DATE_TIME","values":["04-11-2016 10:51 PM","04-11-2016 10:51 PM"],"hasBlanks":false}]'
                },
                {
                    message: 'Facet with 1 Text record and 1 Empty Record',
                    facetFId: [6, 12],
                    expectedFacets: '[{"id":6,"name":"Text Field","type":"TEXT","values":["abcdef"],"hasBlanks":false},{"id":12,"name":"Empty Field","type":"TEXT","values":[""],"hasBlanks":true}]'
                },
                {
                    message: 'Facet with just Empty Record',
                    facetFId: [12],
                    expectedFacets: '[{"id":12,"name":"Empty Field","type":"TEXT","values":[""],"hasBlanks":true}]'
                },
                {
                    message: 'Facet with just Null Record',
                    facetFId: [11],
                    expectedFacets: '[{"id":11,"name":"Null Field","type":"TEXT","values":[""],"hasBlanks":true}]'
                },
                {
                    message: 'Facet with Text null and Empty Records',
                    facetFId: [6, 11, 12],
                    expectedFacets: '[{"id":6,"name":"Text Field","type":"TEXT","values":["abcdef"],"hasBlanks":false},{"id":11,"name":"Null Field","type":"TEXT","values":[""],"hasBlanks":true},{"id":12,"name":"Empty Field","type":"TEXT","values":[""],"hasBlanks":true}]'
                },
                {
                    message: 'Negative Test - Test the order of facet results',
                    facetFId: [11, 12, 6],
                    expectedFacets: '[{"id":11,"name":"Null Field","type":"TEXT","values":[""],"hasBlanks":true},{"id":12,"name":"Empty Field","type":"TEXT","values":[""],"hasBlanks":true},{"id":6,"name":"Text Field","type":"TEXT","values":["abcdef"],"hasBlanks":false}]'
                }

                //TODO Negative testcase for numeric not supporting facets should be added after implementation.
            ];


        }


        facetTestCases().forEach(function(testcase) {
            it('Test case: ' + testcase.message, function(done) {
                var actualReportResults = [];
                var expectedTestRecords = [];
                this.timeout(testConsts.INTEGRATION_TIMEOUT);
                var reportEndpoint = recordBase.apiBase.resolveReportsEndpoint(app.id, app.tables[0].id);
                var reportToCreate = {
                    name: generateRandomString(5),
                    type: 'TABLE',
                    tableId: app.tables[0].id,
                    facetFids: testcase.facetFId
                };
                //Create a report
                recordBase.apiBase.executeRequest(reportEndpoint, consts.POST, reportToCreate).then(function(report) {
                    var r = JSON.parse(report.body);
                    //Execute report against 'resultComponents' endpoint.
                    recordBase.apiBase.executeRequest(reportEndpoint + r.id + '/reportComponents?format=' + FORMAT, consts.GET).then(function(reportResults) {
                        var results = JSON.parse(reportResults.body);
                        //Verify records
                        //For each report record results push to an array.
                        for (var i in results.records) {
                            actualReportResults.push(results.records[i]);
                        }
                        //Push the expected records to an array.
                        for (var j in expectedRecords) {
                            expectedTestRecords.push(expectedRecords[i]);
                        }
                        //Assert if records in recordandFacets results matches expected
                        assert.deepEqual(JSON.stringify(actualReportResults), JSON.stringify(expectedTestRecords), 'Unexpected report result returned: ' + JSON.stringify(actualReportResults) + ', ' + JSON.stringify(expectedTestRecords));

                        //verify facets
                        //Assert if report facet results matches expected
                        assert.deepEqual(JSON.stringify(results.facets), testcase.expectedFacets, 'Unexpected facet result returned: ' + JSON.stringify(results.facets) + ', ' + testcase.expectedFacets);

                        //Delete the report at the end
                        recordBase.apiBase.executeRequest(reportEndpoint + r.id, consts.DELETE).then(function(deleteTestReport) {
                            done();
                        });
                    });

                });
            });

        });

        it('Negative Test case: Facet with text fields limit of 200 fields', function(done) {
            this.timeout(testConsts.INTEGRATION_TIMEOUT);
            //create a report
            var reportEndpoint = recordBase.apiBase.resolveReportsEndpoint(app.id, app.tables[1].id);
            var reportToCreate = {
                name: generateRandomString(5),
                type: 'TABLE',
                tableId: app.tables[1].id,
                facetFids: [6]
            };
            //Create a report
            recordBase.apiBase.executeRequest(reportEndpoint, consts.POST, reportToCreate).then(function(report) {
                var r = JSON.parse(report.body);
                //Execute report against 'resultComponents' endpoint.
                recordBase.apiBase.executeRequest(reportEndpoint + r.id + '/reportComponents?format=' + FORMAT, consts.GET).then(function(reportResults) {
                    var results = JSON.parse(reportResults.body);
                    assert(results.records.length > 200);
                    var expectedFacet = {"id":6, "name":"Text Field", "type":"TEXT", "values":[], "hasBlanks":false, "errorMessage": consts.FACET_RECORD_TOO_BIG_ERROR_MSG};
                    assert.deepEqual(JSON.stringify(results.facets), JSON.stringify([expectedFacet]));
                    //Need to add verification.
                    done();
                });

            });


        });

        // Cleanup the test realm after all tests in the block
        after(function(done) {
            //Realm deletion takes time, bump the timeout
            this.timeout(testConsts.INTEGRATION_TIMEOUT);
            recordBase.apiBase.cleanup().then(function() {
                done();
            });
        });
    });
}());
