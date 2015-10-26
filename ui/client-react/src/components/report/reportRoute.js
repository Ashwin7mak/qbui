import React from 'react';
import ReactIntl from 'react-intl';
//import ReactBootstrap from 'react-bootstrap';

import Stage from '../stage/stage';
import ReportStage from './dataTable/stage';

import Logger from '../../utils/logger';
let logger = new Logger();

import ReportContent from './dataTable/content';
import Fluxxor from 'fluxxor';
import './report.scss';

let FluxMixin = Fluxxor.FluxMixin(React);
var IntlMixin = ReactIntl.IntlMixin;

var ReportRoute = React.createClass({
    mixins: [IntlMixin, FluxMixin],

    loadReport(appId, tblId, rptId){
        let flux = this.getFlux();
        flux.actions.loadReport(appId, tblId, rptId, true);
    },
    loadReportFromParams(params, checkParams) {

        if (params) {
            let appId = params.appId;
            let tblId = params.tblId;
            let rptId = params.rptId;

            // VERY IMPORTANT: check URL params against props to prevent cycles

            if (this.props.reportData.loading) {
                return;
            }

            if (appId === this.props.reportData.appId &&
                tblId === this.props.reportData.tblId &&
                rptId === this.props.reportData.rptId) {
                return;
            }

            if (checkParams) {
                if (appId === this.props.params.appId &&
                    tblId === this.props.params.tblId &&
                    rptId === this.props.params.rptId) {
                    return;
                }
            }

            if (appId && tblId && rptId) {
                logger.debug('Loading report. AppId:' + appId + ' ;tblId:' + tblId + ' ;rptId:' + rptId);
                this.loadReport(appId, tblId, rptId);
            }
        }
    },
    componentDidMount() {
        this.loadReportFromParams(this.props.params);
    },

    // Triggered when properties change
    componentWillReceiveProps(props) {

        this.loadReportFromParams(props.params, true);
    },

    render() {

        return (<div className="reportContainer">
                <Stage stageContent="this is the stage content text" >
                    <ReportStage {...this.props.i18n} reportName={this.props.reportData && this.props.reportData.data ? this.props.reportData.data.name : ""}/>
                </Stage>
                <ReportContent {...this.props.i18n} reportData={this.props.reportData} mobile={this.props.mobile}/>
                </div>);
    }
});

export default ReportRoute;
