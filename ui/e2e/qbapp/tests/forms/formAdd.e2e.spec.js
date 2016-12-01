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


        it('@smoke Add a record from the form', function(done) {
            var origRecordCount;
            var fieldTypeClassNames = ['textField', 'numericField', 'checkbox'];

            reportServicePage.waitForElement(reportServicePage.appsListDivEl).then(function() {
                // Load the List All report
                e2eBase.reportService.loadReportByIdInBrowser(realmName, app.id, app.tables[e2eConsts.TABLE1].id, 1);
                reportContentPage.waitForReportContent().then(function() {
                    // Count the number of records before adding
                    reportContentPage.agGridRecordElList.then(function(records) {
                        origRecordCount = records.length;
                    });
                }).then(function() {
                    // Click on add record button
                    reportServicePage.clickAddRecordOnStage();
                }).then(function() {
                    // Get the fields from the from and create a new record
                    for (var i = 0; i < fieldTypeClassNames.length; i++) {
                        formsPage.enterFormValues(fieldTypeClassNames[i]);
                    }
                }).then(function() {
                    // Save the form
                    formsPage.clickFormSaveBtn();
                    reportContentPage.waitForReportContent();
                }).then(function() {
                    // Check the record count
                    reportContentPage.agGridRecordElList.then(function(records) {
                        expect(records.length).toBe(origRecordCount + 1);
                    });
                }).then(function() {
                    // Reload the report
                    e2eBase.reportService.loadReportByIdInBrowser(realmName, app.id, app.tables[e2eConsts.TABLE1].id, 1);
                    reportContentPage.waitForReportContent();
                }).then(function() {
                    // Verify new record is now the last row in a table
                    for (var j = 0; j < fieldTypeClassNames.length; j++) {
                        formsPage.verifyFieldValuesInReportTable(origRecordCount, fieldTypeClassNames[j]);
                    }
                }).then(function() {
                    done();
                });
            });
        });
    });
}());
