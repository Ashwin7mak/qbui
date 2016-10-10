import React from 'react';
import Fluxxor from 'fluxxor';

import './report.scss';

import ReportNavigation from './reportNavigation';
let FluxMixin = Fluxxor.FluxMixin(React);

/**
 * A footer for a table report. This footer contains the report page navigation links.
 * We render this footer only for the large and medium breakpoint, and when the total number
 * of records in the report exceeds the set page size.
 */
const ReportFooter = React.createClass({
    mixins: [FluxMixin],

    propTypes: {
        /**
         *  Takes in for properties the reportData which includes the list of facets
         *  and a function to call when a facet value is selected.
         **/
        reportData: React.PropTypes.shape({
            data: React.PropTypes.shape({
                facets:  React.PropTypes.array
            })
        }),
        getPreviousReportPage: React.PropTypes.func,
        getNextReportPage: React.PropTypes.func,
        pageStart: React.PropTypes.number,
        pageEnd: React.PropTypes.number,
        recordsCount: React.PropTypes.number,
    },

    render() {
        return (
            <div className="reportFooter">
                <div className="leftReportFooter">
                </div>
                <div className="rightReportFooter">
                    <div className="rightReportFooterSpacer"></div>
                        <ReportNavigation reportData={this.props.reportData}
                                          pageStart={this.props.pageStart}
                                          pageEnd={this.props.pageEnd}
                                          getNextReportPage={this.props.getNextReportPage}
                                          getPreviousReportPage={this.props.getPreviousReportPage}
                                          recordsCount={this.props.recordsCount}
                        />
                </div>
            </div>
        );
    }
});

export default ReportFooter;

