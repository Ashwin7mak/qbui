import {getAppRoles, getAppRolesObject} from '../../src/reducers/appUsers';
import reducer from '../../src/reducers/appUsers';
import * as types from '../../src/actions/types';

describe('Test appUsers reducer', () => {
    let initialState = {
        successDialogOpen: false,
        addedAppUser: [],
    };

    it('return update state', () => {
        let email = 'test@test.com';
        let status = true;
        const state = reducer(initialState, {type: types.TOGGLE_ADD_TO_APP_SUCCESS_DIALOG, email, status});
        expect(state.successDialogOpen).toBe(true);
        expect(state.addedAppUser).toEqual(['test@test.com']);

    });

});
