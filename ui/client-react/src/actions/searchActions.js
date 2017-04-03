import * as types from '../actions/types';

/**
 * Save in the store search input text entered by an end user.
 *
 * @param content
 * @returns {{type, content: *}}
 */
export const searchInput = (content) => {
    return {
        type: types.SEARCH_INPUT,
        content
    };
};

/**
 * Clear the search input text box
 *
 * @returns {{type, content: string}}
 */
export const clearSearchInput = () => {
    return {
        type: types.SEARCH_INPUT,
        content: ''
    };
};
