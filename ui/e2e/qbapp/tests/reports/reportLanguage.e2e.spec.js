/**
 * E2E test which verifies language preferences are maintained when switching from one app to another. See MB-443.
 * Based on dataGen.e2e.spec.js, Created by gedwards on 10/3/16.
 */
(function() {
    'use strict';

    var ReportServicePage = requirePO('reportService');
    var RequestAppsPage = requirePO('requestApps');
    var RequestSessionTicketPage = requirePO('requestSessionTicket');
    var reportServicePage = new ReportServicePage();
    // The expected text displayed in the "Help" link when the language is set to German
    var HELP_GERMAN = 'Hilfe';

    describe('Report Language tests', function() {
        var app;
        var recordList;
        var realmName;
        var realmId;
        /**
         * Setup method. Generates JSON for an app, a table, a set of records and a report. Then creates them via the REST API.
         */
        beforeAll(function(done) {
            var nonBuiltInFields;
            e2eBase.reportsBasicSetUp().then(function(appAndRecords) {
                // Set your global objects to use in the test functions
                app = appAndRecords[0];
                recordList = appAndRecords[1];
                // Get the appropriate fields out of the third table
                nonBuiltInFields = e2eBase.tableService.getNonBuiltInFields(app.tables[e2eConsts.TABLE3]);
                // Generate the record JSON objects
                var generatedRecords = e2eBase.recordService.generateRecords(nonBuiltInFields, 5);
                // Via the API create some records
                return e2eBase.recordService.addRecords(app, app.tables[e2eConsts.TABLE3], generatedRecords);
            }).then(function() {
                // Generate 1 empty record
                var generatedEmptyRecords = e2eBase.recordService.generateEmptyRecords(nonBuiltInFields, 1);
                return e2eBase.recordService.addRecords(app, app.tables[e2eConsts.TABLE3], generatedEmptyRecords);
            }).then(function() {
                //Create a report with facets in table 3
                return e2eBase.reportService.createReportWithFacets(app.id, app.tables[e2eConsts.TABLE3].id, [6, 7, 8, 9]);
            }).then(function() {
                //set report home page
                return e2eBase.tableService.setDefaultTableHomePage(app.id, app.tables[e2eConsts.TABLE1].id);
            }).then(function() {
                var basicApp = e2eBase.appService.generateAppFromMap(e2eBase.makeBasicMap());
                return e2eBase.appService.createApp(basicApp);
            }).then(function() {
                // Get a session ticket for that subdomain and realmId (stores it in the browser)
                realmName = e2eBase.recordBase.apiBase.realm.subdomain;
                realmId = e2eBase.recordBase.apiBase.realm.id;
                return RequestSessionTicketPage.get(e2eBase.getSessionTicketRequestEndpoint(realmName, realmId, e2eBase.ticketEndpoint));
            }).then(function() {
                // Load the requestAppsPage (shows a list of all the apps and tables in a realm)
                return RequestAppsPage.get(e2eBase.getRequestAppsPageEndpoint(realmName));
            }).then(function() {
                // Wait for the leftNav to load
                return reportServicePage.waitForElement(reportServicePage.appsListDivEl);
            }).then(function() {
                done();
            }).catch(function(error) {
                // Global catch that will grab any errors from chain above
                // Will appropriately fail the beforeAll method so other tests won't run
                done.fail('Error during test setup beforeAll: ' + error.message);
            });
        });

        beforeAll(function(done) {
            // Go to report page directly
            RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, "1"));

            return reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                done();
            });
        });

        /*
         * Change the language to German, then, switch to another app and verify language is still German.
         */
        it('verify user\'s language settings persist when switching to another app', function(done) {
            reportServicePage.waitForElementToBeClickable(reportServicePage.topNavEllipsesGlobActEl).then(function() {
                // - click the ellipses in the top navigation bar
                // - change language to German
                return reportServicePage.topNavEllipsesGlobActEl.click().then(function() {
                    return reportServicePage.waitForElementToBeClickable(reportServicePage.topNavLangGerman);
                }).then(function() {
                    return reportServicePage.topNavLangGerman.click();
                });
            }).then(function() {
                // TODO: might want to wait for the element to contain the proper text in case of some lag
                // verify the "Help" link is in German
                expect(reportServicePage.topNavHelpGlobActEl.getText()).toEqual(HELP_GERMAN);
            }).then(function() {
                // - click the AppToggle
                // - switch to the 2nd app
                // - verify that the language is still German
                return reportServicePage.clickAppToggle().then(function() {
                    return reportServicePage.waitForElement(reportServicePage.appsListDivEl);
                }).then(function() {
                    return reportServicePage.appLinksElList.get(1).click();
                }).then(function() {
                    return reportServicePage.waitForElement(reportServicePage.topNavHelpGlobActEl);
                });
            }).then(function() {
                // verify the "Help" link is in German
                expect(reportServicePage.topNavHelpGlobActEl.getText()).toEqual(HELP_GERMAN);
            }).then(function() {
                done();
            });
        });

        /**
         * After all tests are done, run the cleanup function in the base class
         * TODO: once language settings become persistent across sessions, reset the user's language back to the default.
         */
        afterAll(function(done) {
            e2eBase.cleanup(done);
        });
    });
}());
