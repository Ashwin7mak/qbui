/**
 * Created by rbeyer on 5/15/17.
 */
import * as types from '../actions/types';
import Logger from '../utils/logger';


// Return only the appRoles from app roles object for a given appId, else returns null
export const getAppRoles = (state, appId) => {
    const appRoleList = state[appId];
    return appRoleList ? appRoleList.roles : null;
};

// Return a object from the appRoles store for a given appId, else returns null
export const getAppRolesObject = (state, appId) => {
    return state[appId] ? state[appId] : null;
};

/**
 * App Role state model
 * {"appId": {[NONE, VIEWER, PARTICIPANT, ADMINISTRATOR]}
 *
 * @param state
 * @param action
 * @returns {*}
 */
const appRolesStore = (state = {}, action) => {
    let newState = _.cloneDeep(state);
    if (newState[action.appId]) {
        delete newState[action.appId];
    }

    let logger = new Logger();

    switch (action.type) {
    case types.LOAD_APP_ROLES: {
        newState[action.appId] = {
            roles: [],
            rolesLoading: true,
            error: false
        };
        return newState;
    }

    case types.LOAD_APP_ROLES_FAILED: {
        newState[action.appId] = {
            roles: [],
            rolesLoading: false,
            error: true
        };
        return newState;
    }

    case types.LOAD_APP_ROLES_SUCCESS: {
        newState[action.appId] = {
            roles: action.content.roles,
            rolesLoading: false,
            error: false
        };
        return newState;
    }

    default:
        return state;
    }

};

export default appRolesStore;
