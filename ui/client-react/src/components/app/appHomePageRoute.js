import React from 'react';
import QBicon from '../qbIcon/qbIcon';
import IconActions from '../actions/iconActions';
import Fluxxor from 'fluxxor';
import Logger from '../../utils/logger';
import AppHomePage from './appHomePage';
import PageTitle from '../pageTitle/pageTitle';

import './appHomePage.scss';

let FluxMixin = Fluxxor.FluxMixin(React);
let logger = new Logger();

/**
 * placeholder for app dashboard route
 */
let AppHomePageRoute = React.createClass({
    mixins: [FluxMixin],

    contextTypes: {
        touch: React.PropTypes.bool
    },

    /**
     * Select an app by ID
     */
    selectAppId(appId) {
        let flux = this.getFlux();
        flux.actions.selectAppId(appId);
        flux.actions.loadAppRoles(appId);
    },

    /**
     * Select an app from the route params
     */
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

    /**
     * Gets the name of the currently selected app or returns null
     * @returns {null|string}
     */
    getSelectedAppName() {
        if (this.props.apps && this.props.selectedAppId) {
            let app = _.find(this.props.apps, {id: this.props.selectedAppId});
            return (app ? app.name : null);
        }

        return null;
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
        flux.actions.doneRoute();
    },
    // Triggered when properties change
    componentWillReceiveProps: function(props) {
        this.selectAppFromParams(props.params, true);
    },

    getPageActions(maxButtonsBeforeMenu = 0) {
        const actions = [
            {msg: 'pageActions.print', icon:'print'},
            {msg: 'pageActions.customizePage', icon:'settings'}
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

    /**
     * Render a temporary homepage. If the currenlty selected app does not exist, display a warning.
     * @returns {XML}
     */
    render() {
        return (
            <div className="appHomePageContainer">
                <PageTitle title={this.getSelectedAppName()} />
                <AppHomePage />
            </div>
        );
    }
});

export default AppHomePageRoute;
