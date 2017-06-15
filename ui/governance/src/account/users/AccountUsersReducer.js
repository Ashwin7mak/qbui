import * as types from "../../app/actionTypes";
import GetStatus from "../../common/reducer/RequestStatusReducer";
import {combineReducers} from "redux";
import _ from "lodash";
import * as RealmUserAccountFlagConstants from "../../common/constants/RealmUserAccountFlagConstants.js";

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

export const getTotalPaidUsers = _users => {
    const paidUsers = _.filter(_users, user =>  {
        return user.hasAppAccess && !RealmUserAccountFlagConstants.HasAnySystemPermissions(user) && !RealmUserAccountFlagConstants.IsDenied(user) && !RealmUserAccountFlagConstants.IsDeactivated(user);
    });
    return paidUsers.length;
};

export const getTotalDeniedUsers = _users => {
    const deniedUsers = _.filter(_users, user =>  {
        return RealmUserAccountFlagConstants.IsDenied(user);
    });
    return deniedUsers.length;
};

export const getTotalDeactivatedUsers = _users => {
    const deactivatedUsers = _.filter(_users, user =>  {
        return RealmUserAccountFlagConstants.IsDeactivated(user);
    });
    return deactivatedUsers.length;
};

export const getTotalRealmUsers = _users => {
    const totalUsers = _.filter(_users, user =>  {
        return user.realmDirectoryFlags !== 0;
    });
    return totalUsers.length;
};

const AccountUsers = combineReducers({
    users,
    status: GetStatus
});

export const isFetching = (state) => {
    return state.AccountUsers.status.isFetching;
};

export default AccountUsers;
