import * as types from '../constants/actions';

// action creators (this should replace navActions.js, the Fluxxor version...)

export const showTrowser = (content) => {
    return {
        type: types.SHOW_TROWSER,
        content
    };
};

export const hideTrowser = () => {
    return {
        type: types.HIDE_TROWSER
    };
};
