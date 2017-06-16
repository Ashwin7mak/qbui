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

let childRecordsTextValues = [];

describe('Relationships - Add child Record to embedded Table tests: ', () => {
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
            }).catch((error) => {
                // Global catch that will grab any errors from chain above
                // Will appropriately fail the beforeAll method so other tests won't run
                browser.logger.error('Error in beforeAll function:' + JSON.stringify(error));
                return Promise.reject('Error in beforeAll function:' + JSON.stringify(error));
            });
        });

        /**
         * Setup method. Edits child records in the UI to relate them to a parent record
         */
        beforeAll(() => {
            // Add child records to one of the parent records
            // More efficient to do this via API but I wanted to exercise the UI in these tests
            // Go to List All report
            e2ePageBase.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE4].id, 1);

            // Get values for text field of each record
            childRecordsTextValues.push(reportContentPO.getRecordValues(0, 1));
            childRecordsTextValues.push(reportContentPO.getRecordValues(1, 1));
            childRecordsTextValues.push(reportContentPO.getRecordValues(2, 1));
        });

        /**
         * Setup method. Resets state between tests
         */
        beforeEach(() => {
            // Navigate to Table 3, Report 1, Record 1
            reportContentPO.openRecordInViewMode(realmName, testApp.id, testApp.tables[e2eConsts.TABLE3].id, 1, 1);
            reportContentPO.waitForLeftNavLoaded();
            //wait until view form is visible
            return formsPagePO.viewFormContainerEl.waitForVisible();
        });

        /**
         *  Add Child button opens a trowser, adds a row to the embedded report
         */
        it('Test that the Add Child button opens a trowser, adds a row to the embedded report', () => {
            //wait until report rows in table are loaded
            reportContentPO.waitForReportContent();
            const origRecordCount = formsPagePO.getRecordsCountInATable();
            relationshipsPO.addChildRecord(origRecordCount, 1);

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
            //wait until report rows in table are loaded
            reportContentPO.waitForReportContent();
            const origRecordCount = formsPagePO.getRecordsCountInATable();
            relationshipsPO.addChildRecord(origRecordCount, 3);
            // Verify the records count remained same
            expect(formsPagePO.getRecordsCountInATable()).toBe(origRecordCount);

        });
    }
});

