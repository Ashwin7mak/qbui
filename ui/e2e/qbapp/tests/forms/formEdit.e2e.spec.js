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
                return e2eBase.resizeBrowser(e2eConsts.LARGE_BP_WIDTH, e2eConsts.DEFAULT_HEIGHT);
            }).then(function() {
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

        it('Edit a record via recordActions edit pencil using basic report', function(done) {
            var fieldTypeClassNames = ['textField', 'dateCell', 'timeCell', 'numericField'];
            //Open the report
            //reload the report to verify the row edited
            e2eBase.reportService.loadReportByIdInBrowser(realmName, app.id, app.tables[e2eConsts.TABLE1].id, 1);
            reportContentPage.waitForReportContent();

            //click edit record from the grid recordActions
            reportServicePage.clickRecordEditPencil(2);

            //get the fields from the table and generate a record
            for (var i = 0; i < fieldTypeClassNames.length; i++) {
                formsPage.enterFormValues(fieldTypeClassNames[i]);
            }

            //Save the form
            formsPage.clickFormSaveBtn();
            reportContentPage.waitForReportContent();

            //verify the edited record
            for (var j = 0; j < fieldTypeClassNames.length; j++) {
                formsPage.verifyFieldValuesInReportTable(2, fieldTypeClassNames[j]);
            }
            done();
        });

        xit('Edit a record via stage pageActions edit pencil using report with sorting', function(done) {
            //TODO MB-1339 - Test won't work in Firefox and Safari as edit opens 2 forms in view and edit mode one behind the other.
            //TODO After hitting save instead of showing report grid it has the view mode open.
            var fieldTypeClassNames = ['dateField'];
            //Open the report
            //reload the report to verify the row edited
            e2eBase.reportService.loadReportByIdInBrowser(realmName, app.id, app.tables[e2eConsts.TABLE1].id, 3);
            reportContentPage.waitForReportContent();
            //click edit record from the grid recordActions
            reportServicePage.clickEditPencilOnStage(3);

            //get the fields from the table and generate a record
            for (var i = 0; i < fieldTypeClassNames.length; i++) {
                formsPage.enterFormValues(fieldTypeClassNames[i]);
            }

            //Save the form
            formsPage.clickFormSaveBtn();
            reportContentPage.waitForReportContent();

            //verify the edited record
            for (var j = 0; j < fieldTypeClassNames.length; j++) {
                formsPage.verifyFieldValuesInReportTable(3, fieldTypeClassNames[j]);
            }
            done();
        });

        it('Edit a record from the tableActions Container using report with facets', function(done) {
            var fieldTypeClassNames = ['textField', 'numericField'];
            //Open the report
            e2eBase.reportService.loadReportByIdInBrowser(realmName, app.id, app.tables[e2eConsts.TABLE1].id, 4);
            reportContentPage.waitForReportContent();

            //click on add record button
            reportServicePage.clickEditPencilOnReportActions(1);

            //get the fields from the table and generate a record
            for (var i = 0; i < fieldTypeClassNames.length; i++) {
                formsPage.enterFormValues(fieldTypeClassNames[i]);
            }

            //Save the form
            formsPage.clickFormSaveBtn();
            reportContentPage.waitForReportContent();

            for (var j = 0; j < fieldTypeClassNames.length; j++) {
                formsPage.verifyFieldValuesInReportTable(1, fieldTypeClassNames[j]);
            }
            done();
        });
    });
}());
