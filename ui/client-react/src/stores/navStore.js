import * as actions from '../constants/actions';
import * as TrowserConsts from "../constants/trowserConstants";

import Fluxxor from 'fluxxor';
import Locale from '../locales/locales';
import Logger from '../utils/logger';

let logger = new Logger();

let NavStore = Fluxxor.createStore({

    initialize() {
        this.state = {
            leftNavVisible: false,
            leftNavExpanded: true,
            appsListOpen: false,
            searchBarOpen: false,
            showTopNav: true,
            searching:false,
            trowserOpen: false,
            isRowPopUpMenuOpen: false,
            trowserContent: TrowserConsts.TROWSER_EDIT_RECORD,
            topTitle: null,
            scrollingReport: false,
            filterReportsName: '',
            errorPopupHidden: true,
            openCount: 0
        };

        this.setLocaleBundle();

        this.bindActions(
            actions.SHOW_TROWSER, this.onShowTrowser,
            actions.HIDE_TROWSER, this.onHideTrowser,
            actions.TOGGLE_ROW_POP_UP_MENU, this.onToggleRowPopUpMenu,
            actions.TOGGLE_LEFT_NAV_VISIBLE, this.onToggleLeftNavVisible,
            actions.TOGGLE_LEFT_NAV_EXPANDED, this.onToggleLeftNavExpanded,
            actions.TOGGLE_APPS_LIST, this.onToggleAppsList,
            actions.TOGGLE_SEARCH, this.onToggleSearch,
            actions.SEARCHING, this.onSearching,
            actions.CHANGE_LOCALE, this.onChangeLocale,
            actions.SHOW_TOP_NAV, this.onShowTopNav,
            actions.HIDE_TOP_NAV, this.onHideTopNav,
            actions.SET_TOP_TITLE, this.onSetTopTitle,
            actions.SCROLLING_REPORT, this.onScrollingReport,
            actions.FILTER_REPORTS_BY_NAME, this.onFilterReportsByName,
            actions.SHOW_ERROR_MSG_DIALOG, this.onShowErrorMsgDialog,
            actions.HIDE_ERROR_MSG_DIALOG, this.onHideErrorMsgDialog
        );
    },

    onChangeLocale() {
        logger.debug('changing locale: ' + Locale.getLocale());
        this.setLocaleBundle();
        this.emit('change');
    },
    onShowTrowser(content) {
        this.state.trowserOpen = true;
        this.state.trowserContent = content;
        this.emit('change');
    },
    onToggleRowPopUpMenu(isOpen) {
        //Originally if a user opens up one menu then opened up a second menu, the padding would be removed from the page, and the row menu pop up would be clipped
            //by keeping track of the count, makes sure padding remains at the bottom of the page, even if a user clicks on one menu and then clicks on a separate menu
        if (isOpen) {
            this.state.openCount++;
        } else {
            this.state.openCount--;
        }
        this.state.isRowPopUpMenuOpen = this.state.openCount > 0;
        this.emit('change');
    },
    resetRowMenu() {
        this.state.openCount = 0;
    },
    onHideTrowser() {
        this.state.trowserOpen = false;
        this.emit('change');
    },
    onSetTopTitle(title) {
        this.state.topTitle = title;
        this.emit('change');
    },
    onShowTopNav() {
        this.state.showTopNav = true;
        this.emit('change');
    },
    onHideTopNav() {
        this.state.showTopNav = false;
        this.emit('change');
    },
    onToggleSearch() {
        this.state.searchBarOpen = !this.state.searchBarOpen;
        this.emit('change');
    },
    onSearching(searching) {
        this.state.searching = searching;
        this.emit('change');
    },
    onFilterReportsByName(name) {
        this.state.filterReportsName = name;
        this.emit('change');
    },
    /*
     * toggle left nav visible (small breakpoint state)
     * @param visible force visible/hidden
     */
    onToggleLeftNavVisible(visible) {
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
    onToggleLeftNavExpanded(expanded) {
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
    onToggleAppsList(show) {
        if (show === false || show === true) {
            this.state.appsListOpen = show;
        } else {
            this.state.appsListOpen = !this.state.appsListOpen;
        }
        this.emit('change');
    },

    onScrollingReport(scrolling) {
        this.state.scrollingReport = scrolling;
        this.emit('change');
    },

    getState() {
        return this.state;
    },

    setLocaleBundle() {
        this.state.i18n = Locale.getI18nBundle();
    },
    onShowErrorMsgDialog() {
        this.state.errorPopupHidden = false;
        this.emit('change');
    },
    onHideErrorMsgDialog() {
        this.state.errorPopupHidden = true;
        this.emit('change');
    },
});

export default NavStore;
