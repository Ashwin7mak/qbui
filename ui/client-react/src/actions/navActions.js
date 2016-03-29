// action creators
import * as actions from '../constants/actions';
import Locale from '../locales/locales';
import Breakpoints from '../utils/breakpoints';

let navActions = {

    showTrowser() {
        this.dispatch(actions.SHOW_TROWSER);
    },
    hideTrowser() {
        this.dispatch(actions.HIDE_TROWSER);
    },
    /**
     * either toggle the visibility of the left nav or toggle the expanded/collapsed state depending on the breakpoint
     */
    toggleLeftNav(open) {
        const toggleLeftNavAction = Breakpoints.isSmallBreakpoint() ? actions.TOGGLE_LEFT_NAV_VISIBLE : actions.TOGGLE_LEFT_NAV_EXPANDED;
        this.dispatch(toggleLeftNavAction, open);
    },
    toggleAppsList(open) {
        this.dispatch(actions.TOGGLE_APPS_LIST, open);
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
    changeLocale(locale) {
        Locale.changeLocale(locale);
        this.dispatch(actions.CHANGE_LOCALE);
    }
};

export default navActions;
