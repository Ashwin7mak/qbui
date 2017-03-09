import * as actions from '../constants/actions';
import * as TrowserConsts from "../constants/trowserConstants";

import Fluxxor from 'fluxxor';
//import Locale from '../locales/locales';
import Logger from '../utils/logger';

let logger = new Logger();

let NavStore = Fluxxor.createStore({

    initialize() {
        this.state = {
            searchBarOpen: false,
            showTopNav: true,
            searching:false,
            isRowPopUpMenuOpen: false,
            trowserContent: TrowserConsts.TROWSER_EDIT_RECORD,
            topTitle: null,
            scrollingReport: false,
            filterReportsName: '',
            locale: null,
            openCount: 0
        };

        //this.setLocaleBundle();

        this.bindActions(
            actions.TOGGLE_ROW_POP_UP_MENU, this.onToggleRowPopUpMenu,
            actions.TOGGLE_SEARCH, this.onToggleSearch,
            actions.SEARCHING, this.onSearching,
            //actions.CHANGE_LOCALE, this.onChangeLocale,
            actions.SHOW_TOP_NAV, this.onShowTopNav,
            actions.HIDE_TOP_NAV, this.onHideTopNav,
            actions.SET_TOP_TITLE, this.onSetTopTitle,
            actions.SCROLLING_REPORT, this.onScrollingReport,
            actions.FILTER_REPORTS_BY_NAME, this.onFilterReportsByName
        );
    },

    //onChangeLocale() {
    //    logger.debug('changing locale: ' + Locale.getLocale());
    //    this.setLocaleBundle();
    //    this.emit('change');
    //},
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
    onScrollingReport(scrolling) {
        this.state.scrollingReport = scrolling;
        this.emit('change');
    },

    getState() {
        return this.state;
    }

    //setLocaleBundle() {
    //    this.state.locale = Locale.getLocale();
    //    this.state.i18n = Locale.getI18nBundle();
    //}
});

export default NavStore;
