import React from 'react';

import QBicon from '../qbIcon/qbIcon';
import QBToolTip from '../qbToolTip/qbToolTip';
import './report.scss';
import {I18nMessage} from '../../../src/utils/i18nMessage';
import Breakpoints from "../../utils/breakpoints";
import StringUtils from "../../utils/stringUtils";
import NumberUtils from "../../utils/numberUtils";

import Pagination from "../../../../reuse/client/src/components/pagination/pagination";

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
        recordsCount: React.PropTypes.number,
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

        let showNavigation = !(this.props.recordsCount === this.props.pageEnd && this.props.pageStart === 1) && this.props.recordsCount !== 0;
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
                        <Pagination isPreviousDisabled={this.props.pageStart === 1}
                                    isNextDisabled={this.props.recordsCount === this.props.pageEnd}
                                    onClickPrevious={this.props.getPreviousReportPage}
                                    onClickNext={this.props.getNextReportPage}
                                    startRecord={this.props.pageStart}
                                    endRecord={this.props.pageEnd}
                                    isHidden={!this.props.reportData}
                        />
                    </div>);
        }
        return (<div className="spacer"></div>);
    }
});

export default ReportNavigation;
