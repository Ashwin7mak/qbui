import * as types from '../actions/types';

const featureSwitches = (
    state = {
        //  default states

        switches: [],
        states: [],
    },
    action) => {

    // reducer - no mutations!
    switch (action.type) {
    case types.SET_FEATURE_SWITCHES:
        return {
            ...state,
            switches: action.switches
        };
    case types.SET_FEATURE_SWITCH_STATES:
        return {
            ...state,
            states: action.states
        };
    default:
        // return existing state by default in redux
        return state;
    }
};

export default featureSwitches;
