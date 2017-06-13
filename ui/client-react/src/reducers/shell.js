import * as types from '../actions/types';
import Locale from '../locales/locales';
import AppsBundleLoader from '../locales/appsBundleLoader';

const shell = (
    state = {
        //  default states
        appsListOpen: false,
        errorPopupHidden: true,
        isRowPopUpMenuOpen: false,
        leftNavExpanded: true,
        leftNavVisible: false,
        trowserOpen: false,
        trowserContent: null,
        topNavVisible: true,
        openCount: 0,
        locale: Locale.getLocale(),
        i18n: Locale.getI18nBundle(),
        scrollingReport: false,
        filterReportsName: ''
    },
    action) => {

    // reducer - no mutations!
    switch (action.type) {
    case types.SHOW_TROWSER:
        return {
            ...state,
            trowserOpen: true,
            trowserContent: action.content
        };
    case types.HIDE_TROWSER:
        return {
            ...state,
            trowserOpen: false
        };
    case types.TOGGLE_LEFT_NAV_EXPANDED:
        //  Should the left nav window be expanded or collapsed.  Note that the leftNavExpanded state
        //  property is toggled from its current state if action.navState is not a boolean.
        return {
            ...state,
            leftNavExpanded: (typeof action.navState === "boolean" ? action.navState : !state.leftNavExpanded)
        };
    case types.TOGGLE_LEFT_NAV_VISIBLE:
        //  Should the left nav window be hidden or visible.  Note that the leftNavVisible state
        //  property is toggled from its current state if action.navState is not a boolean.
        return {
            ...state,
            leftNavVisible: (typeof action.navState === "boolean" ? action.navState : !state.leftNavVisible)
        };
    case types.TOGGLE_ROW_POP_UP_MENU:
        let openCount = state.openCount;
        if (typeof action.toggleState === "boolean") {
            openCount = action.toggleState ? ++openCount : --openCount;
        }
        openCount = openCount < 0 ? 0 : openCount; //openCount shouldnt go below 0
        return {
            ...state,
            openCount: openCount,
            isRowPopUpMenuOpen: (openCount > 0)
        };
    case types.TOGGLE_APPS_LIST:
        return {
            ...state,
            appsListOpen: (typeof action.toggleState === "boolean" ? action.toggleState : !state.appsListOpen)
        };
    case types.SHOW_ERROR_MSG_DIALOG:
        return {
            ...state,
            errorPopupHidden: false
        };
    case types.HIDE_ERROR_MSG_DIALOG:
        return {
            ...state,
            errorPopupHidden: true
        };
    case types.CHANGE_LOCALE:
        AppsBundleLoader.changeLocale(action.locale);
        return {
            ...state,
            locale: Locale.getLocale(),
            i18n: Locale.getI18nBundle()
        };
    case types.SHOW_TOP_NAV:
        return {
            ...state,
            topNavVisible: true
        };
    case types.HIDE_TOP_NAV:
        return {
            ... state,
            topNavVisible: false
        };
    case types.SCROLLING_REPORT:
        return {
            ...state,
            scrollingReport: action.isScrolling
        };
    case types.FILTER_REPORTS_BY_NAME:
        return {
            ...state,
            filterReportsName: action.reportName
        };
    default:
        // return existing state by default in redux
        return state;
    }
};

export default shell;
