import React from 'react';

import Logger from '../../utils/logger';
let logger = new Logger();

import QBicon from '../qbIcon/qbIcon';

import Fluxxor from 'fluxxor';
import './report.scss';
import {I18nMessage} from '../../../src/utils/i18nMessage';

let FluxMixin = Fluxxor.FluxMixin(React);

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
        return (
            <button className="navigationButton" onClick={this.props.getPreviousReportPage}>
                <QBicon className={"previousButton " + (this.props.pageStart !== 1 ? "" : "disabled") } icon="icon_caretfilledleft" />
            </button>
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
        return (
            <button className="navigationButton" onClick={this.props.getNextReportPage}>
                <QBicon className={"nextButton " + ((this.props.recordsCount != this.props.pageEnd) ? "" : "disabled") } icon="icon_caretfilledright" />
            </button>
        );
    }
});

export default ReportNavigation;
