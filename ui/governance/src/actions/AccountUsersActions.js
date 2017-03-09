// feature switch action creators

import AccountUsersService from '../services/AccountUsersService';
import Promise from 'bluebird';
import * as types from '../actions/types';
import Logger from '../utils/logger';
import LogLevel from '../utils/logLevels';

const logger = new Logger();

// add loaded switches to store
export const getAccountUsersSuccess = (users) => ({
    type: types.SET_USERS,
    users
});

/**
 * Get all the users
 *
 * @returns {function(*=)}
 */
export const getUsers = () => {
    return (dispatch) => {

        return new Promise((resolve, reject) => {

            // get all the users from the account service
            const accountUsersService = new AccountUsersService();

            const promise = accountUsersService.getUsers();

            promise.then(response => {

                // we have the users, update the redux store
                dispatch(getAccountUsersSuccess(response.data));
                resolve();

                // otherwise we have an error
            }).catch(error => {

                if (error.response) {
                    if (error.response.status === 403) {
                        logger.parseAndLogError(LogLevel.WARN, error.response, 'accountUsersService.getUsers:');
                    } else {
                        logger.parseAndLogError(LogLevel.ERROR, error.response, 'accountUsersService.getUsers:');
                    }
                }
                reject(error);
            });
        });
    };
};
