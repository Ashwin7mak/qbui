import reducer, {__RewireAPI__ as ReducerRewireAPI} from '../../src/reducers/forms';
import * as tabIndexConstants from '../../../client-react/src/components/formBuilder/tabindexConstants';
import * as types from '../../src/actions/types';
import _ from 'lodash';

describe('Forms reducer functions', () => {

    // add deepCompare matcher to properly test equality on nested state objects

    beforeEach(() => {
        jasmine.addMatchers({
            toDeepEqual: () => {
                return {
                    compare: (actual, expected) => {
                        return {pass: _.isEqual(actual, expected)};
                    }
                };
            }
        });
    });

    let initialState = {};

    let stateWithViewForm = {
        'view': {
            id: 'view',
            formData: {formMeta: 'some meta data'}
        }
    };

    let stateWithEditForm = {
        'edit': {
            id: 'edit',
            formData: {formMeta: 'some meta data'}
        }
    };

    const updatedFormMeta = 'updated form meta';

    it('returns correct initial state', () => {
        expect(reducer(undefined, {})).toEqual(initialState);
    });


    describe('Sync form changes functions', () => {
        let syncFormState = {
            'view': {
                id:'view',
                syncLoadedForm: false,
                formData: 'someData'
            }
        };

        it('returns correct syncLoadedForm state', () => {
            expect(reducer(syncFormState, {id:'view', type: types.SYNC_FORM})).toEqual({
                'view': {
                    id:'view',
                    syncLoadedForm: true,
                    formData:'someData'
                }
            });
        });
    });


    describe('Loading form functions', () => {
        it('returns correct state when loading view form', () => {
            expect(reducer(initialState, {type: types.LOADING_FORM, id: 'view'})).toDeepEqual({
                'view': {
                    id: 'view',
                    syncLoadedForm: false,
                    loading: true,
                    errorStatus: null
                }
            });
        });

        it('returns correct state when load error occurs', () => {
            let loadingFormState = {
                'view': {
                    id: 'view',
                    loading: true,
                    errorStatus: null
                }
            };
            expect(reducer(loadingFormState, {type: types.LOAD_FORM_ERROR, id: "view", error: "oops"})).toDeepEqual({
                'view': {
                    id: 'view',
                    loading: false,
                    errorStatus: "oops"
                }
            });
        });
        it('returns correct state when load succeeds', () => {
            let currentAppId = 'appId';
            let currentblId = 'tblId';
            let formData = {formMeta: {appId: currentAppId, tableId: currentblId}};
            /**
             * This test checks to be sure the actual appId and tblId from the response are
             * the ones being used. So here I made the backup id's different for testing purposes.
             * */
            let backUpAppId = 'banana';
            let backUpTblId = 'apple';
            let loadingFormState = {
                'view': {
                    id: 'view',
                    loading: true,
                    errorStatus: null
                }
            };
            expect(reducer(loadingFormState, {type: types.LOAD_FORM_SUCCESS, id: "view", formData: formData, appId: backUpAppId, tblId: backUpTblId})).toDeepEqual({
                'view': {
                    id: 'view',
                    loading: false,
                    formData: {formMeta: {appId: currentAppId, tableId: currentblId}},
                    errorStatus: null
                }
            });
        });

        it('returns correct appId and tableId if they are missing', () => {
            let formData = {formMeta: {appId: null, tableId: null}};
            let backUpAppId = 'banana';
            let backUpTblId = 'apple';
            let loadingFormState = {
                'view': {
                    id: 'view',
                    loading: true,
                    errorStatus: null
                }
            };

            expect(reducer(loadingFormState, {type: types.LOAD_FORM_SUCCESS, id: "view", formData: formData, appId: backUpAppId, tblId: backUpTblId})).toDeepEqual({
                'view': {
                    id: 'view',
                    loading: false,
                    formData: {formMeta: {appId: backUpAppId, tableId: backUpTblId}},
                    errorStatus: null
                }
            });
        });

    });

    let VIEW = 'view';
    describe('Save form functions', () => {
        let savingFormState = {
            [VIEW]: {
                id: VIEW,
                saving: true,
                errorStatus: null
            }
        };

        it('returns correct state when saving a form', () => {
            savingFormState[VIEW].saving = true;
            expect(reducer(initialState, {id: VIEW, type: types.SAVE_FORM})).toDeepEqual(savingFormState);
        });

        it('returns correct state when saving a form is complete', () => {
            savingFormState[VIEW].saving = false;
            expect(reducer(initialState, {id: VIEW, type: types.SAVE_FORM_COMPLETE})).toDeepEqual(savingFormState);
        });
    });

    describe('moving a field', () => {
        const mockMoveFieldHelper = {
            moveField(_formMeta, newTabIndex, newSectionIndex, newOrderIndex, draggedItemProps) {return updatedFormMeta;}
        };

        const actionPayload = {
            id: VIEW,
            type: types.MOVE_FIELD,
            content: {
                newLocation: 1,
                draggedItemProps: 2
            }
        };

        beforeEach(() => {
            spyOn(mockMoveFieldHelper, 'moveField').and.callThrough();
            ReducerRewireAPI.__Rewire__('MoveFieldHelper', mockMoveFieldHelper);
        });

        afterEach(() => {
            ReducerRewireAPI.__ResetDependency__('MoveFieldHelper');
        });

        it('returns a new state with the field in the new position', () => {
            expect(reducer(stateWithViewForm, actionPayload)).toEqual({
                [VIEW]: {
                    ...stateWithViewForm[VIEW],
                    formData: {formMeta: updatedFormMeta},
                    selectedFields: [1],
                    isPendingEdit: true,
                    previouslySelectedField: []
                }
            });

            expect(mockMoveFieldHelper.moveField).toHaveBeenCalledWith(
                stateWithViewForm[VIEW].formData.formMeta, 1, 2
            );
        });

        it('returns existing state if there is no current form', () => {
            expect(reducer(stateWithEditForm, actionPayload)).toEqual(stateWithEditForm);

            expect(mockMoveFieldHelper.moveField).not.toHaveBeenCalled();
        });
    });

    describe('removing a field', () => {
        const mockMoveFieldHelper = {
            removeField(_formMeta, location) {return updatedFormMeta;}
        };

        const actionPayload = {
            id: VIEW,
            type: types.REMOVE_FIELD,
            content: {
                location: 1,
            }
        };

        beforeEach(() => {
            spyOn(mockMoveFieldHelper, 'removeField').and.callThrough();
            ReducerRewireAPI.__Rewire__('MoveFieldHelper', mockMoveFieldHelper);
        });

        afterEach(() => {
            ReducerRewireAPI.__ResetDependency__('MoveFieldHelper');
        });

        it('returns a new state with a single field removed', () => {
            expect(reducer(stateWithViewForm, actionPayload)).toEqual({
                [VIEW]: {
                    ...stateWithViewForm[VIEW],
                    formData: {formMeta: updatedFormMeta},
                    isPendingEdit: true,
                }
            });
            expect(mockMoveFieldHelper.removeField).toHaveBeenCalledWith(
                stateWithViewForm[VIEW].formData.formMeta, 1
            );
        });

        it('returns existing state if there is no current form', () => {
            expect(reducer(stateWithEditForm, actionPayload)).toEqual(stateWithEditForm);

            expect(mockMoveFieldHelper.removeField).not.toHaveBeenCalled();
        });
    });

    describe('adding a field', () => {
        const stateForAddingField = {
            'view': {
                id: 'view',
                formData: {formMeta: {tabs: [{sections: [{columns: [{elements: []}]}]}]}}
            }
        };
        const mockMoveFieldHelper = {
            addNewFieldToForm(_formMeta, _location, _field) {return updatedFormMeta;}
        };

        const actionPayload = {
            id: VIEW,
            type: types.ADD_FIELD,
            content: {
                newLocation: 1,
                newField: {}
            }
        };

        beforeEach(() => {
            spyOn(mockMoveFieldHelper, 'addNewFieldToForm').and.callThrough();
            ReducerRewireAPI.__Rewire__('MoveFieldHelper', mockMoveFieldHelper);
        });

        afterEach(() => {
            ReducerRewireAPI.__ResetDependency__('MoveFieldHelper');
        });

        it('returns a new state with a single field added', () => {
            expect(reducer(stateForAddingField, actionPayload)).toEqual({
                [VIEW]: {
                    ...stateForAddingField[VIEW],
                    selectedFields: [1],
                    previouslySelectedField: [],
                    formData: {formMeta: updatedFormMeta},
                    isPendingEdit: true

                },
            });
            expect(mockMoveFieldHelper.addNewFieldToForm).toHaveBeenCalledWith(
                stateForAddingField[VIEW].formData.formMeta, 1, {}
            );
        });

        it('returns existing state if there is no current form', () => {
            expect(reducer(stateWithEditForm, actionPayload)).toEqual(stateWithEditForm);

            expect(mockMoveFieldHelper.addNewFieldToForm).not.toHaveBeenCalled();
        });
    });

    describe('select a field', () => {
        const testFormMeta = 'some meta data';

        const actionPayload = {
            id: VIEW,
            type: types.SELECT_FIELD,
            content: {
                location: 1,
            }
        };

        it('returns a new state with a field selected', () => {
            expect(reducer(stateWithViewForm, actionPayload)).toEqual({
                [VIEW]: {
                    ...stateWithViewForm[VIEW],
                    formData: {formMeta: testFormMeta},
                    selectedFields: [1],
                    previouslySelectedField: undefined
                }
            });
        });

        it('returns existing state if there is no current form', () => {
            expect(reducer(stateWithEditForm, actionPayload)).toEqual(stateWithEditForm);
        });

    });

    describe('(keyboard) move a field up', () => {
        const mockMoveFieldHelper = {
            keyBoardMoveFieldUp(_formMeta, _location) {return updatedFormMeta;},
            updateSelectedFieldLocation(_location, _Updatedlocation) {return updatedFormMeta;}
        };

        const actionPayload = {
            id: VIEW,
            type: types.KEYBOARD_MOVE_FIELD_UP,
            content: {
                location: 1
            }
        };

        beforeEach(() => {
            spyOn(mockMoveFieldHelper, 'keyBoardMoveFieldUp').and.callThrough();
            spyOn(mockMoveFieldHelper, 'updateSelectedFieldLocation').and.callThrough();
            ReducerRewireAPI.__Rewire__('MoveFieldHelper', mockMoveFieldHelper);
        });

        afterEach(() => {
            ReducerRewireAPI.__ResetDependency__('MoveFieldHelper');
        });

        it('returns a new state with the field in the new position', () => {
            expect(reducer(stateWithViewForm, actionPayload)).toEqual({
                [VIEW]: {
                    ...stateWithViewForm[VIEW],
                    formData: {formMeta: updatedFormMeta},
                    selectedFields: [updatedFormMeta],
                    isPendingEdit: true
                }
            });
            expect(mockMoveFieldHelper.keyBoardMoveFieldUp).toHaveBeenCalledWith(
                stateWithViewForm[VIEW].formData.formMeta, 1
            );
            expect(mockMoveFieldHelper.updateSelectedFieldLocation).toHaveBeenCalledWith(
                1, -1
            );
        });

        it('returns existing state if there is no current form', () => {
            expect(reducer(stateWithEditForm, actionPayload)).toEqual(stateWithEditForm);

            expect(mockMoveFieldHelper.keyBoardMoveFieldUp).not.toHaveBeenCalled();
            expect(mockMoveFieldHelper.updateSelectedFieldLocation).not.toHaveBeenCalled();
        });
    });

    describe('(keyboard) move a field down', () => {
        const mockMoveFieldHelper = {
            keyBoardMoveFieldDown(_formMeta, _location) {return updatedFormMeta;},
            updateSelectedFieldLocation(_location, _updatedLocation) {return updatedFormMeta;}
        };

        const actionPayload = {
            id: VIEW,
            type: types.KEYBOARD_MOVE_FIELD_DOWN,
            content: {
                location: 1
            }
        };

        beforeEach(() => {
            spyOn(mockMoveFieldHelper, 'keyBoardMoveFieldDown').and.callThrough();
            spyOn(mockMoveFieldHelper, 'updateSelectedFieldLocation').and.callThrough();
            ReducerRewireAPI.__Rewire__('MoveFieldHelper', mockMoveFieldHelper);
        });

        afterEach(() => {
            ReducerRewireAPI.__ResetDependency__('MoveFieldHelper');
        });

        it('returns a new state with the field in the new position', () => {
            expect(reducer(stateWithViewForm, actionPayload)).toEqual({
                [VIEW]: {
                    ...stateWithViewForm[VIEW],
                    formData: {formMeta: updatedFormMeta},
                    selectedFields: [updatedFormMeta],
                    isPendingEdit: true
                }
            });
            expect(mockMoveFieldHelper.keyBoardMoveFieldDown).toHaveBeenCalledWith(
                stateWithViewForm[VIEW].formData.formMeta, 1
            );
            expect(mockMoveFieldHelper.updateSelectedFieldLocation).toHaveBeenCalledWith(
                1, 1
            );
        });

        it('returns existing state if there is no current form', () => {
            expect(reducer(stateWithEditForm, actionPayload)).toEqual(stateWithEditForm);

            expect(mockMoveFieldHelper.keyBoardMoveFieldDown).not.toHaveBeenCalled();
            expect(mockMoveFieldHelper.updateSelectedFieldLocation).not.toHaveBeenCalled();
        });
    });

    describe('toggle formBuilder children tab index', () => {
        const testFormMeta = 'some meta data';

        const actionPayload = {
            id: VIEW,
            type: types.TOGGLE_FORM_BUILDER_CHILDREN_TABINDEX,
            content: {
                currentTabIndex: '-1',
            }
        };

        it('returns a new state with a tabindex toggled', () => {
            expect(reducer(stateWithViewForm, actionPayload)).toEqual({
                [VIEW]: {
                    ...stateWithViewForm[VIEW],
                    formData: {formMeta: testFormMeta},
                    formBuilderChildrenTabIndex: [tabIndexConstants.FORM_TAB_INDEX],
                    toolPaletteChildrenTabIndex: ['-1'],
                    formFocus: [false],
                    toolPaletteFocus: [false]
                }
            });
        });

        it('returns existing state if there is no current form', () => {
            expect(reducer(stateWithEditForm, actionPayload)).toEqual(stateWithEditForm);
        });

    });

    describe('toggle toolPalette children tab index', () => {
        const testFormMeta = 'some meta data';

        const actionPayload = {
            id: VIEW,
            type: types.TOGGLE_TOOL_PALETTE_BUILDER_CHILDREN_TABINDEX,
            content: {
                currentTabIndex: '-1',
            }
        };

        it('returns a new state with a tabindex toggled', () => {
            expect(reducer(stateWithViewForm, actionPayload)).toEqual({
                [VIEW]: {
                    ...stateWithViewForm[VIEW],
                    formData: {formMeta: testFormMeta},
                    toolPaletteChildrenTabIndex: [tabIndexConstants.TOOL_PALETTE_TABINDEX],
                    formBuilderChildrenTabIndex: ['-1'],
                    formFocus: [false],
                    toolPaletteFocus: [false]
                }
            });
        });

        it('returns existing state if there is no current form', () => {
            expect(reducer(stateWithEditForm, actionPayload)).toEqual(stateWithEditForm);
        });

    });

    describe('isDragging state', () => {
        const testFormMeta = 'some meta data';

        const actionPayload = {
            id: VIEW,
            type: types.IS_DRAGGING,
            content: null
        };

        it('returns a new state with isDragging set to true', () => {
            expect(reducer(stateWithViewForm, actionPayload)).toEqual({
                [VIEW]: {
                    ...stateWithViewForm[VIEW],
                    formData: {formMeta: testFormMeta},
                    isDragging: true
                }
            });
        });

        it('returns existing state if there is no current form', () => {
            expect(reducer(stateWithEditForm, actionPayload)).toEqual(stateWithEditForm);
        });

    });

    describe('endDragging state', () => {
        const testFormMeta = 'some meta data';

        const actionPayload = {
            id: VIEW,
            type: types.END_DRAG,
            content: null
        };

        it('returns a new state with endDragging set to false', () => {
            expect(reducer(stateWithViewForm, actionPayload)).toEqual({
                [VIEW]: {
                    ...stateWithViewForm[VIEW],
                    formData: {formMeta: testFormMeta},
                    isDragging: false
                }
            });
        });

        it('returns existing state if there is no current form', () => {
            expect(reducer(stateWithEditForm, actionPayload)).toEqual(stateWithEditForm);
        });

    });

    describe('sets isPendingEdits to false', () => {
        const testFormMeta = 'some meta data';

        const actionPayload = {
            id: VIEW,
            type: types.SET_IS_PENDING_EDIT_TO_FALSE,
            content: null
        };

        it('returns a new state with isPending edit set to false', () => {
            expect(reducer(stateWithViewForm, actionPayload)).toEqual({
                [VIEW]: {
                    ...stateWithViewForm[VIEW],
                    formData: {formMeta: testFormMeta},
                    isPendingEdit: false
                }
            });
        });

        it('returns existing state if there is no current form', () => {
            expect(reducer(stateWithEditForm, actionPayload)).toEqual(stateWithEditForm);
        });

    });
});
