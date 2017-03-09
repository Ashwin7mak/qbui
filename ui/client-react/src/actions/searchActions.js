import * as types from '../actions/types';

export const searchInput = (content) => {
    return {
        type: types.SEARCH_INPUT,
        content
    };
};

export const clearSearchInput = () => {
    return {
        type: types.SEARCH_INPUT,
        content: ''
    };
};
