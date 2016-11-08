import React, {PropTypes} from 'react';
import {I18nMessage} from '../../utils/i18nMessage';
import AppUtils from '../../utils/appUtils';
import AlertBanner from '../alertBanner/alertBanner';
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

    renderAppNotFound() {
        let {apps, appsLoading, selectedAppId} = this.props;
        let show = (!appsLoading && !AppUtils.appExists(selectedAppId, apps));
        return (
            <AlertBanner show={show} showCreateInQuickBaseClassicLink={true} selectedAppId={selectedAppId}>
                <I18nMessage message="appNotFoundError.notFound"/>
            </AlertBanner>
        );
    },

    renderNoApps() {
        let {apps, appsLoading} = this.props;
        apps = [];
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

    render() {
        return (
            <div className="mainErrorMessages">
                {this.renderNoApps()}
                {this.renderAppNotFound()}
            </div>
        );
    }
});

export default MainErrorMessage;
