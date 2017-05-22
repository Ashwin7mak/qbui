import reducer, {__RewireAPI__ as ReducerRewireAPI} from '../../src/reducers/automation';
import * as types from '../../src/actions/types';
import FacetSelections from '../../src/components/facet/facetSelections';
import _ from 'lodash';
import {UNSAVED_RECORD_ID} from '../../src/constants/schema';
import {NEW_RECORD_VALUE} from '../../src/constants/urlConstants';
import Diff from 'deep-diff';


/**
 * Unit tests for automation reducer
 *
 */
describe('Automation reducer functions', () => {


    describe('Automation reducer initialize', () => {
        it('returns correct initial state empty action', () => {
            let resultState = reducer(undefined, {});
            expect(resultState).toEqual({appId: ''});
        });

        it('returns correct initial state on non-automation action', () => {
            let resultState = reducer(undefined, {type: types.CHANGE_LOCALE, id: 10});
            expect(resultState).toEqual({appId: ''});
        });

        it('returns correct initial state on automation action', () => {
            let resultState = reducer(undefined, {type: types.LOAD_AUTOMATIONS, id: 10, content: {appId: 'TEST'}});
            expect(resultState).toEqual({appId: 'TEST'});
        });
    });

    describe('Automation reducer transitions', () => {
        let state = {appId: 'TEST'};

        it('returns correct initial state empty action', () => {
            let resultState = reducer(state, {});
            expect(resultState).toEqual({appId: 'TEST'});
        });

        it('returns correct initial state on automation action', () => {
            let resultState = reducer(state, {type: types.LOAD_AUTOMATIONS_SUCCESS, id: 10, content: {appId: 'TEST', automationsList: [{name: 'Auto 1'}]}});
            expect(resultState).toEqual({appId: 'TEST', list: [{name: 'Auto 1'}], error: false, errorDetails: null});
        });

        it('returns correct initial state on automation action', () => {
            let resultState = reducer(state, {type: types.LOAD_AUTOMATIONS_FAILED, id: 10, content: {message: 'error'}});
            expect(resultState).toEqual({appId: 'TEST', list: null, error: true, errorDetails: {message: 'error'}});
        });
    });



});
