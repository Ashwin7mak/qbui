import * as types from "../../app/actionTypes";
import GetStatus from "../../common/reducer/RequestStatusReducer";
import {combineReducers} from "redux";
import _ from "lodash";
import * as RealmUserAccountFlagConstants from "../../common/constants/RealmUserAccountFlagConstants.js";

const users = (state = [], action) => {
    switch (action.type) {
    case types.GET_USERS_SUCCESS:
        // update the state with the new users sent through action
        let startTime = window.performance.mark('time to load grid');
        return [...action.users];
        let endTime = window.performance.mark('end of load grid');
    default:
        // return existing state by default in redux
        return state;
    }
};

const AccountUsers = combineReducers({
    users,
    status: GetStatus
});

export const isFetching = (state) => {
    return state.AccountUsers.status.isFetching;
};

/**
 * Paid users are any users that have access to the app and are not internal Quick Base users
 * @returns {*}
 */
export const getTotalPaidUsers = state => {
    return _.sumBy(state.AccountUsers.users, user =>  (
        user.hasAppAccess && !RealmUserAccountFlagConstants.HasAnySystemPermissions(user) && !RealmUserAccountFlagConstants.IsDenied(user) && !RealmUserAccountFlagConstants.IsDeactivated(user) ? 1 : 0));
};

export const getTotalDeniedUsers = state => {
    return _.sumBy(state.AccountUsers.users, user =>  (RealmUserAccountFlagConstants.IsDenied(user) ? 1 : 0));
};

export const getTotalDeactivatedUsers = state => {
    return _.sumBy(state.AccountUsers.users, user =>  (RealmUserAccountFlagConstants.IsDeactivated(user) ? 1 : 0));
};

export const getTotalRealmUsers = state => {
    return _.sumBy(state.AccountUsers.users, user =>  (user.realmDirectoryFlags !== 0 ? 1 : 0));
};

export default AccountUsers;
