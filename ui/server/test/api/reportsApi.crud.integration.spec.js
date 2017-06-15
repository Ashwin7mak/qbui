(function() {
    'use strict';
    const assert = require('assert');
    require('../../src/app');
    const config = require('../../src/config/environment');
    const recordBase = require('./recordApi.base')(config);
    const consts = require('../../../common/src/constants');
    const log = require('../../src/logger').getLogger();
    const testConsts = require('./api.test.constants');
    const errorCodes = require('../../src/api/errorCodes');
    const testUtils = require('./api.test.Utils');
    let reportEndpoint = "";

    describe('API - Validate report CRUD operations', function() {
        var app;

        // App variable with different data fields
        let appWithNoFlags = {
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
                done();
            }).catch(function(error) {
                log.error(JSON.stringify(error));
                done();
            });
        });

        it('should create a report, modify the report, and validate the modified report is as expected', ()=> {
            reportEndpoint = recordBase.apiBase.resolveReportsEndpoint(app.id, app.tables[0].id);

            let reportToCreate = {
                name: 'test report',
                type: 'TABLE',
                tableId: app.tables[0].id,
                fids: [6, 7, 8, 9]
            };

            let propsToChange = {
                name: 'changed name',
                fids: [9, 10, 7, 8]
            };

            return createReport(reportToCreate)
                .then(fetchReport)
                .then(originalReport => updateReport(originalReport, propsToChange))
                .then(originalReport => assertUpdateCorrect(originalReport, propsToChange))
                .catch((error) => {
                    log.error(JSON.stringify(error));
                    return Promise.reject(error);
                });

        });

        /**
         * Create a report.  Requires reportEndpoint to have been previously populated
         * @param reportToCreate with any desired report properties set
         * @returns the id of the newly created report
         */
        function createReport(reportToCreate) {
            return recordBase.apiBase.executeRequest(reportEndpoint, consts.POST, reportToCreate)
                .then(createReportResponse => {
                    return JSON.parse(createReportResponse.body).id;
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
                    return returnedBody;
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
        function updateReport(originalReport, propsToChange) {
            return recordBase.apiBase.executeRequest(reportEndpoint + originalReport.id, consts.PATCH, propsToChange)
                .then(patchResponse => {
                    // The patch method doesn't return a body, so return the original report to make it easier to chain
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
