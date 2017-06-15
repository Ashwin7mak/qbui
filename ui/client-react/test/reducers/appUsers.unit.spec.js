import {getAppRoles, getAppRolesObject} from '../../src/reducers/appUsers';
import reducer from '../../src/reducers/appUsers';
import * as types from '../../src/actions/types';

describe('Test appUsers reducer', () => {
    let initialState = {
        successDialogOpen: false,
        addedAppUser: []
    };

    it('return update state', () => {
        let email = 'test@test.com';
        let isOpen = true;
        const state = reducer(initialState, {type: types.TOGGLE_ADD_TO_APP_SUCCESS_DIALOG, content:{email, isOpen}});
        expect(state.successDialogOpen).toBe(true);
        expect(state.addedAppUser).toEqual(['test@test.com']);

    });
    it('returns correct initial state empty action', () => {
        let resultState = reducer(undefined, {});
        expect(resultState).toEqual({successDialogOpen: false, addedAppUser: []});
    });

    it('returns correct initial state on non-appUsers action', () => {
        let resultState = reducer(undefined, {type: types.CHANGE_LOCALE, id: 10});
        expect(resultState).toEqual({successDialogOpen: false, addedAppUser: []});
    });

});
