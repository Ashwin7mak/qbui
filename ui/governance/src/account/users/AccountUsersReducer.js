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

export const getTotalPaidUsers = state => _.sumBy(state.AccountUsers.users, user =>  (
    user.hasAppAccess && !RealmUserAccountFlagConstants.HasAnySystemPermissions(user) && !RealmUserAccountFlagConstants.IsDenied(user) && !RealmUserAccountFlagConstants.IsDeactivated(user) ? 1 : 0));

const AccountUsers = combineReducers({
    users,
    status: GetStatus
});

export const isFetching = (state) => {
    return state.AccountUsers.status.isFetching;
};

export default AccountUsers;
