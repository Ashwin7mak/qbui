(function() {
    'use strict';

    //Load the page Objects
    var ReportServicePage = requirePO('reportService');
    var RequestAppsPage = requirePO('requestApps');
    var RequestSessionTicketPage = requirePO('requestSessionTicket');
    var reportServicePage = new ReportServicePage();
    var FormsPage = requirePO('formsPage');
    var ReportCardViewPage = requirePO('reportCardView');
    var formsPage = new FormsPage();
    var reportCardViewPage = new ReportCardViewPage();

    describe('Add and Edit a record via Form in Card View: ', function() {
        var realmName;
        var realmId;
        var app;
        var recordList;


        beforeAll(function(done) {
            e2eBase.fullReportsSetup(5).then(function(appAndRecords) {
                app = appAndRecords[0];
                recordList = appAndRecords[1];
                // Get a session ticket for that subdomain and realmId (stores it in the browser)
                // Gather the necessary values to make the requests via the browser
                realmName = e2eBase.recordBase.apiBase.realm.subdomain;
                realmId = e2eBase.recordBase.apiBase.realm.id;
            }).then(function() {
                return RequestSessionTicketPage.get(e2eBase.getSessionTicketRequestEndpoint(realmName, realmId, e2eBase.ticketEndpoint));
            }).then(function() {
                // Load the requestAppsPage (shows a list of all the apps and tables in a realm)
                return RequestAppsPage.get(e2eBase.getRequestAppsPageEndpoint(realmName));
            }).then(function() {
                return e2eBase.resizeBrowser(e2eConsts.SMALL_BP_WIDTH, e2eConsts.DEFAULT_HEIGHT).then(function() {
                    e2eBase.sleep(browser.params.smallSleep);
                    done();
                });
            });
        });

        /**
         * Before each test starts just make sure the report has loaded
         */
            //Set the browser size to card View before running tests
        beforeEach(function(done) {
            //go to report page directly.
            RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, "1"));
            reportCardViewPage.waitForReportReady();
            done();
        });

        it('Verify Add button on stage not displayed', function(done) {
            //Verify reports stage and add button on stage not present for small BP.
            expect(reportServicePage.reportAddRecordBtn.isDisplayed()).toBeFalsy();
            //Verify add button is present in bottom of loaded content
            expect(reportCardViewPage.addNewRecordBtn.isDisplayed()).toBeTruthy();
            done();
        });

        it('Add a record from the form', function(done) {
            var fieldTypeClassNames = ['textField', 'numericField', 'dateCell', 'timeCell', 'checkbox'];
            //click on add record button
            reportCardViewPage.clickAddRecord().then(function() {
                //get the fields from the table and generate a record
                for (var i = 0; i < fieldTypeClassNames.length; i++) {
                    reportCardViewPage.enterFormValues(fieldTypeClassNames[i]);
                }
            }).then(function() {
                //Save the form
                formsPage.clickFormSaveBtn();
            }).then(function() {
                //reload the report
                RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, "1"));
                reportCardViewPage.waitForReportReady().then(function() {
                    //Verify there are 8 records after adding 1
                    expect(reportCardViewPage.reportRecordsCount.getText()).toBe('8 records');
                });
            }).then(function() {
                done();
            });
        });

        it('Edit a record from the form and Verify Save Functionality', function(done) {
            var fieldTypeClassNames = ['textField', 'numericField'];
            //Select record 1
            reportCardViewPage.clickRecord(1).then(function() {

                //Click edit record
                reportCardViewPage.clickEditRecord();
            }).then(function() {

                //get the fields from the table and generate a record
                for (var i = 0; i < fieldTypeClassNames.length; i++) {
                    reportCardViewPage.enterFormValues(fieldTypeClassNames[i]);
                }
            }).then(function() {
                //Save the form
                formsPage.clickFormSaveBtn().then(function() {
                    for (var j = 0; j < fieldTypeClassNames.length; j++) {
                        reportCardViewPage.verifyFieldValuesInReportTableSmallBP(reportCardViewPage.formTableForRecord, fieldTypeClassNames[j]);
                    }
                });
            }).then(function() {
                done();
            });
        });

        it('Edit a record from the form and Verify Save And Next functionality', function(done) {
            var fieldTypeClassNames = ['textField', 'numericField', 'dateCell', 'timeCell'];
            //Select record
            reportCardViewPage.clickRecord(4).then(function() {
                //Click on edit record
                reportCardViewPage.clickEditRecord();
            }).then(function() {
                //get the fields from the table and generate a record
                for (var i = 0; i < fieldTypeClassNames.length; i++) {
                    reportCardViewPage.enterFormValues(fieldTypeClassNames[i]);
                }
            }).then(function() {
                //Save the form
                formsPage.clickFormSaveAndNextBtn();
            }).then(function() {
                //reload the report
                RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, "1"));
                reportCardViewPage.waitForReportReady();
            }).then(function() {
                //select the record
                reportCardViewPage.clickRecord(4);
            }).then(function() {
                //verify editing a record worked
                for (var j = 0; j < fieldTypeClassNames.length; j++) {
                    reportCardViewPage.verifyFieldValuesInReportTableSmallBP(reportCardViewPage.formTable, fieldTypeClassNames[j]);
                }
            }).then(function() {
                done();
            });
        });

    });
}());
