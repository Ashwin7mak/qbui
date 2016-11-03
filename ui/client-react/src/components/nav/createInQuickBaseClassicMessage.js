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
    renderQuickBaseClassicLink() {
        return <a className="quickBaseClassicLink" href={UrlUtils.getQuickBaseClassicLink(this.props.selectedAppId)}>QuickBase Classic</a>;
    },
    renderSupportLink() {
        return <a className="quickBaseClassicLink" href={`mailto:${supportEmail}`}>{supportEmail}</a>;
    },
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
        let message = (
            <span className="noTables">
                <I18nMessage message="createInQuickBaseClassicMessage.noTables" />
                <br/>
                {this.renderCreateInQuickBaseClassic()}
            </span>
        );

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
