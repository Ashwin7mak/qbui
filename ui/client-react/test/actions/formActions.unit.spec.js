import * as formActions from '../../src/actions/formActions';
import {editNewRecord, openRecordForEdit, loadForm, __RewireAPI__ as FormActionsRewireAPI} from '../../src/actions/formActions';
import * as UrlConsts from "../../src/constants/urlConstants";
import * as types from '../../src/constants/actions';
import WindowLocationUtils from '../../src/utils/windowLocationUtils';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Promise from 'bluebird';


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

    describe('loading actions', () => {
        it('should create an action to indicate loading view form', () => {

            expect(formActions.loadingForm("view")).toEqual({type: types.LOADING_FORM, container: "view"});
        });

        it('should create an action to indicate load view form error', () => {

            expect(formActions.loadFormError("view", "oops")).toEqual({
                type: types.LOAD_FORM_ERROR,
                container: "view",
                error: "oops"
            });
        });

        it('should create an action to indicate form loaded', () => {

            expect(formActions.loadFormSuccess("view", "someData")).toEqual({
                type: types.LOAD_FORM_SUCCESS,
                container: "view",
                formData: "someData"
            });
        });
    });

    describe('saving actions', () => {
        it('should create an action to indicate saving a form', () => {

            expect(formActions.savingForm("edit")).toEqual({type: types.SAVE_FORM, container: "edit"});
        });

        it('should create an action to indicate save form error', () => {

            expect(formActions.saveFormError("edit", "oops")).toEqual({
                type: types.SAVE_FORM_FAILED,
                container: "edit",
                error: "oops"
            });
        });

        it('should create an action to indicate form saved', () => {

            expect(formActions.saveFormSuccess("edit", "someData")).toEqual({
                type: types.SAVE_FORM_SUCCESS,
                container: "edit"
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

            const expectedActions = [
                {type: types.LOADING_FORM, container: 'view'},
                {type: types.LOAD_FORM_SUCCESS, container: 'view',
                    formData: {
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
                {type: types.LOADING_FORM, container: 'edit'},
                {type: types.LOAD_FORM_SUCCESS, container: 'edit',
                    formData: {
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
                },
                () => {
                    expect(false).toBe(true);
                    done();
                });
        });
    });
});
