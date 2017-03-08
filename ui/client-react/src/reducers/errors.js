import * as types from '../actions/types';

const errors = (
    state = {
        //  default states
        status: undefined
    },
    action) => {

    // reducer - no mutations!
    switch (action.type) {
    case types.FORBIDDEN:

        // update switches

        return {
            ...state,
            status: 403
        };

    default:
        // return existing state by default in redux
        return {
            ...state,
            status: 200
        };
    }
};

export default errors;
