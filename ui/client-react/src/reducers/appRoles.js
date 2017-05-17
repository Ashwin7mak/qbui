/**
 * Created by rbeyer on 5/15/17.
 */
import * as types from '../actions/types';
import Logger from '../utils/logger';


// Return a specific set of appRoles from app roles object for a given appId, else returns null
export const getAppRoles = (state, appId) => {
    const appRoleList = state[appId];
    return appRoleList ? appRoleList.roles : null;
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

    //const newState = _.reject(state, app => app.id === action.appId);
    const newState = {};
    //let getCurrentState = (appId, tblId) =>  _.find(state, field => field.appId === appId && field.tblId === tblId);

    let logger = new Logger();

    switch (action.type) {
        case types.LOAD_APP_ROLES: {
            // update fields store when loading a form
            newState[action.appId] = {
                roles: [],
                rolesLoading: true,
                error: false
            };
            return newState;
        }

        case types.LOAD_APP_ROLES_FAILED: {
            // update fields store when loading a form
            newState[action.appId] ={
                roles: [],
                rolesLoading: false,
                error: true
            };
            return newState;
        }

        case types.LOAD_APP_ROLES_SUCCESS: {
            // update fields store when loading a form
            newState[action.appId] ={
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
