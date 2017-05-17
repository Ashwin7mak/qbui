import {REQUEST_FAILURE, REQUEST_FETCHING, REQUEST_SUCCESS} from "../../app/actionTypes";

const defaultStatus = {
    isFetching: false,
    error: null
};

const GetStatus = (state = defaultStatus, action) => {
    if (!action.type) {
        return state;
    } else if (action.type.match(`^${REQUEST_SUCCESS}`)) {
        return {
            ...state,
            isFetching: false,
            error: null
        };
    } else if ((action.type.match(`^${REQUEST_FETCHING}`))) {
        return {
            ...state,
            isFetching: true
        };
    } else if ((action.type.match(`^${REQUEST_FAILURE}`))) {
        return {
            ...state,
            isFetching: false,
            error: action.error
        };
    } else {
        return state;
    }
};

export default GetStatus;
