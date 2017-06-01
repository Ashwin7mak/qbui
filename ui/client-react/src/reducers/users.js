import * as types from '../actions/types';

const users = (
    //  default states
    state = {
        searchedUsers: [],
        selectedUsers: [],
        roleIdToAdd: null,
        dialogStatus: false
    },
    action) => {

    // reducer - no mutations!
    switch (action.type) {
    case types.SEARCH_USERS_SUCCESS:
        return {
            ...state,
            searchedUsers: action.content || []
        };
    case types.SET_USER_ROLE_TO_ADD:
        return {
            ...state,
            roleIdToAdd: action.roleId
        };
    case types.TOGGLE_ADD_USER_DIALOG:
        return {
            ...state,
            dialogStatus: action.status
        };
    case types.SELECT_USER_ROWS:
        return {
            ...state,
            selectedUsers: action.selectedUsers
        };
    default:
        // return existing state by default in redux
        return state;
    }
};

export default users;

export const getSearchedUsers = (state) => {
    return state.searchedUsers;
};

export const getDialogStatus = (state) => {
    return state.dialogStatus;
};

export const getRoleIdToAdd = (state) => {
    return state.roleIdToAdd;
};

export const getSelectedUsers = (state) => {
    return state.selectedUsers;
};
