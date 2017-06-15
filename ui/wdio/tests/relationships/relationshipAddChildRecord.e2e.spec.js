/**
 * E2E tests for  adding child records in the UI
 * Written by Ranjita 6/11/17
 */

// Load the page objects
let newStackAuthPO = requirePO('newStackAuth');
let e2ePageBase = requirePO('e2ePageBase');
let reportContentPO = requirePO('reportContent');
let relationshipsPO = requirePO('relationshipsPage');
let reportInLineEditPO = requirePO('reportInLineEdit');
let formsPagePO = requirePO('formsPage');

// Global vars used throughout the it blocks
let realmName;
let realmId;
let testApp;

describe('Relationships - Add child Record to embedded Table tests: ', () => {
    const defaultParentRecordValue = 1;
    if (browserName === 'chrome' || browserName === 'MicrosoftEdge') {
        /**
         * Setup method. Creates test app then authenticates into the new stack
         */
        beforeAll(() => {
            browser.logger.info('beforeAll spec function - Generating test data and logging in');
            // Need to return here. beforeAll is completely async, need to return the Promise chain in any before or after functions!
            // No need to call done() anymore
            return e2eBase.basicAppSetup().then(function(createdApp) {
                // Set your global objects to use in the test functions
                testApp = createdApp;
                realmName = e2eBase.recordBase.apiBase.realm.subdomain;
                realmId = e2eBase.recordBase.apiBase.realm.id;
            }).then(() => {
                // Auth into the new stack
                return newStackAuthPO.realmLogin(realmName, realmId);
            }).then(() => {
                // Modify Child table A's first three records to relate it to Parent Table A's 1 record
                relationshipsPO.modifyChildTableToRelateToParent(testApp, testApp.tables[e2eConsts.TABLE4]);
            }).then(() => {
                // Modify GrandChild table A's first three records to relate it to Child Table A's 1 record
                relationshipsPO.modifyChildTableToRelateToParent(testApp, testApp.tables[e2eConsts.TABLE5]);
            }).catch((error) => {
                // Global catch that will grab any errors from chain above
                // Will appropriately fail the beforeAll method so other tests won't run
                browser.logger.error('Error in beforeAll function:' + JSON.stringify(error));
                return Promise.reject('Error in beforeAll function:' + JSON.stringify(error));
            });
        });

        /**
         * Setup method. Resets state between tests
         */
        beforeEach(() => {
            // Navigate to Table 3, Report 1, Record 1
            reportContentPO.openRecordInViewMode(realmName, testApp.id, testApp.tables[e2eConsts.TABLE3].id, 1, 1);
            return reportContentPO.waitForLeftNavLoaded();
        });

        /**
         *  Add Child button opens a trowser, adds a row to the embedded report
         */
        it('Test that the Add Child button opens a trowser, adds a row to the embedded report', () => {
            //wait until report rows in table are loaded
            reportContentPO.waitForReportContent();
            const origRecordCount = formsPagePO.getRecordsCountInATable();
            relationshipsPO.addChildRecord(origRecordCount, defaultParentRecordValue);

            // Verify new record got added to the end of the embedded table and verify the expected field values
            const recordValues = reportContentPO.getRecordValues(origRecordCount);
            reportContentPO.verifyFieldValuesInEmbeddedReportTable(recordValues);

            // Verify the records count got increased by 1
            expect(formsPagePO.getRecordsCountInATable()).toBe(origRecordCount + 1);

        });

        /**
         *  Add Child button opens a trowser, adds a row with a different parent Id so adding it to a different embedded report and so
         *  row count does not increase for the current embedded report
         */
        it('Adding Child to a different parent,does not add a row to the embedded report currently viewed', () => {
            const parentRecordValue = 3;
            //wait until report rows in table are loaded
            reportContentPO.waitForReportContent();
            const origRecordCount = formsPagePO.getRecordsCountInATable();
            relationshipsPO.addChildRecord(origRecordCount, parentRecordValue);
            // Verify the records count remained same
            expect(formsPagePO.getRecordsCountInATable()).toBe(origRecordCount);

        });

        /**
         *  Add child button disabled when adding a parent
         */
        it('Add child button disabled when adding a parent', () => {
            //wait until report rows in table are loaded
            reportContentPO.waitForReportContent();
            const origRecordCount = formsPagePO.getRecordsCountInATable();
            relationshipsPO.clickAddChildButton();
            // Verify - when the trowser is opened for adding a child, you cannot add a child to this currently being added parent
            // so if it has a relationship with a child , the add child record button is expected to be disable
            browser.waitForVisible(relationshipsPO.addChildButtonDisabledClass);

        });


        /**
         *  default parent selected in drop down when trowser opens while adding a child record, this value can be changed
         */
        xit('Verify default parent selected in drop down when trowser opens while adding a child record', () => {
            //wait until report rows in table are loaded
            reportContentPO.waitForReportContent();
            const origRecordCount = formsPagePO.getRecordsCountInATable();
            relationshipsPO.clickAddChildButton();
            // Verify - when the trowser is opened for adding a child,and we have the default parent selected
            browser.waitForVisible('.Select-value-label');
            expect(browser.getText('.Select-value-label')).toBe('1');

        });
    }
});

