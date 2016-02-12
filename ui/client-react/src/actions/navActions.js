// action creators
import * as actions from '../constants/actions';
import Locale from '../locales/locales';

let navActions = {

    showReports() {
        this.dispatch(actions.SHOW_REPORTS);
    },
    hideReports() {
        this.dispatch(actions.HIDE_REPORTS);
    },
    showTrowser(content = null) {
        this.dispatch(actions.SHOW_TROWSER, content);
    },
    hideTrowser() {
        this.dispatch(actions.HIDE_TROWSER);
    },
    showNewItems() {
        this.dispatch(actions.SHOW_NEW_ITEMS);
    },
    toggleLeftNav(open) {
        this.dispatch(actions.TOGGLE_LEFT_NAV, open);
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
    changeLocale(locale) {
        Locale.changeLocale(locale);
        this.dispatch(actions.CHANGE_LOCALE);
    }
};

export default navActions;
