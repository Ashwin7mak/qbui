import * as types from './types';
import constants from '../../../common/src/constants';
import UserService from '../services/userService';
import Logger from '../utils/logger';
import LogLevel from '../utils/logLevels';

const logger = new Logger();

export const showAddUserDialog = () => ({
    type: types.SHOW_ADD_USER_TO_APP_DIALOG
});

export const hideAddUserDialog = () => ({
    type: types.HIDE_ADD_USER_TO_DIALOG
});

export const getAllUsers = () => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            const userService = new UserService();
            const promise = userService.getAllUsers();
            promise.then(response => {
                resolve(response);
            }).catch(error => {
                if (error.response) {
                    if (error.response.status === constants.HttpStatusCode.FORBIDDEN) {
                        logger.parseAndLogError(LogLevel.WARN, error.response, 'userService.addUserToApp:');
                    } else {
                        logger.parseAndLogError(LogLevel.ERROR, error.response, 'userService.addUserToApp:');
                    }
                }
                reject(error);
            });
        });
    };
};
