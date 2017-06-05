import * as types from "../../app/actionTypes";
import {combineReducers} from "redux";
import GetStatus from "../reducer/RequestStatusReducer";

const realm = (state = {}, action) => {
    switch (action.type) {
    case types.REQUEST_CONTEXT_SUCCESS:
        return {
            ...action.realm
        };
    default:
        return state;
    }
};

const account = (state = {}, action) => {
    switch (action.type) {
    case types.REQUEST_CONTEXT_SUCCESS:
        return {
            ...action.account
        };
    default:
        return state;
    }
};

const currentUser = (state = {}, action) => {
    switch (action.type) {
    case types.REQUEST_CONTEXT_SUCCESS:
        return {
            ...action.user
        };
    default:
        return state;
    }
};

const RequestContext = combineReducers({
    realm,
    account,
    currentUser,
    status: GetStatus
});

export const isFetching = (state) => {
    return state.RequestContext.status.isFetching || !state.RequestContext.currentUser.id;
};
export const getCurrentUser = (state) => {return state.RequestContext.currentUser;};
export const getRealm = (state) => {return state.RequestContext.realm;};


export default RequestContext;
