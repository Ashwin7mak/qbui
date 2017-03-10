import * as actions from '../../src/actions/featureSwitchActions';
import * as types from '../../src/actions/types';
import {__RewireAPI__ as FeatureSwitchActionsRewireAPI} from '../../src/actions/featureSwitchActions';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Promise from 'bluebird';

let mockPromiseError = function() {
    var p = Promise.defer();
    p.reject({response:{status: 403}});
    return p.promise;
};

const expectedErrorActions = [
    {type: types.ERROR, error: {response: {status: 403}}}
];

describe('Feature switch actions error cases', () => {

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
        createFeatureSwitch() {
            return Promise.resolve({data: "newSwitchId"});
        }
        updateFeatureSwitch() {
            return Promise.resolve();
        }
        deleteFeatureSwitches() {
            return Promise.resolve();
        }
        createOverride() {
            return Promise.resolve({data: "newOverrideId"});
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
        class mockFeatureSwitchServiceNeg {
            constructor() {
            }
            getFeatureSwitches() {
                return mockPromiseError();
            }
        }
        FeatureSwitchActionsRewireAPI.__Rewire__('FeatureSwitchService', mockFeatureSwitchServiceNeg);
        const store = mockStore({});
        return store.dispatch(actions.getSwitches()).then(
            () => {
                expect(false).toBe(true);
                done();
            },
            () => {
                expect(store.getActions()).toEqual(expectedErrorActions);
                done();
            });
    });
    it('creates a new switch', (done) => {
        class mockFeatureSwitchServiceNeg {
            constructor() {
            }
            createFeatureSwitch() {
                return mockPromiseError();
            }
        }
        FeatureSwitchActionsRewireAPI.__Rewire__('FeatureSwitchService', mockFeatureSwitchServiceNeg);
        const store = mockStore({});

        return store.dispatch(actions.createFeatureSwitch(name)).then(
            () => {
                expect(false).toBe(true);
                done();
            },
            () => {
                expect(store.getActions()).toEqual(expectedErrorActions);
                done();
            });
    });
    it('deletes feature switches', (done) => {
        class mockFeatureSwitchServiceNeg {
            constructor() {
            }
            deleteFeatureSwitches() {
                return mockPromiseError();
            }
        }
        FeatureSwitchActionsRewireAPI.__Rewire__('FeatureSwitchService', mockFeatureSwitchServiceNeg);
        const store = mockStore({});
        return store.dispatch(actions.deleteFeatureSwitches([1, 2, 3])).then(
            () => {
                expect(false).toBe(true);
                done();
            },
            () => {
                expect(store.getActions()).toEqual(expectedErrorActions);
                done();
            });
    });

    it('updates feature switch', (done) => {
        class mockFeatureSwitchServiceNeg {
            constructor() {
            }
            updateFeatureSwitch() {
                return mockPromiseError();
            }
        }
        FeatureSwitchActionsRewireAPI.__Rewire__('FeatureSwitchService', mockFeatureSwitchServiceNeg);
        const store = mockStore({});
        const feature = {
            id: 'id',
            name: 'oldName',
            team: 'team',
            defaultOn: false
        };
        return store.dispatch(actions.updateFeatureSwitch('id', feature, 'name', 'newName')).then(
            () => {
                expect(false).toBe(true);
                done();
            },
            () => {
                expect(store.getActions()).toEqual(expectedErrorActions);
                done();
            });
    });
    it('creates a new switch override', (done) => {
        class mockFeatureSwitchServiceNeg {
            constructor() {
            }
            createOverride() {
                return mockPromiseError();
            }
        }
        FeatureSwitchActionsRewireAPI.__Rewire__('FeatureSwitchService', mockFeatureSwitchServiceNeg);
        const store = mockStore({});

        return store.dispatch(actions.createOverride('switchId')).then(
            () => {
                expect(false).toBe(true);
                done();
            },
            () => {
                expect(store.getActions()).toEqual(expectedErrorActions);
                done();
            });
    });
    it('updates feature switch override', (done) => {
        class mockFeatureSwitchServiceNeg {
            constructor() {
            }
            updateOverride() {
                return mockPromiseError();
            }
        }
        FeatureSwitchActionsRewireAPI.__Rewire__('FeatureSwitchService', mockFeatureSwitchServiceNeg);
        const store = mockStore({});
        const override = {
            id:'overrideId',
            entityType:'realm',
            entityValue: 'newRealmId',
            on:false
        };
        return store.dispatch(actions.updateOverride('id', 'overrideId', override, 'entityValue', 'newRealmId')).then(
            () => {
                expect(false).toBe(true);
                done();
            },
            () => {
                expect(store.getActions()).toEqual(expectedErrorActions);
                done();
            });
    });
    //it('deletes feature switch overrides', (done) => {
    //    class mockFeatureSwitchServiceNeg {
    //        constructor() {
    //        }
    //        deleteOverride() {
    //            return mockPromiseError();
    //        }
    //    }
    //    FeatureSwitchActionsRewireAPI.__Rewire__('FeatureSwitchService', mockFeatureSwitchServiceNeg);
    //    const store = mockStore({});
    //
    //    return store.dispatch(actions.deleteOverrides('switchId', [1, 2, 3])).then(
    //        () => {
    //            expect(false).toBe(true);
    //            done();
    //        },
    //        () => {
    //            expect(store.getActions()).toEqual(expectedErrorActions);
    //            done();
    //        });
    //});
});
