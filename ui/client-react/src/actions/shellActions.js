import * as types from '../actions/types';
import Breakpoints from '../utils/breakpoints';

// Shell action creators (the Fluxxor navActions.js should be migrated over)

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
 *  Show/hide or expand/collapse the left nav.  For small breakpoint, the action type
 *  is show/hide; for all other breakpoints, it's expand/collapse.
 *
 * @returns {{type, navState}}
 */
export const toggleLeftNav = (navState) => {
    return {
        type: Breakpoints.isSmallBreakpoint() ? types.TOGGLE_LEFT_NAV_VISIBLE : types.TOGGLE_LEFT_NAV_EXPANDED,
        navState
    };
};

/**
 * Show/Hide the row actions menu for report grid
 *
 * @returns {{toggleState}}
 */
export const toggleRowActionsMenu = (toggleState) => {
    return {
        type: types.TOGGLE_ROW_POP_UP_MENU,
        toggleState
    };
};

/**
 * Toggle apps list show/hide state or force to show or hide apps list
 *
 * @returns {{toggleState}}
 */
export const toggleAppsList = (toggleState) => {
    return {
        type: types.TOGGLE_APPS_LIST,
        toggleState
    };
};
