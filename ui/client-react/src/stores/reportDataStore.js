import * as actions from '../constants/actions';

import Fluxxor from 'fluxxor';
import Logger from '../utils/logger';
import { fakeGriddleDataByReportId } from '../components/dataTable/griddleTable/fakeData.js';

var logger = new Logger();

let ReportDataStore = Fluxxor.createStore({

    initialize: function() {
        this.data = [ ];

        this.bindActions(
            actions.LOAD_REPORT, this.onLoadReport
        );

        this.logger = new Logger();
    },

    onLoadReport: function (reportID) {

        if (fakeGriddleDataByReportId[reportID])
            this.data = fakeGriddleDataByReportId[reportID];
        else
            this.data = fakeGriddleDataByReportId["1"];
        
        this.emit("change");
    },

    getState: function () {

        return {
            data: this.data
        }
    }
});

export default ReportDataStore;