import React, {PropTypes} from 'react';
import UrlUtils from '../../utils/urlUtils';
import {I18nMessage} from '../../utils/i18nMessage';

import './createInQuickBaseClassicMessage.scss';

const supportEmail = 'betaprogram@quickbase.com';

const CreateInQuickBaseClassicMessage = React.createClass({
    propTypes: {
        /** Plural name of the elements in the list (e.g., Apps, Tables) */
        nameOfElements: PropTypes.oneOf(['tables', 'apps']).isRequired,
        selectedAppId: PropTypes.string.isRequired
    },
    render() {
        let quickBaseClassicLink = <a className="quickBaseClassicLink" href={UrlUtils.getQuickBaseClassicLink(this.props.selectedAppId)}>QuickBase Classic</a>;
        let supportLink = <a className="quickBaseClassicLink" href={`mailto:${supportEmail}`}>{supportEmail}</a>;

        let createInQuickBaseClassic = (
            <span>
                <I18nMessage message="createInQuickBaseClassicMessage.createInQuickBaseClassic" />
                <br/>
                {quickBaseClassicLink}
            </span>
        );

        let message = (
            <span>
                <I18nMessage message="createInQuickBaseClassicMessage.noTables" />
                <br/>
                {createInQuickBaseClassic}
            </span>
        );

        if (this.props.nameOfElements === 'apps') {
            message = (
                <span>
                    <I18nMessage message="createInQuickBaseClassicMessage.noApps" />
                    <br/>
                    <I18nMessage message="createInQuickBaseClassicMessage.addApps"/>
                    {supportLink}
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
