import reducer, {__RewireAPI__ as ReducerRewireAPI} from '../../src/reducers/forms';
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

    let initialState = [];

    let stateWithViewForm = [{
        id: 'view',
        formData: {formMeta: 'some meta data'}
    }];

    let stateWithEditForm = [{
        id: 'edit',
        formData: {formMeta: 'some meta data'}
    }];

    it('returns correct initial state', () => {
        expect(reducer(undefined, {})).toEqual(initialState);
    });


    describe('Sync form changes functions', () => {
        let syncFormState = [{
            id:'view',
            syncLoadedForm: false,
            formData: 'someData'
        }];

        it('returns correct syncLoadedForm state', () => {
            expect(reducer(syncFormState, {id:'view', type: types.SYNC_FORM})).toEqual([{
                id:'view',
                syncLoadedForm: true,
                formData:'someData'
            }]);
        });
    });

    describe('Loading form functions', () => {
        it('returns correct state when loading view form', () => {
            expect(reducer(initialState, {type: types.LOADING_FORM, id: 'view'})).toDeepEqual([{
                id: 'view',
                syncLoadedForm: false,
                loading: true,
                errorStatus: null
            }]);
        });

        it('returns correct state when load error occurs', () => {
            let loadingFormState = [{
                id: 'view',
                loading: true,
                errorStatus: null
            }];

            expect(reducer(loadingFormState, {type: types.LOAD_FORM_ERROR, id: "view", error: "oops"})).toDeepEqual([{
                id: 'view',
                loading: false,
                errorStatus: "oops"
            }]);
        });

        it('returns correct state when load succeeds', () => {
            let loadingFormState = [{
                id: 'view',
                loading: true,
                errorStatus: null
            }];

            expect(reducer(loadingFormState, {type: types.LOAD_FORM_SUCCESS, id: "view", formData: "someData"})).toDeepEqual([{
                id: 'view',
                loading: false,
                formData: "someData",
                errorStatus:null
            }]);
        });

    });

    describe('Saving form functions', () => {
        it('returns correct state when saving form', () => {
            expect(reducer(initialState, {type: types.SAVE_FORM, id: 'edit'})).toDeepEqual([{
                id: 'edit',
                saving: true,
                errorStatus: null
            }]);
        });

        it('returns correct state when save error occurs', () => {
            let savingFormState = [{
                id: 'edit',
                saving: true,
                errorStatus: null
            }];

            expect(reducer(savingFormState, {type: types.SAVE_FORM_FAILED, id: "edit", error: "oops"})).toDeepEqual([{
                id: 'edit',
                saving: false,
                errorStatus: "oops"
            }]);
        });

        it('returns correct state when save succeeds', () => {
            let savingFormState = [{
                id: 'edit',
                saving: true,
                errorStatus: null
            }];

            expect(reducer(savingFormState, {type: types.SAVE_FORM_SUCCESS, id: "edit"})).toDeepEqual([{
                id: 'edit',
                saving: false,
                errorStatus:null
            }]);
        });
    });

    let VIEW = 'view';
    describe('Update form functions', () => {
        let savingFormState = [{
            id: VIEW,
            saving: true,
            errorStatus: null
        }];

        it('returns correct state when creating/updating a form', () => {
            expect(reducer(initialState, {id: VIEW, type: types.SAVING_FORM})).toDeepEqual(savingFormState);
        });

        it('returns correct state when creating/updating a form error occurs', () => {
            expect(reducer(savingFormState, {id: VIEW, type: types.SAVING_FORM_ERROR, content: 'bah'})).toDeepEqual([{
                id: VIEW,
                saving: false,
                errorStatus: 'bah'
            }]);
        });

        it('returns correct state when creating/updating a form succeeds', () => {
            expect(reducer(savingFormState, {id: VIEW, type: types.SAVING_FORM_SUCCESS, content:'data'})).toDeepEqual([{
                id: VIEW,
                saving: false,
                errorStatus: null,
                formData: {
                    formMeta: 'data'
                }
            }]);
        });
    });

    describe('moving a field', () => {
        const updatedFormMeta = 'updated form meta';
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
            expect(reducer(stateWithViewForm, actionPayload)).toEqual([{
                ...stateWithViewForm[0],
                formData: {formMeta: updatedFormMeta}
            }]);
            expect(mockMoveFieldHelper.moveField).toHaveBeenCalledWith(
                stateWithViewForm[0].formData.formMeta, 1, 2
            );
        });

        it('returns existing state if there is no current form', () => {
            expect(reducer(stateWithEditForm, actionPayload)).toEqual(stateWithEditForm);

            expect(mockMoveFieldHelper.moveField).not.toHaveBeenCalled();
        });
    });

    describe('removing a field', () => {
        const updatedFormMeta = 'updated form meta';
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
            expect(reducer(stateWithViewForm, actionPayload)).toEqual([{
                ...stateWithViewForm[0],
                formData: {formMeta: updatedFormMeta}
            }]);
            expect(mockMoveFieldHelper.removeField).toHaveBeenCalledWith(
                stateWithViewForm[0].formData.formMeta, 1
            );
        });

        it('returns existing state if there is no current form', () => {
            expect(reducer(stateWithEditForm, actionPayload)).toEqual(stateWithEditForm);

            expect(mockMoveFieldHelper.removeField).not.toHaveBeenCalled();
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
            expect(reducer(stateWithViewForm, actionPayload)).toEqual([{
                ...stateWithViewForm[0],
                formData: {formMeta: testFormMeta},
                selectedFields: [1],
                previouslySelectedField: undefined
            }]);
        });

        it('returns existing state if there is no current form', () => {
            expect(reducer(stateWithEditForm, actionPayload)).toEqual(stateWithEditForm);
        });

    });

    describe('(keyboard) move a field up', () => {
        const updatedFormMeta = 'updated form meta';
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
            expect(reducer(stateWithViewForm, actionPayload)).toEqual([{
                ...stateWithViewForm[0],
                formData: {formMeta: updatedFormMeta},
                selectedFields: [updatedFormMeta]
            }]);
            expect(mockMoveFieldHelper.keyBoardMoveFieldUp).toHaveBeenCalledWith(
                stateWithViewForm[0].formData.formMeta, 1
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
        const updatedFormMeta = 'updated form meta';
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
            expect(reducer(stateWithViewForm, actionPayload)).toEqual([{
                ...stateWithViewForm[0],
                formData: {formMeta: updatedFormMeta},
                selectedFields: [updatedFormMeta]
            }]);
            expect(mockMoveFieldHelper.keyBoardMoveFieldDown).toHaveBeenCalledWith(
                stateWithViewForm[0].formData.formMeta, 1
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

    describe('toggle tab index', () => {
        const testFormMeta = 'some meta data';

        const actionPayload = {
            id: VIEW,
            type: types.TOGGLE_FORM_BUILDER_CHILDREN_TABINDEX,
            content: {
                currentTabIndex: '-1',
            }
        };

        it('returns a new state with a tabindex toggled', () => {
            expect(reducer(stateWithViewForm, actionPayload)).toEqual([{
                ...stateWithViewForm[0],
                formData: {formMeta: testFormMeta},
                formBuilderChildrenTabIndex: ['0']
            }]);
        });

        it('returns existing state if there is no current form', () => {
            expect(reducer(stateWithEditForm, actionPayload)).toEqual(stateWithEditForm);
        });

    });
});
