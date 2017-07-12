import * as types from "../../app/actionTypes";
import GetStatus from "../../common/reducer/RequestStatusReducer";
import {combineReducers} from "redux";
import _ from "lodash";
import * as RealmUserAccountFlagConstants from "../../common/constants/RealmUserAccountFlagConstants.js";
import {createSelector} from 'reselect';

const users = (state = [], action) => {
    switch (action.type) {
    case types.GET_USERS_SUCCESS:
        // update the state with the new users sent through action
        return [...action.users];
    default:
        // return existing state by default in redux
        return state;
    }
};

const AccountUsers = combineReducers({
    users,
    status: GetStatus
});

/**
 * Selector to return the users contained in the account
 * @param state
 */
export const usersSelector = state => state.AccountUsers.users;

/**
 * Selector to return the isFetching status (intended to be used for the initial API call for users)
 * @param state
 * @returns {boolean} - True if the users are being fetched, False if finished
 */
export const isFetching = (state) => {
    return state.AccountUsers.status.isFetching;
};

/**
 * Calculates the number of paid users in the account.
 * Paid users are any users that have access to the app and are not internal Quick Base users
 * @returns {integer}
 */
export const getTotalPaidUsers = createSelector(
    usersSelector,
    allUsers =>
        _.sumBy(allUsers, user => (
            user.hasAppAccess &&
            !RealmUserAccountFlagConstants.HasAnySystemPermissions(user) &&
            !RealmUserAccountFlagConstants.IsDenied(user) &&
            !RealmUserAccountFlagConstants.IsDeactivated(user) ? 1 : 0))
);

/**
 * Calculates the number of denied users in the account
 * @returns {integer}
 */
export const getTotalDeniedUsers = createSelector(
    usersSelector,
    allUsers => _.sumBy(allUsers, user => RealmUserAccountFlagConstants.IsDenied(user) ? 1 : 0)
);

/**
 * Calculates the number of deactivated users in the account
 * @returns {number}
 */
export const getTotalDeactivatedUsers = createSelector(
    usersSelector,
    allUsers => _.sumBy(allUsers, user => RealmUserAccountFlagConstants.IsDeactivated(user) ? 1 : 0)
);

/**
 * Calculates the number of realm users in the account
 * @returns {number}
 */
export const getTotalRealmUsers = createSelector(
    usersSelector,
    allUsers => _.sumBy(allUsers, user => user.realmDirectoryFlags !== 0 ? 1 : 0)
);

export default AccountUsers;
