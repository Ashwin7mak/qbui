/**
 * Created by rbeyer on 6/12/17.
 */
import * as types from '../actions/types';

// Return only the appRoles from selectedApp object, else returns null
export const getAppRoles = (state) => {
    return state.roles.length > 0 ? state.roles : [];
};

const selectedApp = (
    state = {
        //  default states
        roles: [],
        successDialogOpen: false,
        addedAppUser: [],
        isLoading: false,
        error: false,
        changeUserRoleDialog: false,
    },
    action) => {

    switch (action.type) {
    case types.TOGGLE_ADD_TO_APP_SUCCESS_DIALOG: {
        return {
            ...state,
            successDialogOpen: action.content.isOpen,
            addedAppUser: [action.content.email]
        };
    }

    case types.LOAD_APP_ROLES: {
        return {
            ...state,
            isLoading: true
        };
    }

    case types.LOAD_APP_ROLES_FAILED: {
        return {
            ...state,
            roles: [],
            isLoading: false,
            error: true
        };
    }

    case types.LOAD_APP_ROLES_SUCCESS: {
        return {
            ...state,
            roles: action.content.roles,
            rolesLoading: false,
            error: false
        };
    }

    case types.TOGGLE_CHANGE_USER_ROLE: {
        return {
            ...state,
            changeUserRoleDialog: action.content.isOpen
        };
    }

    default:
        // return existing state by default in redux
        return state;
    }
};

export default selectedApp;
