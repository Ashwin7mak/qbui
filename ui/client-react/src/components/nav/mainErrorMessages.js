import React, {PropTypes} from 'react';
import {I18nMessage} from '../../utils/i18nMessage';
import AppUtils from '../../utils/appUtils';
import AlertBanner from '../alertBanner/alertBanner';
import UrlUtils from '../../utils/urlUtils';
import QbIcon from '../qbIcon/qbIcon';

import './mainErrorMessages.scss';

const supportEmail = 'betaprogram@quickbase.com';

const MainErrorMessage = React.createClass({
    propTypes: {
        apps: PropTypes.array,
        appsLoading: PropTypes.bool,
        selectedAppId: PropTypes.string
    },

    /**
     * Render a link where the user can contact the support team
     * @returns {XML}
     */
    renderSupportLink() {
        return <a className="quickBaseClassicLink" href={`mailto:${supportEmail}`}>
            <span className="iconContainer">
                <QbIcon icon="mail" />
            </span>
            {supportEmail}
        </a>;
    },

    /**
     * Renders a message indicating the currently selected app does not exist
     */
    renderAppNotFoundMessage() {
        let {apps, appsLoading, selectedAppId} = this.props;
        let show = (!appsLoading && !AppUtils.appExists(selectedAppId, apps));

        return (
            <AlertBanner show={show} showCreateInQuickBaseClassicLink={true} selectedAppId={selectedAppId}>
                <I18nMessage message="appNotFoundError.notFound"/>
                <a href={UrlUtils.getQuickBaseClassicLink(this.props.selectedAppId)}>
                    <I18nMessage message="appNotFoundError.clickHere" />
                </a>
                <I18nMessage message="appNotFoundError.quickBaseClassic" />
            </AlertBanner>
        );
    },

    /**
     * Renders a message indicating there are not apps in the current realm
     */
    renderNoAppsMessage() {
        let {apps, appsLoading} = this.props;
        let show = (!appsLoading && apps && apps.length === 0);

        return (
            <AlertBanner show={show}>
                <I18nMessage message="createInQuickBaseClassicMessage.noApps" />
                <I18nMessage message="createInQuickBaseClassicMessage.addAppsContact" />
                {this.renderSupportLink()}
                <I18nMessage message="createInQuickBaseClassicMessage.addApps"/>
            </AlertBanner>
        );
    },

    /**
     * Renders a message indicating the currenlty selected app does not have any tables
     */
    renderNoTablesMessage() {
        let {apps, appsLoading, selectedAppId} = this.props;
        let show = (!appsLoading && AppUtils.appExists(selectedAppId, apps) && AppUtils.getAppTables(selectedAppId, apps).length === 0);

        return (
            <AlertBanner show={show}>
                <I18nMessage message="createInQuickBaseClassicMessage.noTables" />
                <I18nMessage message="createInQuickBaseClassicMessage.createTablesInQuickBaseClassic" />
                <a href={UrlUtils.getQuickBaseClassicLink(this.props.selectedAppId)}>
                    <I18nMessage message="quickBaseClassic"/>
                </a>.
            </AlertBanner>
        );
    },

    render() {
        return (
            <div className="mainErrorMessages">
                {this.renderNoAppsMessage()}
                {this.renderAppNotFoundMessage()}
                {this.renderNoTablesMessage()}
            </div>
        );
    }
});

export default MainErrorMessage;
