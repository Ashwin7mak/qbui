import React from 'react';
import ReactIntl from 'react-intl';
import { Button } from 'react-bootstrap';
import Logger from '../../../utils/logger';
var logger = new Logger();

import '../../../assets/css/report.css';

var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

var Stage = React.createClass({
    mixins: [IntlMixin],

    handleClick: function() {
        logger.debug('report feedback button click event fired.');
        window.location.href = 'mailto:clay_nicolau@intuit.com?subject=ReArch LH Feedback';
    },

    render: function() {
        return <div className="report-stage">
                 <div className="report-content">
                    <div className="left">
                        <div className="header"><FormattedMessage message={this.getIntlMessage('lighthouse.stage.header')}/></div>
                        <div className="subheader"><FormattedMessage message={this.getIntlMessage('lighthouse.stage.sub_header')}/></div>
                        <div className="content">
                            <div className="stage-showHide-content"><FormattedMessage message={this.getIntlMessage('lighthouse.stage.content')}/></div>
                        </div>
                    </div>
                    <div className="right">
                        <div className="content">
                            <div className="reminder">
                                <div className="stage-showHide-content">
                                    <div className="icon"></div>
                                    <div className="header"><FormattedMessage message={this.getIntlMessage('lighthouse.stage.feedback.header')}/></div>
                                    <div className="subheader"><FormattedMessage message={this.getIntlMessage('lighthouse.stage.feedback.sub_header')}/></div>
                                </div>
                                <Button bsStyle="primary" onClick={this.handleClick}> {<FormattedMessage message={this.getIntlMessage('lighthouse.stage.feedback.button')}/>}</Button>
                            </div>
                        </div>
                    </div>
                 </div>
               </div>
    }
})

export default Stage;