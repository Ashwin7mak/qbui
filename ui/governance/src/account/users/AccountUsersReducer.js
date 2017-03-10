import * as types from '../../app/types';

const AccountUsers = (
    state = {
        // default states

        // empty user list initially
        users: []
    },
    action) => {

    // reducer - no mutations!
    switch (action.type) {
    case types.SET_USERS:

        // update the state with the new users sent through action

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
