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
                    done();
                });
            });
        });

        //afterAll(function(done) {
        //    e2eBase.cleanup(done);
        //});

        it('Edit a record via recordActions edit pencil using basic report', function(done) {
            //var fieldTypeClassNames = ['dateCell','textField', 'numericField', 'checkbox'];
            var fieldTypeClassNames = ['numericField'];
            //Open the report
            RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, "1"));
            return reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                //click edit record from the grid recordActions
                reportServicePage.clickRecordEditPencil(2);
                reportServicePage.waitForElement(formsPage.formEditContainerEl);
                // Check that the add form container is displayed
                expect(formsPage.formEditContainerEl.isPresent()).toBeTruthy();
            }).then(function() {
                //get the fields from the table and generate a record
                for (var i = 0; i < fieldTypeClassNames.length; i++) {
                    formsPage.enterFormValues(fieldTypeClassNames[i]);
                }
            }).then(function() {
                //Save the form
                formsPage.clickFormSaveBtn();
            }).then(function() {
                //reload the report to verify the row edited
                RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, "1"));
                //verify the edited record
                return reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                    //Verify there are 6 records after adding 1
                    e2eBase.sleep(browser.params.smallSleep);
                    expect(reportServicePage.reportRecordsCount.getText()).toContain('7 records');
                    for (var j = 0; j < fieldTypeClassNames.length; j++) {
                        formsPage.verifyFieldValuesInReportTable(2, fieldTypeClassNames[j]);
                    }
                    done();
                });
            });
        });

        it('Edit a record via stage pageActions edit pencil using report with sorting', function(done) {
            var fieldTypeClassNames = ['numericField'];
            //Open the report
            RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, "3"));
            return reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                //click edit record from the grid recordActions
                reportServicePage.clickEditPencilOnStage(5);
                reportServicePage.waitForElement(formsPage.formEditContainerEl);
                // Check that the add form container is displayed
                expect(formsPage.formEditContainerEl.isPresent()).toBeTruthy();
            }).then(function() {
                //get the fields from the table and generate a record
                for (var i = 0; i < fieldTypeClassNames.length; i++) {
                    formsPage.enterFormValues(fieldTypeClassNames[i]);
                }
            }).then(function() {
                //Save the form
                formsPage.clickFormSaveBtn();
            }).then(function() {
                //reload the report to verify the row edited
                RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, "3"));
                //verify the edited record
                return reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                    //Verify there are 6 records after adding 1
                    e2eBase.sleep(browser.params.smallSleep);
                    expect(reportServicePage.reportRecordsCount.getText()).toContain('7 records');
                    for (var j = 0; j < fieldTypeClassNames.length; j++) {
                        formsPage.verifyFieldValuesInReportTable(5, fieldTypeClassNames[j]);
                    }
                    done();
                });
            });
        });

        it('Edit a record from the tableActions Container using report with facets', function(done) {
            var fieldTypeClassNames = ['numericField'];
            //Open the report
            RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, "4"));
            return reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                //click on add record button
                reportServicePage.clickEditPencilOnReportActions(1);
                reportServicePage.waitForElement(formsPage.formEditContainerEl);
                // Check that the add form container is displayed
                expect(formsPage.formEditContainerEl.isPresent()).toBeTruthy();
            }).then(function() {
                //get the fields from the table and generate a record
                for (var i = 0; i < fieldTypeClassNames.length; i++) {
                    formsPage.enterFormValues(fieldTypeClassNames[i]);
                }
            }).then(function() {
                //Save the form
                formsPage.clickFormSaveBtn();
            }).then(function() {
                //reload the report to verify the row edited
                RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, "4"));
                return reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                    //Verify there are 7 records after editing 1
                    e2eBase.sleep(browser.params.smallSleep);
                    expect(reportServicePage.reportRecordsCount.getText()).toContain('7 records');
                    for (var j = 0; j < fieldTypeClassNames.length; j++) {
                        formsPage.verifyFieldValuesInReportTable(1, fieldTypeClassNames[j]);
                    }
                    done();
                });
            });
        });

    });
}());
