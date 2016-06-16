import React from 'react';
import {I18nMessage} from '../../utils/i18nMessage';
import Locale from '../../locales/locales';
import Stage from '../stage/stage';
import QBicon from '../qbIcon/qbIcon';
import TableIcon from '../qbTableIcon/qbTableIcon';
import ReportStage from './reportStage';
import ReportHeader from './reportHeader';
import IconActions from '../actions/iconActions';
import {Link} from 'react-router';
import Logger from '../../utils/logger';
import simpleStringify from '../../../../common/src/simpleStringify';
import Fluxxor from 'fluxxor';
import _ from 'lodash';
import './report.scss';
import ReportToolsAndContent from '../report/reportToolsAndContent';

let logger = new Logger();
let FluxMixin = Fluxxor.FluxMixin(React);

const ReportRoute = React.createClass({
    mixins: [FluxMixin],
    nameForRecords: "Records",  // get from table meta data

    loadReport(appId, tblId, rptId) {
        const flux = this.getFlux();
        flux.actions.selectTableId(tblId);
        flux.actions.loadFields(appId, tblId);
        flux.actions.loadReport(appId, tblId, rptId, true);
    },
    loadReportFromParams(params) {
        let appId = params.appId;
        let tblId = params.tblId;
        let rptId = typeof this.props.rptId !== "undefined" ? this.props.rptId : params.rptId;

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
            <ReportHeader reportData={this.props.reportData}
                          nameForRecords={this.nameForRecords}
                {...this.props}
            />);
    },

    getPageActions(maxButtonsBeforeMenu) {
        const actions = [
            {msg: 'pageActions.addRecord', icon:'add'},
            {msg: 'pageActions.favorite', icon:'star'},
            {msg: 'pageActions.gridEdit', icon:'report-grid-edit'},
            {msg: 'pageActions.email', icon:'mail'},
            {msg: 'pageActions.print', icon:'print'},
            {msg: 'pageActions.customizeReport', icon:'settings-hollow'},
        ];
        return (<IconActions className="pageActions" actions={actions} maxButtonsBeforeMenu={maxButtonsBeforeMenu}/>);
    },

    getBreadcrumbs() {
        let reportName = this.props.reportData && this.props.reportData.data && this.props.reportData.data.name;

        return (this.props.selectedTable &&
        <h3 className="breadCrumbs"><TableIcon icon={this.props.selectedTable.icon}/>{this.props.selectedTable.name}
            <span className="breadCrumbsSeparator"> | </span>{reportName}</h3>);

    },

    getStageHeadline() {
        return (
            <div className="stageHeadline">
                {this.getBreadcrumbs()}
            </div>
        );
    },

    render() {
        if (_.isUndefined(this.props.params) ||
            _.isUndefined(this.props.params.appId) ||
            _.isUndefined(this.props.params.tblId) ||
            (_.isUndefined(this.props.params.rptId) && _.isUndefined(this.props.rptId))
        ) {
            logger.info("the necessary params were not specified to reportRoute render params=" + simpleStringify(this.props.params));
            return null;
        } else {
            return (<div className="reportContainer">
                <Stage stageHeadline={this.getStageHeadline()}
                       pageActions={this.getPageActions(5)}>

                    <ReportStage reportData={this.props.reportData} />
                </Stage>

                {this.getHeader()}

                <ReportToolsAndContent
                    params={this.props.params}
                    reportData={this.props.reportData}
                    routeParams={this.props.routeParams}
                    selectedAppId={this.props.selectedAppId}
                    fields={this.props.fields}
                    searchStringForFiltering={this.props.reportData.searchStringForFiltering}
                    pageActions={this.getPageActions(0)}
                    nameForRecords={this.nameForRecords}
                    selectedRows={this.props.reportData.selectedRows}
                    scrollingReport={this.props.scrollingReport}
                    history={this.props.history}/>
            </div>);
        }
    }
});

export default ReportRoute;
