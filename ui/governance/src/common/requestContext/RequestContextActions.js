import * as types from "../../app/actionTypes";
import RequestContextService from "./RequestContextService";


const fetchingRequestContext = () => ({
    type: types.REQUEST_CONTEXT_FETCHING
});

const receiveRequestContext = (context) => ({
    ...context,
    type: types.REQUEST_CONTEXT_SUCCESS
});

const failedRequestContext = (error) => ({
    error: error,
    type: types.REQUEST_CONTEXT_FAILURE
});

const fetchRequestContext = (desiredAccountId) => {
    return (dispatch) => {
        const srv = new RequestContextService();
        const promise = srv.getRequestContext(desiredAccountId);

        dispatch(fetchingRequestContext());
        return promise
            .then(response => response.data)
            .then(context => dispatch(receiveRequestContext(context)))
            .catch(error => dispatch(failedRequestContext(error)));
    };
};

const shouldFetchRequestContext = (state, desiredAccountId) => {
    if (!state.RequestContext.account.id) {
        return true;
    } else if (state.RequestContext.status.isFetching) {
        return false;
    } else {
        return state.RequestContext.account.id !== desiredAccountId;
    }
};

export const fetchRequestContextIfNeeded = (desiredAccountId) => {
    return (dispatch, getState) => {
        if (shouldFetchRequestContext(getState(), desiredAccountId)) {
            return dispatch(fetchRequestContext(desiredAccountId));
        }
    };
};
