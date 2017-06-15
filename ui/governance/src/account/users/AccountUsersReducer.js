import * as types from "../../app/actionTypes";
import GetStatus from "../../common/reducer/RequestStatusReducer";
import {combineReducers} from "redux";

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

export const isFetching = (state) => {
    return state.AccountUsers.status.isFetching;
};

export default AccountUsers;
