import * as types from "../../app/actionTypes";
import RequestContextService from "./RequestContextService";
import WindowLocationUtils from "../../../../client-react/src/utils/windowLocationUtils";
import {FORBIDDEN, INTERNAL_SERVER_ERROR} from "../../../../client-react/src/constants/urlConstants";
import Logger from "../../../../client-react/src/utils/logger";
import LogLevel from "../../../../client-react/src/utils/logLevels";

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
        let logger = new Logger();
        const srv = new RequestContextService();
        const promise = srv.getRequestContext(desiredAccountId);

        dispatch(fetchingRequestContext());
        return promise
            .then(response => response.data)
            .then(context => dispatch(receiveRequestContext(context)))
            .catch(error => {
                dispatch(failedRequestContext(error));
                if (error.response && error.response.status === 403) {
                    logger.parseAndLogError(LogLevel.WARN, error.response, 'requestContextService.getRequestContext:');
                    WindowLocationUtils.update(FORBIDDEN);
                } else if (!(error.response && error.response.status === 401)) {
                    // Since BaseService might be in the process of handling the redirect to current stack,
                    // we have to provide an additional IF guard here so that we don't redirect to INTERNAL_SERVER_ERROR
                    logger.parseAndLogError(LogLevel.ERROR, error.response, 'requestContextService.getRequestContext:');
                    WindowLocationUtils.update(INTERNAL_SERVER_ERROR);
                }
            });
    };
};

const shouldFetchRequestContext = (state, desiredAccountId) => {
    if (state.RequestContext.status.isFetching) {
        return false;
    } else if (!state.RequestContext.account.id) {
        return true;
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
