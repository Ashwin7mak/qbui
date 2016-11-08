import React, {PropTypes} from 'react';
import {I18nMessage} from '../../utils/i18nMessage';
import AppUtils from '../../utils/appUtils';
import AlertBanner from '../alertBanner/alertBanner';
import UrlUtils from '../../utils/urlUtils';
import QbIcon from '../qbIcon/qbIcon';

import './mainErrorMessages.scss';

const supportEmail = 'betaprogram@quickbase.com';

const I18nKeys = {
    getMainKey(key) {
        return `errors.${key}`;
    },
    appNotFound(key) {
        return I18nKeys.getMainKey(`appNotFound.${key}`);
    },
    noApps(key) {
        return I18nKeys.getMainKey(`noApps.${key}`);
    },
    noTables(key) {
        return I18nKeys.getMainKey(`noTables.${key}`);
    }
};

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
                <I18nMessage message={I18nKeys.appNotFound('notFound')} />
                <a href={UrlUtils.getQuickBaseClassicLink(this.props.selectedAppId)}>
                    <I18nMessage message={I18nKeys.appNotFound('clickHere')} />
                </a>
                <I18nMessage message={I18nKeys.appNotFound('inQuickBaseClassic')} />
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
                <I18nMessage message={I18nKeys.noApps('noApps')} />
                <I18nMessage message={I18nKeys.noApps('addAppsContact')} />
                {this.renderSupportLink()}
                <I18nMessage message={I18nKeys.noApps('addApps')} />
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
                <I18nMessage message={I18nKeys.noTables('noTables')} />
                <I18nMessage message={I18nKeys.noTables('createTablesInQuickBaseClassic')} />
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
