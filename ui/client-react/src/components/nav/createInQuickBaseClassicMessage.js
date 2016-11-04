import React, {PropTypes} from 'react';
import UrlUtils from '../../utils/urlUtils';
import {I18nMessage} from '../../utils/i18nMessage';

import './createInQuickBaseClassicMessage.scss';

const supportEmail = 'betaprogram@quickbase.com';

/**
 * Displays a message that indicates to the user that the missing functionality can be found by visiting
 * their app in QuickBase classic along with a link to the currently selected App in QuickBase Classic.
 */
const CreateInQuickBaseClassicMessage = React.createClass({
    propTypes: {
        /** Plural name of the elements in the list (e.g., Apps, Tables) */
        nameOfElements: PropTypes.oneOf(['tables', 'apps']).isRequired,

        /** The currently selected App's ID */
        selectedAppId: PropTypes.string.isRequired
    },

    /**
     * Render the link to go to QuickBase Classic
     * @returns {XML}
     */
    renderQuickBaseClassicLink() {
        return <a className="quickBaseClassicLink" href={UrlUtils.getQuickBaseClassicLink(this.props.selectedAppId)}>QuickBase Classic</a>;
    },

    /**
     * Render a link where the user can contact the support team
     * @returns {XML}
     */
    renderSupportLink() {
        return <a className="quickBaseClassicLink" href={`mailto:${supportEmail}`}>{supportEmail}</a>;
    },

    /**
     * Render the message along with the link to QuickBase Classic
     * @returns {XML}
     */
    renderCreateInQuickBaseClassic() {
        return (
            <span>
                <I18nMessage message="createInQuickBaseClassicMessage.createInQuickBaseClassic" />
                <br/>
                {this.renderQuickBaseClassicLink()}
            </span>
        );
    },

    render() {
        // By default render a message about missing tables (tables can currently only be created in QB Classic)
        let message = (
            <span className="noTables">
                <I18nMessage message="createInQuickBaseClassicMessage.noTables" />
                <br/>
                {this.renderCreateInQuickBaseClassic()}
            </span>
        );


        // Otherwise render a message about missing apps (some apps that are not migrated can only be viewed in QB Classic
        if (this.props.nameOfElements === 'apps') {
            message = (
                <span className="noApps">
                    <I18nMessage message="createInQuickBaseClassicMessage.noApps" />
                    <br/>
                    <I18nMessage message="createInQuickBaseClassicMessage.addApps"/>
                    {this.renderSupportLink()}
                </span>
            );
        }

        return (
            <div className="createInQuickBaseClassicMessage">
                {message}
            </div>
        );
    }
});

export default CreateInQuickBaseClassicMessage;
