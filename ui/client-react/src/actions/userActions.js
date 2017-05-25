import * as types from '../actions/types';
import UserService from '../services/userService';
import Promise from 'bluebird';
import Logger from '../utils/logger';
import LogLevel from '../utils/logLevels';

/**
 * Construct app store payload
 *
 * @param appId - appId for fields
 * @param type - event type
 * @param content - optional content related to event type
 * @returns {{id: *, type: *, content: *}}
 */
function appEvent(appId, type, content) {
    return {
        appId,
        type,
        content: content || null
    };
}

export const loadAppOwner = (appId, userId) => {
    //  promise is returned in support of unit testing only
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            let logger = new Logger();
            logger.debug('UserActions loadAppOwner');
            if (userId) {
                let userService = new UserService();
                userService.getUser(userId).then(
                    response => {
                        dispatch(appEvent(appId, types.LOAD_APP_OWNER_SUCCESS, response.data));
                        resolve();
                    },
                    error => {
                        logger.parseAndLogError(LogLevel.ERROR, error.response, 'userActions.loadAppOwner:');
                        dispatch(appEvent(appId, types.LOAD_APP_OWNER_ERROR, error));
                        reject();
                    }
                );
            } else {
                logger.error('userService.loadAppOwner: Missing required input parameters.');
                let error = {
                    statusText:'Missing required input parameters to load app owner',
                    status:500
                };
                dispatch(appEvent(appId, types.LOAD_APP_OWNER_ERROR, error));
                reject();
            }
        });
    };
};
