import * as types from '../actions/types';

const shell = (
    //  default states
    state = {
        searchInput: ''
    },
    action) => {

    // reducer - no mutations!
    switch (action.type) {
    case types.SEARCH_INPUT:
        return {
            ...state,
            searchInput: action.content || ''
        };
    default:
        // return existing state by default in redux
        return state;
    }
};

export default shell;
