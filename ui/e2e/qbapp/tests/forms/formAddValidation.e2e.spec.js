/**
 * E2E tests for error and invalid field validation when adding a new record via a Form.
 */
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

    describe('Add Form Validation Tests: ', function() {

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
                return RequestSessionTicketPage.get(e2eBase.getSessionTicketRequestEndpoint(realmName, realmId, e2eBase.ticketEndpoint));
            }).then(function() {
                // Load the requestAppsPage (shows a list of all the apps and tables in a realm)
                return RequestAppsPage.get(e2eBase.getRequestAppsPageEndpoint(realmName));
            }).then(function() {
                // Wait for the leftNav to load
                reportServicePage.waitForElement(reportServicePage.appsListDivEl);
            }).then(function() {
                done();
            });
        });

        /**
         * Before each test starts just make sure the report has loaded
         */
        beforeEach(function(done) {
            //go to report page directly.
            RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, "1"));
            reportContentPage.waitForReportContent();
            done();
        });

        it('@smoke Validate all required fields by not entering anything into them on form', function(done) {
            formsPage.waitForElement(reportServicePage.reportStageContentEl).then(function() {
                //click on add record button
                reportServicePage.clickAddRecordOnStage().then(function() {
                    //Save the form without entering any field values
                    formsPage.clickSaveBtnWithName('Save');
                }).then(function() {
                    //verify validation
                    formsPage.verifyErrorMessages(expectedErrorMessages);
                }).then(function() {
                    //verify clicking on alert button brings up the error message popup
                    formsPage.clickFormAlertBtn();
                    expect(formsPage.formErrorMessageVisisble.isPresent()).toBeTruthy();
                }).then(function() {
                    //verify clicking on alert again hides the error message popup
                    formsPage.clickFormAlertBtn();
                    expect(formsPage.formErrorMessageVisisble.isPresent()).toBeFalsy();
                }).then(function() {
                    //close forms
                    formsPage.clickFormCloseBtn();
                }).then(function() {
                    done();
                });
            });
        });

        /**
         * Data Provider for reports and faceting results.
         */
        function invalidFieldValueTestCases() {
            return [
                {
                    message: 'all numeric fields',
                    fieldTypeClassNames: 'numericField'
                }
            ];
        }

        invalidFieldValueTestCases().forEach(function(testcase) {
            it('Save Button - Validate ' + testcase.message, function(done) {
                formsPage.waitForElement(reportServicePage.reportStageContentEl).then(function() {
                    //click on add record button
                    reportServicePage.clickAddRecordOnStage().then(function() {
                        //enter invalid field values
                        formsPage.enterInvalidFormValues(testcase.fieldTypeClassNames);
                    }).then(function() {
                        //Save the form
                        formsPage.clickSaveBtnWithName('Save').then(function() {
                            //verify field validations
                            formsPage.verifyErrorMessages(expectedErrorMessages);
                        }).then(function() {
                            //close dirty form
                            formsPage.closeSaveChangesDialogue();
                            done();
                        });
                    });
                });
            });
        });

        it('Save and add another Button - Validate errors and correct the errors by adding new record', function(done) {
            var validFieldClassNames = ['textField', 'numericField', 'dateCell', 'timeCell', 'checkbox'];

            //click on add record button
            reportServicePage.clickAddRecordOnStage().then(function() {
                //enter invalid values into fields
                formsPage.enterInvalidFormValues('numericField');
            }).then(function() {
                //Save the form
                formsPage.clickSaveBtnWithName('Save & Add Another');
            }).then(function() {
                //verify validation
                formsPage.verifyErrorMessages(expectedErrorMessages);
                // Needed to get around stale element error
                e2eBase.sleep(browser.params.smallSleep);
            }).then(function() {
                //correct the errors and add the record
                for (var i = 0; i < validFieldClassNames.length; i++) {
                    formsPage.enterFormValues(validFieldClassNames[i]);
                }
            }).then(function() {
                //Save the form by clicking on 'Save and add another' btn
                formsPage.clickFormSaveAndAddAnotherBtn();
            }).then(function() {
                //reload the report
                e2eBase.reportService.loadReportByIdInBrowser(realmName, app.id, app.tables[e2eConsts.TABLE1].id, 1);
                reportContentPage.waitForReportContent().then(function() {
                    reportServicePage.agGridRecordElList.then(function(records) {
                        for (var j = 0; j < validFieldClassNames.length; j++) {
                            formsPage.verifyFieldValuesInReportTable(records.length - 1, validFieldClassNames[j]);
                        }
                    });
                }).then(function() {
                    done();
                });
            });
        });
    });
}());
