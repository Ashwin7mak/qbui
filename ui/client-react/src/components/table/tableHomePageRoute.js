import React from 'react';
import Stage from '../stage/stage';
import QBicon from '../qbIcon/qbIcon';
import IconActions from '../actions/iconActions';
import ReportToolbarAndContent from '../report/reportToolbarAndContent';
import Fluxxor from 'fluxxor';
let FluxMixin = Fluxxor.FluxMixin(React);
import './tableHomePage.scss';

let TableHomePageRoute = React.createClass({
    mixins: [FluxMixin],

    getStageHeadline() {
        return (this.props.selectedTable &&
            <div className="stageHeadline">
                <h3 className="tableName breadCrumbs"><QBicon icon="favicon"/> {this.props.selectedTable.name}</h3>
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
                <div className="table-content">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </div>
            </Stage>

            <div className="tableHomePageActionsContainer secondaryBar">
                {this.getSecondaryBar()}
                {this.getPageActions()}
            </div>

            <ReportToolbarAndContent
                params={this.props.params}
                reportData={this.props.reportData}
                routeParams={this.props.routeParams}
                selectedAppId={this.props.selectedAppId}
                searchStringForFiltering={this.props.searchStringForFiltering}
                selectedRows={this.props.selectedRows}
                scrollingReport={this.props.scrollingReport}
                rptId={'1'} />
        </div>);
    }
});

export default TableHomePageRoute;
