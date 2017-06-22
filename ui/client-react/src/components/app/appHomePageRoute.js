import React, {PropTypes, Component} from 'react';
import IconActions from '../actions/iconActions';
import AppHomePage from './appHomePage';
import PageTitle from '../pageTitle/pageTitle';
import {connect} from 'react-redux';
import {NotificationManager} from 'react-notifications';
import Stage from '../../../../reuse/client/src/components/stage/stage';
import AlertBanner from '../alertBanner/alertBanner';
import Locale from '../../locales/locales';
import {notifyTableDeleted} from '../../actions/tablePropertiesActions';
import {getNeedToNotifyTableDeletion, getTableJustDeleted} from '../../reducers/tableProperties';
import {getSelectedApp, getIsAppsLoading} from '../../reducers/app';
import {showTopNav} from '../../actions/shellActions';
import Loader from 'react-loader';
import {APP_HOMEPAGE_LOADING} from '../../constants/spinnerConfigurations';
import get from 'lodash/get';

import './appHomePage.scss';

/**
 * placeholder for app dashboard route
 */
export class AppHomePageRoute extends Component {
    static propTypes = {
        /**
         * The current appId obtained from react router params
         */
        match: PropTypes.shape({
            params: PropTypes.shape({
                appId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            })
        }),

        isLoading: PropTypes.bool,
        app: PropTypes.object,

        // Props from redux stores
        notifyTableDeleted: PropTypes.bool,
        tableJustDeleted: PropTypes.string,

        // Actions
        resetTableDeleteNotification: PropTypes.func,
        showTopNav: PropTypes.func
    };

    componentDidMount() {
        this.props.showTopNav();
        if (this.props.notifyTableDeleted) {
            NotificationManager.success(Locale.getMessage('tableEdit.tableDeleted', {tableName: this.props.tableJustDeleted}), Locale.getMessage('success'));
            this.props.resetTableDeleteNotification();
        }
    }

    /**
     * Gets the name of the currently selected app or returns undefined
     * @returns {null|string}
     */
    getSelectedAppName = () => {
        return get(this.props, 'app.name', null);
    };

    getPageActions = (maxButtonsBeforeMenu = 0) => {
        const actions = [
            {msg: 'pageActions.print', icon:'print'},
            {msg: 'pageActions.customizePage', icon:'settings'}
        ];
        return (<IconActions className="pageActions" actions={actions} maxButtonsBeforeMenu={maxButtonsBeforeMenu} {...this.props}/>);
    };

    getStageHeadline = () => {
        const userHeadLine = `${Locale.getMessage('app.homepage.welcomeTitle')} ${this.getSelectedAppName()}`;
        return (
            <div className="appHomePageStage">
                <div className="appStageHeadline">
                    <h3 className="appHeadLine">{userHeadLine}</h3>
                </div>
            </div>
        );
    };

    /**
     * Render the app homepage. If the currently selected app does not exist, display a warning.
     * @returns {XML}
     */
    render() {
        if (this.props.isLoading) {
            return <Loader loaded={false} options={APP_HOMEPAGE_LOADING} />;
        }

        if (!this.props.app) {
            return (
                <AlertBanner isVisible={true}>{Locale.getMessage('errors.appNotFound')}</AlertBanner>
            );
        }

        return (
            <div className="appHomePageContainer">
                <Loader loaded={!this.props.isLoading} options={APP_HOMEPAGE_LOADING}>
                    <PageTitle title={this.getSelectedAppName()} />
                    <Stage stageHeadline={this.getStageHeadline()} pageActions={null} />
                    <AppHomePage />
                </Loader>
            </div>
        );
    }
}

const mapStateToProps = (state, props) => {
    const selectedApp = getSelectedApp(state);

    return {
        notifyTableDeleted: getNeedToNotifyTableDeletion(state),
        tableJustDeleted: getTableJustDeleted(state),
        app: get(selectedApp, 'id') === get(props, 'match.params.appId') ? selectedApp : null,
        isLoading: getIsAppsLoading(state)
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        resetTableDeleteNotification: () => dispatch(notifyTableDeleted(false)),
        showTopNav: () => dispatch(showTopNav())
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppHomePageRoute);
