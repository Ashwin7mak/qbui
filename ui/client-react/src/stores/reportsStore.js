import * as actions from '../constants/actions';

import Fluxxor from 'fluxxor';
import ReportService from '../services/reportService';
import Logger from '../utils/logger';

let ReportsStore = Fluxxor.createStore({
    initialize: function() {
        this.reports = [];

        this.bindActions(
            // activate actions once implemented..
            //
            //'ADD_TABLE', this.onAddReport,
            //'REMOVE_TABLE', this.onRemoveReport,
            actions.LOAD_REPORTS, this.onLoadReports
        );

        this.logger = new Logger();
        this.reportService = new ReportService();
    },
    //onAddReport: function(report) {
    //    this.reports.push(report);
    //    this.emit('change');
    //},
    //onRemoveReport: function(id) {
    //    this.reports.splice(index, 1);
    //    this.emit('change');
    //},

    onLoadReports: function(report) {

        this.reports = [];
        if (report.appId && report.tblId) {
            this.reportService.getReports(report.appId, report.tblId).
                then(
                function(response) {
                    this.logger.debug('success:' + response);
                    response.data.forEach(function(rpt) {
                        this.reports.push({id: rpt.id, name: rpt.name, link: this.buildLink(report.appId, report.tblId, rpt.id)});
                    }.bind(this));
                    this.emit('change');
                }.bind(this),
                function(error) {
                    this.logger.debug('error:' + error);
                    this.emit('change');
                }.bind(this))
                .catch(
                function(ex) {
                    this.logger.debug('exception:' + ex);
                    this.emit('change');
                }.bind(this)
            );
        } else {
            this.emit('change');
        }
    },

    buildLink: function(appId, tblId, rptId) {
        return '/app/' + appId + '/table/' + tblId + '/report/' + rptId;
    },

    getState: function() {
        return {
            list: this.reports
        };
    }
});

export default ReportsStore;