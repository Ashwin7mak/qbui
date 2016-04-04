import React from 'react';
import {I18nMessage} from '../../utils/i18nMessage';
import {Button} from 'react-bootstrap';
import Logger from '../../utils/logger';
import Locale from '../../locales/locales';
import StringUtils from '../../utils/stringUtils';
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

    render: function() {

        const reportName = this.props.reportData && this.props.reportData.data ? this.props.reportData.data.name : "";

        return (this.props.reportData && this.props.reportData.data ? (
            <div className="report-content">
            <div className="left">
                <div className="content">
                    <div className="stage-showHide-content"><I18nMessage message={'stage.content'}/></div>
                </div>
            </div>
         </div>) :
        <div>empty</div>);

    }
});

export default ReportStage;
