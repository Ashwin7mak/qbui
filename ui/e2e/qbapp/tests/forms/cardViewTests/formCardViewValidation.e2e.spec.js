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
        var expectedErrorMessages = ['Numeric Field', 'Numeric Percent Field', 'Duration Field', 'Phone Number Field', 'Email Address Field', 'URL Field'];

        beforeAll(function(done) {
            e2eBase.fullReportsSetup(5).then(function(appAndRecords) {
                app = appAndRecords[0];
                recordList = appAndRecords[1];
                // Get a session ticket for that subdomain and realmId (stores it in the browser)
                // Gather the necessary values to make the requests via the browser
                realmName = e2eBase.recordBase.apiBase.realm.subdomain;
                realmId = e2eBase.recordBase.apiBase.realm.id;
            }).then(function() {
                return RequestSessionTicketPage.get(e2eBase.getSessionTicketRequestEndpoint(realmName, realmId, e2eBase.ticketEndpoint));
            }).then(function() {
                // Load the requestAppsPage (shows a list of all the apps and tables in a realm)
                return RequestAppsPage.get(e2eBase.getRequestAppsPageEndpoint(realmName));
            }).then(function() {
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

        it('Validate all required fields on the form', function(done) {
            //click on add record button
            reportCardViewPage.clickAddRecord().then(function() {
                //Save the form
                formsPage.clickFormSaveBtn();
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
                done();
            });
        });

        it('Save Btn - Validate Add form', function(done) {
            var fieldTypeClassNames = ['textField', 'numericField'];
            //click on add record button
            reportCardViewPage.clickAddRecord().then(function() {

                //get the fields from the table and generate a record
                for (var i = 0; i < fieldTypeClassNames.length; i++) {
                    reportCardViewPage.enterInvalidFormValues(fieldTypeClassNames[i]);
                }
            }).then(function() {
                //Save the form
                formsPage.clickFormSaveBtn();
            }).then(function() {
                //verify validation
                formsPage.verifyErrorMessages(expectedErrorMessages);
            }).then(function() {
                //close dirty form
                formsPage.closeSaveChangesDialogue();
            }).then(function() {
                done();
            });

        });

        it('Save Btn -Validate Edit form', function(done) {
            var fieldTypeClassNames = ['textField', 'numericField'];
            //Select record
            reportCardViewPage.clickRecord(1).then(function() {
                //Click edit button
                reportCardViewPage.clickEditRecord();
            }).then(function() {
                //get the fields from the table and generate a record
                for (var i = 0; i < fieldTypeClassNames.length; i++) {
                    reportCardViewPage.enterInvalidFormValues(fieldTypeClassNames[i]);
                }
            }).then(function() {
                //Save the form
                formsPage.clickFormSaveBtn();
            }).then(function() {
                //verify validation
                formsPage.verifyErrorMessages(expectedErrorMessages);
            }).then(function() {
                //close dirty form
                formsPage.closeSaveChangesDialogue();
            }).then(function() {
                done();
            });
        });

        it('Save And Next - Validate edit form and Edit a record successfully after errors', function(done) {
            var fieldTypeClassNames = ['textField', 'numericField'];
            //Select record 1
            reportCardViewPage.clickRecord(3).then(function() {
                reportCardViewPage.clickEditRecord();
            }).then(function() {
                //get the fields from the table and generate a record
                for (var i = 0; i < fieldTypeClassNames.length; i++) {
                    reportCardViewPage.enterInvalidFormValues(fieldTypeClassNames[i]);
                }
            }).then(function() {
                //Save the form
                formsPage.clickSaveBtnWithName('Save & Next');
            }).then(function() {
                //verify validation
                formsPage.verifyErrorMessages(expectedErrorMessages);
                // Needed to get around stale element error
                e2eBase.sleep(browser.params.smallSleep);
            }).then(function() {
                //correct the errors and add the record
                for (var j = 0; j < fieldTypeClassNames.length; j++) {
                    reportCardViewPage.enterFormValues(fieldTypeClassNames[j]);
                }
            }).then(function() {
                //Save the form
                formsPage.clickFormSaveAndNextBtn();
            }).then(function() {
                //reload the report
                RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, "1"));
                reportCardViewPage.waitForReportReady();
            }).then(function() {
                //select the record
                reportCardViewPage.clickRecord(3);
            }).then(function() {
                //verify editing a record worked
                for (var k = 0; k < fieldTypeClassNames.length; k++) {
                    reportCardViewPage.verifyFieldValuesInReportTableSmallBP(reportCardViewPage.formTable, fieldTypeClassNames[k]);
                }
            }).then(function() {
                done();
            });
        });

    });
}());
