import AccountUsersService from "./AccountUsersService";
import * as types from "../../app/actionTypes";
import Logger from "../../../../client-react/src/utils/logger";
import LogLevel from "../../../../client-react/src/utils/logLevels";

const logger = new Logger();

/**
 * Action when there is successful user from the backend
 * @param users
 */
export const receiveAccountUsers = (users) => ({
    type: types.SET_USERS,
    users
});

/**
 * Get all the users
 *
 * @returns {function(*=)}
 */
export const fetchAccountUsers = (accountId) => {
    return (dispatch) => {
        // get all the users from the account service
        const accountUsersService = new AccountUsersService();
        const promise = accountUsersService.getAccountUsers(accountId);

        promise.then(response => {

            // we have the users, update the redux store
            dispatch(receiveAccountUsers(response.data));

            // otherwise we have an error
        }).catch(error => {

            if (error.response) {
                if (error.response.status === 403) {
                    logger.parseAndLogError(LogLevel.WARN, error.response, 'accountUsersService.getAccountUsers:');
                } else {
                    logger.parseAndLogError(LogLevel.ERROR, error.response, 'accountUsersService.getAccountUsers:');
                }
            }
        });
        return promise;
    };
};
