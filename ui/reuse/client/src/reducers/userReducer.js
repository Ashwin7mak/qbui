import {UPDATE_LOGGED_IN_USER, UPDATE_USER_LOADING_STATUS} from 'REUSE/actions/userActions';

const user = (state = {isLoading: false}, action) => {
    switch (action.type) {
    case UPDATE_USER_LOADING_STATUS: {
        return {
            ...state,
            isLoading: action.isLoading
        };
    }

    case UPDATE_LOGGED_IN_USER: {
        return {
            ...state,
            ...action.user,
            isLoading: action.isLoading
        };
    }

    default: {
        return state;
    }
    }
};

export const getLoggedInUser = state => state.user;

export const getLoggedInUserId = state => (state.user ? state.user.id : undefined);

export const getLoggedInUserAdminStatus = state => (state.user ? state.user.administrator : undefined);

export const getLoggedInUserDropDownText = (state) => {
    if (state.user && state.user.firstName) {
        return state.user.firstName;
    } else if (state.user && state.user.email) {
        return state.user.email.split("@")[0];
    } else {
        return null;
    }
};

export default user;
