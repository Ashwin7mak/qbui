import * as types from '../../app/actionTypes';
import {combineReducers} from 'redux';

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

const defaultStatus = {
    isFetching: false,
    error: null
};

const status = (state = defaultStatus, action) => {
    switch (action.type) {
    case types.REQUEST_CONTEXT_SUCCESS:
        return {
            ...state,
            isFetching: false,
            error: null
        };
    case types.REQUEST_CONTEXT_FETCHING:
        return {
            ...state,
            isFetching: true
        };
    case types.REQUEST_CONTEXT_FAILURE:
        return {
            ...state,
            isFetching: false,
            error: action.error
        };
    default:
        return state;
    }
};

const RequestContext = combineReducers({
    realm,
    account,
    currentUser,
    status
});

export default RequestContext;
