// action creators
import * as actions from '../constants/actions';
import Locale from '../locales/locales';

let navActions = {

    showTrouser: function() {
        this.dispatch(actions.SHOW_TROUSER);
    },
    hideTrouser: function() {
        this.dispatch(actions.HIDE_TROUSER);
    },
    showNewItems: function() {
        this.dispatch(actions.SHOW_NEW_ITEMS);
    },
    toggleLeftNav: function() {
        this.dispatch(actions.TOGGLE_LEFT_NAV);
    },
    toggleSearch: function() {
        this.dispatch(actions.TOGGLE_SEARCH);
    },
    searchFor: function(text) {
        this.dispatch(actions.SEARCH_FOR, text)
    },
    changeLocale: function(locale) {
        Locale.changeLocale(locale);
        this.dispatch(actions.CHANGE_LOCALE);
    }
};

export default navActions