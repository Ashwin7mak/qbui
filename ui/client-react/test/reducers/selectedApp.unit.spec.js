/**
 * Created by rbeyer on 6/13/17.
 */
import {getAppRoles} from '../../src/reducers/selectedApp';
import reducer from '../../src/reducers/selectedApp';
import * as types from '../../src/actions/types';

function event(type, content) {
    return {
        type,
        content: content || null
    };
}

describe('Test selectedApp reducer', () => {
    let initialState = {
        roles: [],
        successDialogOpen: false,
        addedAppUser: [],
        isLoading: false,
        error: false
    };

    const appRoles = [{"9": {"id": 9, "name": "none", "tableRights": {}, "fieldRights": {}, "description": "", "access": "NONE"}}];

    it('returns correct initial state empty action', () => {
        let resultState = reducer(undefined, {});
        expect(resultState).toEqual(initialState);
    });

    it('test load appRoles', () => {
        const state = reducer(initialState, event(types.LOAD_APP_ROLES));
        expect(state.roles).toEqual([]);
        expect(state.isLoading).toEqual(true);
        expect(state.error).toEqual(false);
    });

    it('test load appRoles success', () => {
        const state = reducer(initialState, event(types.LOAD_APP_ROLES_SUCCESS, {roles: appRoles}));
        expect(state.roles).toEqual(appRoles);
        expect(state.isLoading).toEqual(false);
        expect(state.error).toEqual(false);
    });

    it('test load appRoles failed', () => {
        const state = reducer(initialState, event(types.LOAD_APP_ROLES_FAILED));
        expect(state.roles).toEqual([]);
        expect(state.isLoading).toEqual(false);
        expect(state.error).toEqual(true);
    });

    it('test get appRole', () => {
        const state = reducer(initialState, event(types.LOAD_APP_ROLES_SUCCESS, {roles: appRoles}));
        expect(getAppRoles(state)).toEqual(appRoles);
    });

    it('return update state', () => {
        let email = 'test@test.com';
        let isOpen = true;
        const state = reducer(initialState, event(types.TOGGLE_ADD_TO_APP_SUCCESS_DIALOG, {email, isOpen}));
        expect(state.successDialogOpen).toBe(true);
        expect(state.addedAppUser).toEqual(['test@test.com']);

    });

    it('returns correct initial state on non-appUsers action', () => {
        let resultState = reducer(undefined, event(types.CHANGE_LOCALE, {id: 10}));
        expect(resultState).toEqual(initialState);
    });
});
