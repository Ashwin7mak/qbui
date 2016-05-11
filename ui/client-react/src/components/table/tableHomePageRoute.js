import React from 'react';
import Stage from '../stage/stage';
import QBicon from '../qbIcon/qbIcon';
import IconActions from '../actions/iconActions';
import ReportToolsAndContent from '../report/reportToolsAndContent';
import Fluxxor from 'fluxxor';
let FluxMixin = Fluxxor.FluxMixin(React);
import './tableHomePage.scss';

let TableHomePageRoute = React.createClass({
    mixins: [FluxMixin],

    getStageHeadline() {
        let reportName = this.props.reportData && this.props.reportData.data && this.props.reportData.data.name;

        return (this.props.selectedTable &&
            <div className="stageHeadline">
                <h3 className="tableName breadCrumbs"><QBicon icon="favicon"/> {this.props.selectedTable.name}
                    <span className="breadCrumbsSeparator"> | </span>{reportName}</h3>
            </div>
        );
    },

    getPageActions(maxButtonsBeforeMenu = 0) {
        const actions = [
            {msg: 'pageActions.addRecord', icon:'add'},
            {msg: 'pageActions.gridEdit', icon:'report-grid-edit'},
            {msg: 'pageActions.email', icon:'mail'},
            {msg: 'pageActions.print', icon:'print'},
            {msg: 'pageActions.customizePage', icon:'settings-hollow'}
        ];
        return (<IconActions className="pageActions" actions={actions} maxButtonsBeforeMenu={maxButtonsBeforeMenu} {...this.props}/>);
    },

    getSecondaryBar() {
        return (
            <div className="secondaryTableHomePageActions">
                {/* todo */}
            </div>);
    },

    render() {
        return (<div className="tableHomepageContainer">
            <Stage stageHeadline={this.getStageHeadline()} pageActions={this.getPageActions(5)}>
            </Stage>

            <div className="tableHomePageActionsContainer secondaryBar">
                {this.getSecondaryBar()}
                {this.getPageActions()}
            </div>

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
                rptId={'1'} />
        </div>);
    }
});

export default TableHomePageRoute;
