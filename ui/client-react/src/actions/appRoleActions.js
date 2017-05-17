import * as types from '../actions/types';
import RoleService from '../services/roleService';
import Promise from 'bluebird';
import LogLevel from '../utils/logLevels';

/**
 * Construct fields store payload
 *
 * @param appId - appId for fields
 * @param tblId - tblId for fields
 * @param type - event type
 * @param content - optional content related to event type
 * @returns {{id: *, type: *, content: *}}
 */
function event(appId, type, content) {
    return {
        appId,
        type,
        content: content || null
    };
}

export const loadAppRoles = (appId) => {
    return (dispatch) => {
        //  promise is returned in support of unit testing only
        return new Promise((resolve, reject) => {
            let roleService = new RoleService();
            // fetch the app roles list if we don't have it already
            roleService.getAppRoles(appId).then(
                (response) => {
                dispatch(event(appId, types.LOAD_APP_ROLES_SUCCESS, {roles: response.data}));
                resolve();
            }, (errorResponse) => {
                let error = errorResponse.response;
                logger.parseAndLogError(LogLevel.ERROR, error, 'roleService.loadAppRoles:');
                dispatch(event(appId, types.LOAD_APP_ROLES_FAILED, {error: error}));
                reject();
            });
        });
    };
};
