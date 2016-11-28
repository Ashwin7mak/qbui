(function() {
    'use strict';

    //Load the page Objects
    var ReportServicePage = requirePO('reportService');
    var RequestAppsPage = requirePO('requestApps');
    var RequestSessionTicketPage = requirePO('requestSessionTicket');
    var reportServicePage = new ReportServicePage();
    var ReportContentPage = requirePO('reportContent');
    var reportContentPage = new ReportContentPage();

    var FormsPage = requirePO('formsPage');
    var formsPage = new FormsPage();

    describe('Edit a record Via Form Tests :', function() {
        var realmName;
        var realmId;
        var app;
        var recordList;

        beforeAll(function(done) {
            e2eBase.fullReportsSetup(5).then(function(appAndRecords) {
                app = appAndRecords[0];
                recordList = appAndRecords[1];
            }).then(function() {
                // Get a session ticket for that subdomain and realmId (stores it in the browser)
                // Gather the necessary values to make the requests via the browser
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
            });
        });

        it('@smoke Edit a record via recordActions edit pencil using basic report', function(done) {
            var fieldTypeClassNames = ['textField', 'dateCell', 'timeCell', 'numericField'];

            //Open the report
            e2eBase.reportService.loadReportByIdInBrowser(realmName, app.id, app.tables[e2eConsts.TABLE1].id, 1);
            reportContentPage.waitForReportContent().then(function() {
                //click edit record from the grid recordActions
                reportServicePage.clickRecordEditPencil(2);
            }).then(function() {
                //get the fields from the table and generate a record
                for (var i = 0; i < fieldTypeClassNames.length; i++) {
                    formsPage.enterFormValues(fieldTypeClassNames[i]);
                }
            }).then(function() {
                //Save the form
                formsPage.clickFormSaveBtn().then(function() {
                    reportContentPage.waitForReportContent().then(function() {
                        reportServicePage.waitForElement(reportServicePage.reportRecordsCount);
                    });
                });
            }).then(function() {
                //reload the report
                e2eBase.reportService.loadReportByIdInBrowser(realmName, app.id, app.tables[e2eConsts.TABLE1].id, 1);
                reportContentPage.waitForReportContent();
            }).then(function() {
                //Verify record is added on top row in a table
                for (var j = 0; j < fieldTypeClassNames.length; j++) {
                    formsPage.verifyFieldValuesInReportTable(2, fieldTypeClassNames[j]);
                }
            }).then(function() {
                done();
            });
        });

        it('Edit a record via stage pageActions edit pencil using report with sorting', function(done) {

            var fieldTypeClassNames = ['dateField'];

            //Open the report
            e2eBase.reportService.loadReportByIdInBrowser(realmName, app.id, app.tables[e2eConsts.TABLE1].id, 3);
            reportContentPage.waitForReportContent().then(function() {
                //click edit record from the grid recordActions
                reportServicePage.clickEditPencilOnStage(3);
            }).then(function() {
                //get the fields from the table and generate a record
                for (var i = 0; i < fieldTypeClassNames.length; i++) {
                    formsPage.enterFormValues(fieldTypeClassNames[i]);
                }
            }).then(function() {
                //Save the form
                formsPage.clickFormSaveBtn().then(function() {
                    //verify it landed in record viewMode since record edited in record open mode. If edited at table level should land in table.
                    reportServicePage.waitForElement(formsPage.formViewContainerEl);
                });
            }).then(function() {
                //reload the report
                e2eBase.reportService.loadReportByIdInBrowser(realmName, app.id, app.tables[e2eConsts.TABLE1].id, 3);
                reportContentPage.waitForReportContent().then(function() {
                    //Verify record is added on top row in a table
                    for (var j = 0; j < fieldTypeClassNames.length; j++) {
                        formsPage.verifyFieldValuesInReportTable(3, fieldTypeClassNames[j]);
                    }
                }).then(function() {
                    done();
                });
            });
        });

        it('Edit a record from the tableActions Container using report with facets', function(done) {
            var fieldTypeClassNames = ['textField', 'numericField'];

            //Open the report
            e2eBase.reportService.loadReportByIdInBrowser(realmName, app.id, app.tables[e2eConsts.TABLE1].id, 4);
            reportContentPage.waitForReportContent().then(function() {
                //click on add record button
                reportServicePage.clickEditPencilOnReportActions(1);
            }).then(function() {
                //get the fields from the table and generate a record
                for (var i = 0; i < fieldTypeClassNames.length; i++) {
                    formsPage.enterFormValues(fieldTypeClassNames[i]);
                }
            }).then(function() {
                //Save the form
                formsPage.clickFormSaveBtn();
                reportContentPage.waitForReportContent();
            }).then(function() {
                //reload the report
                e2eBase.reportService.loadReportByIdInBrowser(realmName, app.id, app.tables[e2eConsts.TABLE1].id, 4);
                reportContentPage.waitForReportContent().then(function() {
                    //Verify record is added on top row in a table
                    for (var j = 0; j < fieldTypeClassNames.length; j++) {
                        formsPage.verifyFieldValuesInReportTable(1, fieldTypeClassNames[j]);
                    }
                }).then(function() {
                    done();
                });
            });
        });
    });
}());
