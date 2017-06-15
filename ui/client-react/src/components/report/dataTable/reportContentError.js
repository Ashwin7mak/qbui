import React, {PropTypes} from 'react';
import {I18nMessage} from '../../../utils/i18nMessage';
import QbIcon from '../../qbIcon/qbIcon';

import _ from 'lodash';

import './reportContentError.scss';

const supportEmail = 'betaprogram@quickbase.com';
const supportEmailSubject = 'subject=Error%20Loading%20Report';

/**
 * This is a temporary component that is a stopgap error message for Mercury Beta when
 * a report cannot be loaded.
 */
const ReportContentError = React.createClass({
    propTypes: {
        /** the QbResponseError */
        errorDetails: PropTypes.object
    },

    getDefaultProps() {
        return {errorDetails: {}};
    },

    getErrorMessages() {
        let errorMessages = this.props.errorDetails.errorMessages;
        if (errorMessages && _.isArray(errorMessages)) {
            return errorMessages.map((errorMessage, currentIndex) => {
                return (
                    <li key={currentIndex + 2}>
                        {errorMessage.code} - {errorMessage.message}
                    </li>
                );
            });
        } else {
            return null;
        }
    },

    createSupportEmailBody() {
        let {errorDetails} = this.props;

        let supportEmailBody = 'body=%0D%0A%0D%0A------------------------------------%0D%0APlace additional information above%0D%0A';
        if (errorDetails.tid) {
            supportEmailBody += `TID:${errorDetails.tid}%0D%0A`;
        }

        if (errorDetails.sid) {
            supportEmailBody += `SID:${errorDetails.sid}`;
        }

        if (errorDetails.errorMessages && _.isArray(errorDetails.errorMessages)) {
            errorDetails.errorMessages.forEach(errorMessage => {
                supportEmailBody += `%0D%0A${errorMessage.code}-${errorMessage.message}`;
            });
        }

        return supportEmailBody;
    },

    render() {
        let {errorDetails} = this.props;

        return (
            <div className="reportContentError">
                <h3><I18nMessage message="errors.errorLoadingReport.message" /></h3>

                <div className="additionalHelp">
                    <h5>
                        <a className="helpLink" href={`mailto:${supportEmail}?${supportEmailSubject}&${this.createSupportEmailBody()}`}>
                            <span className="iconContainer">
                                <QbIcon icon="mail" />
                            </span>
                            <span className="helpText">
                                <I18nMessage message="errors.errorLoadingReport.contactSupport"/>
                            </span>
                        </a>
                    </h5>
                </div>

                <p><I18nMessage message="errors.errorLoadingReport.helpText" /></p>

                <div className="additionalInfo">
                    <p><I18nMessage message="errors.errorLoadingReport.supportTeamInfo"/></p>
                    <ul>
                        <li key="0">TID: {errorDetails.tid}</li>
                        <li key="1">SID: {errorDetails.sid}</li>
                        {this.getErrorMessages()}
                    </ul>
                </div>
            </div>
        );
    }
});

export default ReportContentError;
