(function() {
    'use strict';

    //Load the page Objects
    let newStackAuthPO = requirePO('newStackAuth');
    let e2ePageBase = requirePO('e2ePageBase');
    let tableCreatePO = requirePO('tableCreate');
    let formsPO = requirePO('formsPage');
    let formBuilderPO = requirePO('formBuilder');
    let modalDialog = requirePO('/common/modalDialog');
    let RequestAppsPage = requirePO('requestApps');
    let rawValueGenerator = require('../../../test_generators/rawValue.generator');
    let ReportContentPO = requirePO('reportContent');
    const tableNameFieldTitleText = '* Table name';
    const recordNameFieldTitleText = '* A record in the table is called';
    const descFieldTitleText = 'Description';
    const RECORD_TITLE_FIELD_NAME = '* Record title';


    describe('Tables - nonAdmin table tests: ', function() {
        let realmName;
        let realmId;
        let testApp;
        let userId;

        /**
         * Setup method. Creates test app then authenticates into the new stack
         */
        beforeAll(function() {
            browser.logger.info('beforeAll spec function - Generating test data and logging in');
            // Need to return here. beforeAll is completely async, need to return the Promise chain in any before or after functions!
            // No need to call done() anymore
            return e2eBase.basicAppSetup(null, 5).then(function(createdApp) {
                // Set your global objects to use in the test functions
                testApp = createdApp;
                realmName = e2eBase.recordBase.apiBase.realm.subdomain;
                realmId = e2eBase.recordBase.apiBase.realm.id;
            }).then(function() {
                // Auth into the new stack
                return newStackAuthPO.realmLogin(realmName, realmId);
            }).then(function() {
                // Create a user
                return e2eBase.recordBase.apiBase.createUser().then(function(userResponse) {
                    userId = JSON.parse(userResponse.body).id;
                });
            }).then(function() {
                // Add user to participant appRole
                return e2eBase.recordBase.apiBase.assignUsersToAppRole(testApp.id, e2eConsts.PARTICIPANT_ROLEID, [userId]);
            }).catch(function(error) {
                // Global catch that will grab any errors from chain above
                // Will appropriately fail the beforeAll method so other tests won't run
                browser.logger.error('Error in beforeAll function:' + JSON.stringify(error));
                return Promise.reject('Error in beforeAll function:' + JSON.stringify(error));
            });
        });

        /**
         * Before each it block reload the list all report (can be used as a way to reset state between tests)
         */
        beforeEach(function() {
            // Load the requestAppPage (shows a list of all the tables associated with an app in a realm)
            newStackAuthPO.nonAdminRealmLogin(realmName, realmId, userId);
        });

        it('Verify User cannot add a new table', function() {
            //go to app via url
            e2ePageBase.loadAppByIdInBrowser(realmName, testApp.id);

            //Verify New Table button not available for user other than ADMIN
            expect(browser.isVisible('.newTable')).toBe(false);
        });

        it('Verify User cannot edit a table', function() {

            //go to app via url
            e2ePageBase.loadAppByIdInBrowser(realmName, testApp.id);

            //Select table Table 1
            e2ePageBase.loadTableByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id);

            //Verify settings icon not available for user other than ADMIN
            expect(browser.isExisting('.topNav .iconUISturdy-settings')).toBe(false);
            expect(browser.isVisible('.topNav .iconUISturdy-settings')).toBe(false);
        });


    });
}());