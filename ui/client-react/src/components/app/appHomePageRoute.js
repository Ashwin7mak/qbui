import React from 'react';
import QBicon from '../qbIcon/qbIcon';
import IconActions from '../actions/iconActions';
import Fluxxor from 'fluxxor';
import Logger from '../../utils/logger';
import AppHomePage from './appHomePage';
import PageTitle from '../pageTitle/pageTitle';
import {connect} from 'react-redux';
import {NotificationManager} from 'react-notifications';
import Stage from '../../../../reuse/client/src/components/stage/stage';
import Locale from '../../locales/locales';
import {notifyTableDeleted} from '../../actions/tablePropertiesActions';
import {getNeedToNotifyTableDeletion, getTableJustDeleted} from '../../reducers/tableProperties';
import './appHomePage.scss';

let FluxMixin = Fluxxor.FluxMixin(React);
let logger = new Logger();

/**
 * placeholder for app dashboard route
 */
export const AppHomePageRoute = React.createClass({
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
                if (_.get(this.props, 'match.params.appId') === appId) {
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
        this.selectAppFromParams(_.get(this.props, 'match.params'));
        flux.actions.doneRoute();
        if (this.props.notifyTableDeleted) {
            NotificationManager.success(Locale.getMessage('tableEdit.tableDeleted', {tableName: this.props.tableJustDeleted}), Locale.getMessage('success'));
            this.props.resetTableDeleteNotification();
        }
    },
    // Triggered when properties change
    componentWillReceiveProps: function(props) {
        this.selectAppFromParams(_.get(this.props, 'match.params'), true);
    },

    getPageActions(maxButtonsBeforeMenu = 0) {
        const actions = [
            {msg: 'pageActions.print', icon:'print'},
            {msg: 'pageActions.customizePage', icon:'settings'}
        ];
        return (<IconActions className="pageActions" actions={actions} maxButtonsBeforeMenu={maxButtonsBeforeMenu} {...this.props}/>);
    },

    getStageHeadline() {
        const userHeadLine = `${Locale.getMessage('app.homepage.welcomeTitle')} ${this.props.selectedApp.name}`;
        return (
            <div className="appHomePageStage">
                <div className="appStageHeadline">
                    <h3 className="appHeadLine">{userHeadLine}</h3>
                </div>
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
                <Stage stageHeadline={this.getStageHeadline()}
                       pageActions={null}>
                    <div></div>
                </Stage>
                <AppHomePage />
            </div>
        );
    }
});

const mapStateToProps = (state) => {
    return {
        notifyTableDeleted: getNeedToNotifyTableDeletion(state),
        tableJustDeleted: getTableJustDeleted(state)
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        resetTableDeleteNotification: () => dispatch(notifyTableDeleted(false))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppHomePageRoute);
