import reducer from '../../src/reducers/appBuilder';
import * as AppBuilderSelectors from '../../src/reducers/appBuilder';
import * as types from '../../src/actions/types';
import _ from 'lodash';
let storeState = {};

let mockState = {
    appBuilder: {
        isDialogOpen: true,
        name: 'Mock App Name',
        description: 'Mock App Name',
        icon: 'Mock Icon'
    }
};

describe('Test appBuilder reducer - initial state', () => {
    const initialState = {
        isSavingApp: false,
        isDialogOpen: false,
        isAppIconChooserOpen: false,
        icon: 'Customer',
        name: '',
        description: ''
    };
    it('return default state', () => {
        const state = reducer(undefined, {});
        expect(state).toEqual(initialState);
    });
});

describe('App Creation', () => {
    it('create app', () => {
        const state = reducer(storeState, {type: types.CREATE_APP});
        expect(state.isSavingApp).toBe(true);
    });
    it('create app success', () => {
        const state = reducer(storeState, {type: types.CREATE_APP_SUCCESS});
        expect(state.isSavingApp).toBe(false);
        expect(state.isDialogOpen).toBe(false);
        expect(state.name).toBe('');
        expect(state.description).toBe('');
    });
    it('create app failed', () => {
        const state = reducer(storeState, {type: types.CREATE_APP_FAILED});
        expect(state.isSavingApp).toBe(false);
    });
});

describe('App Creation Dialog', () => {
    it('will show the app creation dialog', () => {
        const state = reducer(storeState, {type: types.SHOW_APP_CREATION_DIALOG});

        expect(state.isDialogOpen).toBe(true);
    });

    it('will hide the app creation dialog', () => {
        const state = reducer(storeState, {type: types.HIDE_APP_CREATION_DIALOG});

        expect(state.isDialogOpen).toBe(false);
        expect(state.name).toBe('');
        expect(state.description).toBe('');
    });

    it('will set the app name property', () => {
        const state = reducer(storeState, {type: types.SET_APP_PROPERTY, property: 'name', value: 'mockAppName'});

        expect(state.name).toBe('mockAppName');
    });

    describe('OPEN_ICON_CHOOSER_FOR_APP', () => {
        it('will set isAppIconChooserOpen to true', () => {
            const state = reducer(storeState, {type: types.OPEN_ICON_CHOOSER_FOR_APP});

            expect(state.isAppIconChooserOpen).toBe(true);
        });
    });

    describe('CLOSE_ICON_CHOOSER_FOR_APP', () => {
        it('will set isAppIconChooserOpen to true', () => {
            const state = reducer(storeState, {type: types.CLOSE_ICON_CHOOSER_FOR_APP});

            expect(state.isAppIconChooserOpen).toBe(false);
        });
    });
});


describe('App Creation Selector', () => {
    describe('getIsDialogOpenState', () => {
        it('will return true if isDialogOpen is true', () => {
            let openDialog = AppBuilderSelectors.getIsDialogOpenState(mockState);

            expect(openDialog).toEqual(true);
        });

        it('will return false if isDialogOpen is undefined', () => {
            let openDialog = AppBuilderSelectors.getIsDialogOpenState({});

            expect(openDialog).toEqual(false);
        });

        it('will return false if isDialogOpen is false', () => {
            let mockCloneState = _.cloneDeep(mockState);
            mockCloneState.appBuilder.isDialogOpen = false;
            let openDialog = AppBuilderSelectors.getIsDialogOpenState(mockCloneState);

            expect(openDialog).toEqual(false);
        });
    });

    describe('getAppProperties', () => {
        it('will return app name if there is an app name', () => {
            let {name, icon, description} = AppBuilderSelectors.getAppProperties(mockState);

            expect(name).toEqual(mockState.appBuilder.name);
            expect(icon).toEqual(mockState.appBuilder.icon);
            expect(description).toEqual(mockState.appBuilder.description);
        });

        it('will return app name if there is an app name', () => {
            let cloneMockState = _.cloneDeep(mockState);

            delete cloneMockState.appBuilder.name;
            delete cloneMockState.appBuilder.icon;
            delete cloneMockState.appBuilder.description;

            let {name, icon, description} = AppBuilderSelectors.getAppProperties(cloneMockState);

            expect(name).toEqual(undefined);
            expect(icon).toEqual(undefined);
            expect(description).toEqual(undefined);
        });
    });

    describe('getNewAppInfo', () => {
        it('will return a new app object if there is an app object', () => {
            let result = AppBuilderSelectors.getNewAppInfo(mockState);

            expect(result).toEqual({name: 'Mock App Name', icon: 'Mock Icon', description: 'Mock App Name'});
        });

        it('will return null if there is no new app object', () => {
            let cloneMockState = _.cloneDeep(mockState);
            cloneMockState.appBuilder.name = '';

            let result = AppBuilderSelectors.getNewAppInfo(cloneMockState);

            expect(result).toEqual(null);
        });
    });
});
