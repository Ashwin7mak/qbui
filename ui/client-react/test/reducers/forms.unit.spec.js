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

    describe('Loading form functions', () => {
        it('returns correct state when loading view form', () => {
            expect(reducer(initialState, {type: types.LOADING_FORM, id: 'view'})).toDeepEqual([{
                id: 'view',
                syncLoadedForm: false,
                loading: true,
                errorStatus: null
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

    let VIEW = 'view';
    describe('Save form functions', () => {
        let savingFormState = [{
            id: VIEW,
            saving: true,
            errorStatus: null
        }];

        it('returns correct state when saving a form', () => {
            savingFormState[0].saving = true;
            expect(reducer(initialState, {id: VIEW, type: types.SAVE_FORM})).toDeepEqual(savingFormState);
        });

        it('returns correct state when saving a form is complete', () => {
            savingFormState[0].saving = false;
            expect(reducer(initialState, {id: VIEW, type: types.SAVE_FORM_COMPLETE})).toDeepEqual(savingFormState);
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
                selectedFields: [1]
            }]);
        });

        it('returns existing state if there is no current form', () => {
            expect(reducer(stateWithEditForm, actionPayload)).toEqual(stateWithEditForm);
        });

    });
});
