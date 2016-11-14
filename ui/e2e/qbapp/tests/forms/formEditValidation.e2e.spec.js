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
        var expectedErrorMessages = ['Numeric Field', 'Numeric Percent Field', 'Duration Field', 'Phone Number Field', 'Email Address Field', 'URL Field'];

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
            reportContentPage.waitForReportContent();
            done();
        });

        it('Save Button - Validate errors ', function(done) {
            var fieldTypeClassNames = ['textField', 'numericField'];
            //click edit record from the grid recordActions
            reportServicePage.clickRecordEditPencil(2);

            //enter invalid values into fields on form
            for (var i = 0; i < fieldTypeClassNames.length; i++) {
                formsPage.enterInvalidFormValues(fieldTypeClassNames[i]);
            }

            //Save the form
            formsPage.clickSaveBtnWithName('Save');

            //verify validation
            formsPage.verifyErrorMessages(expectedErrorMessages);

            //verify clicking on alert button brings up the error message popup
            formsPage.clickFormAlertBtn();
            expect(formsPage.formErrorMessageVisisble.isPresent()).toBeTruthy();

            //verify clicking on alert again hides the error message popup
            formsPage.clickFormAlertBtn();
            expect(formsPage.formErrorMessageVisisble.isPresent()).toBeFalsy();

            //close dirty form
            formsPage.closeSaveChangesDialogue();
            done();
        });

        it('Save and Next Button - Validate errors and correct the errors by editing new record', function(done) {
            var fieldTypeClassNames = ['textField', 'numericField'];
            //click edit record from the grid recordActions
            reportServicePage.clickRecordEditPencil(3);

            //get the fields from the table and generate a record
            for (var i = 0; i < fieldTypeClassNames.length; i++) {
                formsPage.enterInvalidFormValues(fieldTypeClassNames[i]);
            }

            //Save the form
            formsPage.clickSaveBtnWithName('Save & Next');

            //verify validation
            formsPage.verifyErrorMessages(expectedErrorMessages);
            // Needed to get around stale element error
            e2eBase.sleep(browser.params.smallSleep);

            //correct the errors and add the record
            for (var j = 0; j < fieldTypeClassNames.length; j++) {
                formsPage.enterFormValues(fieldTypeClassNames[j]);
            }

            //Save the form by clicking on 'Save and Next' btn
            formsPage.clickFormSaveAndNextBtn();
            reportContentPage.waitForReportContent();

            for (var k = 0; k < fieldTypeClassNames.length; k++) {
                formsPage.verifyFieldValuesInReportTable(3, fieldTypeClassNames[k]);
            }
            done();
        });

    });
}());
