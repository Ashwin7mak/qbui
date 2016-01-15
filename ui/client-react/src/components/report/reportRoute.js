import React from 'react';
import {I18nMessage} from '../../utils/i18nMessage';
import Locale from '../../locales/locales';
import Stage from '../stage/stage';
import ReportStage from './dataTable/reportStage';

import Logger from '../../utils/logger';
let logger = new Logger();

import ReportContent from './dataTable/reportContent';
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
        var facetExpression = [{fid:'3', values:['10', '11']}, {fid:'4', values:['abc']}];

        let flux = this.getFlux();
        flux.actions.filterReport(this.props.params.appId, this.props.params.tblId, this.props.params.rptId, true, facetExpression);
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

                <div> This is hard wired to call filter by facets - only matches Record#id = 10 OR 11 <button className="testFilterButton" onClick={this.filterReport}> Fake filter this report </button></div>

                <ReportContent reportData={this.props.reportData}/>
                </div>);
    }
});

export default ReportRoute;
