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
    },

    render() {
        let isLoading = false;
        // Indicates that the total count of records is still being calculated
        let isCountingRecords = false;
        // Total number of records in report
        let recordCount = 0;

        if (this.props.reportData) {
            if (this.props.reportData.loading) {
                isLoading = this.props.reportData.loading;
            }
            if (this.props.reportData.countingTotalRecords) {
                isCountingRecords = this.props.reportData.countingTotalRecords;
            } else if (this.props.reportData.data) {
                recordCount = this.props.reportData.data.recordsCount;
            }
        }
        let isFiltered = false;
        if (this.props.reportData.searchStringForFiltering && this.props.reportData.searchStringForFiltering.length !== 0) {
            isFiltered = true;
        } else {
            isFiltered = this.props.reportData.selections ? this.props.reportData.selections.hasAnySelections() : false;
        }
        let showFooterForFilteredPage = true;
        if (isFiltered && this.props.reportData.data.filteredRecordsCount <= this.props.pageEnd) {
            showFooterForFilteredPage = false;
        }
        // Conditional indicating display of record navigation arrows. Show when
        // - records/page have been loaded and
        // - if the total count of records is available, total number of records in report is greater than page size. In the parent
        //   component container, to display the correct page end, we set the page end to the total records count if records count
        //   is less than page size for the last page. Hence, the conditions to check for here, are that we are on the first page
        //   (page start is 1) and the number of records is equal to page end
        let showFooterNavigation = !isLoading && !isCountingRecords && !(recordCount === this.props.pageEnd && this.props.pageStart === 1) && showFooterForFilteredPage;
        return (
            <div className="reportFooter">
                <div className="leftReportFooter">
                </div>
                <div className="rightReportFooter">
                    <div className="rightReportFooterSpacer"></div>
                    { showFooterNavigation ?
                        (<ReportNavigation pageStart={this.props.pageStart}
                                           pageEnd={this.props.pageEnd}
                                           recordsCount={recordCount}
                                           getNextReportPage={this.props.getNextReportPage}
                                           getPreviousReportPage={this.props.getPreviousReportPage}
                        />) :
                        null
                    }
                    { isLoading ? <div className="loadedContent"></div> :
                        null
                    }
                </div>
            </div>
        );
    }
});

export default ReportFooter;

