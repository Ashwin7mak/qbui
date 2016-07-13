import React from 'react';

import Logger from '../../utils/logger';
let logger = new Logger();

import Fluxxor from 'fluxxor';
import './report.scss';
import {I18nMessage} from '../../../src/utils/i18nMessage';

let FluxMixin = Fluxxor.FluxMixin(React);

var ReportNavigation = React.createClass({
    propTypes: {
        offset: React.PropTypes.number,
        numRows: React.PropTypes.number,
        recordsCount: React.PropTypes.number,
    },
    /**
     * renders the report navigation toolbar
     */
    render() {
        let navBar = "report.reportNavigationBar";

        return (<div className="reportNavigation">

                { this.props.offset != 1 ?  <PreviousLink/> : null }

                <I18nMessage message={navBar}
                             offset={this.props.offset}
                             numRows={this.props.numRows}
                />

                { this.props.recordsCount && this.props.numRows >= this.props.recordsCount ? <NextLink/> : null }
        </div>);

    }
});

var PreviousLink = React.createClass({
    onClick: function() {
        alert('previous');
    },
    render: function() {
        return (
            <span style={{marginRight: 2 + 'em'}} id="previousReportPage" onClick={this.onClick}>
                Previous
            </span>
        );
    }
});

var NextLink = React.createClass({
    onClick: function() {
        alert('next');
    },
    render: function() {
        return (
            <span style={{marginLeft: 2 + 'em'}} id="nextReportPage" onClick={this.onClick}>
                Next
            </span>
        );
    }
});

export default ReportNavigation;
