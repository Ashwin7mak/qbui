import * as types from '../actions/types';

const users = (
    //  default states
    state = {
        searchedUsers: []
    },
    action) => {

    // reducer - no mutations!
    switch (action.type) {
    case types.SEARCH_USERS_SUCCESS:
        return {
            ...state,
            searchedUsers: action.content || []
        };
    default:
        // return existing state by default in redux
        return state;
    }
};

export default users;

export const getSearchedUsers = (state) => {
    return state.searchedUsers;
};
