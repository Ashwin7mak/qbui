import * as actions from '../../src/actions/featureSwitchActions';
import * as types from '../../src/actions/types';
import {__RewireAPI__ as FeatureSwitchActionsRewireAPI} from '../../src/actions/featureSwitchActions';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Promise from 'bluebird';

describe('Feature switch actions', () => {

    let switchesResponseData = [
        {'Feature A': true},
        {'Feature B': false}
    ];

    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);

    class mockFeatureSwitchService {
        constructor() { }
        getFeatureSwitches() {
            return Promise.resolve({data: switchesResponseData});
        }
        createFeatureSwitch(feature) {
            return Promise.resolve({data: {id: "newSwitchId"}});
        }
        updateFeatureSwitch() {
            return Promise.resolve();
        }
        deleteFeatureSwitches() {
            return Promise.resolve();
        }
        createOverride() {
            return Promise.resolve({data: {id: "newOverrideId"}});
        }
        updateOverride() {
            return Promise.resolve();
        }
        deleteOverrides() {
            return Promise.resolve();
        }
        getFeatureSwitchStates() {
            return Promise.resolve({data: switchesResponseData});
        }
    }

    beforeEach(() => {
        FeatureSwitchActionsRewireAPI.__Rewire__('FeatureSwitchService', mockFeatureSwitchService);
    });

    afterEach(() => {
        FeatureSwitchActionsRewireAPI.__ResetDependency__('FeatureSwitchService');
    });

    it('loads switches', (done) => {

        // the mock store makes the actions dispatched available via getActions()
        // so we don't need to spy on the dispatcher etc.

        const expectedActions = [
            {type: types.SET_FEATURE_SWITCHES, switches: switchesResponseData}
        ];
        const store = mockStore({});

        return store.dispatch(actions.getSwitches()).then(
            () => {
                expect(store.getActions()).toEqual(expectedActions);
                done();
            },
            () => {
                expect(false).toBe(true);
                done();
            });
    });

    it('should create an action for loaded switches', () => {
        const switches = [{id: "id", name: "Feature", teamName: "team", description: "desc", defaultOn: false}];
        expect(actions.loadSwitchesSuccess(switches)).toEqual({type: types.SET_FEATURE_SWITCHES, switches});
    });

    it('creates a new switch', (done) => {

        const name = 'Feature';

        const expectedActions = [
            {
                type: types.CREATED_FEATURE_SWITCH,
                feature: {
                    name,
                    id:'newSwitchId',
                    description:'Description',
                    teamName: 'Team Name',
                    defaultOn:false, overrides:[]
                }
            }
        ];
        const store = mockStore({});

        return store.dispatch(actions.createFeatureSwitch(name)).then(
            () => {
                expect(store.getActions()).toEqual(expectedActions);
                done();
            },
            () => {
                expect(false).toBe(true);
                done();
            });
    });

    it('should create an action for created feature', () => {
        const feature = {id: "id", name: "Feature", teamName: "team", description: "desc", defaultOn: false};
        expect(actions.createdFeatureSwitch(feature)).toEqual({type: types.CREATED_FEATURE_SWITCH, feature});
    });

    it('deletes feature switches', (done) => {

        const expectedActions = [
            {
                type: types.FEATURE_SWITCHES_DELETED,
                ids: [1, 2, 3]
            }
        ];
        const store = mockStore({});

        return store.dispatch(actions.deleteFeatureSwitches([1, 2, 3])).then(
            () => {
                expect(store.getActions()).toEqual(expectedActions);
                done();
            },
            () => {
                expect(false).toBe(true);
                done();
            });
    });

    it('should create an action for deleted features', () => {
        const ids = ['id1', 'id2', 'id3'];
        expect(actions.featureSwitchesDeleted(ids)).toEqual({type: types.FEATURE_SWITCHES_DELETED, ids});
    });

    it('should create an action for edit feature', () => {
        const id = 'id1';
        const column = 'name';
        expect(actions.editFeatureSwitch(id, column)).toEqual({type: types.EDIT_FEATURE_SWITCH, id, column});
    });

    it('updates feature switch', (done) => {

        const feature = {
            id: 'id',
            name: 'oldName',
            team: 'team',
            defaultOn: false
        };

        const expectedActions = [
            {
                type: types.FEATURE_SWITCH_UPDATED,
                id: feature.id,
                property: 'name',
                value: 'newName'
            }
        ];
        const store = mockStore({});

        return store.dispatch(actions.updateFeatureSwitch('id', feature, 'name', 'newName')).then(
            () => {
                expect(store.getActions()).toEqual(expectedActions);
                done();
            },
            () => {
                expect(false).toBe(true);
                done();
            });
    });

    it('should create an action for feature switch updated', () => {
        const id = 'id';
        const property = 'property';
        const value = 'value';
        expect(actions.featureSwitchUpdated(id, property, value)).toEqual({type: types.FEATURE_SWITCH_UPDATED, id, property, value});
    });

    it('should create an action for set feature switch overrides', () => {
        const id = 'id1';

        expect(actions.setFeatureSwitchOverrides(id)).toEqual({type: types.SET_FEATURE_OVERRIDES, id});
    });

    it('creates a new switch override', (done) => {

        const expectedActions = [
            {
                type: types.CREATED_OVERRIDE,
                override: {
                    id:'newOverrideId'
                }
            }
        ];
        const store = mockStore({});

        return store.dispatch(actions.createOverride('switchId')).then(
            () => {
                expect(store.getActions()).toEqual(expectedActions);
                done();
            },
            () => {
                expect(false).toBe(true);
                done();
            });
    });

    it('should create an action for create feature switch override', () => {
        const override = {id: 'id', entityType: 'app', entityValue: '123', on: true};
        expect(actions.createdOverride(override)).toEqual({type: types.CREATED_OVERRIDE, override});
    });

    it('should create an action for edit override', () => {
        const id = 'id1';
        const column = 'name';
        expect(actions.editOverride(id, column)).toEqual({type: types.EDIT_OVERRIDE, id, column});
    });

    it('updates feature switch override', (done) => {

        const override = {
            id:'overrideId',
            entityType:'realm',
            entityValue: 'newRealmId',
            on:false
        };

        const expectedActions = [
            {
                id:'overrideId',
                type: types.OVERRIDE_UPDATED,
                property: 'entityValue',
                value: 'newRealmId'
            }
        ];
        const store = mockStore({});

        return store.dispatch(actions.updateOverride('id', 'overrideId', override, 'entityValue', 'newRealmId')).then(
            () => {
                expect(store.getActions()).toEqual(expectedActions);
                done();
            },
            () => {
                expect(false).toBe(true);
                done();
            });
    });

    it('should create an action for feature switch override updated', () => {
        const id = 'id';
        const property = 'property';
        const value = 'value';
        expect(actions.overrideUpdated(id, property, value)).toEqual({type: types.OVERRIDE_UPDATED, id, property, value});
    });

    it('deletes feature switch overrides', (done) => {

        const expectedActions = [
            {
                type: types.OVERRIDES_DELETED,
                ids: [1, 2, 3]
            }
        ];
        const store = mockStore({});

        return store.dispatch(actions.deleteOverrides('switchId', [1, 2, 3])).then(
            () => {
                expect(store.getActions()).toEqual(expectedActions);
                done();
            },
            () => {
                expect(false).toBe(true);
                done();
            });
    });
    it('should create an action for deleted overrides', () => {
        const ids = ['id1', 'id2', 'id3'];
        expect(actions.overridesDeleted(ids)).toEqual({type: types.OVERRIDES_DELETED, ids});
    });

    it('loads feature states', (done) => {

        const expectedActions = [
            {type: types.SET_FEATURE_SWITCH_STATES, states: switchesResponseData}
        ];
        const store = mockStore({});

        return store.dispatch(actions.getStates('appId')).then(
            () => {
                expect(store.getActions()).toEqual(expectedActions);
                done();
            },
            () => {
                expect(false).toBe(true);
                done();
            });
    });
    it('should create an action for loaded feature states', () => {
        const states = [{'Feature 1': true}, {'Feature 2': false}];
        expect(actions.loadStatesSuccess(states)).toEqual({type: types.SET_FEATURE_SWITCH_STATES, states});
    });

    it('Test error state', (done) => {

        class mockFeatureSwitchNegService {
            constructor() {}

            getFeatureSwitches() {
                return Promise.reject({response: {status: 403}});
            }
        }
        FeatureSwitchActionsRewireAPI.__Rewire__('FeatureSwitchService', mockFeatureSwitchNegService);

        const expectedActions = [
            {type: types.ERROR, error: {response: {status: 403}}}
        ];
        const store = mockStore({});

        return store.dispatch(actions.getSwitches()).then(
            () => {
                expect(false).toBe(true);
                done();
            },
            () => {
                expect(store.getActions()).toEqual(expectedActions);
                done();
            });
    });
});
