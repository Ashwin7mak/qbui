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

    describe('API - Validate report CRUD operations', function() {
        var app;
        //TODO Test Data should not hardcoded.
        //var testRecord = '[{"id": 6 , "value": "abcdef"},{"id": 7 , "value": "2016-04-12"},{"id": 8,"value": "2016-04-12T05:51:19Z"},{"id": 9 , "value": "first_name_last_name@quickbase.com"},{"id": 10 , "value": true},{"id": 11 , "value": ""},{"id": 12 , "value": ""},{"id": 13 , "value": "2016-08-08"}]';
        //var expectedRecords = [[
        //    {"id":6, "value":"abcdef", "display":"abcdef"},
        //    {"id":7, "value":"2016-04-12", "display":"04-12-2016"},
        //    {"id":8, "value":"2016-04-12T05:51:19Z[UTC]", "display":"04-11-2016 10:51 pm"},
        //    {"id":9, "value":"first_name_last_name@quickbase.com", "display":"first_name_last_name@quickbase.com"},
        //    {"id":10, "value":true, "display":true},
        //    {"id":11, "value":null, "display":""},
        //    {"id":12, "value":null, "display":""},
        //    {"id":13, "value":"2016-08-08", "display":"08-08-2016"},
        //    {"id":3, "value":1, "display":"1"}
        //]];

        var FORMAT = 'display';

        ///**
        // * Method to verify Records returned in reportResults with expectedRecords
        // */
        //function verifyRecords(reportResults) {
        //    var actualReportResults = [];
        //    var expectedReportRecords = [];
        //
        //    var records = reportResults;
        //    if (!Array.isArray(records)) {
        //        records = reportResults.records;
        //    }
        //    records.forEach(function(record) {
        //        actualReportResults.push(record);
        //    });
        //
        //    //Push the expected records to an array.
        //    for (var j in expectedRecords) {
        //        expectedReportRecords.push(expectedRecords[j]);
        //    }
        //    //Assert if records from report results matches expected records
        //    assert.deepEqual(JSON.stringify(actualReportResults), JSON.stringify(expectedReportRecords), 'Unexpected report result returned: ' + JSON.stringify(actualReportResults) + ', ' + JSON.stringify(expectedReportRecords));
        //}
        //


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
                    {name: 'Null Text Field', datatypeAttributes: {type: 'TEXT'}, type: 'SCALAR'},
                    {name: 'Empty Text Field', datatypeAttributes: {type: 'TEXT'}, type: 'SCALAR'},
                    {name: 'Date Field', datatypeAttributes: {type: 'DATE'}, type: 'SCALAR'}
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
            console.log("before function");
            this.timeout(testConsts.INTEGRATION_TIMEOUT * appWithNoFlags.length);
            recordBase.createApp(appWithNoFlags).then(function(appResponse) {
                app = JSON.parse(appResponse.body);
                var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[0].id);
                recordBase.createAndFetchRecord(recordsEndpoint, JSON.parse(testRecord), '?format=' + FORMAT);
                //second table records
                let records = [];
                for (var i = 0; i <= 210; i++) {
                    var value = testUtils.generateRandomString(10);
                    records.push([{id: 6, value: "' + value + '"}]);
                }
                var recordsEndpoint2 = recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[1].id);
                recordBase.createBulkRecords(recordsEndpoint2, records).then(
                    (success) => {
                        done();
                    },
                    (error) => {
                        throw new Error("Error in set up for ReportsApi" + JSON.stringify(error));
                    }
                );
            }).catch(function(error) {
                log.error(JSON.stringify(error));
                done();
            });
        });


        /**
         * Test to create a report with all fields and verify the results.
         */
        it('Should create a report, execute the report, and validate the resulting ' +
            'record matches the created record in setup', function() {
            this.timeout(testConsts.INTEGRATION_TIMEOUT * appWithNoFlags.length);

            var reportEndpoint = recordBase.apiBase.resolveReportsEndpoint(app.id, app.tables[0].id);
            var reportToCreate = {
                name: 'test report',
                type: 'TABLE',
                tableId: app.tables[0].id
            };
            //Create a report
            return recordBase.apiBase.executeRequest(reportEndpoint, consts.POST, reportToCreate).then(function(report) {
                var r = JSON.parse(report.body);
                //Execute a report
                return recordBase.apiBase.executeRequest(reportEndpoint + r.id + '/results?format=' + FORMAT, consts.GET).then(function(reportResults) {
                    return JSON.parse(reportResults.body);
                }, error => {
                    log.error(JSON.stringify(error));
                });
            })
            .then(verifyRecords)
            .catch(function(error) {
                log.error(JSON.stringify(error));
                return Promise.reject(error);
            });
        });

        it('should create a report, modify the report, and validate the modified report is as expected', function() {
            let reportEndpoint = recordBase.apiBase.resolveReportsEndpoint(app.id, app.tables[0].id);

            // This should have all fields in it, since none were specified
            let reportToCreate = {
                name: 'test report',
                type: 'TABLE',
                tableId: app.tables[0].id
            };

            recordBase.apiBase.executeRequest(reportEndpoint, consts.POST, reportToCreate).then(function(report) {
                var r = JSON.parse(report.body);
                console.log("report is " + report + " r is " + r);

            }).catch(function(error) {
                log.error(JSON.stringify(error));
                done();
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
