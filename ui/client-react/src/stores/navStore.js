import * as actions from '../constants/actions';
import * as TrowserConsts from "../constants/trowserConstants";

import Fluxxor from 'fluxxor';
import Logger from '../utils/logger';

let logger = new Logger();

let NavStore = Fluxxor.createStore({

    initialize() {
        this.state = {
            searching:false,
            scrollingReport: false,
            filterReportsName: '',
            locale: null,
            openCount: 0
        };

        //this.setLocaleBundle();

        this.bindActions(
            actions.SEARCHING, this.onSearching,
            actions.SCROLLING_REPORT, this.onScrollingReport,
            actions.FILTER_REPORTS_BY_NAME, this.onFilterReportsByName
        );
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
});

export default NavStore;
