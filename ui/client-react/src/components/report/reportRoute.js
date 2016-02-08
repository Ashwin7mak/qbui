import React from 'react';
import {I18nMessage} from '../../utils/i18nMessage';
import Locale from '../../locales/locales';
import Stage from '../stage/stage';
import ReportStage from './reportStage';


import Logger from '../../utils/logger';
let logger = new Logger();

import ReportToolsAndContent from './reportToolsAndContent';
import EmailReportLink from '../actions/emailReportLink';
import StringUtils from '../../utils/stringUtils';

import Fluxxor from 'fluxxor';
import _ from 'lodash';
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
        if (_.isUndefined(this.props.params) ||
            _.isUndefined(this.props.params.appId) ||
            _.isUndefined(this.props.params.tblId) ||
            _.isUndefined(this.props.params.rptId)) {
            logger.info("the necessary params were not specified to reportRoute render params=" + StringUtils.simpleStringify(this.props.params));
            return <div> Insufficient parameters supplied</div>;
        } else {
            return (<div className="reportContainer">
                <Stage stageContent="this is the stage content text">
                    <ReportStage reportData={this.props.reportData}/>
                </Stage>


                <ReportToolsAndContent reportData={this.props.reportData}
                                       appId={this.props.params.appId}
                                       tblId={this.props.params.tblId}
                                       rptId={this.props.params.rptId}
                />
            </div>);
        }
    }
});


export default ReportRoute;
