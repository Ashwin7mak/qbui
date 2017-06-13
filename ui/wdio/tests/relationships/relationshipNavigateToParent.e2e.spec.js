/**
 * E2E tests for viewing and navigating parent and child records in the UI
 * Written by klabak 4/29/17
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

describe('Relationships - View child table on form tests: ', () => {
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

            // Edit the Numeric Field of the first record
            reportInLineEditPO.openRecordEditMenu(0);
            reportInLineEditPO.editNumericField(0, 1);
            reportInLineEditPO.clickSaveChangesButton();

            // Edit the Numeric Field of the second record
            reportInLineEditPO.openRecordEditMenu(1);
            reportInLineEditPO.editNumericField(0, 1);
            reportInLineEditPO.clickSaveChangesButton();

            // Edit the Numeric Field of the second record
            reportInLineEditPO.openRecordEditMenu(2);
            reportInLineEditPO.editNumericField(0, 1);
            reportInLineEditPO.clickSaveChangesButton();

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
            return reportContentPO.waitForLeftNavLoaded();
        });

        /**
         *  Child record drawer shows link to navigate to parent record
         */
        it('Child record drawer shows link to navigate to parent record', () => {
            // Select a parent record, verify parent record is displayed along with child records in embedded report
            let childTableFormSection = relationshipsPO.qbPanelFormSectionEl(1);
            // Check the displayed record count
            let recordCount = relationshipsPO.recordsCountEl(childTableFormSection).getText();
            expect(recordCount).toContain('3 records');
            // Check the number of created related records in the table
            let rowCount = reportContentPO.getAllRows.value.length;
            expect(rowCount).toEqual(3);
            // Compare record values to make sure we are displaying the right ones
            let recordValues = [];
            recordValues.push(reportContentPO.getRecordValues(0, 0));
            recordValues.push(reportContentPO.getRecordValues(1, 0));
            recordValues.push(reportContentPO.getRecordValues(2, 0));
            expect(recordValues).toEqual(childRecordsTextValues);

            // Select a child record, open slidey-rightey
            relationshipsPO.clickOnRecordInChildTable(0);

            // Verify link to parent is displayed in drawer
            let parentLinkText = relationshipsPO.parentRecordLinkEl;
            expect(parentLinkText.getText()).toEqual('1');
        });

        /**
         *  Clicking on parent link in child form opens slidey-righty to parent
         */
        it('Clicking on parent link in child form opens slidey-righty to parent', () => {
            let childTableFormSection = relationshipsPO.qbPanelFormSectionEl(1);
            let sectionText = relationshipsPO.qbPanelHeaderTitleTextEl(childTableFormSection).getText();
            relationshipsPO.clickOnParentRecordLinkInForm();
            relationshipsPO.slideyRightyEl.waitForVisible();
            // Do I need to check expectation here?
        });

        /**
         *  Navigating to a child record without context of a parent, shows a link to parent record
         */
        it('Navigating to a child record directly will show a link to the parent record', () => {
            reportContentPO.openRecordInViewMode(realmName, testApp.id, testApp.tables[e2eConsts.TABLE4].id, 1, 1);
            let parentLinkText = relationshipsPO.parentRecordLinkEl;
            expect(parentLinkText.getText()).toEqual('1');
        });

    }
});

