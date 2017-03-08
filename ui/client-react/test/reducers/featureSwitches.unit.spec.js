import reducer from '../../src/reducers/featureSwitches';
import * as types from '../../src/actions/types';

let initialState = {};

function initializeState() {
    initialState = {
        switches: [],
        overrides: [],
        states: []
    };
}

beforeEach(() => {
    initializeState();
});

describe('Test feature switches', () => {

    describe('Test initial state of feature switches reducer', () => {
        it('return correct initial state', () => {
            expect(reducer(undefined, {})).toEqual(initialState);
        });
    });

    describe('Test feature switch states', () => {
        it('return updated feature states', () => {
            const states = [{'Feature A': true}];
            const state = reducer(initialState, {type: types.SET_FEATURE_SWITCH_STATES, states});

            states.length = 0; // clear states array, state should not be affected
            expect(state.states).toEqual([{'Feature A': true}]);
        });
    });


    describe('Test feature switches', () => {
        it('return set feature switches', () => {
            const switches = [{name: 'Feature A'}, {name: 'Feature B'}];
            const state = reducer(initialState, {type: types.SET_FEATURE_SWITCHES, switches});

            switches.length = 0;
            expect(state.switches).toEqual([{name: 'Feature A'}, {name: 'Feature B'}]);
        });

        it('return new feature switch', () => {
            const feature = {name: 'Feature A'};
            const state = reducer(initialState, {type: types.CREATED_FEATURE_SWITCH, feature});

            feature.name = null;
            expect(state.switches).toEqual([{name: 'Feature A', overrides: []}]);
        });

        it('return new editing feature switch', () => {
            initialState.switches = [{id: 'id', name: 'Feature A', overrides: []}];
            const state = reducer(initialState, {type: types.EDIT_FEATURE_SWITCH, id: 'id', column: 'name'});

            initialState.switches.length = 0;
            expect(state.switches).toEqual([{name: 'Feature A', id:'id', editing: 'name', overrides: []}]);
        });

        it('return updated feature switch', () => {
            initialState.switches = [{id: 'id', name: 'Feature A', overrides: []}];
            const state = reducer(initialState, {type: types.FEATURE_SWITCH_UPDATED, id: 'id', property: 'name', value: 'newName'});

            initialState.switches.length = 0;
            expect(state.switches).toEqual([{name: 'newName', id:'id', editing: false, overrides: []}]);
        });

        it('return deleted feature switches', () => {
            initialState.switches = [{id: 'id1', name: 'Feature A'}, {id: 'id2', name: 'Feature B'}];
            const state = reducer(initialState, {type: types.FEATURE_SWITCHES_DELETED, ids: ['id1']});

            initialState.switches.length = 0;
            expect(state.switches).toEqual([{id: 'id2', name: 'Feature B'}]);
        });
    });

    describe('Test feature switch overrides', () => {
        it('return set overrides', () => {

            const overrides = [{entityType: 'realm', entityValue: '123'}];
            initialState.switches = [{id:'id', name: 'Feature A', overrides}];
            const state = reducer(initialState, {type: types.SET_FEATURE_OVERRIDES, id: 'id'});

            overrides.length = 0;
            expect(state.overrides).toEqual([{entityType: 'realm', entityValue: '123'}]);
        });

        it('return new overrides', () => {
            const override = {entityType: 'realm', entityValue: '123'};
            const state = reducer(initialState, {type: types.CREATED_OVERRIDE, override});

            override.entityType = null;
            expect(state.overrides).toEqual([{entityType: 'realm', entityValue: '123'}]);
        });

        it('return new editing overrides', () => {
            initialState.overrides = [{id: 'id', entityType: 'realm', entityValue: '123'}];
            const state = reducer(initialState, {type: types.EDIT_OVERRIDE, id: 'id', column: 'entityValue'});

            initialState.overrides.length = 0;
            expect(state.overrides).toEqual([{id: 'id', entityType: 'realm', entityValue: '123', editing: 'entityValue'}]);
        });

        it('return updated overrides', () => {
            initialState.overrides = [{id:'id', entityType: 'realm', entityValue: '123'}];
            const state = reducer(initialState, {type: types.OVERRIDE_UPDATED, id: 'id', property: 'entityType', value: 'app'});

            initialState.overrides.length = 0;
            expect(state.overrides).toEqual([{id: 'id', entityType: 'app', entityValue: '123', editing: false}]);
        });

        it('return deleted overrides', () => {
            initialState.overrides = [{entityType: 'realm', entityValue: '123'}];
            const state = reducer(initialState, {type: types.OVERRIDES_DELETED, ids: ['id1']});

            initialState.overrides.length = 0;
            expect(state.overrides).toEqual([{entityType: 'realm', entityValue: '123'}]);
        });
    });
});

