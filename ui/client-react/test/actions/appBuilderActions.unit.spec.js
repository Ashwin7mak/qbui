import * as AppBuilderActions from '../../src/actions/appBuilderActions';
import * as types from '../../src/actions/types';
import {__RewireAPI__ as AppBuilderActionsRewireAPI} from '../../src/actions/appBuilderActions';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Promise from 'bluebird';

describe('Create app workflows', () => {

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

    const successResponse = {
        data: {id: '1'}
    };
    class mockAppServiceSuccess {
        constructor() { }
        createApp(app) {
            return Promise.resolve(successResponse);
        }
    }
    class mockAppServiceFailure {
        constructor() { }
        createApp(app) {
            return Promise.reject({response: {status: 500}});
        }
    }

    beforeEach(() => {
        spyOn(mockLogger.prototype, 'logException').and.callThrough();
        AppBuilderActionsRewireAPI.__Rewire__('Logger', mockLogger);
    });
    afterEach(() => {
        AppBuilderActionsRewireAPI.__ResetDependency__('AppService');
        AppBuilderActionsRewireAPI.__ResetDependency__('Logger');
    });

    it('create app success', (done) => {
        AppBuilderActionsRewireAPI.__Rewire__('AppService', mockAppServiceSuccess);
        const store = mockStore({});

        const expectedActions = [
            {type: types.CREATE_APP},
            {type: types.CREATE_APP_SUCCESS, app: successResponse.data}
        ];

        const app = {name:'appName'};
        return store.dispatch(AppBuilderActions.createApp(app)).then(
            () => {
                expect(store.getActions()).toEqual(expectedActions);
                done();
            },
            () => {
                expect(false).toBe(true);
                done();
            });
    });

    it('create app failure', (done) => {
        AppBuilderActionsRewireAPI.__Rewire__('AppService', mockAppServiceFailure);
        const store = mockStore({});

        const expectedActions = [
            {type: types.CREATE_APP},
            {type: types.CREATE_APP_FAILED}
        ];

        const app = {name:'appName'};
        return store.dispatch(AppBuilderActions.createApp(app)).then(
            () => {
                expect(false).toBe(true);
                done();
            },
            () => {
                expect(store.getActions()).toEqual(expectedActions);
                expect(mockLogger.prototype.logException).toHaveBeenCalled();
                done();
            });
    });
});

describe('App Actions event functions', () => {
    it('createNewApp event', () => {
        expect(AppBuilderActions.createNewApp()).toEqual({type: types.CREATE_APP});
    });

    const newApp = {id: '1'};
    it('createAppSuccess event', () => {
        expect(AppBuilderActions.createAppSuccess(newApp)).toEqual({type: types.CREATE_APP_SUCCESS, app:newApp});
    });

    it('createAppFailed event', () => {
        expect(AppBuilderActions.createAppFailed()).toEqual({type: types.CREATE_APP_FAILED});
    });

    it('create showAppCreationDialog event', () => {
        expect(AppBuilderActions.showAppCreationDialog()).toEqual({type: types.SHOW_APP_CREATION_DIALOG});
    });

    it('create hideAppCreationDialog event', () => {
        expect(AppBuilderActions.hideAppCreationDialog()).toEqual({type: types.HIDE_APP_CREATION_DIALOG});
    });

    it('create setAppProperty event', () => {
        expect(AppBuilderActions.setAppProperty('mockProperty', 'mockValue')).toEqual({type: types.SET_APP_PROPERTY, property: 'mockProperty', value: 'mockValue'});
    });

    it('create openIconChooserForApp event', () => {
        expect(AppBuilderActions.openIconChooserForApp()).toEqual({type: types.OPEN_ICON_CHOOSER_FOR_APP});
    });

    it('create closeIconChooserForApp event', () => {
        expect(AppBuilderActions.closeIconChooserForApp()).toEqual({type: types.CLOSE_ICON_CHOOSER_FOR_APP});
    });
});
