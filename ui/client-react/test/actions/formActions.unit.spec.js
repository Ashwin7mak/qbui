import * as formActions from '../../src/actions/formActions';
import {editNewRecord, openRecordForEdit, loadForm, createForm, updateForm, __RewireAPI__ as FormActionsRewireAPI} from '../../src/actions/formActions';
import * as UrlConsts from "../../src/constants/urlConstants";
import * as types from '../../src/actions/types';
import WindowLocationUtils from '../../src/utils/windowLocationUtils';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Promise from 'bluebird';
import testFormData from '../testHelpers/testFormData';

class WindowLocationUtilsMock {
    static pushWithQuery(url) { }
}

describe('Form Actions functions', () => {

    beforeEach(() => {
        FormActionsRewireAPI.__Rewire__('WindowLocationUtils', WindowLocationUtilsMock);

    });

    afterEach(() => {
        FormActionsRewireAPI.__ResetDependency__('WindowLocationUtils');
    });

    describe('syncing actions', () => {

        it('should create an action to indicate the view form needs to be reloaded', () => {

            expect(formActions.syncForm("view")).toEqual({type: types.SYNC_FORM, id: "view"});
        });
    });

    describe('loading actions', () => {

        it('should create an action to indicate loading view form', () => {

            expect(formActions.loadingForm("view")).toEqual({type: types.LOADING_FORM, id: "view"});
        });

        it('should create an action to indicate load view form error', () => {

            expect(formActions.loadFormError("view", "oops")).toEqual({
                type: types.LOAD_FORM_ERROR,
                id: "view",
                error: "oops"
            });
        });

        it('should create an action to indicate form loaded', () => {

            expect(formActions.loadFormSuccess("view", "someData")).toEqual({
                type: types.LOAD_FORM_SUCCESS,
                id: "view",
                formData: "someData"
            });
        });
    });

    describe('saving actions', () => {

        it('should create an action to indicate saving a form', () => {

            expect(formActions.savingForm("edit")).toEqual({type: types.SAVE_FORM, id: "edit"});
        });

        it('should create an action to indicate save form error', () => {

            expect(formActions.saveFormError("edit", "oops")).toEqual({
                type: types.SAVE_FORM_FAILED,
                id: "edit",
                error: "oops"
            });
        });

        it('should create an action to indicate form saved', () => {

            expect(formActions.saveFormSuccess("edit", "someData")).toEqual({
                type: types.SAVE_FORM_SUCCESS,
                id: "edit"
            });
        });
    });


    describe('edit record actions', () => {

        it('should create an action to open record for edit', () => {

            expect(openRecordForEdit(123)).toEqual({
                type: types.EDIT_REPORT_RECORD,
                recId: 123,
            });
        });

        it('should create an action to edit new record, no nav after save', () => {

            expect(editNewRecord(false)).toEqual({
                type: types.EDIT_REPORT_RECORD,
                recId: UrlConsts.NEW_RECORD_VALUE,
                navigateAfterSave: false
            });
        });

        it('should create an action to edit new record, nav after save', () => {

            expect(editNewRecord(true)).toEqual({
                type: types.EDIT_REPORT_RECORD,
                recId: UrlConsts.NEW_RECORD_VALUE,
                navigateAfterSave: true
            });
        });
    });

    describe('load form data action', () => {

        // we mock the Redux store when testing async action creators

        const middlewares = [thunk];
        const mockStore = configureMockStore(middlewares);

        let formResponseData = {
            formId: 1,
            tableId: "table1",
            appId: "app1",
            recordId: "newRecordId"
        };

        let formAndRecordResponseData = {
            formId: 2,
            tableId: "table2",
            appId: "app2"
        };

        class mockFormService {
            constructor() { }
            getFormAndRecord() {
                return Promise.resolve({data: formAndRecordResponseData});
            }
            getForm() {
                return Promise.resolve({data: formResponseData});
            }
        }

        beforeEach(() => {
            spyOn(mockFormService.prototype, 'getFormAndRecord').and.callThrough();
            spyOn(mockFormService.prototype, 'getForm').and.callThrough();
            FormActionsRewireAPI.__Rewire__('FormService', mockFormService);
        });

        afterEach(() => {
            FormActionsRewireAPI.__ResetDependency__('FormService');
        });

        it('load view record form', (done) => {

            // the mock store makes the actions dispatched available via getActions()
            // so we don't need to spy on the dispatcher etc.

            const expectedActions = [
                {type: types.LOADING_FORM, id: 'view'},
                {type: types.LOAD_FORM_SUCCESS, id: 'view',
                    formData: {
                        formType: 'view',
                        formId: formAndRecordResponseData.formId,
                        tableId: formAndRecordResponseData.tableId,
                        appId: formAndRecordResponseData.appId,
                        recordId: '123'
                    }
                }
            ];
            const store = mockStore({});

            return store.dispatch(loadForm("appId", "tblId", "report", "view", "123")).then(
                () => {
                    expect(store.getActions()).toEqual(expectedActions);
                    done();
                },
                () => {
                    expect(false).toBe(true);
                    done();
                });
        });

        it('load new record form', (done) => {

            const expectedActions = [
                {type: types.LOADING_FORM, id: 'edit'},
                {type: types.LOAD_FORM_SUCCESS, id: 'edit',
                    formData: {
                        formType: 'edit',
                        formId: formResponseData.formId,
                        tableId: formResponseData.tableId,
                        appId: formResponseData.appId,
                        recordId: formResponseData.recordId,
                        record: null
                    }
                }
            ];
            const store = mockStore({});

            return store.dispatch(loadForm("appId", "tblId", "report", "edit", "new")).then(
                () => {
                    expect(store.getActions()).toEqual(expectedActions);
                    done();
                }).catch(error => {
                    expect(false).toBe(true);
                    done();
                });
        });
    });

    describe('save form data action', () => {

        let formData = {
            formId: 1
        };

        // we mock the Redux store when testing async action creators
        const middlewares = [thunk];
        const mockStore = configureMockStore(middlewares);
        const expectedActions = [
            {id:'view', type:types.SAVING_FORM, content:null},
            {id: 'view', type: types.SAVING_FORM_SUCCESS, content: formData}
        ];

        class mockFormService {
            constructor() {}
            createForm() {
                return Promise.resolve({data:formData});
            }
            updateForm() {
                return Promise.resolve({data:formData});
            }
        }

        beforeEach(() => {
            spyOn(mockFormService.prototype, 'createForm').and.callThrough();
            spyOn(mockFormService.prototype, 'updateForm').and.callThrough();
            FormActionsRewireAPI.__Rewire__('FormService', mockFormService);
        });

        afterEach(() => {
            FormActionsRewireAPI.__ResetDependency__('FormService');
        });

        it('save a form update', (done) => {

            // the mock store makes the actions dispatched available via getActions()
            // so we don't need to spy on the dispatcher etc.

            const store = mockStore({});
            return store.dispatch(updateForm("appId", "tblId", "view", formData)).then(
                () => {
                    expect(mockFormService.prototype.createForm).not.toHaveBeenCalled();
                    expect(mockFormService.prototype.updateForm).toHaveBeenCalled();
                    expect(store.getActions()).toEqual(expectedActions);
                    done();
                },
                () => {
                    expect(false).toBe(true);
                    done();
                });
        });
        it('save a form create', (done) => {

            // the mock store makes the actions dispatched available via getActions()
            // so we don't need to spy on the dispatcher etc.
            const store = mockStore({});

            return store.dispatch(createForm("appId", "tblId", "view", formData)).then(
                () => {
                    expect(mockFormService.prototype.createForm).toHaveBeenCalled();
                    expect(mockFormService.prototype.updateForm).not.toHaveBeenCalled();
                    expect(store.getActions()).toEqual(expectedActions);
                    done();
                },
                () => {
                    expect(false).toBe(true);
                    done();
                });
        });
    });

    describe('tranforming formMeta for use in the UI', () => {
        let result;
        beforeEach(() => {
            result = formActions.loadFormSuccess("view", testFormData);
        });

        it('transforms the tab object into an array', () => {
            let actualTabs = result.formData.formMeta.tabs.map(tab => tab.title);

            expect(actualTabs).toEqual(['Tab1', 'Tab2']);
        });

        it('transforms sections object into an array', () => {
            let actualSections = result.formData.formMeta.tabs[0].sections.map(section => section.headerElement.FormHeaderElement.displayText);

            expect(actualSections).toEqual(['Tab1-Section1', 'Tab1-Section2']);
        });

        it('separates sections into column arrays', () => {
            let actualColumns = result.formData.formMeta.tabs[0].sections[0].columns;

            expect(actualColumns.length).toEqual(1);
            expect(actualColumns[0].orderIndex).toEqual(0);
        });



        it('transforms elements object into an array', () => {
            let actualElements = result.formData.formMeta.tabs[0].sections[0].columns[0].rows.map(row => row.elements[0].FormFieldElement.displayText);

            expect(actualElements).toEqual([
                'Tab1-Section1-Field1',
                'Tab1-Section1-Field2',
                'Tab1-Section1-Field3',
                'Tab1-Section1-Field4'
            ]);
        });
        
        it('puts elements into rows based on the positionSameRow property', () => {
            let actualRows = result.formData.formMeta.tabs[1].sections[0].columns[0].rows.map(row => {
                return row.elements.map(element => element.FormFieldElement.displayText);
            });

            expect(actualRows).toEqual([
                ['Tab2-Section1-Field1', 'Tab2-Section1-Field2'],
                ['Tab2-Section1-Field3', 'Tab2-Section1-Field4', 'Tab2-Section1-Field5'],
                ['Tab2-Section1-Field6'],
                ['Tab2-Section1-Field7']
            ]);
        });

        it('adds unique Ids that can be used as react keys', () => {
            let tab = result.formData.formMeta.tabs[0];
            let section = tab.sections[0];
            let column = section.columns[0];
            let row = column.rows[0];
            let element = row.elements[0];

            expect(tab.id).toBeDefined();
            expect(section.id).toBeDefined();
            expect(column.id).toBeDefined();
            expect(row.id).toBeDefined();
            expect(element.id).toBeDefined();
        });

        it('adds the location of the section so it can be found and moved during drag and drop', () => {
            let section = result.formData.formMeta.tabs[0].sections[1];

            expect(section.location).toEqual({
                tabIndex: 0,
                sectionIndex: 1
            });

            let sectionInDifferentTab = result.formData.formMeta.tabs[1].sections[0];

            expect(sectionInDifferentTab.location).toEqual({
                tabIndex: 1,
                sectionIndex: 0
            });
        });

        it('adds the location of the element so the element can be found and moved during drag and drop', () => {
            let element = result.formData.formMeta.tabs[0].sections[1].columns[0].rows[0].elements[0];

            expect(element.location).toEqual({
                tabIndex: 0,
                sectionIndex: 1,
                columnIndex: 0,
                rowIndex: 0,
                elementIndex: 1
            });

            let elementInRow = result.formData.formMeta.tabs[1].sections[0].columns[0].rows[1].elements[2];
            expect(elementInRow.location).toEqual({
                tabIndex: 1,
                sectionIndex: 0,
                columnIndex: 0,
                rowIndex: 1,
                elementIndex: 2
            });
        });
    })
});
