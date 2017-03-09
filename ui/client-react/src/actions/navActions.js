// action creators
import * as actions from '../constants/actions';
import Breakpoints from '../utils/breakpoints';

let navActions = {

    /**
     * checks to see if row pop up menu is open
     * */
    onToggleRowPopUpMenu(isOpen) {
        this.dispatch(actions.TOGGLE_ROW_POP_UP_MENU, isOpen);
    },
    /**
     * Resets onToggleRowPopUpMenu count to 0
     * */
    //  NO ONE IS LISTENING TO THIS EVENT
    //resetRowMenu() {
    //    this.dispatch(actions.RESET_ROW_MENU);
    //},
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
    /**
     * set a top nav title
     * @param title a react node (or null to omit one)
     */
    setTopTitle(title = null) {
        this.dispatch(actions.SET_TOP_TITLE, title);
    },
    showTopNav() {
        this.dispatch(actions.SHOW_TOP_NAV);
    },
    hideTopNav() {
        this.dispatch(actions.HIDE_TOP_NAV);
    },
    scrollingReport(isScrolling = true) {
        this.dispatch(actions.SCROLLING_REPORT, isScrolling);
    }
};

export default navActions;
