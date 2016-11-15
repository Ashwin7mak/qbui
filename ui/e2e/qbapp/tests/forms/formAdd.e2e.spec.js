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
                RequestSessionTicketPage.get(e2eBase.getSessionTicketRequestEndpoint(realmName, realmId, e2eBase.ticketEndpoint));
                // Load the requestAppsPage (shows a list of all the apps and tables in a realm)
                RequestAppsPage.get(e2eBase.getRequestAppsPageEndpoint(realmName));

                // Wait for the leftNav to load
                reportServicePage.waitForElement(reportServicePage.appsListDivEl).then(function() {
                    done();
                });
            });
        });


        it('Add a record from the form', function(done) {
            var fieldTypeClassNames = ['textField', 'numericField', 'dateCell', 'timeCell', 'checkbox'];

            e2eBase.reportService.loadReportByIdInBrowser(realmName, app.id, app.tables[e2eConsts.TABLE1].id, 1);
            reportContentPage.waitForReportContent();

            //click on add record button
            reportServicePage.clickAddRecordOnStage();

            //get the fields from the table and generate a record
            for (var i = 0; i < fieldTypeClassNames.length; i++) {
                formsPage.enterFormValues(fieldTypeClassNames[i]);
            }

            //Save the form
            formsPage.clickFormSaveBtn();
            reportContentPage.waitForReportContent().then(function() {
                //Verify record is added on top row in a table
                for (var j = 0; j < fieldTypeClassNames.length; j++) {
                    formsPage.verifyFieldValuesInReportTable(0, fieldTypeClassNames[j]);
                }
            }).then(function() {
                done();
            });
        });
    });
}());
