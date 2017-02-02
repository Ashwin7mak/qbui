import * as types from '../actions/types';

const featureSwitches = (
    state = {
        //  default states

        switches: [],
        exceptions: [],
        statuses: [],
    },
    action) => {

    // reducer - no mutations!
    switch (action.type) {
    case types.SET_FEATURE_SWITCHES:
        return {
            ...state,
            switches: action.switches
        };
    case types.SET_FEATURE_SWITCH_EXCEPTIONS:
        return {
            ...state,
            exceptions: action.exceptions
        };
    case types.SET_FEATURE_SWITCH_STATUSES:
        return {
            ...state,
            statuses: action.statuses
        };
    default:
        // return existing state by default in redux
        return state;
    }
};

export default featureSwitches;
