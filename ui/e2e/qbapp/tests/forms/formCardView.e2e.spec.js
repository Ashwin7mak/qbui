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
                RequestSessionTicketPage.get(e2eBase.getSessionTicketRequestEndpoint(realmName, realmId, e2eBase.ticketEndpoint));
                // Load the requestAppsPage (shows a list of all the apps and tables in a realm)
                RequestAppsPage.get(e2eBase.getRequestAppsPageEndpoint(realmName));
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
            return reportServicePage.waitForElement(reportCardViewPage.loadedContentEl).then(function() {
                done();
            });
        });

        it('Verify Add button on stage not displayed', function(done) {
            //Verify reports stage and add button on stage not present for small BP.
            expect(reportServicePage.reportAddRecordBtn.isDisplayed()).toBeFalsy();
            //Verify add button is present in bottom of loaded content
            expect(reportCardViewPage.addNewRecordBtn.isDisplayed()).toBeTruthy();
            done();
        });

        it('Add a record from the form', function(done) {
            //TODO textField.Right now even phone no field says textField. So can't enter values and save record
            //TODO 'dateCell', 'timeCell' in small breakpoints dosent work typing in date and time.
            var fieldTypeClassNames = ['textField', 'numericField', 'dateCell', 'timeCell', 'checkbox'];
            //click on add record button
            reportCardViewPage.clickAddRecord();
            // Check that the add form container is displayed
            expect(formsPage.formEditContainerEl.isPresent()).toBeTruthy();

            //get the fields from the table and generate a record
            for (var i = 0; i < fieldTypeClassNames.length; i++) {
                reportCardViewPage.enterFormValues(fieldTypeClassNames[i]);
            }

            //Save the form
            formsPage.clickFormSaveBtn();

            //reload the report to verify the row edited
            RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, 1));
            reportCardViewPage.waitForReportReady();

            //Verify there are 8 records after adding 1
            expect(reportCardViewPage.reportRecordsCount.getText()).toBe('8 records');
            done();
        });

        it('Edit a record from the form and Verify Save Functionality', function(done) {
            var fieldTypeClassNames = ['textField', 'numericField'];
            //Select record 1
            reportCardViewPage.clickRecord(1);
            reportCardViewPage.clickEditRecord();

            //get the fields from the table and generate a record
            for (var i = 0; i < fieldTypeClassNames.length; i++) {
                reportCardViewPage.enterFormValues(fieldTypeClassNames[i]);
            }

            //Save the form
            formsPage.clickFormSaveBtn();

            //reload the report to verify the row edited
            RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, 1));
            //verify the edited record
            reportCardViewPage.waitForReportReady();

            //Select record 1
            reportCardViewPage.clickRecord(1);

            for (var j = 0; j < fieldTypeClassNames.length; j++) {
                reportCardViewPage.verifyFieldValuesInReportTableSmallBP(fieldTypeClassNames[j]);
            }
            done();
        });

        it('Edit a record from the form and Verify Save And Next functionality', function(done) {
            var fieldTypeClassNames = ['textField', 'numericField', 'dateCell', 'timeCell'];
            //Select record 1
            reportCardViewPage.clickRecord(4);
            reportCardViewPage.clickEditRecord();
            //get the fields from the table and generate a record
            for (var i = 0; i < fieldTypeClassNames.length; i++) {
                reportCardViewPage.enterFormValues(fieldTypeClassNames[i]);
            }

            //Save the form
            formsPage.clickFormSaveAndNextBtn();

            //reload the report to verify the row edited
            RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, 1));
            //verify the edited record
            reportCardViewPage.waitForReportReady();

            reportCardViewPage.clickRecord(4);
            for (var j = 0; j < fieldTypeClassNames.length; j++) {
                reportCardViewPage.verifyFieldValuesInReportTableSmallBP(fieldTypeClassNames[j]);
            }
            done();
        });

    });
}());
