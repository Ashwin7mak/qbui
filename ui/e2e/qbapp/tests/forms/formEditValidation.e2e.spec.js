(function() {
    'use strict';

    //Load the page Objects
    var ReportServicePage = requirePO('reportService');
    var RequestAppsPage = requirePO('requestApps');
    var RequestSessionTicketPage = requirePO('requestSessionTicket');
    var FormsPage = requirePO('formsPage');
    var ReportContentPage = requirePO('reportContent');

    var reportServicePage = new ReportServicePage();
    var formsPage = new FormsPage();
    var reportContentPage = new ReportContentPage();
    var tableGenerator = require('../../../../test_generators/table.generator');

    describe('Edit Form Validation Tests :', function() {

        var realmName;
        var realmId;
        var app;
        var recordList;
        var expectedNumericErrorMessages = ['Numeric Field', 'Numeric Percent Field', 'Duration Field'];

        beforeAll(function(done) {
            e2eBase.fullReportsSetup(5).then(function(appAndRecords) {
                app = appAndRecords[0];
                recordList = appAndRecords[1];
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

        /**
         * Before each test starts just make sure the report has loaded
         */
        beforeEach(function(done) {
            //go to report page directly.
            e2eBase.reportService.loadReportByIdInBrowser(realmName, app.id, app.tables[e2eConsts.TABLE1].id, 1);
            done();
        });

        it('Save Button - Validate errors ', function(done) {
            var fieldTypeClassNames = ['textField', 'numericField'];
            reportContentPage.waitForReportContent().then(function() {
                //click edit record from the grid recordActions
                reportServicePage.clickRecordEditPencil(2);
            }).then(function() {
                //enter invalid values into fields on form
                for (var i = 0; i < fieldTypeClassNames.length; i++) {
                    formsPage.enterInvalidFormValues(fieldTypeClassNames[i]);
                }
            }).then(function() {
                //Save the form
                formsPage.clickSaveBtnWithName('Save');
            }).then(function() {
                //verify validation
                formsPage.verifyErrorMessages(expectedNumericErrorMessages);
            }).then(function() {
                //verify clicking on alert button brings up the error message popup
                formsPage.clickFormAlertBtn();
                expect(formsPage.formErrorMessageVisisble.isPresent()).toBeTruthy();
            }).then(function() {
                //verify clicking on alert again hides the error message popup
                formsPage.clickFormAlertBtn();
                expect(formsPage.formErrorMessageVisisble.isPresent()).toBeFalsy();
            }).then(function() {
                //close dirty form
                formsPage.closeSaveChangesDialogue();
                done();
            });
        });

        it('Save and Next Button - Validate errors and correct the errors by editing new record', function(done) {
            var fieldTypeClassNames = ['textField', 'numericField'];
            reportContentPage.waitForReportContent().then(function() {
                //click edit record from the grid recordActions
                reportServicePage.clickRecordEditPencil(3);
            }).then(function() {
                //get the fields from the table and generate a record
                for (var i = 0; i < fieldTypeClassNames.length; i++) {
                    formsPage.enterInvalidFormValues(fieldTypeClassNames[i]);
                }
            }).then(function() {
                //Save the form
                formsPage.clickSaveBtnWithName('Save & Next');
            }).then(function() {
                //verify validation
                formsPage.verifyErrorMessages(expectedNumericErrorMessages);
                // Needed to get around stale element error
                e2eBase.sleep(browser.params.smallSleep);
            }).then(function() {
                //correct the errors and add the record
                for (var j = 0; j < fieldTypeClassNames.length; j++) {
                    formsPage.enterFormValues(fieldTypeClassNames[j]);
                }
            }).then(function() {
                //Save the form by clicking on 'Save and Next' btn
                formsPage.clickFormSaveAndNextBtn();
            }).then(function() {
                e2eBase.reportService.loadReportByIdInBrowser(realmName, app.id, app.tables[e2eConsts.TABLE1].id, 1);
                reportContentPage.waitForReportContent();
            }).then(function() {
                for (var j = 0; j < fieldTypeClassNames.length; j++) {
                    formsPage.verifyFieldValuesInReportTable(3, fieldTypeClassNames[j]);
                }
                done();
            });
        });

    });
}());
