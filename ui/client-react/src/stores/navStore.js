import * as actions from '../constants/actions';

import Fluxxor from 'fluxxor';
import Locale from '../locales/locales';
import Logger from '../utils/logger';

let logger = new Logger();

let NavStore = Fluxxor.createStore({

    initialize: function() {
        this.state = {
            leftNavVisible: false,
            leftNavExpanded: true,
            appsListOpen: false,
            searchBarOpen: false,
            showTopNav: true,
            searching:false,
            trowserOpen: false,
            topTitle: null,
            scrollingReport: false
        };

        this.setLocaleBundle();

        this.bindActions(
            actions.SHOW_TROWSER, this.onShowTrowser,
            actions.HIDE_TROWSER, this.onHideTrowser,
            actions.TOGGLE_LEFT_NAV_VISIBLE, this.onToggleLeftNavVisible,
            actions.TOGGLE_LEFT_NAV_EXPANDED, this.onToggleLeftNavExpanded,
            actions.TOGGLE_APPS_LIST, this.onToggleAppsList,
            actions.TOGGLE_SEARCH, this.onToggleSearch,
            actions.SEARCHING, this.onSearching,
            actions.CHANGE_LOCALE, this.onChangeLocale,
            actions.SHOW_TOP_NAV, this.onShowTopNav,
            actions.HIDE_TOP_NAV, this.onHideTopNav,
            actions.SET_TOP_TITLE, this.onSetTopTitle,
            actions.SCROLLING_REPORT, this.onScrollingReport
        );
    },

    onChangeLocale: function() {
        logger.debug('changing locale: ' + Locale.getLocale());
        this.setLocaleBundle();
        this.emit('change');
    },
    onShowTrowser: function() {
        this.state.trowserOpen = true;
        this.emit('change');
    },
    onHideTrowser: function() {
        this.state.trowserOpen = false;
        this.emit('change');
    },
    onSetTopTitle: function(title) {
        this.state.topTitle = title;
        this.emit('change');
    },
    onShowTopNav: function() {
        this.state.showTopNav = true;
        this.emit('change');
    },
    onHideTopNav: function() {
        this.state.showTopNav = false;
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

    /*
     * toggle left nav visible (small breakpoint state)
     * @param visible force visible/hidden
     */
    onToggleLeftNavVisible: function(visible) {
        if (visible === false || visible === true) {
            this.state.leftNavVisible = visible;
        } else {
            this.state.leftNavVisible = !this.state.leftNavVisible;
        }
        this.emit('change');
    },
    /*
     * toggle left nav expanded/collapsed (non-small breakpoint state)
     * @param expanded force expanded/collapsed
     */
    onToggleLeftNavExpanded: function(expanded) {
        if (expanded === false || expanded === true) {
            this.state.leftNavExpanded = expanded;
        } else {
            this.state.leftNavExpanded = !this.state.leftNavExpanded;
        }
        this.emit('change');
    },
    /*
     * toggle apps list
     * @param show force shown/hidden
     */
    onToggleAppsList: function(show) {
        if (show === false || show === true) {
            this.state.appsListOpen = show;
        } else {
            this.state.appsListOpen = !this.state.appsListOpen;
        }
        this.emit('change');
    },

    onScrollingReport: function(scrolling) {
        this.state.scrollingReport = scrolling;
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
