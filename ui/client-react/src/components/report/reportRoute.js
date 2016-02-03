import React from 'react';
import {I18nMessage} from '../../utils/i18nMessage';
import Locale from '../../locales/locales';
import Stage from '../stage/stage';
import ReportStage from './reportStage';

import Logger from '../../utils/logger';
let logger = new Logger();

import ReportToolsAndContent from './reportToolsAndContent';
import EmailReportLink from '../actions/emailReportLink';
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
    /* Placeholder method to hook into node layer call to get filtered records when user selects a facet
    * Hardcoded facetExpression for testing
    * TODO: replace with a real method.*/
    filterReport: function(){
        var filter = {
            facet: [{fid: '3', values: ['10', '11']}, {fid: '4', values: ['abc']}],
            search: ''
        };

        let flux = this.getFlux();
        flux.actions.filterReport(this.props.params.appId, this.props.params.tblId, this.props.params.rptId, true, filter);
    },
    componentDidMount() {
        if (this.props.params) {
            this.loadReportFromParams(this.props.params);
        }
    },

    render() {

        return (<div className="reportContainer">
                <Stage stageContent="this is the stage content text" >
                    <ReportStage reportData={this.props.reportData}/>
                </Stage>


                <ReportToolsAndContent reportData={this.props.reportData}
                                       appId={this.props.params.appId}
                                       tblId={this.props.params.tblId}
                                       rptId={this.props.params.rptId}
                />
                </div>);
    }
});

export default ReportRoute;
