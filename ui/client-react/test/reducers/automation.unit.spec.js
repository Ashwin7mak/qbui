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
            expect(resultState).toEqual({appId: null, list: null, error: undefined});
        });

        it('returns correct initial state on non-automation action', () => {
            let resultState = reducer(undefined, {type: types.CHANGE_LOCALE, id: 10});
            expect(resultState).toEqual({appId: null, list: null, error: undefined});
        });

        it('returns correct initial state on automation action', () => {
            let resultState = reducer(undefined, {type: types.LOAD_AUTOMATIONS, id: 10, content: 'TEST'});
            expect(resultState).toEqual({appId: 'TEST', list: null, error: undefined});
        });
    });

    describe('Automation reducer transitions', () => {
        let state = {appId: 'TEST'};

        it('returns correct initial state empty action', () => {
            let resultState = reducer(state, {});
            expect(resultState).toEqual({appId: 'TEST'});
        });

        it('returns correct initial state on load automations action', () => {
            let resultState = reducer(state, {type: types.LOAD_AUTOMATIONS_SUCCESS, id: 10, content: [{name: 'Auto 1'}]});
            expect(resultState).toEqual({appId: 'TEST', list: [{name: 'Auto 1'}], error: undefined});
        });

        it('returns correct initial state on load automations action failed', () => {
            let resultState = reducer(state, {type: types.LOAD_AUTOMATIONS_FAILED, id: 10, content: {message: 'error'}});
            expect(resultState).toEqual({appId: 'TEST', list: null, error: {message: 'error'}});
        });

        it('returns correct initial state on load automation action', () => {
            let resultState = reducer(state, {type: types.LOAD_AUTOMATION_SUCCESS, id: 10, content: {id: 'auto1', name: 'Auto 1', active: true, type: "EMAIL"}});
            expect(resultState).toEqual({appId: 'TEST', automation: {id: 'auto1', name: 'Auto 1', active: true, type: "EMAIL"}, error: undefined});
        });

    });



});
