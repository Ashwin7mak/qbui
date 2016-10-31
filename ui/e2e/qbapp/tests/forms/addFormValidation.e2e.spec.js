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

    describe('Add Form Validation Tests', function() {

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

        it('Validate all required fields by not entering anything into them on form', function(done) {
            var expectedErrorMessages = ['Fill in the Numeric Field', 'Fill in the Numeric Percent Field', 'Fill in the Duration Field', 'Fill in the Phone Number Field', 'Fill in the Email Address Field', 'Fill in the URL Field'];
            formsPage.waitForElement(reportServicePage.reportStageContentEl).then(function() {
                //click on add record button
                reportServicePage.clickAddRecordOnStage();
                // Check that the add form container is displayed
                expect(formsPage.formEditContainerEl.isPresent()).toBeTruthy();
            }).then(function() {
                //Save the form without entering any field values on form
                return formsPage.formSaveBtn.click();
            }).then(function() {
                //verify validation
                formsPage.waitForElement(formsPage.formErrorMessage).then(function() {
                    formsPage.verifyErrorMessages(expectedErrorMessages);
                });
            }).then(function() {
                //finally close the form
                formsPage.clickFormCloseBtn();
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
                    //verify clicking on alert button brings up the error message popup
                    formsPage.clickFormAlertBtn();
                    expect(formsPage.formErrorMessage.getAttribute('hidden')).toBe(null);
                }).then(function() {
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
                    formsPage.verifyErrorMessages(expectedErrorMessages);
                });
                // Needed to get around stale element error
                e2eBase.sleep(browser.params.smallSleep);
            }).then(function() {
                //correct the errors and add the record
                for (var i = 0; i < validFieldClassNames.length; i++) {
                    formsPage.enterFormValues(validFieldClassNames[i]);
                }
            }).then(function() {
                //Save the form
                formsPage.clickSaveBtnWithName('Save & add another');
                reportServicePage.waitForElement(formsPage.formEditContainerEl);
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
