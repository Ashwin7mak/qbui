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
         *  Create related child records and view them in the child table from the master record
         */
        it('Create related child records and view them in the embedded child table', () => {
            // Do assertions on the child table form section
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

            // Click into one of the child records to view the record form
            relationshipsPO.clickOnRecordInChildTable(0);

            // Confirm the values on the child form is the right record
            let recordFormValues = relationshipsPO.getChildRecordValuesFromForm();
            expect(recordFormValues[0]).toEqual(childRecordsTextValues[0]);
        });

        /**
         *  Navigate between child records from within slidey-righty
         */
        it('Navigate between child records from within slidey-righty', () => {
            // Click into one of the child records to view the record form (second record)
            relationshipsPO.clickOnRecordInChildTable(1);

            // Use the nav buttons on the form to navigate to the next related child record
            relationshipsPO.navigateToNextChildRecord();
            // Check values
            let record3FormValues = relationshipsPO.getChildRecordValuesFromForm();
            expect(record3FormValues[0]).toEqual(childRecordsTextValues[2]);

            // Go Back to the first record
            relationshipsPO.navigateToNextChildRecord(true);
            relationshipsPO.navigateToNextChildRecord(true);
            // Check values
            let record1FormValues = relationshipsPO.getChildRecordValuesFromForm();
            expect(record1FormValues[0]).toEqual(childRecordsTextValues[0]);
        });

        /**
         *  Navigate back to parent record by closing slidey-righty
         */
        it('Test that the X button closes an open slidey-righty', () => {
            // Click into one of the child records to view the record form (second record)
            relationshipsPO.clickOnRecordInChildTable(1);

            // Check that you can close slidey-righty
            relationshipsPO.closeSlideyRighty();
        });

        /**
         *  Add Child button opens a trowser, adds a row to the embedded report
         */
        it('Test that the Add Child button opens a trowser, adds a row to the embedded report', () => {
            //wait until report rows in table are loaded
            reportContentPO.waitForReportContent();
            const origRecordCount = formsPagePO.getRecordsCountInATable();

            // Click on add child button on embedded table opens trowser
            relationshipsPO.clickAddChildButton();
            const fieldTypes = ['allTextFields', 'allParentRecordFields'];

            browser.waitForVisible('form.editForm');
            // enter form values
            fieldTypes.forEach(function (fieldType) {
                formsPagePO.enterFormValues(fieldType);
            });

            // Click Save on the form
            formsPagePO.clickFormSaveBtn();
            // wait until report rows in table are loaded
            reportContentPO.waitForReportContent();

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

            // Click on add child button on embedded table opens trowser
            relationshipsPO.clickAddChildButton();
            const fieldTypes = ['allTextFields', 'allParentRecordFields'];

            browser.waitForVisible('form.editForm');
            // enter form values
            fieldTypes.forEach(function (fieldType) {
                let parentReferenceFieldValue = null;
                if (fieldType === 'allParentRecordFields') {
                    parentReferenceFieldValue = 3;
                }
                formsPagePO.enterFormValues(fieldType, parentReferenceFieldValue);
            });

            // Click Save on the form
            formsPagePO.clickFormSaveBtn();
            // wait until report rows in table are loaded
            reportContentPO.waitForReportContent();

            // Verify the records count remained same
            expect(formsPagePO.getRecordsCountInATable()).toBe(origRecordCount);

        });

        /**
         * Navigate to a record (view form) and assert that the section containing an empty child table is displayed
         */
        it('Empty child table is present when viewing a parent record with no children (so sad!)', () => {
            // Navigate to Table 3, Report 1, Record 2
            reportContentPO.openRecordInViewMode(realmName, testApp.id, testApp.tables[e2eConsts.TABLE3].id, 1, 2);

            // Do assertions on the child table form section
            let childTableFormSection = relationshipsPO.qbPanelFormSectionEl(1);
            childTableFormSection.waitForVisible();

            // Check the table name
            let sectionText = relationshipsPO.qbPanelHeaderTitleTextEl(childTableFormSection).getText();
            expect(sectionText).toContain('Child Table A');

            // Check the displayed record count
            let recordCount = relationshipsPO.recordsCountEl(childTableFormSection).getText();
            expect(recordCount).toContain('0 records');

            // Check there are no records in the child table
            browser.waitForExist('.qbRow', 1000, true);
        });

        /**
         * Navigate back to the correct child report via link in open slidey-righty
         */
        it('Navigate back to the child table homepage via link in open child record', () => {
            // Click into one of the child records to view the record form
            relationshipsPO.clickOnRecordInChildTable(0);

            // Assert that the name of the link is for the Parent table
            let parentLinkText = relationshipsPO.tableHomePageLinkEl.getAttribute('textContent');
            expect(parentLinkText).toContain('Child Table A');

            // Click the tablehomepage link (should send you back to the table homepage of the child table)
            relationshipsPO.clickTableHomePageLink();

            // Check the stage title to make sure we are on the right report
            let tableHomepageText = reportContentPO.stageTableHomepageTitleEl.getText();

            //TODO: This is failing in Edge even tho we are getting the exact same text back we expect to
            //TODO: See https://jenkins1.ci.quickbaserocks.com/view/Try%20UX%20Builds/job/try-ui-wdio-Edge/1361/console
            if (browserName !== 'MicrosoftEdge') {
                expect(tableHomepageText).toContain('Child Table A Home');
            }

            // Check the url as well
            let currentURL = browser.url().value;
            expect(currentURL).toContain(testApp.tables[e2eConsts.TABLE4].id);
        });
    }
});

