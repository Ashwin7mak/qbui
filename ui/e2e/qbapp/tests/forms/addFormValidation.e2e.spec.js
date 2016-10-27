(function() {
    'use strict';

    //Load the page Objects
    var ReportServicePage = requirePO('reportService');
    var RequestAppsPage = requirePO('requestApps');
    var RequestSessionTicketPage = requirePO('requestSessionTicket');
    var reportServicePage = new ReportServicePage();
    var FormsPage = requirePO('formsPage');
    var formsPage = new FormsPage();
    var tableGenerator = require('../../../../test_generators/table.generator');

    describe('Form Validation Tests', function() {

        var realmName;
        var realmId;
        var app;
        var recordList;

        beforeAll(function(done) {
            e2eBase.fullReportsSetup(5).then(function(appAndRecords) {
                app = appAndRecords[0];
                recordList = appAndRecords[1];
            }).then(function() {
                //Create a form in table 3 with required fields
                //return e2eBase.formService.createFormsWithRequiredFields(app);
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

        /**
         * Data Provider for reports and faceting results.
         */
        function invalidFieldValueTestCases() {
            return [
                {
                    message: 'numeric fields',
                    fieldTypeClassNames: 'numericField',
                    expectedErrorMessages: ['Fill in the Numeric Field', 'Fill in the Numeric Percent Field', 'Fill in the Duration Field']
                },
            ];
        }

        invalidFieldValueTestCases().forEach(function(testcase) {
            it('Save Button - Validate ' + testcase.message, function(done) {
                formsPage.waitForElement(reportServicePage.reportStageContentEl).then(function() {
                    //click on add record button
                    reportServicePage.clickAddRecordOnStage();
                    // Check that the add form container is displayed
                    expect(formsPage.formEditContainerEl.isPresent()).toBeTruthy();
                }).then(function() {
                    //get the fields from the table and generate a record
                    formsPage.enterInvalidFormValues(testcase.fieldTypeClassNames);
                }).then(function() {
                    //Save the form
                    return formsPage.formSaveBtn.click();
                }).then(function() {
                    //verify validation
                    formsPage.waitForElement(formsPage.formErrorMessage).then(function() {
                        formsPage.verifyErrorMessages(testcase.expectedErrorMessages);
                    });
                }).then(function() {
                    //verify clicking on alert hides the error message popup
                    formsPage.clickFormAlertBtn();
                    expect(formsPage.formErrorMessage.getAttribute('hidden')).toBe('true');
                }).then(function() {
                    //verify clicking on it again brings up the error message popup
                    formsPage.clickFormAlertBtn();
                    expect(formsPage.formErrorMessage.getAttribute('hidden')).toBe(null);
                    done();
                });
            });
        });

        it('Save and add another Button - Validate errors and correct the errors by adding new record', function(done) {
            var validFieldClassNames = ['textField', 'numericField', 'dateCell', 'timeCell', 'checkbox'];
            var expectedNumericErrorMessages = ['Fill in the Numeric Field', 'Fill in the Numeric Percent Field', 'Fill in the Duration Field'];
            formsPage.waitForElement(reportServicePage.reportStageContentEl).then(function() {
                //click on add record button
                reportServicePage.clickAddRecordOnStage();
                // Check that the add form container is displayed
                expect(formsPage.formEditContainerEl.isPresent()).toBeTruthy();
            }).then(function() {
                //get the fields from the table and generate a record
                formsPage.enterInvalidFormValues('numericField');
            }).then(function() {
                //Save the form
                formsPage.clickSaveBtnWithName('Save & add another');
            }).then(function() {
                //verify validation
                formsPage.waitForElement(formsPage.formErrorMessage).then(function() {
                    formsPage.verifyErrorMessages(expectedNumericErrorMessages);
                });
            }).then(function() {
                //correct the errors and add the record
                for (var i = 0; i < validFieldClassNames.length; i++) {
                    formsPage.enterFormValues(validFieldClassNames[i]);
                }
            }).then(function() {
                //Save the form
                formsPage.clickSaveBtnWithName('Save & add another');
            }).then(function() {
                //reload the report to verify the row edited
                RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, "1"));
                return formsPage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                    for (var j = 0; j < validFieldClassNames.length; j++) {
                        formsPage.verifyFieldValuesInReportTable(7, validFieldClassNames[j]);
                    }
                    done();
                });
            });
        });

    });
}());
