import React from 'react';
import {I18nMessage} from '../../utils/i18nMessage';
import Locale from '../../locales/locales';
import Stage from '../stage/stage';
import ReportStage from './reportStage';
import ReportHeader from './reportHeader';

import Logger from '../../utils/logger';
let logger = new Logger();

import ReportToolsAndContent from './reportToolsAndContent';
import EmailReportLink from '../actions/emailReportLink';
import simpleStringify from '../../../../common/src/simpleStringify';

import Fluxxor from 'fluxxor';
import _ from 'lodash';
import './report.scss';

let FluxMixin = Fluxxor.FluxMixin(React);

var ReportRoute = React.createClass({
    mixins: [FluxMixin],

    loadReport(appId, tblId, rptId) {
        const flux = this.getFlux();
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
        const flux = this.getFlux();
        flux.actions.hideTopNav();

        if (this.props.params) {
            this.loadReportFromParams(this.props.params);
        }
    },

    getHeader() {
        return (
            <ReportHeader reportData={this.props.reportData}/>);
    },
    render() {
        if (_.isUndefined(this.props.params) ||
            _.isUndefined(this.props.params.appId) ||
            _.isUndefined(this.props.params.tblId) ||
            _.isUndefined(this.props.params.rptId)) {
            logger.info("the necessary params were not specified to reportRoute render params=" + simpleStringify(this.props.params));
            return null;
        } else {
            return (<div className="reportContainer">
                <Stage stageContent="this is the stage content text">
                    <ReportStage reportData={this.props.reportData}/>
                </Stage>

                {this.getHeader()}

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
