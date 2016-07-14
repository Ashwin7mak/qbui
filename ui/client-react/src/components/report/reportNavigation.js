import React from 'react';

import Logger from '../../utils/logger';
let logger = new Logger();

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

                { this.props.pageStart != 1 ?
                    <PreviousLink getPreviousReportPage={this.props.getPreviousReportPage}/>
                    : null
                }

                <I18nMessage message={navBar}
                             pageStart={this.props.pageStart}
                             pageEnd={this.props.pageEnd}
                />

                { this.props.recordsCount && this.props.pageEnd <= (this.props.recordsCount + this.props.pageStart) ?
                    <NextLink getNextReportPage={this.props.getNextReportPage} /> :
                    null
                }
        </div>);

    }
});

var PreviousLink = React.createClass({
    propTypes: {
        getPreviousReportPage : React.PropTypes.func,
    },

    render: function() {
        return (
            <span style={{marginRight: 2 + 'em'}} id="previousReportPage" onClick={this.props.getPreviousReportPage}>
                Previous
            </span>
        );
    }
});

var NextLink = React.createClass({
    propTypes: {
        getNextReportPage : React.PropTypes.func,
    },

    render: function() {
        return (
            <span style={{marginLeft: 2 + 'em'}} id="nextReportPage" onClick={this.props.getNextReportPage} onDoubleClick={this.props.getNextReportPage}>
                Next
            </span>
        );
    }
});

export default ReportNavigation;
