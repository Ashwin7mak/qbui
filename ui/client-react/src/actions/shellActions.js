import * as types from '../actions/types';
import Breakpoints from '../utils/breakpoints';

// action creators (the Fluxxor navActions.js should be migrated over)

/**
 * Show the trowser
 *
 * @param content which trowser ID (see TrowserConsts.js)
 * @returns {{type, content: *}}
 */
export const showTrowser = (content) => {
    return {
        type: types.SHOW_TROWSER,
        content
    };
};

/**
 * Hide the trowser
 *
 * @returns {{type}}
 */
export const hideTrowser = () => {
    return {
        type: types.HIDE_TROWSER
    };
};

/**
 * Based on breakpoint size, toggle either the visibility of the left nav or toggle
 * the expand/collapse state of the nav.
 *
 * @returns {{type, navState}}
 */
export const toggleLeftNav = (navState) => {
    return {
        type: Breakpoints.isSmallBreakpoint() ? types.TOGGLE_LEFT_NAV_VISIBLE : types.TOGGLE_LEFT_NAV_EXPANDED,
        navState
    };

};
