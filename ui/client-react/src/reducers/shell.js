import * as types from '../constants/actions';

const shell = (state = {trowserOpen: false, trowserContent: null}, action) => {

    // reducer - no mutations!
    switch (action.type) {
    case types.SHOW_TROWSER:
        return {
            trowserOpen: true,
            trowserContent: action.content
        };
    case types.HIDE_TROWSER:
        return {
            ...state,
            trowserOpen: false,
        };

    default:
        // return existing state by default in redux
        return state;
    }
};

export default shell;
