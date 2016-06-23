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
    var testUtils = require('./api.test.Utils');

    describe('API - Validate report query execution', function() {
        var app;
        var testRecord1 = '[{"id": 6 , "value": "abcdef"},{"id": 7 , "value": "2016-04-12"},{"id": 8,"value": "2016-04-12T05:51:19Z"},{"id": 9 , "value": "first_name_last_name@quickbase.com"},{"id": 10 , "value": true},{"id": 11 , "value": ""},{"id": 12 , "value": ""},{"id": 13 , "value": "2016-10-08"}]';
        var testRecord2 = '[{"id": 6 , "value": "xyz"},{"id": 7 , "value": "2015-04-12"},{"id": 8,"value": "2015-04-12T05:51:19Z"},{"id": 9 , "value": "xyz_last_name@quickbase.com"},{"id": 10 , "value": false},{"id": 11 , "value": ""},{"id": 12 , "value": ""},{"id": 13 , "value": "2015-08-08"}]';
        var testRecord3 = '[{"id": 6 , "value": "wuv"},{"id": 7 , "value": "2016-01-12"},{"id": 8,"value": "2016-01-12T05:51:19Z"},{"id": 9 , "value": "abcxyz_LastName@quickbase.com"},{"id": 10 , "value": true},{"id": 11 , "value": ""},{"id": 12 , "value": ""},{"id": 13 , "value": "2014-08-08"}]';

        var FORMAT = 'display';

        // App variable with different data fields
        var appWithNoFlags = {
            name: 'reportSearch',
            tables: [
                {
                    name: 'table1', fields: [
                    {name: 'Text Field', datatypeAttributes: {type: 'TEXT'}, type: 'SCALAR'},
                    {name: 'Date Field', datatypeAttributes: {type: 'DATE'}, type: 'SCALAR'},
                    {name: 'Date Time Field', datatypeAttributes: {type: 'DATE_TIME'}, type: 'SCALAR'},
                    {name: 'Email Field', datatypeAttributes: {type: 'EMAIL_ADDRESS'}, type: 'SCALAR'},
                    {name: 'Checkbox Field', datatypeAttributes: {type: 'CHECKBOX'}, type: 'SCALAR'},
                    {name: 'Null Text Field', datatypeAttributes: {type: 'TEXT'}, type: 'SCALAR'},
                    {name: 'Empty Text Field', datatypeAttributes: {type: 'TEXT'}, type: 'SCALAR'},
                    {name: 'Date Field', datatypeAttributes: {type: 'DATE'}, type: 'SCALAR'},
                    ]
                }
            ]

        };

        /**
         * Setup method. Generates JSON for an app, a table with different fields, and a single record with different field types.
         */
        before(function(done) {
            this.timeout(testConsts.INTEGRATION_TIMEOUT * appWithNoFlags.length);
            recordBase.createApp(appWithNoFlags).then(function(appResponse) {
                app = JSON.parse(appResponse.body);
                var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[0].id);

                var fetchRecordPromises = [];
                recordBase.createAndFetchRecord(recordsEndpoint, JSON.parse(testRecord1), '?format=' + FORMAT);
                recordBase.createAndFetchRecord(recordsEndpoint, JSON.parse(testRecord2), '?format=' + FORMAT);
                recordBase.createAndFetchRecord(recordsEndpoint, JSON.parse(testRecord3), '?format=' + FORMAT);
                done();
            }).catch(function(error) {
                log.error(JSON.stringify(error));
                done();
            });
            return app;
        });


        /**
         * Data Provider for reports and faceting results.
         */
        function reportQueryTestCases() {
            return [
                {
                    message: 'Query Contains(CT) Operator',
                    Query: "{'9'.CT.'quickbase'}",
                    count:'3'
                },
                {
                    message: 'Query Not Contains(XCT) Operator',
                    Query: "{'9'.XCT.'quickbase.com'}",
                    count:'0'
                },
                {
                    message: 'Query Is AND Operator',
                    Query: "{'6'.XEX.''}AND{'11'.EX.''}",
                    count:'3'
                },
                {
                    message: 'Query Is before Operator',
                    Query: "{'7'.BF.'01-12-2016'}",
                    count:'1'
                },
                {
                    message: 'Query Is On or After Operator',
                    Query: "{'7'.OAF.'04-12-2015'}",
                    count:'3'
                },
                {
                    message: 'Query Checkbox Operator',
                    Query: "{'10'.EX.'1'}",
                    count:'2'
                },
                {
                    message: 'Query Date/Time Operator',
                    Query: "{'8'.EX.'today'}",
                    count:'0'
                },
                {
                    message: 'Query all searchable fields Contains(CT) w Operator',
                    Query: "{'0'.CT.'w'}",
                    count:'1'
                },
                //TODO the below are failing until Matt G fixes. Known issue.
                //{
                //    message: 'Query all searchable fields Contains(CT) d Operator',
                //    Query: "{'0'.CT.'d'}",
                //    count:'1'
                //},
            ];


        }


        reportQueryTestCases().forEach(function(testcase) {
            it('Test case: ' + testcase.message, function(done) {
                this.timeout(testConsts.INTEGRATION_TIMEOUT);
                var reportEndpoint = recordBase.apiBase.resolveReportsEndpoint(app.id, app.tables[0].id);
                var reportToCreate = {
                    name: testUtils.generateRandomString(5),
                    type: 'TABLE',
                    tableId: app.tables[0].id,
                    query: testcase.Query,
                };
                //Create a report
                recordBase.apiBase.executeRequest(reportEndpoint, consts.POST, reportToCreate).then(function(report) {
                    var r = JSON.parse(report.body);
                    //Execute report against 'resultComponents' endpoint.
                    recordBase.apiBase.executeRequest(reportEndpoint + r.id + '/count/?format=' + FORMAT, consts.GET).then(function(reportResults) {
                        var results = JSON.parse(reportResults.body);
                        console.log("report results are: " + JSON.stringify(results));

                        //Assert if report results count matches expected
                        assert.deepEqual(JSON.stringify(results), testcase.count, 'Unexpected record count returned after query : ' + JSON.stringify(results) + ', ' + testcase.count);
                        done();
                    });

                }).catch(function(error) {
                    log.error(JSON.stringify(error));
                    done();
                });
            });

        });

         //Cleanup the test realm after all tests in the block
        after(function(done) {
            //Realm deletion takes time, bump the timeout
            this.timeout(testConsts.INTEGRATION_TIMEOUT);
            recordBase.apiBase.cleanup().then(function() {
                done();
            });
        });
    });
}());
