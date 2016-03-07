import * as actions from '../constants/actions';

import Fluxxor from 'fluxxor';
import Locale from '../locales/locales';
import Logger from '../utils/logger';

let logger = new Logger();

let NavStore = Fluxxor.createStore({

    initialize: function() {
        this.state = {
            leftNavOpen: true,
            appsListOpen: false,
            searchBarOpen: false,
            searching:false,
            trowserOpen: false,
            topTitle: {label:"", icon:null}
        };

        this.setLocaleBundle();

        this.bindActions(
            actions.SHOW_TROWSER, this.onShowTrowser,
            actions.HIDE_TROWSER, this.onHideTrowser,
            actions.TOGGLE_LEFT_NAV, this.onToggleLeftNav,
            actions.TOGGLE_APPS_LIST, this.onToggleAppsList,
            actions.TOGGLE_SEARCH, this.onToggleSearch,
            actions.SEARCHING, this.onSearching,
            actions.SET_TOP_TITLE, this.onSetTopTitle,
            actions.CHANGE_LOCALE, this.onChangeLocale,

            actions.LOAD_REPORT_SUCCESS, this.onLoadReportSuccess
        );
    },

    onChangeLocale: function() {
        logger.debug('changing locale: ' + Locale.getLocale());
        this.setLocaleBundle();
        this.emit('change');
    },

    /* bind to load report success to update top title */
    onLoadReportSuccess: function(reportData) {
        this.state.topTitle = {name: reportData.name, icon: 'report-menu-3'};
        this.emit('change');
    },
    onSetTopTitle: function(title) {
        this.state.topTitle = title;
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

    onToggleSearch: function() {
        this.state.searchBarOpen = !this.state.searchBarOpen;
        this.emit('change');
    },
    onSearching: function(searching) {
        this.state.searching = searching;
        this.emit('change');
    },

    /*
     * toggle left nav open/closed
     * @param show force shown/hidden
     */
    onToggleLeftNav: function(show) {
        if (show === false || show === true) {
            this.state.leftNavOpen = show;
        } else {
            this.state.leftNavOpen = !this.state.leftNavOpen;
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
    getState: function() {
        return this.state;
    },

    setLocaleBundle: function() {
        this.state.i18n = Locale.getI18nBundle();
    }
});

export default NavStore;
