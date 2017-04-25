/*
 *  Define all Redux store action constants
 */

/*
 * Prefixes for generic request Fetching/Failure/Success
 * This allows us to use a single generic reducer to handle
 * request errors and such.
 */
export const REQUEST_FETCHING = 'REQUEST_FETCHING_';
export const REQUEST_FAILURE = 'REQUEST_FAILURE_';
export const REQUEST_SUCCESS = 'REQUEST_SUCCESS_';

/*
 * Actions for retrieving Account Users from Legacy Stack
 */
export const GET_USERS_FETCHING =  `${REQUEST_FETCHING}GET_USERS`;
export const GET_USERS_FAILURE =  `${REQUEST_FAILURE}GET_USERS`;
export const GET_USERS_SUCCESS =  `${REQUEST_SUCCESS}GET_USERS`;

/*
 * Actions for retrieving metadata about the request user, realm from Legacy Stack
 * (e.g., Account Admin, Realm Admin, etc..)
 */
export const REQUEST_CONTEXT_FETCHING = `${REQUEST_FETCHING}REQUEST_CONTEXT`;
export const REQUEST_CONTEXT_FAILURE = `${REQUEST_FAILURE}REQUEST_CONTEXT`;
export const REQUEST_CONTEXT_SUCCESS = `${REQUEST_SUCCESS}REQUEST_CONTEXT`;
