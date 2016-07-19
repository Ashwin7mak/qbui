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

                <I18nMessage message={navBar}
                             pageStart={this.props.pageStart}
                             pageEnd={this.props.pageEnd}
                />

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
            <span id="previousReportPage" tabIndex="0" onClick={this.props.getPreviousReportPage}>
                <QBicon className={"previousButton " + (this.pageStart != 1 ? "" : "disabled") } icon="caret-left" />
            </span>
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
            <span id="nextReportPage" tabIndex="0" onClick={this.props.getNextReportPage}>
                <QBicon className={"nextButton " + ((this.props.recordsCount != this.props.pageEnd) ? "" : "disabled") } icon="caret-right" />
            </span>
        );
    }
});

export default ReportNavigation;
