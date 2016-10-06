(function() {
    'use strict';

    //Load the page Objects
    var ReportServicePage = requirePO('reportService');
    var RequestAppsPage = requirePO('requestApps');
    var RequestSessionTicketPage = requirePO('requestSessionTicket');
    var reportServicePage = new ReportServicePage();
    var FormsPage = requirePO('formsPage');
    var formsPage = new FormsPage();

    describe('Edit Form Tests', function() {
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
                    //go to report page directly.
                    RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, "1"));
                    // Make sure the table report has loaded
                    reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                        done();
                    });
                });
            });
        });

        /**
         * Before each test starts just make sure the report has loaded
         */
        beforeEach(function(done) {
            // Wait until report loaded
            reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                done();
            });
        });

        afterAll(function(done) {
            e2eBase.cleanup(done);
        });

        it('Add a record from the form', function(done) {
            //var fieldTypeClassNames = ['timeCell', 'dateCell','textField', 'numericField', 'checkbox'];
            var fieldTypeClassNames = ['timeCell', 'dateCell', 'numericField', 'checkbox'];

            return reportServicePage.waitForElement(reportServicePage.reportStageContentEl).then(function() {
                return reportServicePage.waitForElementToBeClickable(reportServicePage.reportAddRecordBtn).then(function() {
                    //click on add record button
                    reportServicePage.clickAddRecordOnStage();
                    reportServicePage.waitForElement(formsPage.formEditContainerEl);
                    // Check that the add form container is displayed
                    expect(formsPage.formEditContainerEl.isPresent()).toBeTruthy();
                }).then(function() {
                    //get the fields from the table and generate a record
                    for (var i = 0; i < fieldTypeClassNames.length; i++) {
                        formsPage.enterFormValues(fieldTypeClassNames[i]);
                    }
                }).then(function(testValues) {
                    //Save the form
                    formsPage.clickFormSaveBtn();
                }).then(function(testValues) {
                    //close the form
                    formsPage.clickFormCloseBtn();
                }).then(function(testValues) {
                    //reload the report to verify the row edited
                    RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, "1"));
                    return reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                        //Verify there are 7 records after editing 1
                        e2eBase.sleep(browser.params.smallSleep);
                        expect(reportServicePage.reportRecordsCount.getText()).toContain('8 records');
                        for (var j = 0; j < fieldTypeClassNames.length; j++) {
                            formsPage.verifyFieldValuesInReportTable(7, fieldTypeClassNames[j]);
                        }
                        done();
                    });
                });
            });
        });

        xit('Add a record from the form', function(done) {
            //var fieldValues = [];
            //var nonBuiltInFields = e2eBase.tableService.getNonBuiltInFields(app.tables[e2eConsts.TABLE1]);
            //var generatedRecords = e2eBase.recordService.generateRecords(nonBuiltInFields, 1);
            //var clonedArray = JSON.parse(JSON.stringify(generatedRecords));
            //var genRecord = clonedArray[0];
            //genRecord.forEach(function(field) {
            //    fieldValues.push(field.value);
            //});
            //console.log ("the generated records are: "+JSON.stringify(fieldValues));

        });


    });
}());
