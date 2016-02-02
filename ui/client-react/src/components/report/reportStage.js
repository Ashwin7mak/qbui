import React from 'react';
import {I18nMessage} from '../../utils/i18nMessage';
import {Button} from 'react-bootstrap';
import Logger from '../../utils/logger';
import Locale from '../../locales/locales';
import StringUtils from '../../utils/stringUtils';
import EmailReportLink from '../actions/emailReportLink';
let logger = new Logger();

import './reportStage.scss';

const ReportStage = React.createClass({

    propTypes: {
        reportData: React.PropTypes.object
    },

    handleClick() {
        logger.debug('report feedback button click event fired.');
        window.location.href = 'mailto:clay_nicolau@intuit.com?subject=ReArch LH Feedback';
    },
    getReportLink() {
        return window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/app/" + this.props.reportData.appId + "/table/" + this.props.reportData.tblId + "/report/" + this.props.reportData.rptId;
    },
    getEmailBody() {
        const reportName = this.props.reportData.data.name;
        const appName = this.props.reportData.appId;
        const tableName = this.props.reportData.tblId;

        const bodyTemplate = Locale.getMessage("reports.emailBody");

        return StringUtils.format(bodyTemplate, {reportName, appName, tableName}) + '":%0D%0A%0D%0A' + this.getReportLink();
    },
    getEmailSubject() {

        const reportName = this.props.reportData.data.name;
        const appName = this.props.reportData.appId;

        const subjectTemplate = Locale.getMessage("reports.emailSubject");

        return StringUtils.format(subjectTemplate, {reportName, appName});
    },
    getEmailLinkText() {
        return Locale.getMessage('selection.email');
    },
    getEmailLinkTooltip() {
        return Locale.getMessage('reports.emailReportTooltip');
    },
    render: function() {

        const reportName = this.props.reportData && this.props.reportData.data ? this.props.reportData.data.name : "";

        return (this.props.reportData && this.props.reportData.data ? (
            <div className="report-content">
            <div className="left">
                <div className="stageTop">
                    <h1 className="header">{reportName}</h1>
                    <div className="stageActions">
                        <EmailReportLink subject={this.getEmailSubject()}
                                         body={this.getEmailBody()}
                                         tipPlacement="bottom"
                                         tip={this.getEmailLinkTooltip()}>
                            {this.getEmailLinkText()}
                        </EmailReportLink>

                    </div>
                </div>
                <div className="subheader"><I18nMessage message={'stage.sub_header'}/></div>
                <div className="content">
                    <div className="stage-showHide-content"><I18nMessage message={'stage.content'}/></div>
                </div>
            </div>
            <div className="right">
                <div className="content">
                    <div className="reminder">
                        <div className="stage-showHide-content">
                            <div className="icon"></div>
                            <div className="header"><I18nMessage message={'stage.feedback.header'}/></div>
                            <div className="subheader"><I18nMessage message={'stage.feedback.sub_header'}/></div>
                        </div>
                        <div className="button-container">
                            <Button bsStyle="primary" onClick={this.handleClick}> {<I18nMessage message={'stage.feedback.button'}/>}</Button>
                        </div>
                    </div>
                </div>
            </div>
         </div>) :
        <div>empty</div>);

    }
});

export default ReportStage;
