import * as actions from '../constants/actions';

import Fluxxor from 'fluxxor';

import Logger from '../utils/logger';

let ReportsStore = Fluxxor.createStore({
    initialize: function() {
        this.reports = [];
        this.loading = false;
        this.error = false;

        this.bindActions(
            // activate actions once implemented..
            //
            actions.LOAD_REPORTS, this.onLoadReports,
            actions.LOAD_REPORTS_SUCCESS, this.onLoadReportsSuccess,
            actions.LOAD_REPORTS_FAILED, this.onLoadReportsFailed
        );

        this.logger = new Logger();

    },
    onLoadReports: function() {
        this.loading = true;
        this.emit("change");
    },
    onLoadReportsFailed: function() {
        this.loading = false;
        this.error = true;
        this.emit("change");
    },

    onLoadReportsSuccess: function(reports) {
        this.loading = false;
        this.error = false;

        this.reports = [];
        reports.data.forEach((rpt) => {
            this.reports.push({id: rpt.id, name: rpt.name, link: this.buildLink(reports.appId, reports.tblId, rpt.id)});
        });

        this.emit('change');
    },

    buildLink: function(appId, tblId, rptId) {
        return '/app/' + appId + '/table/' + tblId + '/report/' + rptId;
    },


    getState: function() {
        return {
            list: this.reports,
            loading: this.loading,
            error: this.error
        };
    }
});

export default ReportsStore;
