import reducer from '../../src/reducers/forms';
import * as types from '../../src/constants/actions';
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


    let syncFormState = {
        syncLoadedForm: true, // set true after save,
        edit: [],
        view: []
    };
    it('returns correct syncLoadedForm state', () => {
        expect(reducer(syncFormState, {type: types.SYNCING_FORM})).toEqual({syncLoadedForm: false, edit:[], view:[]});
    });

    it('returns correct state when loading view form', () => {
        expect(reducer(initialState, {type: types.LOADING_FORM, container:"view"})).toDeepEqual(
            {
                syncLoadedForm: false,
                edit: [],
                view: [{loading: true, errorStatus: null}]
            });
    });

    it('returns correct state when loading edit form', () => {
        expect(reducer(initialState, {type: types.LOADING_FORM, container:"edit"})).toDeepEqual(
            {
                syncLoadedForm: false,
                edit: [{loading: true, errorStatus: null}],
                view: []
            });
    });

    it('returns correct state when container is not edit/view', () => {
        expect(reducer(initialState, {type: types.LOADING_FORM, container:"notViewOrEdit"})).toDeepEqual(
            {
                syncLoadedForm: false,
                edit: [],
                view: [],
                "notViewOrEdit": [{loading: true, errorStatus: null}]
            });
    });

});
