import AccountUsersService from './AccountUsersService';
import Promise from 'bluebird';
import * as types from '../../app/types';
import Logger from '../../../../client-react/src/utils/logger';
import LogLevel from '../../../../client-react/src/utils/logLevels';

const logger = new Logger();

/**
 * Action when there is successful user from the backend
 * @param users
 */
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

                // pass the data through the resolve if we need to chain these actions in the future.
                resolve(response.data);

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
