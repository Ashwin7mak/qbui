import Promise from 'bluebird';
import {UPDATE_LOGGED_IN_USER, UPDATE_USER_LOADING_STATUS} from './userActionTypes';

// IMPORT FROM CLIENT REACT
import UserService from '../../../../../client-react/src/services/userService';
import Logger from '../../../../../client-react/src/utils/logger';
// IMPORT FROM CLIENT REACT

export const updateLoadingUserStatus = isLoading => ({type: UPDATE_USER_LOADING_STATUS, isLoading});

/**
 * Updates the logged in user with a new user object
 * @param user
 */
export const updateLoggedInUser = user => ({type: UPDATE_LOGGED_IN_USER, user, isLoading: false});

/**
 * Gets the currently logged in user via the API and sends events to update the user after the API call is resolved.
 * @returns {function(*, *)}
 */
export const getLoggedInUser = () => {
    return dispatch => {
        const userService = new UserService();
        const logger = new Logger();

        dispatch(updateLoadingUserStatus(true));

        return userService.getRequestUser()
            .then(result => {
                dispatch(updateLoggedInUser(result.data));
            })
            .catch(failure => {
                logger.error('Error getting logged in user.', failure);

                dispatch(updateLoadingUserStatus(false));

                return Promise.reject(failure);
            });
    };
};
