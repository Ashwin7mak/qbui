/**
 * Created by skamineni on 11/1/16.
 */
/**
 * Created by skamineni on 11/1/16.
 */
(function() {
    'use strict';

    //Load the page Objects
    var ReportServicePage = requirePO('reportService');
    var RequestAppsPage = requirePO('requestApps');
    var RequestSessionTicketPage = requirePO('requestSessionTicket');
    var reportServicePage = new ReportServicePage();
    var FormsPage = requirePO('formsPage');
    var ReportCardViewPage = requirePO('reportCardView');
    var formsPage = new FormsPage();
    var reportCardViewPage = new ReportCardViewPage();

    describe('Validate Form in Card View Tests :', function() {
        var realmName;
        var realmId;
        var app;
        var recordList;
        var RECORDS_COUNT = '8 records';
        var expectedErrorMessages = ['Fill in the Numeric Field', 'Fill in the Numeric Percent Field', 'Fill in the Duration Field', 'Fill in the Phone Number Field', 'Fill in the Email Address Field', 'Fill in the URL Field'];
        var expectedNumericErrorMessages = ['Fill in the Numeric Field', 'Fill in the Numeric Percent Field', 'Fill in the Duration Field'];

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
                return e2eBase.resizeBrowser(e2eConsts.SMALL_BP_WIDTH, e2eConsts.DEFAULT_HEIGHT).then(function() {
                    e2eBase.sleep(browser.params.smallSleep);
                    done();
                });
            });
        });

        /**
         * Before each test starts just make sure the report has loaded
         */
            //Set the browser size to card View before running tests
        beforeEach(function(done) {
            //go to report page directly.
            RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, "1"));
            return reportServicePage.waitForElement(reportCardViewPage.loadedContentEl).then(function() {
                done();
            });
        });

        afterAll(function(done) {
            e2eBase.cleanup(done);
        });

        it('Validate required fields on the form', function(done) {
            //click on add record button
            reportCardViewPage.clickAddRecord();
            // Check that the add form container is displayed
            expect(formsPage.formEditContainerEl.isPresent()).toBeTruthy();

            //Save the form without entering any field values on form
            formsPage.clickSaveBtnWithName('Save');

            //verify validation
            formsPage.verifyErrorMessages(expectedErrorMessages);
            done();
        });

        it('Save Btn - Validate Add form', function(done) {
            //TODO 'dateCell', 'timeCell' in small breakpoints dosent work typing in date and time.
            var fieldTypeClassNames = ['numericField'];
            //click on add record button
            reportCardViewPage.clickAddRecord();
            // Check that the add form container is displayed
            expect(formsPage.formEditContainerEl.isPresent()).toBeTruthy();

            //get the fields from the table and generate a record
            for (var i = 0; i < fieldTypeClassNames.length; i++) {
                reportCardViewPage.enterInvalidFormValues(fieldTypeClassNames[i]);
            }

            //Save the form
            formsPage.clickSaveBtnWithName('Save');

            //verify validation
            formsPage.verifyErrorMessages(expectedErrorMessages);

            //verify clicking on alert button brings up the error message popup
            formsPage.clickFormAlertBtn();
            expect(formsPage.formErrorMessage.getAttribute('hidden')).toBe(null);

            //verify clicking on alert again hides the error message popup
            formsPage.clickFormAlertBtn();
            expect(formsPage.formErrorMessage.getAttribute('hidden')).toBe('true');
            done();

        });

        it('Save Btn -Validate Edit form', function(done) {
            var fieldTypeClassNames = ['numericField'];
            //Select record 1
            reportCardViewPage.clickRecord(1);
            reportCardViewPage.clickEditRecord();
            //get the fields from the table and generate a record
            for (var i = 0; i < fieldTypeClassNames.length; i++) {
                reportCardViewPage.enterInvalidFormValues(fieldTypeClassNames[i]);
            }
            //Save the form
            formsPage.clickSaveBtnWithName('Save');

            //verify validation
            formsPage.verifyErrorMessages(expectedNumericErrorMessages);

            //verify clicking on alert button brings up the error message popup
            formsPage.clickFormAlertBtn();
            expect(formsPage.formErrorMessage.getAttribute('hidden')).toBe(null);

            //verify clicking on alert again hides the error message popup
            formsPage.clickFormAlertBtn();
            expect(formsPage.formErrorMessage.getAttribute('hidden')).toBe('true');
            done();

        });

        it('Save And Next - Validate edit form and Edit a record successfully after errors', function(done) {
            var fieldTypeClassNames = ['textField', 'numericField'];
            //Select record 1
            reportCardViewPage.clickRecord(4);
            reportCardViewPage.clickEditRecord();

            //get the fields from the table and generate a record
            reportCardViewPage.enterInvalidFormValues('numericField');

            //Save the form
            formsPage.clickSaveBtnWithName('Save & Next');

            //verify validation

            formsPage.verifyErrorMessages(expectedNumericErrorMessages);

            //correct the errors and add the record
            for (var i = 0; i < fieldTypeClassNames.length; i++) {
                reportCardViewPage.enterFormValues(fieldTypeClassNames[i]);
            }

            //Save the form
            formsPage.clickSaveBtnWithName('Save & Next');
            reportServicePage.waitForElement(element(by.className('editForm')));


            //reload the report to verify the row edited
            RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, 1));
            //verify the edited record
            reportCardViewPage.waitForReportReady();

            reportCardViewPage.clickRecord(4);
            for (var j = 0; j < fieldTypeClassNames.length; j++) {
                reportCardViewPage.verifyFieldValuesInReportTableSmallBP(fieldTypeClassNames[j]);
            }
            done();
        });

    });
}());
