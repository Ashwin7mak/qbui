import * as formActions from '../../src/actions/formActions';
import {loadForm, createForm, updateForm, deleteMarkedFields, deleteDetailFieldUpdateParentForm, __RewireAPI__ as FormActionsRewireAPI} from '../../src/actions/formActions';
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

const mockFieldsActions = {
    saveAllNewFields(_appId, _tableId, formType) {
        return (dispatch) => {
            return Promise.resolve().then(() => (dispatch({type: 'AllFieldsAdded'})));
        };
    },
    updateAllFieldsWithEdits(_appId, _tableId) {
        return (dispatch) => {
            return Promise.resolve().then(() => (dispatch({type: 'AllFieldsUpdated'})));
        };
    },
    deleteMarkedFields(_appId, _formMeta) {
        return (dispatch) => {
            return Promise.resolve().then(() => (dispatch({type: 'AllFieldsDeleted'})));
        };
    }
};

const mockTableActions = {
    udpateTable(_appId, _tableId, table) {
        return (dispatch) => {
            return Promise.resolve().then(() => (dispatch({type: 'TableUpdated'})));
        };
    }
};

// we mock the Redux store when testing async action creators
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

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

            expect(formActions.syncForm("view", 123)).toEqual({type: types.SYNC_FORM, id: "view", recordId: 123});
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
        let formResponseData = {
            formId: 1,
            tableId: "table1",
            appId: "app1",
            recordId: "newRecordId",
            formMeta: {},
            fields: []
        };

        let formAndRecordResponseData = {
            formId: 2,
            tableId: "table2",
            appId: "app2",
            formMeta: {},
            fields: []
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
                        recordId: '123',
                        formMeta: {},
                        fields: []
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
                        record: null,
                        formMeta: {},
                        fields: []
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

        const expectedSaveActions = [
            {id:'view', type:types.SAVING_FORM, content: null},
            {type: 'AllFieldsAdded'},
            {type: 'AllFieldsUpdated'},
            {type: 'AllFieldsDeleted'},
            {id: 'view', type: types.SAVING_FORM_SUCCESS, content: formData.formMeta}
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
            FormActionsRewireAPI.__Rewire__('TableActions', mockTableActions);

            spyOn(mockFieldsActions, 'saveAllNewFields').and.callThrough();
            spyOn(mockFieldsActions, 'updateAllFieldsWithEdits').and.callThrough();
            spyOn(mockFieldsActions, 'deleteMarkedFields').and.callThrough();
            spyOn(mockTableActions, 'updateTable').and.callThrough();
            FormActionsRewireAPI.__Rewire__('saveAllNewFields', mockFieldsActions.saveAllNewFields);
            FormActionsRewireAPI.__Rewire__('updateAllFieldsWithEdits', mockFieldsActions.updateAllFieldsWithEdits);
            FormActionsRewireAPI.__Rewire__('deleteMarkedFields', mockFieldsActions.deleteMarkedFields);
            FormActionsRewireAPI.__Rewire__('updateTable', mockTableActions.updateTable);
        });

        afterEach(() => {
            FormActionsRewireAPI.__ResetDependency__('FormService');
            FormActionsRewireAPI.__ResetDependency__('convertFormToArrayForClient');
            FormActionsRewireAPI.__ResetDependency__('saveAllNewFields');
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

        it('saves new fields added to the form', (done) => {
            const appId = 'appId';
            const tableId = 'tableId';
            const formType = 'view';

            const store = mockStore({});

            return store.dispatch(updateForm(appId, tableId, formType, formData)).then(
                () => {
                    expect(mockFieldsActions.saveAllNewFields).toHaveBeenCalledWith(appId, tableId, formType);
                    done();
                },
                () => {
                    expect(false).toBe(true);
                    done();
                }
            );
        });

        it('saves existing fields that were edited on the form', (done) => {
            const appId = 'appId';
            const tableId = 'tableId';
            const formType = 'view';

            const store = mockStore({});

            return store.dispatch(updateForm(appId, tableId, formType, formData)).then(
                () => {
                    expect(mockFieldsActions.updateAllFieldsWithEdits).toHaveBeenCalledWith(appId, tableId);
                    done();
                },
                () => {
                    expect(false).toBe(true);
                    done();
                }
            );
        });

        it('deletes fields marked for deletion on the form', (done) => {
            const appId = 'appId';
            const tableId = 'tableId';
            const formType = 'view';

            const store = mockStore({});

            return store.dispatch(updateForm(appId, tableId, formType, formData)).then(
                () => {
                    expect(mockFieldsActions.deleteMarkedFields).toHaveBeenCalledWith(appId, tableId, formData);
                    done();
                },
                () => {
                    expect(false).toBe(true);
                    done();
                }
            );
        });
    });

    describe('transforms data appropriately', () => {
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

            store.dispatch(createForm("appId", "tblId", "view", formData)).then(
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
    describe('addFieldToForm', () => {
        it('creates an action that will add a new field when no field id is passed in', () => {
            const testNewField = {field: 'mockFieldData'};
            expect(formActions.addFieldToForm('view', 1, 2, 3, testNewField)).toEqual({
                id: 'view',
                type: types.ADD_FIELD,
                appId: 1,
                tblId: 2,
                content: {
                    newLocation: 3,
                    field:  {
                        id: 'newField_1',
                        edit: true,
                        field: 'mockFieldData',
                        FormFieldElement: {
                            positionSameRow: false,
                            fieldId: 'newField_1'
                        },
                    }
                },
            });
        });

        it('will build an existing field with the existing field id passed in', () => {
            const testNewField = {id: 'existingField_Id', field: 'mockFieldData'};
            expect(formActions.addFieldToForm('view', 1, 2, 3, testNewField)).toEqual({
                id: 'view',
                type: types.ADD_FIELD,
                appId: 1,
                tblId: 2,
                content: {
                    newLocation: 3,
                    field:  {
                        id: 'existingField_Id',
                        edit: true,
                        field: 'mockFieldData',
                        FormFieldElement: {
                            positionSameRow: false,
                            fieldId: 'existingField_Id'
                        },
                    }
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
            expect(formActions.removeFieldFromForm('view', 'appId', 'tblId', {id: 6}, 1)).toEqual({
                id: 'view',
                type: types.REMOVE_FIELD,
                appId: 'appId',
                tblId: 'tblId',
                field: {id: 6},
                location: 1
            });
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

    describe('toggleToolPaletteChildrenTabIndex', () => {
        it('creates an action that update toolPalette children tabindex', () => {
            expect(formActions.toggleToolPaletteChildrenTabIndex('view', 1)).toEqual({
                id: 'view',
                type: types.TOGGLE_TOOL_PALETTE_BUILDER_CHILDREN_TABINDEX,
                content: {
                    currentTabIndex: 1
                }});
        });
    });

    describe('endDraggingState', () => {
        it('creates an action that update updates the dragging state to false', () => {
            expect(formActions.endDraggingState('view')).toEqual({
                id: 'view',
                type: types.END_DRAG,
                content: null});
        });
    });

    describe('isInDraggingState', () => {
        it('creates an action that updates dragging state to true', () => {
            expect(formActions.isInDraggingState('view')).toEqual({
                id: 'view',
                type: types.IS_DRAGGING,
                content: null});
        });
    });

    describe('setFormBuilderPendingEditToFalse', () => {
        it('creates an action that sets isPendingEdit to false', () => {
            expect(formActions.setFormBuilderPendingEditToFalse('view')).toEqual({
                id: 'view',
                type: types.SET_IS_PENDING_EDIT_TO_FALSE,
                content: null});
        });
    });

    describe('deleteDetailFieldUpdateParentForm', () => {
        const testDeleteFieldAction = {type: 'deleteField'};
        let removeRelationship;

        const childTableId = 2;
        const fieldId = 3;

        const testFormMetaWithRelationship = {
            relationships: [
                {
                    detailTableId: childTableId,
                    detailFieldId: fieldId
                }
            ]
        };

        beforeEach(() => {
            removeRelationship = jasmine.createSpy('removeRelationship');
            FormActionsRewireAPI.__Rewire__('deleteField', () => dispatch => dispatch(testDeleteFieldAction));
            FormActionsRewireAPI.__Rewire__('removeRelationshipFromForm', removeRelationship);
        });

        afterEach(() => {
            FormActionsRewireAPI.__ResetDependency__('deleteField');
            FormActionsRewireAPI.__ResetDependency__('removeRelationshipFromForm');
        });

        it('deletes a field from the form', (done) => {
            const store = mockStore({});

            store.dispatch(deleteDetailFieldUpdateParentForm(1, 2, 3, {})).then(() => {
                // the delete action should be called once for the field
                expect(store.getActions()).toEqual([testDeleteFieldAction]);
                expect(removeRelationship).not.toHaveBeenCalled();
                done();
            }).catch(() => {
                expect(false).toBe(true);
                done();
            });
        });

        it('removes any relationships form the form for the currently deleted field', (done) => {
            const store = mockStore({});

            removeRelationship.and.callFake(() => Promise.resolve());

            store.dispatch(deleteDetailFieldUpdateParentForm(1, childTableId, fieldId, testFormMetaWithRelationship)).then(() => {
                expect(store.getActions()).toEqual([testDeleteFieldAction]);
                expect(removeRelationship).toHaveBeenCalled();
                done();
            }).catch(() => {
                expect(false).toBe(true);
                done();
            });
        });

        it('handles an error response when trying to remove a relationships', () => {
            const store = mockStore({});

            removeRelationship.and.callFake(() => Promise.reject());

            store.dispatch(deleteDetailFieldUpdateParentForm(1, childTableId, fieldId, testFormMetaWithRelationship)).then(() => {
                expect(false).toBe(true);
                done();
            }).catch(() => {
                expect(store.getActions()).toEqual([testDeleteFieldAction]);
                expect(removeRelationship).toHaveBeenCalled();
                done();
            });
        });
    });

    describe('deleteMarkedFields', () => {
        const testDeleteDetailFieldAction = {type: 'deleteDetailField'};
        beforeEach(() => {
            FormActionsRewireAPI.__Rewire__('deleteDetailFieldUpdateParentForm', () => dispatch => dispatch(testDeleteDetailFieldAction));
        });

        afterEach(() => {
            FormActionsRewireAPI.__ResetDependency__('deleteDetailFieldUpdateParentForm');
        });

        it('deletes any fields currently marked for deletion on the form', (done) => {
            const formMeta = {fieldsToDelete: [1, 2]};
            const store = mockStore({});

            // expects deleteDetailFieldUpdateParentForm to be called for each field in the list
            const expectedActions = [
                testDeleteDetailFieldAction,
                testDeleteDetailFieldAction
            ];

            store.dispatch(deleteMarkedFields(1, 2, formMeta)).then(() => {
                expect(store.getActions()).toEqual(expectedActions);
                done();
            }).catch(() => {
                expect(false).toBe(true);
                done();
            });
        });

        it('resolves the promise without calling additional actions if there are no fields to delete', (done) => {
            const formMeta = {fieldsToDelete: []};
            const store = mockStore({});

            store.dispatch(deleteMarkedFields(1, 2, formMeta)).then(() => {
                expect(store.getActions()).toEqual([]);
                done();
            }).catch(() => {
                expect(false).toBe(true);
                done();
            });
        });
    });
});
