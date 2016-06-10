import React from 'react';
import Stage from '../stage/stage';
import ReportStage from '../report/reportStage';
import ReportHeader from '../report/reportHeader';
import QBicon from '../qbIcon/qbIcon';
import TableIcon from '../qbTableIcon/qbTableIcon';
import IconActions from '../actions/iconActions';
import ReportToolsAndContent from '../report/reportToolsAndContent';
import Fluxxor from 'fluxxor';
let FluxMixin = Fluxxor.FluxMixin(React);
import './tableHomePage.scss';
import '../report/report.scss';

let TableHomePageRoute = React.createClass({
    mixins: [FluxMixin],
    nameForRecords: "Records",

    getHeader() {
        return (
            <ReportHeader reportData={this.props.reportData}
                          nameForRecords={this.nameForRecords}
                          rptId={this.props.reportData ? this.props.reportData.rptId : null} {...this.props}
            />);
    },

    loadTableHomePageReportFromParams(appId, tblId) {
        const flux = this.getFlux();
        flux.actions.selectTableId(tblId);
        flux.actions.loadFields(appId, tblId);
        flux.actions.loadTableHomePage(appId, tblId);
    },
    loadHomePageForParams(params) {
        let appId = params.appId;
        let tblId = params.tblId;

        if (appId && tblId) {
            //logger.debug('Loading report. AppId:' + appId + ' ;tblId:' + tblId + ' ;rptId:' + rptId);
            this.loadTableHomePageReportFromParams(appId, tblId);
        }
    },
    componentDidMount() {
        const flux = this.getFlux();
        flux.actions.hideTopNav();

        if (this.props.params) {
            this.loadHomePageForParams(this.props.params);
        }
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
        return (<div className="reportContainer">
            <Stage stageHeadline={this.getStageHeadline()} pageActions={this.getPageActions(5)}>
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
                selectedRows={this.props.reportData.selectedRows}
                scrollingReport={this.props.scrollingReport}
                history={this.props.history}
                rptId={this.props.reportData ? this.props.reportData.rptId : null} />
        </div>);
    }
});

export default TableHomePageRoute;
