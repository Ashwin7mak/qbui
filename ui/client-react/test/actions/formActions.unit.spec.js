import * as formActions from '../../src/actions/formActions';
import {loadForm, createForm, updateForm, __RewireAPI__ as FormActionsRewireAPI} from '../../src/actions/formActions';
import * as UrlConsts from "../../src/constants/urlConstants";
import * as types from '../../src/actions/types';
import WindowLocationUtils from '../../src/utils/windowLocationUtils';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Promise from 'bluebird';

class WindowLocationUtilsMock {
    static pushWithQuery(url) { }
}

const mockTransformHelper = {
    convertFormToArrayForClient(data) {return data;},
    convertFormToObjectForServer(data) {return data;}
};

describe('Form Actions', () => {

    beforeEach(() => {
        FormActionsRewireAPI.__Rewire__('WindowLocationUtils', WindowLocationUtilsMock);
        // Mock out Lodash's uniqueId function so it produces a predictable output for tests. Other functions remain the same.
        FormActionsRewireAPI.__Rewire__('_',  Object.assign({}, _, {uniqueId:() => 'newField_1'}));

    });

    afterEach(() => {
        FormActionsRewireAPI.__ResetDependency__('WindowLocationUtils');
        FormActionsRewireAPI.__ResetDependency__('_');
    });

    describe('syncing actions', () => {

        it('creates an action to indicate the view form needs to be reloaded', () => {

            expect(formActions.syncForm("view")).toEqual({type: types.SYNC_FORM, id: "view"});
        });
    });

    describe('loading actions', () => {

        it('creates an action to indicate loading view form', () => {

            expect(formActions.loadingForm("view")).toEqual({type: types.LOADING_FORM, id: "view"});
        });

        it('creates an action to indicate load view form error', () => {

            expect(formActions.loadFormError("view", "oops")).toEqual({
                type: types.LOAD_FORM_ERROR,
                id: "view",
                error: "oops"
            });
        });

        it('creates an action to indicate form loaded', () => {

            expect(formActions.loadFormSuccess("view", "someData", 'appId', 'tblId')).toEqual({
                type: types.LOAD_FORM_SUCCESS,
                id: "view",
                formData: "someData",
                appId: 'appId',
                tblId: 'tblId'
            });
        });
    });

    describe('saving actions', () => {
        it('creates an action to indicate saving a form', () => {
            expect(formActions.saveForm("edit")).toEqual({type: types.SAVE_FORM, id: "edit"});
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

            spyOn(mockTransformHelper, 'convertFormToArrayForClient').and.callThrough();
            FormActionsRewireAPI.__Rewire__('convertFormToArrayForClient', mockTransformHelper.convertFormToArrayForClient);
        });

        afterEach(() => {
            FormActionsRewireAPI.__ResetDependency__('FormService');
            FormActionsRewireAPI.__ResetDependency__('convertFormToArrayForClient');
        });

        it('loads view record form', (done) => {

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
                    },
                    appId: 'appId',
                    tblId: 'tblId'
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

        it('loads new record form', (done) => {

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
                    },
                    appId: 'appId',
                    tblId: 'tblId'
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

        it('transforms data to array structure for use on the client UI', (done) => {


            const store = mockStore({});

            return store.dispatch(loadForm("appId", "tblId", "report", "edit", "new")).then(
                () => {
                    expect(mockTransformHelper.convertFormToArrayForClient).toHaveBeenCalled();
                    done();
                }).catch(error => {
                    expect(false).toBe(true);
                    done();
                });
        });
    });

    describe('save form data action', () => {

        let formData = {
            formId: 1,
            formMeta: {tabs: {}}
        };

        // we mock the Redux store when testing async action creators
        const middlewares = [thunk];
        const mockStore = configureMockStore(middlewares);

        const expectedSaveActions = [
            {id:'view', type:types.SAVING_FORM, content: null},
            {id: 'view', type: types.SAVING_FORM_SUCCESS, content: formData.formMeta}
        ];
        const expectedActions = [
            {id:'view', type:types.SAVING_FORM, content: null},
            {id: 'view', type: types.SAVING_FORM_SUCCESS, content: formData}
        ];
        class mockFormService {
            constructor() {}
            createForm() {
                return Promise.resolve({data: formData});
            }
            updateForm() {
                return Promise.resolve({data: formData});
            }
        }

        beforeEach(() => {
            spyOn(mockFormService.prototype, 'createForm').and.callThrough();
            spyOn(mockFormService.prototype, 'updateForm').and.callThrough();
            FormActionsRewireAPI.__Rewire__('FormService', mockFormService);

            spyOn(mockTransformHelper, 'convertFormToArrayForClient').and.returnValue(formData);
            FormActionsRewireAPI.__Rewire__('convertFormToArrayForClient', mockTransformHelper.convertFormToArrayForClient);
        });

        afterEach(() => {
            FormActionsRewireAPI.__ResetDependency__('FormService');
            FormActionsRewireAPI.__ResetDependency__('convertFormToArrayForClient');
        });

        it('saves a form update', (done) => {

            // the mock store makes the actions dispatched available via getActions()
            // so we don't need to spy on the dispatcher etc.

            const store = mockStore({});
            return store.dispatch(updateForm("appId", "tblId", "view", formData)).then(
                () => {
                    expect(mockFormService.prototype.createForm).not.toHaveBeenCalled();
                    expect(mockFormService.prototype.updateForm).toHaveBeenCalled();
                    expect(store.getActions()).toEqual(expectedSaveActions);
                    done();
                },
                () => {
                    expect(false).toBe(true);
                    done();
                });
        });

        it('saves a form create', (done) => {

            // the mock store makes the actions dispatched available via getActions()
            // so we don't need to spy on the dispatcher etc.
            const store = mockStore({});

            return store.dispatch(createForm("appId", "tblId", "view", formData)).then(
                () => {
                    expect(mockFormService.prototype.createForm).toHaveBeenCalled();
                    expect(mockFormService.prototype.updateForm).not.toHaveBeenCalled();
                    expect(store.getActions()).toEqual(expectedSaveActions);
                    done();
                },
                () => {
                    expect(false).toBe(true);
                    done();
                });
        });
    });

    describe('transforms data appropriately', () => {
        const middlewares = [thunk];
        const mockStore = configureMockStore(middlewares);

        const formData = {
            formId: 1,
            formMeta: {tabs: {}}
        };

        class MockFormService {
            getForm() {return Promise.resolve(formData);}
            getFormAndRecord() {return Promise.resolve(formData);}
            createForm() {return Promise.resolve(formData);}
            updateForm() {return Promise.resolve(formData);}
        }

        beforeEach(() => {
            FormActionsRewireAPI.__Rewire__('FormService', MockFormService);

            spyOn(mockTransformHelper, 'convertFormToObjectForServer').and.returnValue(formData);
            FormActionsRewireAPI.__Rewire__('convertFormToObjectForServer', mockTransformHelper.convertFormToObjectForServer);

            spyOn(mockTransformHelper, 'convertFormToArrayForClient').and.returnValue(formData);
            FormActionsRewireAPI.__Rewire__('convertFormToArrayForClient', mockTransformHelper.convertFormToArrayForClient);
        });

        afterEach(() => {
            FormActionsRewireAPI.__ResetDependency__('FormService');
            FormActionsRewireAPI.__ResetDependency__('convertFormToObjectForServer');
            FormActionsRewireAPI.__ResetDependency__('convertFormToArrayForClient');
        });


        it('transforms the data from array structure to object before save', (done) => {
            const store = mockStore({});

            return store.dispatch(createForm("appId", "tblId", "view", formData)).then(
                () => {
                    expect(mockTransformHelper.convertFormToObjectForServer).toHaveBeenCalled();
                    done();
                },
                () => {
                    expect(false).toBe(true);
                    done();
                });
        });

        it('transforms the returned response data after the save', (done) => {
            const store = mockStore({});

            return store.dispatch(createForm("appId", "tblId", "view", formData)).then(
                () => {
                    expect(mockTransformHelper.convertFormToArrayForClient).toHaveBeenCalled();
                    done();
                },
                () => {
                    expect(false).toBe(true);
                    done();
                });
        });

    });

    describe('moveFieldOnForm', () => {
        it('creates an action that will move a field on a form', () => {
            expect(formActions.moveFieldOnForm(1, 2, 3)).toEqual({
                id: 1,
                type: types.MOVE_FIELD,
                content: {
                    newLocation: 2,
                    draggedItemProps: 3
                }
            });
        });
    });
    describe('addNewFieldToForm', () => {
        it('creates an action that will add a field', () => {
            expect(formActions.addNewFieldToForm('view', 1, {}, 1, 1)).toEqual({
                id: 'view',
                type: types.ADD_FIELD,
                content: {
                    newLocation: 1,
                    newField: {id: 'newField_1', edit: true, FormFieldElement: {positionSameRow: false, fieldId: 'newField_1', displayText: 'New Text Field'}},
                    appId: 1,
                    tblId: 1
                }
            });
        });
    });

    describe('selectFieldOnForm', () => {
        it('creates an action that will select a field', () => {
            expect(formActions.selectFieldOnForm('view', 1)).toEqual({
                id: 'view',
                type: types.SELECT_FIELD,
                content: {
                    location: 1
                }});
        });
    });

    describe('deselectField', () => {
        it('creates an action that deselects a form element', () => {
            expect(formActions.deselectField('view', 1)).toEqual({
                id: 'view',
                type: types.DESELECT_FIELD,
                content: {
                    location: 1
                }});
        });
    });

    describe('removeFieldFromForm', () => {
        it('creates an action that will remove a field', () => {
            expect(formActions.removeFieldFromForm('view', 1)).toEqual({
                id: 'view',
                type: types.REMOVE_FIELD,
                content: {
                    location: 1
                }});
        });
    });

    describe('keyBoardMoveFieldUp', () => {
        it('creates an action that will move a field up', () => {
            expect(formActions.keyboardMoveFieldUp('view', 1)).toEqual({
                id: 'view',
                type: types.KEYBOARD_MOVE_FIELD_UP,
                content: {
                    location: 1
                }});
        });
    });

    describe('keyboardMoveFieldDown', () => {
        it('creates an action that will move a field Down', () => {
            expect(formActions.keyboardMoveFieldDown('view', 1)).toEqual({
                id: 'view',
                type: types.KEYBOARD_MOVE_FIELD_DOWN,
                content: {
                    location: 1
                }});
        });
    });

    describe('toggleFormBuilderChildrenTabIndex', () => {
        it('creates an action that update formBuilder children tabindex', () => {
            expect(formActions.toggleFormBuilderChildrenTabIndex('view', 1)).toEqual({
                id: 'view',
                type: types.TOGGLE_FORM_BUILDER_CHILDREN_TABINDEX,
                content: {
                    currentTabIndex: 1
                }});
        });
    });
});
