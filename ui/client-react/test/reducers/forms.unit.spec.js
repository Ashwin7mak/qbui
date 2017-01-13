import reducer from '../../src/reducers/forms';
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
                formData:'someData',
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
});
