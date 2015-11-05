// action creators
import * as actions from '../constants/actions';
import Locale from '../locales/locales';

let navActions = {

    showTrouser() {
        this.dispatch(actions.SHOW_TROUSER);
    },
    hideTrouser() {
        this.dispatch(actions.HIDE_TROUSER);
    },
    showNewItems() {
        this.dispatch(actions.SHOW_NEW_ITEMS);
    },
    toggleLeftNav(open) {
        this.dispatch(actions.TOGGLE_LEFT_NAV, open);
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
