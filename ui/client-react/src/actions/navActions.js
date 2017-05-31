// action creators
import * as actions from '../constants/actions';
import Breakpoints from '../utils/breakpoints';
import AppsBundleLoader from '../locales/appsBundleLoader';

let navActions = {

    /**
     * checks to see if row pop up menu is open
     * */
    onToggleRowPopUpMenu(isOpen) {
        this.dispatch(actions.TOGGLE_ROW_POP_UP_MENU, isOpen);
    },
    toggleSearch() {
        this.dispatch(actions.TOGGLE_SEARCH);
    },
    searchFor(text) {
        this.dispatch(actions.SEARCH_FOR, text);
    },
    setSearching(searching) {
        this.dispatch(actions.SEARCHING, searching);
    },
    filterReportsByName(text) {
        this.dispatch(actions.FILTER_REPORTS_BY_NAME, text);
    },
    changeLocale(locale) {
        AppsBundleLoader.changeLocale(locale);
        this.dispatch(actions.CHANGE_LOCALE);
    },
    scrollingReport(isScrolling = true) {
        this.dispatch(actions.SCROLLING_REPORT, isScrolling);
    }
};

export default navActions;
