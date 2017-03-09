import * as types from '../actions/types';

const AccountUsers = (
    state = {
        //  default states
        users: []
    },
    action) => {

    // reducer - no mutations!
    switch (action.type) {
    case types.SET_USERS:

        // update the state with the new users

        return {
            ...state,
            users: [...action.users]
        };
    default:
        // return existing state by default in redux
        return state;
    }
};

export default AccountUsers;
