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

    let initialState = {
        syncLoadedForm: false, // set true after save,
        edit: [],
        view: []
    };

    it('returns correct initial state', () => {
        expect(reducer(undefined, {})).toEqual(initialState);
    });


    describe('Sync form changes functions', () => {
        let syncFormState = {
            syncLoadedForm: true, // set true after save,
            edit: [],
            view: []
        };
        it('returns correct syncLoadedForm state', () => {
            expect(reducer(syncFormState, {type: types.SYNCING_FORM})).toEqual({
                syncLoadedForm: false,
                edit: [],
                view: []
            });
        });

    });

    describe('Loading form functions', () => {
        it('returns correct state when loading view form', () => {
            expect(reducer(initialState, {type: types.LOADING_FORM, container: "view"})).toDeepEqual(
                {
                    syncLoadedForm: false,
                    edit: [],
                    view: [{loading: true, errorStatus: null}]
                });
        });

        it('returns correct state when loading edit form', () => {
            expect(reducer(initialState, {type: types.LOADING_FORM, container: "edit"})).toDeepEqual(
                {
                    syncLoadedForm: false,
                    edit: [{loading: true, errorStatus: null}],
                    view: []
                });
        });

        it('returns correct state when container is not edit/view', () => {
            expect(reducer(initialState, {type: types.LOADING_FORM, container: "notViewOrEdit"})).toDeepEqual(
                {
                    syncLoadedForm: false,
                    edit: [],
                    view: [],
                    "notViewOrEdit": [{loading: true, errorStatus: null}]
                });
        });

        it('returns correct state when load error occurs', () => {
            let loadingFormState = {
                syncLoadedForm: false, // set true after save,
                edit: [],
                view: [{loading: true, errorStatus: null}]
            };

            expect(reducer(loadingFormState, {type: types.LOAD_FORM_ERROR, container: "view", error: "oops"})).toDeepEqual(
                {
                    syncLoadedForm: false,
                    edit: [],
                    view: [{loading: false, errorStatus: "oops"}]
                });
        });

        it('returns correct state when load succeeds', () => {
            let loadingFormState = {
                syncLoadedForm: false, // set true after save,
                edit: [],
                view: [{loading: true, errorStatus: null}]
            };

            expect(reducer(loadingFormState, {type: types.LOAD_FORM_SUCCESS, container: "view", formData: "someData"})).toDeepEqual(
                {
                    syncLoadedForm: false,
                    edit: [],
                    view: [{loading: false, formData: "someData", errorStatus:null}]
                });
        });

    });

    describe('Saving form functions', () => {
        it('returns correct state when saving form', () => {
            expect(reducer(initialState, {type: types.SAVE_FORM, container: "edit"})).toDeepEqual(
                {
                    syncLoadedForm: false,
                    edit: [{saving: true, errorStatus: null}],
                    view: []
                });
        });

        it('returns correct state when save error occurs', () => {
            let savingFormState = {
                syncLoadedForm: false, // set true after save,
                edit: [{saving: true, errorStatus: null}],
                view: []
            };

            expect(reducer(savingFormState, {type: types.SAVE_FORM_FAILED, container: "edit", error: "oops"})).toDeepEqual(
                {
                    syncLoadedForm: false,
                    edit: [{saving: false, errorStatus: "oops"}],
                    view: []
                });
        });

        it('returns correct state when save succeeds', () => {
            let savingFormState = {
                syncLoadedForm: false, // set true after save,
                edit: [{saving: true, errorStatus: null}],
                view: []
            };

            expect(reducer(savingFormState, {type: types.SAVE_FORM_SUCCESS, container: "edit"})).toDeepEqual(
                {
                    syncLoadedForm: true,
                    edit: [{saving: false, errorStatus:null}],
                    view: []
                });
        });
    });
});
