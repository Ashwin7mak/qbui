import {getSearchedUsers, getDialogStatus, getRoleIdToAdd, getSelectedUsers} from '../../src/reducers/users';
import reducer from '../../src/reducers/users';
import * as types from '../../src/actions/types';

function event(type, content) {
    return {
        type,
        content: content || null
    };
}

describe('Test users reducer', () => {
    const searchedUsers = [
        {
            "id": "666",
            "firstName": "Baal",
            "lastName": "Beelzebub",
            "screenName": "Winger",
            "email": "theevilone@hell.net",
            "deactivated": false,
            "administrator": true,
            "realmUserFlags": 0
        }
    ];
    const selectedUsers = [1, 3, 3, 7];
    const roleIdToAdd = 9;
    const openDialogStatus = true;
    const closeDialogStatus = false;

    it('test default state', () => {
        let state = reducer({}, event("DEFAULT_STATE_TEST"));
        expect(state).toEqual({});
    });

    it('test set user role to add', () => {
        let state = reducer({}, event(types.SET_USER_ROLE_TO_ADD, {roleId: roleIdToAdd}));
        let currentRoleIdToAdd = getRoleIdToAdd(state);
        expect(currentRoleIdToAdd).toEqual(roleIdToAdd);
    });

    it('test search users success', () => {
        let state = reducer({}, event(types.SEARCH_USERS_SUCCESS, {searchedUsers: searchedUsers}));
        let currentSearchedUsers = getSearchedUsers(state);
        expect(currentSearchedUsers).toEqual(searchedUsers);
    });

    it('test toggle add user dialog', () => {
        let state = reducer({}, event(types.TOGGLE_ADD_USER_DIALOG, {status: openDialogStatus}));
        let currentDialogStatus = getDialogStatus(state);
        expect(currentDialogStatus).toEqual(openDialogStatus);
        state = reducer({}, event(types.TOGGLE_ADD_USER_DIALOG, {status: closeDialogStatus}));
        currentDialogStatus = getDialogStatus(state);
        expect(currentDialogStatus).toEqual(closeDialogStatus);
    });

    it('test select user rows', () => {
        let state = reducer({}, event(types.SELECT_USER_ROWS, {selectedUsers: selectedUsers}));
        let currentSelectedUsers = getSelectedUsers(state);
        expect(currentSelectedUsers).toEqual(selectedUsers);
    });
});
