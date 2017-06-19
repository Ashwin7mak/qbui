import reducer from '../../src/reducers/appBuilder';
import * as types from '../../src/actions/types';
import _ from 'lodash';
let storeState = {};

describe('Test appBuilder reducer - initial state', () => {
    it('return default state', () => {
        expect(reducer(undefined, {})).toEqual(storeState);
    });
});

describe('App Creation', () => {
    it('will show the app creation dialog', () => {
        const state = reducer(storeState, {type: types.SHOW_APP_CREATION_DIALOG});

        expect(state.dialogOpen).toBe(true);
    });

    it('will show the app creation dialog', () => {
        const state = reducer(storeState, {type: types.HIDE_APP_CREATION_DIALOG});

        expect(state.dialogOpen).toBe(false);
    });
});
