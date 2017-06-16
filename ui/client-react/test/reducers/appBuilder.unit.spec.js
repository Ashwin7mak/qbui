import reducer from '../../src/reducers/appBuilder';
import * as types from '../../src/actions/types';
import _ from 'lodash';

let storeState = {};

function initializeState() {
    return {
        app: null,
        apps: []
    };
}

beforeEach(() => {
    storeState = initializeState();
});

describe('Test appBuilder reducer - initial state', () => {
    it('return default state', () => {
        expect(reducer(undefined, {})).toEqual(storeState);
    });
});

describe('Test App Creation', () => {
    it('test show app creation dialog', () => {
        const state = reducer(storeState, {type: types.SHOW_APP_CREATION_DIALOG});

        expect(state.dialogOpen).toBe(true);
    });
});
