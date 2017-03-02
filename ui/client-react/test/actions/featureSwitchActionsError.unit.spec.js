import * as actions from '../../src/actions/featureSwitchActions';
import * as types from '../../src/actions/types';
import {__RewireAPI__ as FeatureSwitchActionsRewireAPI} from '../../src/actions/featureSwitchActions';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Promise from 'bluebird';

let errorStatus = 404;
let exStatus = 500;

describe('Feature switch actions errors', () => {

    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);

    class mockFeatureSwitchService {
        constructor() {
        }

        getFeatureSwitches() {
            return Promise.reject({response:{message:'someError', status:errorStatus}});
        }

        createFeatureSwitch() {
            return Promise.reject({response:{message:'someError', status:errorStatus}});
        }

        updateFeatureSwitch() {
            return Promise.reject({response:{message:'someError', status:errorStatus}});
        }

        deleteFeatureSwitches() {
            return Promise.reject({response:{message:'someError', status:errorStatus}});
        }

        createOverride() {
            return Promise.reject({response:{message:'someError', status:errorStatus}});
        }

        updateOverride() {
            return Promise.reject({response:{message:'someError', status:errorStatus}});
        }

        deleteOverrides() {
            return Promise.reject({response:{message:'someError', status:errorStatus}});
        }

        getFeatureSwitchStates() {
            return Promise.reject({response:{message:'someError', status:errorStatus}});
        }
    }


    beforeEach(() => {
        FeatureSwitchActionsRewireAPI.__Rewire__('FeatureSwitchService', mockFeatureSwitchService);
    });

    afterEach(() => {
        FeatureSwitchActionsRewireAPI.__ResetDependency__('FeatureSwitchService');
    });

    it('loads switches failure', (done) => {
        const store = mockStore({});

        return store.dispatch(actions.getSwitches()).then(
            () => {
                expect(false).toBe(true);
                done();
            },
            () => {
                expect(true).toBe(true);
                done();
            });
    });

    it('loads feature states failure', (done) => {
        const store = mockStore({});

        return store.dispatch(actions.getStates('appId')).then(
            () => {
                expect(false).toBe(true);
                done();
            },
            () => {
                expect(true).toBe(true);
                done();
            });
    });

    it('create switch failure', (done) => {
        const store = mockStore({});

        return store.dispatch(actions.createFeatureSwitch('feature')).then(
            () => {
                expect(false).toBe(true);
                done();
            },
            () => {
                expect(true).toBe(true);
                done();
            });
    });

    it('delete switch failure', (done) => {
        const store = mockStore({});

        return store.dispatch(actions.deleteFeatureSwitches([])).then(
            () => {
                expect(false).toBe(true);
                done();
            },
            () => {
                expect(true).toBe(true);
                done();
            });
    });

    it('delete switch failure', (done) => {
        const store = mockStore({});

        return store.dispatch(actions.deleteFeatureSwitches([])).then(
            () => {
                expect(false).toBe(true);
                done();
            },
            () => {
                expect(true).toBe(true);
                done();
            });
    });

    it('update switch failure', (done) => {
        const store = mockStore({});

        return store.dispatch(actions.updateFeatureSwitch('id', 'entityType', 'app')).then(
            () => {
                expect(false).toBe(true);
                done();
            },
            () => {
                expect(true).toBe(true);
                done();
            });
    });

    it('create override failure', (done) => {
        const store = mockStore({});

        return store.dispatch(actions.createOverride({})).then(
            () => {
                expect(false).toBe(true);
                done();
            },
            () => {
                expect(true).toBe(true);
                done();
            });
    });

    it('update override failure', (done) => {
        const store = mockStore({});

        return store.dispatch(actions.updateOverride('id', 'fsid', {}, 'entityType', 'app')).then(
            () => {
                expect(false).toBe(true);
                done();
            },
            () => {
                expect(true).toBe(true);
                done();
            });
    });

    it('delete overrides failure', (done) => {
        const store = mockStore({});

        return store.dispatch(actions.deleteOverrides('id', [])).then(
            () => {
                expect(false).toBe(true);
                done();
            },
            () => {
                expect(true).toBe(true);
                done();
            });
    });
});
