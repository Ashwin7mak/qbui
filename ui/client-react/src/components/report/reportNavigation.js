import React from 'react';

import QBicon from '../qbIcon/qbIcon';
import QBToolTip from '../qbToolTip/qbToolTip';
import './report.scss';
import {I18nMessage} from '../../../src/utils/i18nMessage';
import Breakpoints from "../../utils/breakpoints";
import StringUtils from "../../utils/stringUtils";
import NumberUtils from "../../utils/numberUtils";

var ReportNavigation = React.createClass({
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
        pageStart: React.PropTypes.number,
        pageEnd: React.PropTypes.number,
        getNextReportPage: React.PropTypes.func,
        getPreviousReportPage: React.PropTypes.func,
    },

    /**
     * renders the report navigation toolbar
     */
    render() {
        // Conditional indicating display of record navigation arrows. Show when
        // - records/page have been loaded and
        // - if the total count of records is available, total number of records in report is greater than page size. In the parent
        //   component container, to display the correct page end, we set the page end to the total records count if records count
        //   is less than page size for the last page. Hence, the conditions to check for here, are that we are on the first page
        //   (page start is 1) and the number of records is equal to page end
        if (!this.props.reportData) {
            return (<div className="spacer"></div>);
        }
        let isSmall = Breakpoints.isSmallBreakpoint();
        let isError = this.props.reportData.error ? true : false;
        let isLoading = this.props.reportData.loading ? true : false;
        let isCountingRecords = this.props.reportData.countingTotalRecords ? true : false;
        let recordCount = this.props.reportData.data && NumberUtils.isInt(this.props.reportData.data.recordsCount) ? this.props.reportData.data.recordsCount : 0;

        let isReportFiltered = false;
        if (this.props.reportData.searchStringForFiltering && StringUtils.trim(this.props.reportData.searchStringForFiltering).length !== 0) {
            isReportFiltered = true;
        } else {
            isReportFiltered = this.props.reportData.selections ? this.props.reportData.selections.hasAnySelections() : false;
        }

        if (isReportFiltered) {
            recordCount = this.props.reportData.data.filteredRecordsCount;
        }
        let showNavigation = !(recordCount === this.props.pageEnd && this.props.pageStart === 1) && recordCount !== 0;
        // Do not show navigation if:
        // - We're in the small breakpoint
        // - Page records have not been fetched
        // - We're counting the total number of records
        // - There's an error
        // - When page is not filtered, the condition mentioned above
        // - When page is filtered, number of items is less than page size
        let showComponent = !isSmall && !isLoading && !isCountingRecords && !isError && showNavigation;

        let navBar = "report.reportNavigationBar";
        if (showComponent) {
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
                        <NextLink recordsCount={recordCount}
                                  pageEnd={this.props.pageEnd}
                                  getNextReportPage={this.props.getNextReportPage}
                        />
                    </div>);
        }
        return (<div className="spacer"></div>);
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
