/**
 * Created by skamineni on 11/3/16.
 */
(function() {
    'use strict';
    //Bluebird Promise library
    var promise = require('bluebird');

    //Load the page Objects
    var ReportServicePage = requirePO('reportService');
    var RequestAppsPage = requirePO('requestApps');
    var RequestSessionTicketPage = requirePO('requestSessionTicket');
    var FormsPage = requirePO('formsPage');
    var ReportContentPO = requirePO('reportContent');

    var reportServicePage = new ReportServicePage();
    var reportContentPO = new ReportContentPO();
    var formsPage = new FormsPage();

    describe('Form Viewer Permission Tests: ', function() {

        var realmName;
        var realmId;
        var app;
        var recordList;
        var userId;
        var reportId;
        var roleId = 10;
        var appId;
        var tableId;

        beforeAll(function(done) {
            //App basic setUp
            e2eBase.fullReportsSetup(5).then(function(appAndRecords) {
                // Set your global objects to use in the test functions
                app = appAndRecords[0];
                recordList = appAndRecords[1];
                appId = app.id;
                tableId = app.tables[0].id;

                //report JSON
                var reportJSON = {
                    name: 'Test Roles Report',
                    type: 'TABLE',
                    tableId: app.tables[0].id,
                    query: null
                };
                //report endpoint
                var reportEndpoint = e2eBase.recordBase.apiBase.resolveReportsEndpoint(appId, tableId);

                //Create a report
                return e2eBase.recordBase.apiBase.executeRequest(reportEndpoint, consts.POST, reportJSON).then(function(repResponse) {
                    var r = JSON.parse(repResponse.body);
                    reportId = r.id;
                });
            }).then(function() {
                //create user
                return e2eBase.recordBase.apiBase.createUser().then(function(userResponse) {
                    userId = JSON.parse(userResponse.body).id;
                });
            }).then(function() {
                return e2eBase.recordBase.apiBase.assignUsersToAppRole(appId, roleId, [userId]);
            }).then(function() {
                //POST custdefaulthomepage for a table
                return e2eBase.recordBase.apiBase.setCustDefaultTableHomePageForRole(appId, tableId, e2eBase.roleService.createRoleReportMapJSON(roleId, reportId));
            }).then(function() {
                //Modify the field rights for Text field (readAccess and modify access set to false)
                return e2eBase.roleService.createFieldRightsForAppRole(appId, roleId, tableId, 6, false, false);
            }).then(function() {
                //Modify the field rights for Phone Number Field(readAccess and modify access set to false)
                return e2eBase.roleService.createFieldRightsForAppRole(appId, roleId, tableId, 16, false, false);
            }).then(function() {
                //Modify the field rights for Email Address Field(readAccess and modify access set to false)
                return e2eBase.roleService.createFieldRightsForAppRole(appId, roleId, tableId, 17, false, false);
            }).then(function() {
                //Modify the field rights for URL Field(readAccess and modify access set to false)
                return e2eBase.roleService.createFieldRightsForAppRole(appId, roleId, tableId, 18, false, false);
            }).then(function() {
                done();
            });
        });

        beforeEach(function(done) {
            //Set the session back to ADMIN
            // Get a session ticket for that subdomain and realmId (stores it in the browser)
            realmName = e2eBase.recordBase.apiBase.realm.subdomain;
            realmId = e2eBase.recordBase.apiBase.realm.id;
            //get the Admin authentication
            RequestSessionTicketPage.get(e2eBase.getSessionTicketRequestEndpoint(realmName, realmId, e2eBase.ticketEndpoint));
            done();
        });

        it('@smoke Verify not able to see any text fields on the View and Edit forms', function(done) {
            //get user authentication
            formsPage.getUserAuthentication(userId).then(function() {
                //Open the report
                e2eBase.reportService.loadReportByIdInBrowser(realmName, appId, tableId, reportId);
                reportContentPO.waitForReportContent().then(function() {
                    //Open a record
                    reportServicePage.openRecord(2);
                }).then(function() {
                    //Verify cannot see any text fields on the form in view mode as readaccess set to false
                    formsPage.verifyFieldsNotPresentOnForm(formsPage.formViewModeTable, ['Text Field', 'Phone Number Field', 'Email Address Field', 'URL Field']);
                }).then(function() {
                    //go to edit mode
                    reportServicePage.waitForElementToBeClickable(reportServicePage.reportEditRecordBtnOnStage).then(function() {
                        reportServicePage.reportEditRecordBtnOnStage.click().then(function() {
                            reportServicePage.waitForElement(element(by.className('editForm')));
                            //wait for trowser to animate
                            e2eBase.sleep(browser.params.smallSleep);
                            //Verify cannot see any text fields on the form in edit mode as modify access set to false
                            formsPage.verifyFieldsNotPresentOnForm(formsPage.formTable, ['Text Field', 'Phone Number Field', 'Email Address Field', 'URL Field']);
                        });
                    });
                }).then(function() {
                    done();
                });
            });
        });

        it('Verify cannot add a record into table as tableRights canadd set to false', function(done) {
            var fieldTypeClassNames = ['numericField', 'durationField'];
            //get user authentication
            formsPage.getUserAuthentication(userId).then(function() {
                //Open the report
                e2eBase.reportService.loadReportByIdInBrowser(realmName, appId, tableId, reportId);
                reportContentPO.waitForReportContent().then(function() {
                    //click on add record button
                    reportServicePage.clickAddRecordOnStage();
                }).then(function() {

                    //get the fields from the table and generate a record
                    for (var i = 0; i < fieldTypeClassNames.length; i++) {
                        formsPage.enterFormValues(fieldTypeClassNames[i]);
                    }
                }).then(function() {
                    //Save the form
                    formsPage.clickSaveBtnWithName('Save');
                    reportContentPO.waitForReportContent();
                }).then(function() {
                    //Verify record has no permission message shows up.
                    reportContentPO.assertNotificationMessage("You are not authorized to create or access this record");
                }).then(function() {
                    formsPage.closeSaveChangesDialogue();
                }).then(function() {
                    done();
                });
            });
        });

        it('Verify cannot edit a record since table rights canModify set to "NONE', function(done) {
            var fieldTypeClassNames = ['numericField'];

            //get user authentication
            formsPage.getUserAuthentication(userId).then(function() {

                //Open the report
                e2eBase.reportService.loadReportByIdInBrowser(realmName, appId, tableId, reportId);
                reportContentPO.waitForReportContent().then(function() {
                    //click edit record from the grid recordActions
                    reportServicePage.clickRecordEditPencil(2);
                }).then(function() {

                    //get the fields from the table and generate a record
                    for (var i = 0; i < fieldTypeClassNames.length; i++) {
                        formsPage.enterFormValues(fieldTypeClassNames[i]);
                    }
                }).then(function() {
                    //Save the form
                    formsPage.clickSaveBtnWithName('Save');
                    reportContentPO.waitForReportContent();
                }).then(function() {
                    //Verify record has no permission message shows up.
                    reportContentPO.assertNotificationMessage("Record not saved");
                    //TODO enable when MB-1488 is fixed enable below and remove above message
                    //reportContentPO.assertNotificationMessage("You are not authorized to create or access this record");
                }).then(function() {
                    formsPage.closeSaveChangesDialogue();
                }).then(function() {
                    done();
                });
            });
        });

        //TODO verify cannot delete a record when no permission.

    });
}());
