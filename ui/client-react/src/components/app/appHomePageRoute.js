import React from 'react';
import Stage from '../stage/stage';
import QBicon from '../qbIcon/qbIcon';
import IconActions from '../actions/iconActions';
import Fluxxor from 'fluxxor';
import Logger from '../../utils/logger';

import './appHomePage.scss';

let FluxMixin = Fluxxor.FluxMixin(React);
let logger = new Logger();
/**
 * placeholder for app dashboard route
 */
let AppHomePageRoute = React.createClass({
    mixins: [FluxMixin],

    selectAppId(appId) {
        let flux = this.getFlux();
        flux.actions.selectAppId(appId);
    },
    selectAppFromParams(params, checkParams) {
        if (params) {
            let appId = params.appId;

            if (this.props.selectedAppId === appId) {
                return;
            }

            if (checkParams) {
                if (this.props.params.appId === appId) {
                    return;
                }
            }

            if (appId) {
                logger.debug('Loading app. AppId:' + appId);
                this.selectAppId(appId);
            }
        }
    },

    getTopTitle() {
        return (this.props.selectedApp &&
            <div className="topTitle">
                <QBicon icon="favicon"/>
                <span>{this.props.selectedApp.name}</span>
            </div>
        );
    },

    componentDidMount() {
        // no title for now...
        let flux = this.getFlux();
        flux.actions.showTopNav();
        flux.actions.setTopTitle();
        this.selectAppFromParams(this.props.params);
    },
    // Triggered when properties change
    componentWillReceiveProps: function(props) {
        this.selectAppFromParams(props.params, true);
    },

    getPageActions(maxButtonsBeforeMenu = 0) {
        const actions = [
            {msg: 'pageActions.print', icon:'print'},
            {msg: 'pageActions.customizePage', icon:'settings-hollow'}
        ];
        return (<IconActions className="pageActions" actions={actions} maxButtonsBeforeMenu={maxButtonsBeforeMenu} {...this.props}/>);
    },
    getStageHeadline() {
        return (this.props.selectedApp &&
            <div className="stageHeadline">

                <h3 className="appName breadCrumbs"><QBicon icon="favicon"/> {this.props.selectedApp.name}</h3>
            </div>
        );
    },
    getSecondaryBar() {
        return (
            <div className="secondaryAppHomePageActions">
                {/* todo */}
            </div>);
    },
    render: function() {
        //return (<div className="appHomePageContainer">
        //    <Stage stageHeadline={this.getStageHeadline()}
        //           pageActions={this.getPageActions(2)}>
        //
        //        <div className="app-content">
        //            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        //        </div>
        //
        //    </Stage>
        //
        //    <div className="appHomePageActionsContainer secondaryBar">
        //        {this.getSecondaryBar()}
        //        {this.getPageActions(2)}
        //    </div>
        //    <div>App Dashboard goes here...</div>
        //</div>);
        return <div className="appHomePageImageContainer"><img className="appHomePageImage"/></div>;
    }
});

export default AppHomePageRoute;
