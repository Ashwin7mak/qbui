import React from 'react';
import Stage from '../stage/stage';
import QBicon from '../qbIcon/qbIcon';
import IconActions from '../actions/iconActions';
import Fluxxor from 'fluxxor';
let FluxMixin = Fluxxor.FluxMixin(React);
import Logger from '../../utils/logger';
let logger = new Logger();

import './tableHomePage.scss';

let TableHomePageRoute = React.createClass({
    mixins: [FluxMixin],

    selectTableId(tblId) {
        let flux = this.getFlux();
        flux.actions.selectTableId(tblId);
        flux.actions.loadReports(this.props.params.appId, tblId);
    },
    loadReportsFromParams(params, checkParams) {

        let flux = this.getFlux();

        if (params) {
            let appId = params.appId;
            let tblId = params.tblId;

            // VERY IMPORTANT: check URL params against props to prevent cycles

            if (appId === this.props.reportData.appId &&
                tblId === this.props.reportData.tblId) {
                return;
            }

            if (checkParams) {
                if (appId === this.props.params.appId &&
                    tblId === this.props.params.tblId) {
                    return;
                }
            }

            if (appId && tblId) {
                logger.debug('Loading reports. AppId:' + appId + ' ;tblId:' + tblId);

                this.selectTableId(tblId);
            }
        }
    },
    componentDidMount() {
        let flux = this.getFlux();
        flux.actions.showTopNav();
        flux.actions.setTopTitle();
        this.loadReportsFromParams(this.props.params);
    },
    componentWillReceiveProps: function(props) {
        this.loadReportsFromParams(props.params, true);
    },

    getStageHeadline() {
        return (this.props.selectedTable &&
            <div className="stageHeadline">
                <QBicon icon="favicon"/>
                <h3 className="tableName">{this.props.selectedTable.name}</h3>
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

    render: function() {

        return (<div className="tableHomepageContainer">
            <Stage stageHeadline={this.getStageHeadline()}
                   pageActions={this.getPageActions(5)}>

                <div className="table-content">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </div>

            </Stage>
            <div className="tableHomePageActionsContainer secondaryBar">
                {this.getSecondaryBar()}
                {this.getPageActions()}
            </div>
            <div>Table homepage goes here...</div>
        </div>);
    }
});

export default TableHomePageRoute;
