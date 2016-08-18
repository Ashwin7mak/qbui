import React from 'react';

import QBicon from '../qbIcon/qbIcon';
import QBToolTip from '../qbToolTip/qbToolTip';
import './report.scss';
import {I18nMessage} from '../../../src/utils/i18nMessage';

var ReportNavigation = React.createClass({
    propTypes: {
        pageStart: React.PropTypes.number,
        pageEnd: React.PropTypes.number,
        recordsCount: React.PropTypes.number,
        getNextReportPage: React.PropTypes.func,
        getPreviousReportPage: React.PropTypes.func,
    },

    /**
     * renders the report navigation toolbar
     */
    render() {
        let navBar = "report.reportNavigationBar";

        return (<div className="reportNavigation">
                    <PreviousLink pageStart={this.props.pageStart}
                                  getPreviousReportPage={this.props.getPreviousReportPage}
                    />
                    <div className="pageNumbers">
                        <I18nMessage message={navBar}
                                     pageStart={this.props.pageStart}
                                     pageEnd={this.props.pageEnd}
                        />
                    </div>
                    <NextLink recordsCount={this.props.recordsCount}
                              pageEnd={this.props.pageEnd}
                              getNextReportPage={this.props.getNextReportPage}
                    />
                </div>);

    }
});

var PreviousLink = React.createClass({
    propTypes: {
        pageStart : React.PropTypes.number,
        getPreviousReportPage : React.PropTypes.func,
    },

    render: function() {
        const previousButtonClassName = "previousButton " + (this.props.pageStart !== 1 ? "" : "disabled");
        return (
            <QBToolTip tipId="fieldName" i18nMessageKey="report.previousToolTip">
                <button tabIndex="0" className="navigationButton" onClick={this.props.getPreviousReportPage}>
                    <QBicon className={previousButtonClassName} icon="icon_caretfilledleft" />
                </button>
            </QBToolTip>
        );
    }
});

var NextLink = React.createClass({
    propTypes: {
        recordsCount : React.PropTypes.number,
        pageEnd : React.PropTypes.number,
        getNextReportPage : React.PropTypes.func,
    },

    render: function() {
        const nextButtonClassName = "nextButton " + (this.props.recordsCount !== this.props.pageEnd ? "" : "disabled");

        return (
            <QBToolTip tipId="fieldName" i18nMessageKey="report.nextToolTip">
                <button tabIndex="0" className="navigationButton" onClick={this.props.getNextReportPage}>
                    <QBicon className={nextButtonClassName} icon="icon_caretfilledright" />
                </button>
            </QBToolTip>
        );
    }
});

export default ReportNavigation;
