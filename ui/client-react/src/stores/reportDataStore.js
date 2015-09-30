
import Fluxxor from 'fluxxor';
import Logger from '../utils/logger';
import { fakeGriddleDataByReportId } from '../components/dataTable/griddleTable/fakeData.js';

let ReportDataStore = Fluxxor.createStore({

    initialize: function() {
        this.data = [ ];

        this.bindActions(
            'LOAD_REPORT', this.onLoadReport
        );

        this.logger = new Logger();
    },

    onLoadReport: function (reportID) {

        if (fakeGriddleDataByReportId[reportID])
            this.data = fakeGriddleDataByReportId[reportID];
        else
            this.data = fakeGriddleDataByReportId["1"];

        console.log('loaded!',reportID,this.data)

        this.emit("change");
    },

    getState: function () {

        return {
            data: this.data
        }
    }
});

export default ReportDataStore;