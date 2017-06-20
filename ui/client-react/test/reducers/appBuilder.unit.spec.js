import reducer from '../../src/reducers/appBuilder';
import * as types from '../../src/actions/types';
import _ from 'lodash';
let storeState = {};

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
});
