import React from 'react';
import ReactIntl from 'react-intl';
import ReactBootstrap from 'react-bootstrap';
import { Locale, getI18nBundle } from '../../locales/locales';
import Stage from '../stage/stage';
import ReportStage from './dataTable/stage';
import Logger from '../../utils/logger';
let logger = new Logger();
import ReportContent from './dataTable/content';
import Fluxxor from 'fluxxor';
import './report.scss';

let FluxMixin = Fluxxor.FluxMixin(React);
var i18n = getI18nBundle();

var ReportRoute = React.createClass( {
    mixins: [FluxMixin],

    loadReportFromParams: function(params, checkParams) {

        if (params) {
            let appId = params.appId;
            let tblId = params.tblId;
            let rptId = params.rptId;

            // VERY IMPORTANT: check URL params against props to prevent cycles

            if (this.props.reportData.loading)
                return;

            if (appId == this.props.reportData.appId &&
                tblId == this.props.reportData.tblId &&
                rptId == this.props.reportData.rptId) {
                return;
            }

            if (checkParams) {
                if (appId == this.props.params.appId &&
                    tblId == this.props.params.tblId &&
                    rptId == this.props.params.rptId) {
                    return;
                }
            }

            if (appId && tblId && rptId) {
                logger.debug('Loading report. AppId:' + appId + ' ;tblId:' + tblId + ' ;rptId:' + rptId);
                let flux = this.getFlux();

                flux.actions.loadReport(appId, tblId, rptId);
            }
        }
    },
    componentDidMount: function() {
        this.loadReportFromParams(this.props.params);
    },

    // Triggered when properties change
    componentWillReceiveProps: function(props) {

        this.loadReportFromParams(props.params,true);
    },

    render: function() {

        return (<div className='reportContainer'>
                <Stage stageContent='this is the stage content text' >
                    <ReportStage {...i18n} reportName={this.props.reportData.data.name}/>
                </Stage>
                <ReportContent {...i18n} reportData={this.props.reportData} mobile={this.props.mobile}/>
                </div>);
    }
});

export default ReportRoute;