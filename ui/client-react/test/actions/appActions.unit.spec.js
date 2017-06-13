import {__RewireAPI__ as AppActionsRewireAPI} from '../../src/actions/appActions';
import * as AppActions from '../../src/actions/appActions';
import * as types from '../../src/actions/types';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import Promise from 'bluebird';

let appId = 'appId';
let tblId = 'tblId';

// we mock the Redux store when testing async action creators
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

class mockLogger {
    constructor() {}
    logException() {}
    debug() {}
    warn() {}
    error() {}
    parseAndLogError() {}
}

function event(type, content) {
    return {
        type: type,
        content: content || null
    };
}

describe('App Actions success workflow functions', () => {

    let responseData = {
        data: {id: '1'}
    };
    class mockAppService {
        constructor() { }
        getApps() {
            return Promise.resolve(responseData);
        }
        getAppComponents() {
            return Promise.resolve(responseData);
        }
    }

    beforeEach(() => {
        spyOn(mockAppService.prototype, 'getApps').and.callThrough();
        spyOn(mockAppService.prototype, 'getAppComponents').and.callThrough();
        AppActionsRewireAPI.__Rewire__('AppService', mockAppService);
        AppActionsRewireAPI.__Rewire__('Logger', mockLogger);
    });

    afterEach(() => {
        AppActionsRewireAPI.__ResetDependency__('AppService');
        AppActionsRewireAPI.__ResetDependency__('Logger');
    });

    it('test load apps', (done) => {
        // the mock store makes the actions dispatched available via getActions()
        // so we don't need to spy on the dispatcher etc.
        const expectedActions = [
            event(types.LOAD_APPS),
            event(types.LOAD_APPS_SUCCESS, responseData.data)
        ];

        const store = mockStore({});
        return store.dispatch(AppActions.loadApps()).then(
            () => {
                expect(mockAppService.prototype.getApps).toHaveBeenCalled();
                expect(store.getActions()).toEqual(expectedActions);
                done();
            },
            () => {
                expect(false).toEqual(true);
                done();
            });
    });

    it('test load app', (done) => {
        // the mock store makes the actions dispatched available via getActions()
        // so we don't need to spy on the dispatcher etc.
        const expectedActions = [
            event(types.LOAD_APP, {appId: appId}),
            event(types.LOAD_APP_SUCCESS, responseData.data)
        ];

        const store = mockStore({});
        return store.dispatch(AppActions.loadApp(appId)).then(
            () => {
                expect(mockAppService.prototype.getAppComponents).toHaveBeenCalled();
                expect(store.getActions()).toEqual(expectedActions);
                done();
            },
            () => {
                expect(false).toEqual(true);
                done();
            });
    });

    it('create clear selected app event', () => {
        expect(AppActions.clearSelectedApp()).toEqual(event(types.CLEAR_SELECTED_APP));
    });

    it('create set selected app table event', () => {
        expect(AppActions.selectAppTable(appId, tblId)).toEqual(event(types.SELECT_APP_TABLE, {appId, tblId}));
    });

    it('create clear selected app table event', () => {
        expect(AppActions.clearSelectedAppTable()).toEqual(event(types.CLEAR_SELECTED_APP_TABLE));
    });

    it('create showAppCreationDialog event', () => {
        expect(AppActions.showAppCreationDialog()).toEqual(event(types.SHOW_APP_CREATION_DIALOG));
    });

    it('toggle add to app success dialog event', () => {
        const isOpen = false;
        const email = 'test@test.com';
        expect(AppActions.toggleAddToAppSuccessDialog(isOpen, email)).toEqual(event(types.TOGGLE_ADD_TO_APP_SUCCESS_DIALOG, {isOpen, email}));
    });

    it('update add table properties event', () => {
        const tableInfo = {'id':1};
        expect(AppActions.updateAppTableProperties(appId, tblId, tableInfo)).toEqual(event(types.UPDATE_APP_TABLE_PROPS, {appId, tblId, tableInfo}));
    });
});

describe('App Actions error workflow functions', () => {

    let errorData = {
        response: 'some error'
    };
    class mockAppService {
        constructor() { }
        getApps() {
            return Promise.reject(errorData);
        }
        getAppComponents() {
            return Promise.reject(errorData);
        }
    }

    beforeEach(() => {
        spyOn(mockAppService.prototype, 'getApps').and.callThrough();
        spyOn(mockAppService.prototype, 'getAppComponents').and.callThrough();
        spyOn(mockLogger.prototype, 'parseAndLogError').and.callThrough();
        spyOn(mockLogger.prototype, 'logException').and.callThrough();
        AppActionsRewireAPI.__Rewire__('AppService', mockAppService);
        AppActionsRewireAPI.__Rewire__('Logger', mockLogger);
    });

    afterEach(() => {
        AppActionsRewireAPI.__ResetDependency__('AppService');
        AppActionsRewireAPI.__ResetDependency__('Logger');
    });

    it('loads apps with invalid response', (done) => {
        // the mock store makes the actions dispatched available via getActions()
        // so we don't need to spy on the dispatcher etc.
        const expectedActions = [
            event(types.LOAD_APPS),
            event(types.LOAD_APPS_ERROR, errorData)
        ];

        const store = mockStore({});
        return store.dispatch(AppActions.loadApps()).then(
            () => {
                expect(true).toEqual(false);
                done();
            },
            () => {
                expect(mockAppService.prototype.getApps).toHaveBeenCalled();
                expect(mockLogger.prototype.parseAndLogError).toHaveBeenCalled();
                expect(store.getActions()).toEqual(expectedActions);
                done();
            });
    });

    it('loads app with invalid response', (done) => {
        // the mock store makes the actions dispatched available via getActions()
        // so we don't need to spy on the dispatcher etc.
        const expectedActions = [
            event(types.LOAD_APP, {appId: appId}),
            event(types.LOAD_APP_ERROR, errorData)
        ];

        const store = mockStore({});
        return store.dispatch(AppActions.loadApp(appId)).then(
            () => {
                expect(true).toEqual(false);
                done();
            },
            () => {
                expect(mockAppService.prototype.getAppComponents).toHaveBeenCalled();
                expect(mockLogger.prototype.parseAndLogError).toHaveBeenCalled();
                expect(store.getActions()).toEqual(expectedActions);
                done();
            });
    });

});

