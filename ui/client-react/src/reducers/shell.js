import * as types from '../actions/types';

const shell = (
    state = {
        //  default states
        trowserOpen: false,
        trowserContent: null,
        leftNavExpanded: true,
        leftNavVisible: false
    },
    action) => {

    // reducer - no mutations!
    switch (action.type) {
    case types.SHOW_TROWSER:
        return {
            ...state,
            trowserOpen: true,
            trowserContent: action.content
        };
    case types.HIDE_TROWSER:
        return {
            ...state,
            trowserOpen: false
        };
    case types.TOGGLE_LEFT_NAV_EXPANDED:
        //  set leftNavExpanded state to navState action if defined and a boolean; otherwise toggle the current state.
        return {
            ...state,
            leftNavExpanded: (typeof action.navState === "boolean" ? action.navState : !state.leftNavExpanded)
        };
    case types.TOGGLE_LEFT_NAV_VISIBLE:
        //  set leftNavVisible state to navState action if defined and a boolean; otherwise toggle the current state.
        return {
            ...state,
            leftNavVisible: (typeof action.navState === "boolean" ? action.navState : !state.leftNavVisible)
        };
    default:
        // return existing state by default in redux
        return state;
    }
};

export default shell;
