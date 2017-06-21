import reducer from '../../src/reducers/appBuilder';
import * as AppBuilderSelectors from '../../src/reducers/appBuilder';
import * as types from '../../src/actions/types';
import _ from 'lodash';
let storeState = {};

let mockState = {
    appBuilder: {
        dialogOpen: true,
        name: 'Mock App Name',
        description: 'Mock App Name'
    }
};

describe('Test appBuilder reducer - initial state', () => {
    const initialState = {
        savingApp: false,
        dialogOpen: false
    };
    it('return default state', () => {
        const state = reducer(undefined, {});
        expect(state).toEqual(initialState);
    });
});

describe('App Creation', () => {
    it('create app', () => {
        const state = reducer(storeState, {type: types.CREATE_APP});
        expect(state.savingApp).toBe(true);
    });
    it('create app success', () => {
        const state = reducer(storeState, {type: types.CREATE_APP_SUCCESS});
        expect(state.savingApp).toBe(false);
        expect(state.dialogOpen).toBe(false);
        expect(state.name).toBe('');
        expect(state.description).toBe('');
    });
    it('create app failed', () => {
        const state = reducer(storeState, {type: types.CREATE_APP_FAILED});
        expect(state.savingApp).toBe(false);
    });
});

describe('App Creation Dialog', () => {
    it('will show the app creation dialog', () => {
        const state = reducer(storeState, {type: types.SHOW_APP_CREATION_DIALOG});

        expect(state.dialogOpen).toBe(true);
    });

    it('will hide the app creation dialog', () => {
        const state = reducer(storeState, {type: types.HIDE_APP_CREATION_DIALOG});

        expect(state.dialogOpen).toBe(false);
    });

    it('will set the app name property', () => {
        const state = reducer(storeState, {type: types.SET_APP_PROPERTY, property: 'name', value: 'mockAppName'});

        expect(state.name).toBe('mockAppName');
    });
});


describe('App Creation Selector', () => {
    describe('getIsDialogOpenState', () => {
        it('will return true for dialogOpen state if it is true', () => {
            let openDialog = AppBuilderSelectors.getIsDialogOpenState(mockState);

            expect(openDialog).toEqual(true);
        });

        it('will return false for dialogOpen if there is no dialogOpen state', () => {
            let openDialog = AppBuilderSelectors.getIsDialogOpenState({});

            expect(openDialog).toEqual(false);
        });

        it('will return false for dialogOpen if the dialogOpen state is false', () => {
            let mockCloneState = _.cloneDeep(mockState);
            mockCloneState.appBuilder.dialogOpen = false;
            let openDialog = AppBuilderSelectors.getIsDialogOpenState(mockCloneState);

            expect(openDialog).toEqual(false);
        });
    });

    describe('getAppNameValue', () => {
        it('will return app name if there is an app name', () => {
            let result = AppBuilderSelectors.getAppNameValue(mockState);

            expect(result).toEqual(mockState.appBuilder.name);
        });

        it('will return an empty string if there is no app name', () => {
            let cloneMockState = _.cloneDeep(mockState);
            cloneMockState.appBuilder.name = '';

            let result = AppBuilderSelectors.getAppNameValue(cloneMockState);

            expect(result).toEqual('');
        });
    });

    describe('getAppDescriptionValue', () => {
        it('will return app description if there is an app description', () => {
            let result = AppBuilderSelectors.getAppDescriptionValue(mockState);

            expect(result).toEqual(mockState.appBuilder.description);
        });

        it('will return an empty string if there is no app description', () => {
            let cloneMockState = _.cloneDeep(mockState);
            cloneMockState.appBuilder.description = '';

            let result = AppBuilderSelectors.getAppDescriptionValue(cloneMockState);

            expect(result).toEqual('');
        });
    });

    describe('getNewAppInfo', () => {
        it('will return a new app object if there is an app obejct', () => {
            let result = AppBuilderSelectors.getNewAppInfo(mockState);

            expect(result).toEqual({name: 'Mock App Name'});
        });

        it('will return null if there is no new app object', () => {
            let cloneMockState = _.cloneDeep(mockState);
            cloneMockState.appBuilder.name = '';

            let result = AppBuilderSelectors.getNewAppInfo(cloneMockState);

            expect(result).toEqual(null);
        });
    });
});
