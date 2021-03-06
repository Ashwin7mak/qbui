import * as types from '../actions/types';
import Breakpoints from '../utils/breakpoints';

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
 * @returns {{type, toggleState}}
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

/**
 * Show error message dialog
 *
 * @returns {{type}}
 */
export const showErrorMsgDialog = () => {
    return {
        type: types.SHOW_ERROR_MSG_DIALOG
    };
};

/**
 * Hide error message dialog
 *
 * @returns {{type}}
 */
export const hideErrorMsgDialog = () => {
    return {
        type: types.HIDE_ERROR_MSG_DIALOG
    };
};

/**
 * Change the locale
 *
 * @param locale
 * @returns {{type, locale: *}}
 */
export const changeLocale = (locale) => {
    return {
        type: types.CHANGE_LOCALE,
        locale
    };
};

/**
 * Show top nav (Today, top nav is not shown only for small breakpoint)
 * @returns {{type: *}}
 */
export const showTopNav = () => {
    return {
        type: types.SHOW_TOP_NAV
    };
};

/**
 * Hide top nav (Hidden for small breakpoint)
 * @returns {{type}}
 */
export const hideTopNav = () => {
    return {
        type: types.HIDE_TOP_NAV
    };
};
/**
 * filter report by name
 * @param reportName
 * @returns {{type, reportName: string}}
 */
export const filterReportsByName = (reportName = "") => {
    return {
        type: types.FILTER_REPORTS_BY_NAME,
        reportName
    };
};
/**
 * hide scrolling on reports for a small interval
 * @param isScrolling
 * @returns {{type, isScrolling: boolean}}
 */
export const scrollingReport = (isScrolling = true) => {
    return {
        type: types.SCROLLING_REPORT,
        isScrolling
    };
};
