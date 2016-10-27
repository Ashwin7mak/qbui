import React from 'react';
import {I18nMessage} from '../../../utils/i18nMessage';

import './reportContentError.scss';

const supportEmail = 'support@quickbase.com';
const supportEmailSubject = 'subject=Error%20Loading%20Report';

const ReportContentError = React.createClass({
    getErrorMessages() {
        return this.props.errorDetails.errorMessages.map((errorMessage, currentIndex) => {
            return (
                <li key={currentIndex + 2}>
                    {errorMessage.code} - {errorMessage.message}
                </li>
            );
        });
    },
    render() {
        let {errorDetails} = this.props;

        return (
            <div className="reportContentError">
                <h3><I18nMessage message="errors.errorLoadingReport.message"/></h3>
                <p><I18nMessage message="errors.errorLoadingReport.helpText"/></p>
                <img className="errorImage" />

                <div className="additionalHelp">
                    <h4><I18nMessage message="errors.errorLoadingReport.continuedTrouble"/></h4>

                    <h5>
                        <a href={`https://quickbase-493.quickbase.com/qb/support/newcase?subject=newstack+error+loading+report+tid+${errorDetails.tid}`} target="_blank">
                            <I18nMessage message="errors.errorLoadingReport.contactSupport"/>
                        </a>
                    </h5>
                </div>

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
