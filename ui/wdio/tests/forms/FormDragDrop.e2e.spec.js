(function() {
    'use strict';

    let newStackAuthPO = requirePO('newStackAuth');
    let e2ePageBase = requirePO('e2ePageBase');
    let reportContentPO = requirePO('reportContent');
    let formBuilderPO = requirePO('formBuilder');

    let realmName;
    let realmId;
    let testApp;

    describe('Form Builder Tests:', function() {
        /**
         * Setup method. Creates test app then authenticates into the new stack
         */
        beforeAll(function() {
            browser.logger.info('beforeAll spec function - Generating test data and logging in');
            // Need to return here. beforeAll is completely async, need to return the Promise chain in any before or after functions!
            // No need to call done() anymore
            return e2eBase.basicAppSetup().then(function(createdApp) {
                // Set your global objects to use in the test functions
                testApp = createdApp;
                realmName = e2eBase.recordBase.apiBase.realm.subdomain;
                realmId = e2eBase.recordBase.apiBase.realm.id;
            }).then(function() {
                // Auth into the new stack
                return newStackAuthPO.realmLogin(realmName, realmId);
            }).catch(function(error) {
                // Global catch that will grab any errors from chain above
                // Will appropriately fail the beforeAll method so other tests won't run
                throw new Error('Error during test setup beforeAll: ' + error.message);
            });
        });

        beforeEach(function() { // why is beforeEach purple here whereas beforeAll is not purple above?
            // TODO: this needs to be synchronous, how?  I tried to mimic beforeAll...
            // open first table
            e2ePageBase.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1);
            // edit first record
            reportContentPO.clickOnRecordInReportTable(0);
            // invoke form builder
            formBuilderPO.open();
        });

        it('move a field via drag/drop, save & verify persistence', function() {
            // store the list of fields before moving
            let origFields = formBuilderPO.getFieldLabels();
            // drag the 1st field below the 2nd one
            let source = formBuilderPO.fieldLocator(1);
            let target = formBuilderPO.fieldLocator(2);
            browser.dragAndDrop(source, target);
            // verify that the first 2 items have changed position
            let movedFields = formBuilderPO.getFieldLabels();
            expect(movedFields[0]).toBe(origFields[1]);
            expect(movedFields[1]).toBe(origFields[0]);
            // save & verify persistence
            formBuilderPO.saveBtn.click();
            formBuilderPO.cancelBtn.click();
            formBuilderPO.open();
            expect(formBuilderPO.getFieldLabels()).toEqual(movedFields);
        });

        it('move a field via drag/drop, cancel & verify lack of persistence', function() {
            // store the list of fields before moving
            let origFields = formBuilderPO.getFieldLabels();
            // drag the 1st field below the 2nd one
            let source = formBuilderPO.fieldLocator(1);
            let target = formBuilderPO.fieldLocator(2);
            browser.dragAndDrop(source, target);
            // verify that the first 2 items have changed position
            let movedFields = formBuilderPO.getFieldLabels();
            expect(movedFields[0]).toBe(origFields[1]);
            expect(movedFields[1]).toBe(origFields[0]);
            // cancel & verify lack of persistence
            formBuilderPO.cancelBtn.click();
            formBuilderPO.open();
            expect(formBuilderPO.getFieldLabels()).toEqual(origFields);
        });

        it('drag a field to another & verify preview token, then drag off & verify no change', function() {
            // store the list of fields before moving
            let origFields = formBuilderPO.getFieldLabels();
            // drag 1st field onto 2nd
            let source = formBuilderPO.fieldLocator(1);
            let target = formBuilderPO.fieldLocator(2);
            browser.moveToObject(source);
            browser.buttonDown();
            // TODO: verify click effects, e.g. field selected & buttons enabled? DOM doesn't change...
            browser.moveToObject(target);
            // verify preview token attributes, e.g. title (which won't contain a 'required' asterisk)
            expect(formBuilderPO.fieldTokenTitle.getText()).toEqual(origFields[0].replace('* ', ''));
            // TODO: verify preview token icon?  Need a const hashmap?
            // TODO: verify target is highlighted? DOM doesn't change...
            // drag preview back to original position & drop
            browser.moveToObject(source);
            browser.buttonUp();
            // verify field order has not changed
            expect(formBuilderPO.getFieldLabels()).toEqual(origFields);
        });

        // this isn't a real test, but the technique will come in handy later
        // when we start creating fields on the fly, renaming fields, etc.
        it('drag/drop a field to another by name & verify move', function() {
            // store the list of fields before moving
            let origFields = formBuilderPO.getFieldLabels();
            // drag the 1st field below the 2nd one
            formBuilderPO.moveByName(origFields[1], origFields[2]);
            // verify that the first 2 items have changed position
            let movedFields = formBuilderPO.getFieldLabels();
            expect(movedFields[0]).toBe(origFields[1]);
            expect(movedFields[1]).toBe(origFields[0]);
        });
    });
}());
