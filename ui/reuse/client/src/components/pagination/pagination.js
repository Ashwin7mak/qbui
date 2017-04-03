import React, {PropTypes, Component} from 'react';
import Icon from '../icon/icon';
import Tooltip from '../tooltip/tooltip';
import './pagination.scss';
import {I18nMessage} from '../../utils/i18nMessage';
import Breakpoints from '../../../../../client-react/src/utils/breakpoints';
import StringUtils from "../../../../../client-react/src/utils/stringUtils";
import NumberUtils from "../../../../../client-react/src/utils/numberUtils";
import constants from '../../../../../common/src/constants';

class Pagination extends Component{
    Pagination.propTypes = {
        /**
         *  Takes in for properties the reportData which includes the list of facets
         *  and a function to call when a facet value is selected.
         **/
        reportData: PropTypes.shape({
            data: PropTypes.shape({
                facets:  PropTypes.array
            })
        }),
        /**
         * Shows the current page for the particular paginized record */
        pageStart: PropTypes.number,
        /**
         * Shows the total page count for the particular paginized record */
        pageEnd: PropTypes.number,
        /**
         * Gets the next page in the particular paginized record */
        getNextReportPage: PropTypes.func,
        /**
         * Goes to the previous page in the particular paginized record */
        getPreviousReportPage: PropTypes.func,
        /**
         * Shows the total number of fields available in the particular paginized record*/
        recordsCount: PropTypes.number,
        loadDynamicReport: React.PropTypes.func,
    },

    /**
     * renders the pagination bar
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

        getNextReportPage() {
            if (this.props.reportData) {
                if (this.props.reportData.pageOffset + this.props.reportData.numRows >= this.props.reportData.data.recordsCount) {
                    return false;
                }
                this.getPageUsingOffsetMultiplicant(1);
            }
        },

        getPreviousReportPage() {
            if (this.props.reportData) {
                if (this.props.reportData.pageOffset === 0) {
                    return false;
                }
                this.getPageUsingOffsetMultiplicant(-1);
            }
        },

        getPageUsingOffsetMultiplicant(multiplicant) {
            let appId = this.props.reportData.appId;
            let tblId = this.props.reportData.tblId;
            let rptId = typeof this.props.reportData.rptId !== "undefined" ? this.props.reportData.rptId : this.props.params.rptId;
            let filter = {};
            let queryParams = {};
            let sortList = "";
            let numRows = Constants.PAGE.DEFAULT_NUM_ROWS;
            let offset =  Constants.PAGE.DEFAULT_OFFSET;

            if (this.props.reportData) {
                let reportData = this.props.reportData;
                if (reportData.numRows) {
                    numRows = reportData.numRows;
                }
                if (reportData.pageOffset) {
                    offset = reportData.pageOffset;
                }

                filter.selections = reportData.selections;
                filter.search = reportData.searchStringForFiltering;
                filter.facet = reportData.facetExpression;

                if (reportData.data && reportData.data.sortList) {
                    sortList = reportData.data.sortList;
                }
            }

            queryParams[query.SORT_LIST_PARAM] = sortList;
            queryParams[query.OFFSET_PARAM] = offset + (multiplicant * numRows);
            queryParams[query.NUMROWS_PARAM] = numRows;

            this.props.loadDynamicReport(appId, tblId, rptId, true, filter, queryParams);
        },

        let navBar = "report.reportNavigationBar";
        if (showComponent) {
            return (
              <div className="pagination">

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
                    </div>
                  );
        }
        return (<div className="spacer"></div>);
    }
};

class PreviousLink extends Component {
    PreviousLink.propTypes =  {
      /**
       * Shows the current page number in the particular paginized record*/
        pageStart : PropTypes.number,
        /**
         * Gets the previous page available in the particular paginized record*/
        getPreviousReportPage : PropTypes.func
    },

    render() {
        const previousButtonClassName = "previousButton " + (this.props.pageStart !== 1 ? "" : "disabled");
        return (
            <Tooltip tipId="fieldName" i18nMessageKey="report.previousToolTip">
                {/* For embedded reports, this button element is rendered inside a <form> element.
                    We need to specify type="button" to prevent form submission when clicked. */}
                <button tabIndex="0" className="navigationButton" onClick={this.props.getPreviousReportPage} type="button">
                    <Icon className={previousButtonClassName} icon="caret-filled-left" />
                </button>
            </Tooltip>
        );
    }
};

class NextLink extends Component {
    NextLink.propTypes = {
      /**
       * Shows the total number of fields available in the particular paginized record*/
        recordsCount : PropTypes.number,
        /**
         * Shows the last page number in the particular paginized record*/
        pageEnd : PropTypes.number,
        /**
         * Gets the next page available in the particular paginized record*/
        getNextReportPage : PropTypes.func
    },

    render() {
        const nextButtonClassName = "nextButton " + (this.props.recordsCount !== this.props.pageEnd ? "" : "disabled");

        return (
            <Tooltip tipId="fieldName" i18nMessageKey="report.nextToolTip">
                {/* For embedded reports, this button element is rendered inside a <form> element.
                    We need to specify type="button" to prevent form submission when clicked. */}
                <button tabIndex="0" className="navigationButton" onClick={this.props.getNextReportPage} type="button">
                    <Icon className={nextButtonClassName} icon="caret-filled-right" />
                </button>
            </Tooltip>
        );
    }
};

export default Pagination;
