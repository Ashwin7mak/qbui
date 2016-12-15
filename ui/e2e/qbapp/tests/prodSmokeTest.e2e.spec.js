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
    var ReportContentPage = require('../pages/reportContent.po');
    var CurrentStackLoginPage = require('../pages/currentStackLogin.po');
    var CurrentStackReportsPage = require('../pages/currentStackReports.po');
    var WalkMePage = require('../pages/walkMe.po');
    var v2Tov3Page = require('../pages/v2ToV3.po');

    var reportServicePage = new ReportServicePage();
    var reportContentPage = new ReportContentPage();
    var currentStackLoginPage = new CurrentStackLoginPage();
    var currentStackReportsPage = new CurrentStackReportsPage();
    var walkMePage = new WalkMePage();
    var v2Tov3PO = new v2Tov3Page();

    describe('New Stack Production Smoke Test', function() {

        var PROD_REALM = 'https://team.quickbase.com';

        var BICYCLE_APPID = 'bkj4bmc3s';
        var FASCINATING_APPID = 'bkebkzy3d';
        var COLLEGE_UNIVERSITIES_APPID = 'bkh4jji9q';

        var BICYCLE_TABLEID = 'bkj4bmc7r';

        var ADMIN_USERNAME = 'QuickBaseall';
        var ADMIN_PASSWORD = 'quickbase1';

        var SWITCH_TO_QUICKBASE_CLASSIC = 'Switch to QuickBase Classic';

        var currentStackRecordCount;
        var currentStackRecordValues;
        var testRecordIndex = 4;

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
                return browser.get(PROD_REALM + '/db/' + BICYCLE_APPID);
            }).then(function() {
                // Go to List All report of test table
                return browser.get(PROD_REALM + '/db/' + BICYCLE_TABLEID + '?a=q&qid=1');
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
                return walkMePage.dismissWalkMe();
            }).then(function() {
                done();
            });
        });

        /**
         * Tests
         * V3 Enabled in below tests means (Admin toggels switch to mercury in app home page footer popup + feature switch V2 to V3 turned on in V2 + App is migrated Successfully
         * V3 not enabled in below tests means (Bicycle app has admin toggle set to classic instead of Mercury, COLLEGE_UNIVERSITIES app has no feature switch(v2-v3) turned on in current stack
         */
        it('Verify the specified record in the List All report matches the one from the current stack', function(done) {
            browser.get(PROD_REALM + '/qbase/app/' + BICYCLE_APPID + '/table/' + BICYCLE_TABLEID + '/report/1').then(function() {
                reportContentPage.waitForReportContent();
            }).then(function() {
                // Get the records out of the table report
                reportServicePage.agGridRecordElList.then(function(records) {
                    // Assert we have all records being displayed from current stack
                    expect(records.length).toBe(currentStackRecordCount);
                    // Check the values of the selected record
                    reportServicePage.getRecordValues(records[testRecordIndex]).then(function(newStackRecordValues) {
                        // Currently showing record Id column on new stack so don't use that in assert
                        newStackRecordValues.shift();
                        expect(newStackRecordValues).toContain(currentStackRecordValues);
                        done();
                    });
                });
            });
        });

        it('@smoke V3 not enabled on a app - Admin Request to V3 app page - Verify popup shows and in footer and switch to classic is selected by default', function(done) {
            // Log in to the new stack env and go to Bicycle app
            browser.get(PROD_REALM + '/qbase/app/' + BICYCLE_APPID).then(function() {
                //wait untill table lists loaded at leftNav
                reportServicePage.waitForElement(reportServicePage.tablesListDivEl);
            }).then(function() {
                //Click on popup in the footer
                v2Tov3PO.clickManageUserAccessToggle().then(function() {
                    //Verify switch to classic is selected by default
                    expect(v2Tov3PO.openInClassic.element(by.tagName('input')).getAttribute('checked')).toBe('true');
                });
            }).then(function() {
                done();
            });
        });

        it('@smoke V3 not enabled on a app - Admin Request to V3 - Verify goes to V3 and also Verify user menu dosent show switch to classic for that app', function(done) {
            // Log in to the new stack env and go to Bicycle app
            browser.get(PROD_REALM + '/qbase/app/' + BICYCLE_APPID).then(function() {
                //wait until table lists loaded at leftNav
                reportServicePage.waitForElement(reportServicePage.tablesListDivEl);
                e2eBase.sleep(browser.params.smallSleep);
            }).then(function() {
                //verify switch to quickbase classic Toggle not present under user Menu
                v2Tov3PO.verifyUserMenuItem(SWITCH_TO_QUICKBASE_CLASSIC);
            }).then(function() {
                done();
            });
        });

        it('@smoke V3 not enabled on a app - Admin Request to V2 - Verify goes to V2 app page', function(done) {
            //go to V2 bicycle app
            browser.get(PROD_REALM + '/db/' + BICYCLE_APPID).then(function() {
                //wait untill sign In dropdown button shows up
                reportServicePage.waitForElement(v2Tov3PO.signInAsButtonInCurrentStack);
            }).then(function() {
                //verify its goes to V2
                browser.getCurrentUrl().then(function(url) {
                    expect(url).toBe(PROD_REALM + '/db/' + BICYCLE_APPID);
                });
            }).then(function() {
                done();
            });
        });

        it('@smoke V3 enabled/Not enabled - Any User Request to V3 app page - Verify Mange user access to Mercury popup dont show up in the apps page footer', function(done) {
            // Log in to the new stack env and go to Fascinating app
            browser.get(PROD_REALM + '/qbase/app/' + FASCINATING_APPID).then(function() {
                //wait untill table lists loaded at leftNav
                reportServicePage.waitForElement(reportServicePage.tablesListDivEl);
            }).then(function() {
                expect(v2Tov3PO.popUpTitleLabel.isPresent()).toBeFalsy();
            }).then(function() {
                done();
            });
        });

        it('@smoke V3 enabled - User Request to V3 app - Switch to V2 and Switch back to V3 from User menu', function(done) {
            // Log in to the new stack env and go to Fascinating app
            browser.get(PROD_REALM + '/qbase/app/' + FASCINATING_APPID).then(function() {
                //wait untill table lists loaded at leftNav
                reportServicePage.waitForElement(reportServicePage.tablesListDivEl);
            }).then(function() {
                //select switch to quickbase classic Toggle under user Menu
                v2Tov3PO.clickUserMenuItem(SWITCH_TO_QUICKBASE_CLASSIC);
            }).then(function() {
                //verify its switched to classic view (ie V2)
                browser.getCurrentUrl().then(function(url) {
                    expect(url).toBe(PROD_REALM + '/db/' + FASCINATING_APPID);
                });
            }).then(function() {
                //switch bck to V3
                v2Tov3PO.clickSwitchToMercuryLink().then(function() {
                    //wait untill table lists loaded at leftNav
                    reportServicePage.waitForElement(reportServicePage.tablesListDivEl);
                });
            }).then(function() {
                //verify it redirects to V3
                browser.getCurrentUrl().then(function(url) {
                    expect(url).toBe(PROD_REALM + '/qbase/app/' + FASCINATING_APPID);
                });
            }).then(function() {
                done();
            });
        });

        it('@smoke V3 enabled - User Request to V2 app - Verify redirects to V3', function(done) {
            // Log in to the new stack env and go to Fascinating app
            browser.get(PROD_REALM + '/db/' + FASCINATING_APPID).then(function() {
                //wait untill table lists loaded at leftNav
                reportServicePage.waitForElement(reportServicePage.tablesListDivEl);
            }).then(function() {
                //verify its switched to classic view (ie V2)
                browser.getCurrentUrl().then(function(url) {
                    expect(url).toBe(PROD_REALM + '/qbase/app/' + FASCINATING_APPID);
                });
            }).then(function() {
                done();
            });
        });

        it('@smoke V3 NOT enabled - User Request to V3 app - Verify gives Page not found error', function(done) {
            // Log in to the new stack env and go to College Universities App
            browser.get(PROD_REALM + '/qbase/app/' + COLLEGE_UNIVERSITIES_APPID).then(function() {
                e2eBase.sleep(browser.params.mediumSleep);
            }).then(function() {
                //verify page not found error
                expect(element.all(by.tagName('p')).first().getAttribute('textContent')).toBe('When your app admin enables access, you can use this app in our new experience, Mercury.');
            }).then(function() {
                done();
            });

        });

    });
}());
