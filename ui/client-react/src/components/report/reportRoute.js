import React from 'react';

import Stage from '../stage/stage';
import ReportStage from './dataTable/stage';

import Logger from '../../utils/logger';
let logger = new Logger();

import ReportContent from './dataTable/content';
import Fluxxor from 'fluxxor';
import './report.scss';

let FluxMixin = Fluxxor.FluxMixin(React);

var ReportRoute = React.createClass({
    mixins: [FluxMixin],

    loadReport(appId, tblId, rptId) {
        let flux = this.getFlux();

        flux.actions.loadReport(appId, tblId, rptId, true);
    },
    loadReportFromParams(params) {

        let appId = params.appId;
        let tblId = params.tblId;
        let rptId = params.rptId;

        if (appId && tblId && rptId) {
            //logger.debug('Loading report. AppId:' + appId + ' ;tblId:' + tblId + ' ;rptId:' + rptId);
            this.loadReport(appId, tblId, rptId);
        }
    },

    componentDidMount() {
        this.loadReportFromParams(this.props.params);
    },

    render() {

        return (<div className="reportContainer">
                <Stage stageContent="this is the stage content text" >
                    <ReportStage reportName={this.props.reportData && this.props.reportData.data ? this.props.reportData.data.name : ""}/>
                </Stage>
                <ReportContent reportData={this.props.reportData} />
                </div>);
    }
});

export default ReportRoute;
