import React from 'react';
import {I18nMessage} from '../../../utils/i18nMessage';
import {Button} from 'react-bootstrap';
import Logger from '../../../utils/logger';
var logger = new Logger();

import './stage.scss';

var Stage = React.createClass({

    handleClick: function() {
        logger.debug('report feedback button click event fired.');
        window.location.href = 'mailto:clay_nicolau@intuit.com?subject=ReArch LH Feedback';
    },

    render: function() {
        return <div className="report-content">
                    <div className="left">
                        <div className="header">{this.props.reportName}</div>
                        <div className="subheader"><I18nMessage message={'lighthouse.stage.sub_header'}/></div>
                        <div className="content">
                            <div className="stage-showHide-content"><I18nMessage message={'lighthouse.stage.content'}/></div>
                        </div>
                    </div>
                    <div className="right">
                        <div className="content">
                            <div className="reminder">
                                <div className="stage-showHide-content">
                                    <div className="icon"></div>
                                    <div className="header"><I18nMessage message={'lighthouse.stage.feedback.header'}/></div>
                                    <div className="subheader"><I18nMessage message={'lighthouse.stage.feedback.sub_header'}/></div>
                                </div>
                                <div className="button-container">
                                    <Button bsStyle="primary" onClick={this.handleClick}> {<I18nMessage message={'lighthouse.stage.feedback.button'}/>}</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                 </div>;

    }
});

export default Stage;
