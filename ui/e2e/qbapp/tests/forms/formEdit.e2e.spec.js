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

        afterAll(function(done) {
            e2eBase.cleanup(done);
        });

        it('Edit a record via recordActions edit pencil using basic report', function(done) {
            //Open the report
            RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, "1"));
            return reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                //click edit record from the grid recordActions
                reportServicePage.clickRecordEditPencil(2);
                reportServicePage.waitForElement(formsPage.formEditContainerEl);
                // Check that the add form container is displayed
                expect(formsPage.formEditContainerEl.isPresent()).toBeTruthy();
            }).then(function() {
                //var fieldTypeClassNames = ['dateCell','textField', 'numericField', 'checkbox'];
                var fieldTypeClassNames = ['numericField'];
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
                    reportServicePage.agGridRecordElList.then(function(records) {
                        // Check the all numeric field
                        //numeric field
                        expect(reportServicePage.getRecordValues(records[2], 2)).toBe('123');
                        //numeric currency field
                        expect(reportServicePage.getRecordValues(records[2], 3)).toBe('$123');
                        //numeric percent field
                        expect(reportServicePage.getRecordValues(records[2], 4)).toBe('123%');
                        //numeric rating field
                        expect(reportServicePage.getRecordValues(records[2], 5)).toBe('123');
                        //numeric duration field
                        expect(reportServicePage.getRecordValues(records[2], 9)).toBe('2.0337302E-7 weeks');
                        done();
                    });
                });
            });
        });

        it('Edit a record via stage pageActions edit pencil using report with sorting', function(done) {
            //Open the report
            RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, "3"));
            return reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                //click edit record from the grid recordActions
                reportServicePage.clickEditPencilOnStage(5);
                reportServicePage.waitForElement(formsPage.formEditContainerEl);
                // Check that the add form container is displayed
                expect(formsPage.formEditContainerEl.isPresent()).toBeTruthy();
            }).then(function() {
                var fieldTypeClassNames = ['numericField'];
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
                    reportServicePage.agGridRecordElList.then(function(records) {
                        // Check the all numeric field
                        //numeric field
                        expect(reportServicePage.getRecordValues(records[5], 2)).toBe('123');
                        //numeric currency field
                        expect(reportServicePage.getRecordValues(records[5], 3)).toBe('$123');
                        //numeric percent field
                        expect(reportServicePage.getRecordValues(records[5], 4)).toBe('123%');
                        //numeric rating field
                        expect(reportServicePage.getRecordValues(records[5], 5)).toBe('123');
                        //numeric duration field
                        expect(reportServicePage.getRecordValues(records[5], 9)).toBe('2.0337302E-7 weeks');
                        done();
                    });
                });
            });
        });

        //TODO the below script will fail since edit pencil not opening the edit form from reports toolbar
        xit('Edit a record from the tableActions Container using report with facets', function(done) {
            //Open the report
            RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, "4"));
            return reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                //click on add record button
                reportServicePage.clickEditPencilOnReportActions(6);
                reportServicePage.waitForElement(formsPage.formEditContainerEl);
                // Check that the add form container is displayed
                expect(formsPage.formEditContainerEl.isPresent()).toBeTruthy();
            }).then(function() {
                //var fieldTypeClassNames = ['timeCell', 'dateCell','textField', 'numericField', 'checkbox'];
                var fieldTypeClassNames = ['timeCell', 'dateCell', 'numericField', 'checkbox'];
                //get the fields from the table and generate a record
                for (var i = 0; i < fieldTypeClassNames.length; i++) {
                    formsPage.enterFormValues(fieldTypeClassNames[i]);
                }
            }).then(function() {
                //Save the form
                formsPage.clickFormSaveBtn();
            }).then(function() {
                //close the form
                formsPage.clickFormCloseBtn();
            }).then(function() {
                //reload the report to verify the row edited
                RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, "4"));
                return reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                    //Verify there are 7 records after editing 1
                    e2eBase.sleep(browser.params.smallSleep);
                    expect(reportServicePage.reportRecordsCount.getText()).toContain('8 records');
                    reportServicePage.agGridRecordElList.then(function(records) {
                        //numeric field
                        expect(reportServicePage.getRecordValues(records[6], 2)).toBe('123');
                        //numeric currency field
                        expect(reportServicePage.getRecordValues(records[6], 3)).toBe('$123');
                        //numeric percent field
                        expect(reportServicePage.getRecordValues(records[6], 4)).toBe('123%');
                        //numeric rating field
                        expect(reportServicePage.getRecordValues(records[6], 5)).toBe('123');
                        //date field
                        expect(reportServicePage.getRecordValues(records[6], 6)).toBe('12-12-2016');
                        //date Time field
                        expect(reportServicePage.getRecordValues(records[6], 7)).toBe('12-12-2016 2:30 am');
                        //time of day field
                        expect(reportServicePage.getRecordValues(records[6], 8)).toBe('2:30 am');
                        //numeric duration field
                        expect(reportServicePage.getRecordValues(records[6], 9)).toBe('2.0337302E-7 weeks');
                        //checkbox field
                        expect(reportServicePage.getRecordValues(records[6], 10)).toBe('true');
                        done();
                    });
                });
            });
        });

    });
}());
