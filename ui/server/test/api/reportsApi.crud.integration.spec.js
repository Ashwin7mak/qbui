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
    var reportEndpoint = "";

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
                reportEndpoint = recordBase.apiBase.resolveReportsEndpoint(app.id, app.tables[0].id);

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
         * Create a report.  Requires reportEndpoint to have been previously populated
         * @param reportToCreate with any desired report properties set
         * @returns the id of the newly created report
         */
        function createReport(reportToCreate) {
            assert.not(reportEndpoint.empty(), `reportEndpoint must be set before calling ${functionName}`);
            return recordBase.apiBase.executeRequest(reportEndpoint, consts.POST, reportToCreate).then(createReportResponse => {
                return JSON.parse(createReportResponse.body).id;
            }, errorResponse => {
                // Pass through the error and expect the assertions to handle it correctly
                return errorResponse;
            });
        }

        /**
         * Fetch a report based its id.  Requires reportEndpoint to have been previously populated
         * @param reportId
         * @returns the metadata for a report
         */
        function fetchReport(reportId) {
            return recordBase.apiBase.executeRequest(reportEndpoint + reportId, consts.GET)
                .then(fetchResponse => {
                    let returnedBody = JSON.parse(fetchResponse.body);
                    return JSON.parse(returnedBody.body);
                });
        }

        /**
         * Compares two reports and asserts that only the properties in the propsToChange object differ between the two
         * @param updatedReport
         * @param originalReport
         * @param propsToChange
         */
        function assertExpected(updatedReport, originalReport, propsToChange) {
            for (var prop in updatedReport) {
                if (propsToChange.hasOwnProperty(prop)) {
                    assert.deepEqual(updatedReport[prop], propsToChange[prop], `${prop} should have been updated`);
                } else {
                    assert.deepEqual(updatedReport[prop], originalReport[prop], `${prop} should NOT have been updated`);
                }
            }
        }

        /**
         * Updates the specified properties of a report
         * @param originalReport
         * @param propsToChange
         * @returns the report prior to its being updated (for use further down the chain)
         */
        function updateRecord(originalReport, propsToChange) {
            return recordBase.apiBase.executeRequest(reportEndpoint + originalReport.id, consts.PATCH, propsToChange)
                .then(patchResponse => {
                    console.log(patchResponse.body);
                    return originalReport;
                });
        }

        /**
         * Fetches an updated report, and compares it to its previous version to validate that only the specified
         * properties changed and all other properties are the same as the original
         * @param originalReport
         * @param propsToChange
         * @returns {*}
         */
        function assertUpdateCorrect(originalReport, propsToChange) {

            return fetchReport(originalReport.id).then(updatedReport => {
                assertExpected(updatedReport, originalReport, propsToChange);
            });

        }

        it('should create a report, modify the report, and validate the modified report is as expected', function() {
            reportEndpoint = recordBase.apiBase.resolveReportsEndpoint(app.id, app.tables[0].id);
            // This should have all fields in it, since none were specified
            let reportToCreate = {
                name: 'test report',
                type: 'TABLE',
                tableId: app.tables[0].id,
                fids: [6,7,8,9]
            };

            let propsToChange = {
                name: 'changed name',
                type: 'TABLE',
                tableId: app.tables[0].id,
                fids: [9,10,7,8]
            };

            return createReport(reportToCreate)
                .then(fetchReport)
                .then(originalReport => updateRecord(originalReport, propsToChange))
                .then(originalReport => assertUpdateCorrect(originalReport, propsToChange))
                .catch((error) => {
                    log.error(JSON.stringify(error));
                    return Promise.reject(error);
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
