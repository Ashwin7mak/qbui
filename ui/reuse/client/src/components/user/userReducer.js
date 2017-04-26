import {UPDATE_LOGGED_IN_USER, UPDATE_USER_LOADING_STATUS} from './userActionTypes';

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

export const getLoggedInUserId = state => state.user.id;

export default user;
