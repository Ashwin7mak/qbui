/**
 * E2E Smoke Test for New Stack Production Environment
 * Created by klabak on 10/20/16
 */
// jshint sub: true
// jscs:disable requireDotNotation

(function() {
    'use strict';

    // Load the page objects
    var ReportServicePage = requirePO('reportService');
    var CurrentStackLoginPage = requirePO('currentStackLogin');
    var CurrentStackReportsPage = requirePO('currentStackReports');

    var reportServicePage = new ReportServicePage();
    var currentStackLoginPage = new CurrentStackLoginPage();
    var currentStackReportsPage = new CurrentStackReportsPage();

    describe('New Stack Production Smoke Test', function() {

        var CURRENT_STACK_PROD_REALM = 'https://team.quickbase.com';
        var CURRENT_STACK_APPID = 'bkj4bmc3s';
        var CURRENT_STACK_TABLEID = 'bkj4bmc7r';

        var CURRENT_STACK_USERNAME = 'QuickBaseall';
        var CURRENT_STACK_PASSWORD = 'quickbase1';

        var NEW_STACK_PROD_REALM = 'https://team.newstack.quickbase.com';

        var currentStackRecordCount;
        var currentStackRecordValues;
        var testRecordIndex = 4;

        /**
         * Logs into current stack prod to get a proper ticket. Navigates to the Bicycle app to get a record from the list all
         * report of the Maintenance table. Then logs into the same migrated app in the new stack before starting tests.
         */
        beforeAll(function(done) {
            // Log in to current stack env
            browser.get(CURRENT_STACK_PROD_REALM);

            // Enter login creds
            currentStackLoginPage.loginUser(CURRENT_STACK_USERNAME, CURRENT_STACK_PASSWORD);

            // Go to Bicycle app
            browser.get(CURRENT_STACK_PROD_REALM + '/db/' + CURRENT_STACK_APPID);

            // Go to List All report of test table
            browser.get(CURRENT_STACK_PROD_REALM + '/db/' + CURRENT_STACK_TABLEID + '?a=q&qid=1');

            // Count current stack records in report
            currentStackReportsPage.getRecordCount().then(function(count) {
                currentStackRecordCount = count;
            });

            // Get a record to compare values on the new stack
            currentStackReportsPage.getRecordFromReportTable(testRecordIndex).then(function(recordEl) {
                currentStackReportsPage.getRecordValues(recordEl).then(function(values) {
                    currentStackRecordValues = values;
                });
            });

            // Log in to the new stack env and load the List All report
            browser.get(NEW_STACK_PROD_REALM + '/app/' + CURRENT_STACK_APPID + '/table/' + CURRENT_STACK_TABLEID + '/report/1');
            done();
        });

        /**
         * Before each test starts just make sure the report has loaded in the UI
         */
        beforeEach(function(done) {
            reportServicePage.waitForElement(reportServicePage.agGridContainerEl).then(function() {
                done();
            });
        });

        /**
         * Test methods
         */
        it('Verify the specified record in the List All report matches the one from the current stack', function(done) {
            // Get the records out of the table report
            reportServicePage.agGridRecordElList.then(function(records) {
                // Assert we have all records being displayed from current stack
                expect(records.length).toBe(currentStackRecordCount);
                // Check the values of the selected record
                reportServicePage.getRecordValues(records[testRecordIndex]).then(function(newStackRecordValues) {
                    // Currently showing record Id column on new stack so don't use that in assert
                    newStackRecordValues.shift();
                    expect(newStackRecordValues).toEqual(currentStackRecordValues);
                    done();
                });
            });
        });

        /**
         * After all tests are done, this function is used for any cleanup
         */
        afterAll(function(done) {
            done();
        });
    });
}());
