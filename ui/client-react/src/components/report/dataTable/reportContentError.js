import React from 'react';
import {I18nMessage} from '../../../utils/i18nMessage';

import './reportContentError.scss';

const supportEmail = 'betaprogram@quickbase.com';
const supportEmailSubject = 'subject=Error%20Loading%20Report';

const ReportContentError = React.createClass({
    getInitialState() {
        return {
            playingErrorGraphic: false
        };
    },
    getErrorMessages() {
        return this.props.errorDetails.errorMessages.map((errorMessage, currentIndex) => {
            return (
                <li key={currentIndex + 2}>
                    {errorMessage.code} - {errorMessage.message}
                </li>
            );
        });
    },
    toggleErrorGraphic() {
        this.setState({playingErrorGraphic: !this.state.playingErrorGraphic});
    },
    createSupportEmailBody() {
        let {errorDetails} = this.props;

        let supportEmailBody = 'body=%0D%0A%0D%0A------------------------------------%0D%0APlace additional information above%0D%0A';
        supportEmailBody += `TID:${errorDetails.tid}%0D%0A`;
        supportEmailBody += `SID:${errorDetails.sid}`;

        errorDetails.errorMessages.forEach(errorMessage => {
            supportEmailBody += `%0D%0A${errorMessage.code}-${errorMessage.message}`;
        });
        return supportEmailBody;
    },
    render() {
        let {errorDetails} = this.props;
        let errorImageClasses = ['errorImage'];
        let playingText = <I18nMessage message="errors.errorLoadingReport.playGraphic" />;

        if (this.state.playingErrorGraphic) {
            playingText = <I18nMessage message="errors.errorLoadingReport.stopGraphic" />;
            errorImageClasses.push('errorImage--animation');
        } else {
            errorImageClasses.push('errorImage--still');
        }

        return (
            <div className="reportContentError">
                <h3><I18nMessage message="errors.errorLoadingReport.message" /></h3>
                <p><I18nMessage message="errors.errorLoadingReport.helpText" /></p>
                <button className="playReportErrorGraphicButton btn btn-link" onClick={this.toggleErrorGraphic}>{playingText}</button>
                <img className={errorImageClasses.join(' ')} />

                <div className="additionalHelp">
                    <h4><I18nMessage message="errors.errorLoadingReport.continuedTrouble"/></h4>
                    <h5>
                        <a href={`mailto:${supportEmail}?${supportEmailSubject}&${this.createSupportEmailBody()}`}>
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
