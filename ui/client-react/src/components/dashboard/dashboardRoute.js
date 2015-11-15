import React from 'react';
import './dashboard.scss';
import ReportContent from '../report/dataTable/content';
import Fluxxor from 'fluxxor';

import Logger from '../../utils/logger';
let logger = new Logger();

let FluxMixin = Fluxxor.FluxMixin(React);

var DashboardRoute = React.createClass({
    mixins: [FluxMixin],

    loadReport(appId, tblId, rptId) {
        let flux = this.getFlux();
        flux.actions.loadReport(appId, tblId, rptId, true);
    },
    // Triggered when properties change
    componentWillReceiveProps: function(props) {

        if (props.params) {
            let appId = props.params.appId;
            let tblId = props.params.tblId;
            let rptId = props.params.rptId;

            // VERY IMPORTANT: check URL params against props to prevent cycles
            if (appId === this.props.reportData.appId &&
                tblId === this.props.reportData.tblId &&
                rptId === this.props.reportData.rptId) {
                return;
            }

            if (appId && tblId && rptId) {
                logger.debug('Loading report. AppId:' + appId + ' ;tblId:' + tblId + ' ;rptId:' + rptId);
                this.loadReport(appId, tblId, rptId);
            }
        }
    },

    // DEMO CODE TO EXPLORE NESTED TABLES etc.
    render: function() {

        return (<div className="dashboard">

                <div className="dashboardRow">
                    <div className="narrow">
                        <ReportContent className="narrow" reportData={this.props.reportData} />
                    </div>
                    <div className="wide">
                        <ReportContent className="narrow" reportData={this.props.reportData} />
                    </div>
                </div>
                <div className="dashboardRow">
                    <div className="narrow">
                        <ReportContent reportData={this.props.reportData} />
                    </div>
                    <div className="wide">
                        <ReportContent reportData={this.props.reportData} />
                    </div>
                </div>

            </div>);
    }
});

export default DashboardRoute;
