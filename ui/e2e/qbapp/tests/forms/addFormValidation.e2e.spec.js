(function() {
    'use strict';

    //Load the page Objects
    var ReportServicePage = requirePO('reportService');
    var RequestAppsPage = requirePO('requestApps');
    var RequestSessionTicketPage = requirePO('requestSessionTicket');
    var FormsPage = requirePO('formsPage');
    var ReportContentPage = requirePO('reportContent');

    var reportServicePage = new ReportServicePage();
    var reportContentPage = new ReportContentPage();
    var formsPage = new FormsPage();
    var tableGenerator = require('../../../../test_generators/table.generator');

    describe('Add Form Validation Tests: ', function() {

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
            RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, "1"));
            // Wait until report loaded
            reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                done();
            });
        });

        afterAll(function(done) {
            e2eBase.cleanup(done);
        });

        it('Validate all required fields by not entering anything into them on form', function(done) {
            var expectedErrorMessages = ['Fill in the Numeric Field', 'Fill in the Numeric Percent Field', 'Fill in the Duration Field', 'Fill in the Phone Number Field', 'Fill in the Email Address Field', 'Fill in the URL Field'];
            formsPage.waitForElement(reportServicePage.reportStageContentEl).then(function() {
                //click on add record button
                reportServicePage.clickAddRecordOnStage();
                // Check that the add form container is displayed
                expect(formsPage.formEditContainerEl.isPresent()).toBeTruthy();

                //Save the form without entering any field values
                formsPage.clickSaveBtnWithName('Save');

                //verify validation
                formsPage.verifyErrorMessages(expectedErrorMessages);
                done();
            });
        });

        /**
         * Data Provider for reports and faceting results.
         */
        function invalidFieldValueTestCases() {
            return [
                {
                    message: 'all numeric fields',
                    fieldTypeClassNames: 'numericField',
                    expectedErrorMessages : ['Fill in the Numeric Field', 'Fill in the Numeric Percent Field', 'Fill in the Duration Field', 'Fill in the Phone Number Field', 'Fill in the Email Address Field', 'Fill in the URL Field']
                },
            ];
        }

        invalidFieldValueTestCases().forEach(function(testcase) {
            it('Save Button - Validate ' + testcase.message, function(done) {
                formsPage.waitForElement(reportServicePage.reportStageContentEl).then(function() {
                    //click on add record button
                    reportServicePage.clickAddRecordOnStage();

                    //enter invalid field values
                    formsPage.enterInvalidFormValues(testcase.fieldTypeClassNames);

                    //Save the form
                    formsPage.clickSaveBtnWithName('Save');

                    //verify field validations
                    formsPage.verifyErrorMessages(testcase.expectedErrorMessages);

                    //verify clicking on alert button brings up the error message popup
                    formsPage.clickFormAlertBtn();
                    expect(formsPage.formErrorMessage.getAttribute('hidden')).toBe(null);

                    //verify clicking on alert again hides the error message popup
                    formsPage.clickFormAlertBtn();
                    expect(formsPage.formErrorMessage.getAttribute('hidden')).toBe('true');
                    done();
                });
            });
        });

        it('Save and add another Button - Validate errors and correct the errors by adding new record', function(done) {
            var validFieldClassNames = ['textField', 'numericField', 'dateCell', 'timeCell', 'checkbox'];
            var expectedErrorMessages = ['Fill in the Numeric Field', 'Fill in the Numeric Percent Field', 'Fill in the Duration Field', 'Fill in the Phone Number Field', 'Fill in the Email Address Field', 'Fill in the URL Field'];

            //click on add record button
            reportServicePage.clickAddRecordOnStage();

            //enter invalid values into fields
            formsPage.enterInvalidFormValues('numericField');

            //Save the form
            formsPage.clickSaveBtnWithName('Save & add another');

            //verify validation
            formsPage.verifyErrorMessages(expectedErrorMessages);
            // Needed to get around stale element error
            e2eBase.sleep(browser.params.smallSleep);

            //correct the errors and add the record
            for (var i = 0; i < validFieldClassNames.length; i++) {
                formsPage.enterFormValues(validFieldClassNames[i]);
            }

            //Save the form by clicking on 'Save and add another' btn
            formsPage.clickFormSaveAndAddAnotherBtn();

            //reload the report to verify the row edited
            RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, "1"));
            return formsPage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                e2eBase.sleep(browser.params.smallSleep);
                reportServicePage.agGridRecordElList.then(function(records) {
                    for (var j = 0; j < validFieldClassNames.length; j++) {
                        formsPage.verifyFieldValuesInReportTable(records.length - 1, validFieldClassNames[j]);
                    }
                    done();
                });
            });
        });

    });
}());
