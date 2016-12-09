/**
 * E2E Smoke Test for New Stack Production Environment
 * Created by klabak on 10/20/16
 */
// jshint sub: true
// jscs:disable requireDotNotation

(function() {
    'use strict';

    // Load the page objects
    var ReportServicePage = require('../pages/reportService.po');
    var CurrentStackLoginPage = require('../pages/currentStackLogin.po');
    var CurrentStackReportsPage = require('../pages/currentStackReports.po');
    var WalkMePage = require('../pages/walkMe.po');
    var v2Tov3Page = require('../pages/v2Tov3.po');

    var reportServicePage = new ReportServicePage();
    var currentStackLoginPage = new CurrentStackLoginPage();
    var currentStackReportsPage = new CurrentStackReportsPage();
    var walkMePage = new WalkMePage();
    var v2Tov3PO = new v2Tov3Page();

    describe('New Stack Production Smoke Test', function() {

        var PROD_REALM = 'https://team.quickbase.com';
        var APPID = 'bkj4bmc3s';
        var TABLEID = 'bkj4bmc7r';

        var ADMIN_USERNAME = 'QuickBaseall';
        var ADMIN_PASSWORD = 'quickbase1';

        var USER_VIEWER_ROLE_USERNAME = 'qbautomationviewer@gmail.com';
        var USER_VIEWER_ROLE_PASSWORD = 'Quickbase123';

        var currentStackRecordCount;
        var currentStackRecordValues;
        var testRecordIndex = 4;
        var userId;

        /**
         * Logs into current stack prod to get a proper ticket. Navigates to the Bicycle app to get a record from the list all
         * report of the Maintenance table. Then logs into the same migrated app in the new stack before starting tests.
         */
        beforeAll(function(done) {
            // Log in to current stack env
            return browser.get(PROD_REALM).then(function() {
                // Enter login creds
                return currentStackLoginPage.loginUser(ADMIN_USERNAME, ADMIN_PASSWORD);
            }).then(function() {
                // Go to Bicycle app
                return browser.get(PROD_REALM + '/db/' + APPID);
            }).then(function() {
                // Go to List All report of test table
                return browser.get(PROD_REALM + '/db/' + TABLEID + '?a=q&qid=1');
            }).then(function() {
                // Count current stack records in report
                return currentStackReportsPage.getRecordCount().then(function(count) {
                    currentStackRecordCount = count;
                });
            }).then(function() {
                // Get a record to compare values on the new stack
                return currentStackReportsPage.getRecordFromReportTable(testRecordIndex).then(function(recordEl) {
                    return currentStackReportsPage.getRecordValues(recordEl).then(function(values) {
                        currentStackRecordValues = values;
                    });
                });
            }).then(function() {
                // Log in to the new stack env and load the List All report
                return browser.get(PROD_REALM + '/qbase/apps/').then(function() {
                    return reportServicePage.waitForElement(reportServicePage.appsListDivEl);
                });
            }).then(function() {
                //dismiss walkme
                walkMePage.dismissWalkMe();
                done();
            });
        });

        /**
         * Tests
         */
        it('Verify the specified record in the List All report matches the one from the current stack', function(done) {
            browser.get(PROD_REALM + '/qbase/app/' + APPID + '/table/' + TABLEID + '/report/1').then(function() {
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
        });

        it('Verify admin(quickbaseall) can switch from V3 to V2 from user Menu', function(done) {
            // Log in to the new stack env and go to Bicycle app
            browser.get(PROD_REALM + '/qbase/app/' + APPID).then(function() {
                //wait untill table lists loaded at leftNav
                reportServicePage.waitForElement(reportServicePage.tablesListDivEl);
            }).then(function() {
                //select switch to quickbase classic Toggle under user Menu
                v2Tov3PO.clickUserMenuItem('Switch to QuickBase Classic');
            }).then(function() {
                //verify its switched to classic view (ie V2)
                browser.getCurrentUrl().then(function(url) {
                    expect(url).toBe(PROD_REALM + '/db/' + APPID);
                });
                //TODO switch back to V3 once the code is available in production
            }).then(function() {
                done();
            });
        });

        it('Verify user(testUser) can switch from V3 to V2 from user Menu', function(done) {
            browser.get(PROD_REALM).then(function() {
                // Enter login creds
                currentStackLoginPage.loginUser(USER_VIEWER_ROLE_USERNAME, USER_VIEWER_ROLE_PASSWORD);
            }).then(function() {
                // Go to Bicycle app
                browser.get(PROD_REALM + '/qbase/app/' + APPID);
            }).then(function() {
                //wait untill table lists loaded at leftNav
                reportServicePage.waitForElement(reportServicePage.tablesListDivEl);
            }).then(function() {
                //select switch to quickbase classic Toggle under user Menu
                v2Tov3PO.clickUserMenuItem('Switch to QuickBase Classic');
            }).then(function() {
                //verify its switched to classic view (ie V2)
                browser.getCurrentUrl().then(function(url) {
                    expect(url).toBe(PROD_REALM + '/db/' + APPID);
                });
                //TODO switch back to V3 once the code is available in production
            }).then(function() {
                done();
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
