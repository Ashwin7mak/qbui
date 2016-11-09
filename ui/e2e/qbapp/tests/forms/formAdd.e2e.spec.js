(function() {
    'use strict';

    //Load the page Objects
    var ReportServicePage = requirePO('reportService');
    var RequestAppsPage = requirePO('requestApps');
    var RequestSessionTicketPage = requirePO('requestSessionTicket');
    var reportServicePage = new ReportServicePage();
    var FormsPage = requirePO('formsPage');
    var formsPage = new FormsPage();

    describe('Add a record Via Form Tests : ', function() {
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

                // Wait for the leftNav to load
                reportServicePage.waitForElement(reportServicePage.appsListDivEl).then(function() {
                    done();
                });
            });
        });

        /**
         * Before each test starts just make sure the report has loaded
         */
        beforeEach(function(done) {
            //go to report page directly.
            RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, "1"));
            // Wait until report loaded
            reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                done();
            });
        });

        it('Add a record from the form', function(done) {
            var fieldTypeClassNames = ['textField', 'numericField', 'dateCell', 'timeCell', 'checkbox'];
            formsPage.waitForElement(reportServicePage.reportStageContentEl).then(function() {
                //click on add record button
                reportServicePage.clickAddRecordOnStage();
                // Check that the add form container is displayed
                expect(formsPage.formEditContainerEl.isPresent()).toBeTruthy();

                //get the fields from the table and generate a record
                for (var i = 0; i < fieldTypeClassNames.length; i++) {
                    formsPage.enterFormValues(fieldTypeClassNames[i]);
                }

                //Save the form
                formsPage.clickFormSaveBtn();
            }).then(function() {
                //reload the report to verify the row edited
                RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, "1"));
                return formsPage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                    e2eBase.sleep(browser.params.smallSleep);
                    reportServicePage.agGridRecordElList.then(function(records) {
                        for (var j = 0; j < fieldTypeClassNames.length; j++) {
                            formsPage.verifyFieldValuesInReportTable(records.length - 1, fieldTypeClassNames[j]);
                        }
                        done();
                    });
                });
            });
        });

    });
}());
