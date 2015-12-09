import * as actions from '../constants/actions';

import Fluxxor from 'fluxxor';
import Locale from '../locales/locales';
import Logger from '../utils/logger';
var logger = new Logger();

let NavStore = Fluxxor.createStore({

    initialize: function() {
        this.state = {
            leftNavOpen: true,
            appsListOpen: false,
            searchBarOpen: false,
            searching:false,
            trouserOpen: false,
            newItemsOpen: false,
            showReports: false,
            leftNavItems: []
        };

        this.setLocaleBundle();

        this.bindActions(
            actions.SHOW_TROUSER, this.onShowTrouser,
            actions.HIDE_TROUSER, this.onHideTrouser,
            actions.SHOW_REPORTS, this.onShowReports,
            actions.HIDE_REPORTS, this.onHideReports,
            actions.SHOW_NEW_ITEMS, this.onShowNewItems,
            actions.TOGGLE_LEFT_NAV, this.onToggleLeftNav,
            actions.TOGGLE_APPS_LIST, this.onToggleAppsList,
            actions.TOGGLE_SEARCH, this.onToggleSearch,
            actions.SEARCHING, this.onSearching,
            actions.CHANGE_LOCALE, this.onChangeLocale
        );

        this.state.leftNavItems.push({key: 'nav.home', link:'/apps', icon:'document-alt'});
        this.state.leftNavItems.push({key: 'nav.users', link:'/users', icon:'customers'});
        this.state.leftNavItems.push({key: 'nav.favorites', link:'/favorites', icon:'star'});
    },

    onChangeLocale: function() {
        logger.debug('changing locale: ' + Locale.getLocale());
        this.setLocaleBundle();
        this.emit('change');
    },

    onShowTrouser: function() {
        this.state.trouserOpen = true;
        this.emit('change');
    },
    onHideTrouser: function() {
        this.state.trouserOpen = false;
        this.emit('change');
    },

    onShowReports: function() {
        this.state.showReports = true;
        this.emit('change');
    },
    onHideReports: function() {
        this.state.showReports = false;
        this.emit('change');
    },
    onToggleSearch: function() {
        this.state.searchBarOpen = !this.state.searchBarOpen;
        this.emit('change');
    },
    onSearching: function(searching) {
        this.state.searching = searching;
        this.emit('change');
    },
    onToggleLeftNav: function(open) {
        if (open === false || open === true) {
            this.state.leftNavOpen = open;
        } else {
            this.state.leftNavOpen = !this.state.leftNavOpen;
        }
        this.emit('change');
    },
    onToggleAppsList: function(show) {
        if (show === false || show === true) {
            this.state.appsListOpen = open;
        } else {
            this.state.appsListOpen = !this.state.appsListOpen;
        }
        this.emit('change');
    },
    onShowNewItems: function() {
        this.state.newItemsOpen = true;
        this.emit('change');
    },
    getState: function() {
        return this.state;
    },

    setLocaleBundle: function() {
        this.state.i18n = Locale.getI18nBundle();
    }
});

export default NavStore;
