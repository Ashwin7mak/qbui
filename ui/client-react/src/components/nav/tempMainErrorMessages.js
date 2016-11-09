import React, {PropTypes} from 'react';
import {I18nMessage} from '../../utils/i18nMessage';
import AppUtils from '../../utils/appUtils';
import AlertBanner from '../alertBanner/alertBanner';
import UrlUtils from '../../utils/urlUtils';
import QbIcon from '../qbIcon/qbIcon';
import {SUPPORT_LINK} from '../../constants/urlConstants';

import './tempMainErrorMessages.scss';

const I18nKeys = {
    getMainKey(key) {
        return `errors.${key}`;
    },
    appNotFound(key) {
        return this.getMainKey(`appNotFound.${key}`);
    },
    noApps(key) {
        return this.getMainKey(`noApps.${key}`);
    },
    noTables(key) {
        return this.getMainKey(`noTables.${key}`);
    },
    supportLink(key) {
        return this.getMainKey(`supportLink.${key}`);
    }
};

/**
 * This parent-level component can display error messages that appear in the main content area
 * It is temporary and stopgap for admin preview until a fully fledged error messaging system can be created
 */
const TempMainErrorMessage = React.createClass({
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
        return (
            <span className="supportLink">
                <a href={SUPPORT_LINK} target="_blank">
                    <I18nMessage message={I18nKeys.supportLink('text')} />
                </a>
            </span>
        );
    },

    /**
     * Renders a message indicating the currently selected app does not exist
     */
    renderAppNotFoundMessage() {
        let {apps, appsLoading, selectedAppId} = this.props;
        let show = (!appsLoading && apps && apps.length > 0 && !AppUtils.appExists(selectedAppId, apps));

        return (
            <AlertBanner show={show} showCreateInQuickBaseClassicLink={true} selectedAppId={selectedAppId}>
                <span id="appNotFoundErrorMessage">
                    <I18nMessage message={I18nKeys.appNotFound('notFound')} />
                    <a href={UrlUtils.getQuickBaseClassicLink(this.props.selectedAppId)}>
                        <I18nMessage message={I18nKeys.appNotFound('clickHere')} />
                    </a>
                    <I18nMessage message={I18nKeys.appNotFound('inQuickBaseClassic')} />
                </span>
            </AlertBanner>
        );
    },

    /**
     * Renders a message indicating there are no apps in the current realm
     */
    renderNoAppsMessage() {
        let {apps, appsLoading} = this.props;
        let show = (!appsLoading && apps && apps.length === 0);

        return (
            <AlertBanner show={show}>
                <span id="noAppsErrorMessage">
                    <I18nMessage message={I18nKeys.noApps('noApps')} />
                    {this.renderSupportLink()}
                    <I18nMessage message={I18nKeys.noApps('addApps')} />
                </span>
            </AlertBanner>
        );
    },

    /**
     * Renders a message indicating the currently selected app does not have any tables
     */
    renderNoTablesMessage() {
        let {apps, appsLoading, selectedAppId} = this.props;
        let show = (!appsLoading && AppUtils.appExists(selectedAppId, apps) && AppUtils.getAppTables(selectedAppId, apps).length === 0);

        return (
            <AlertBanner show={show}>
                <span id="noTablesErrorMessage">
                    <I18nMessage message={I18nKeys.noTables('noTables')} />
                    <I18nMessage message={I18nKeys.noTables('createTablesInQuickBaseClassic')} />
                    <a href={UrlUtils.getQuickBaseClassicLink(this.props.selectedAppId)}>
                        <I18nMessage message="quickBaseClassic"/>
                    </a>.
                </span>
            </AlertBanner>
        );
    },

    render() {
        return (
            <div className="tempMainErrorMessages">
                {this.renderNoAppsMessage()}
                {this.renderAppNotFoundMessage()}
                {this.renderNoTablesMessage()}
            </div>
        );
    }
});

export default TempMainErrorMessage;
