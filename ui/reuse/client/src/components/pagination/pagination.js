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
         *  Takes in for properties the pagingData which includes the list of facets
         *  and a function to call when a facet value is selected.
         **/
        pagingData: PropTypes.shape({
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
        getNextPage: PropTypes.func,
        /**
         * Goes to the previous page in the particular paginized record */
        getPreviousPage: PropTypes.func,
        /**
         * Shows the total number of fields available in the particular paginized record*/
        pageCount: PropTypes.number,
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
        if (!this.props.pagingData) {
            return (<div className="spacer"></div>);
        }
        let isSmall = Breakpoints.isSmallBreakpoint();
        let isError = this.props.pagingData.error ? true : false;
        let isLoading = this.props.pagingData.loading ? true : false;
        let isCountingRecords = this.props.pagingData.countingTotalRecords ? true : false;

        let showNavigation = !(this.props.pageCount === this.props.pageEnd && this.props.pageStart === 1) && this.props.pageCount !== 0;
        // Do not show navigation if:
        // - We're in the small breakpoint
        // - Page records have not been fetched
        // - We're counting the total number of records
        // - There's an error
        // - When page is not filtered, the condition mentioned above
        // - When page is filtered, number of items is less than page size
        let showComponent = !isSmall && !isLoading && !isCountingRecords && !isError && showNavigation;

        getNextPage() {
            if (this.props.pagingData) {
                if (this.props.pagingData.pageOffset + this.props.pagingData.numRows >= this.props.pagingData.data.pageCount) {
                    return false;
                }
                this.getPageUsingOffsetMultiplicant(1);
            }
        },

        getPreviousPage() {
            if (this.props.pagingData) {
                if (this.props.pagingData.pageOffset === 0) {
                    return false;
                }
                this.getPageUsingOffsetMultiplicant(-1);
            }
        },

        let navBar = "report.reportNavigationBar";
        if (showComponent) {
            return (
              <div className="reportNavigation">

                        <PreviousLink pageStart={this.props.pageStart}
                                      getPreviousPage={this.props.getPreviousPage}
                        />
                        <div className="pageNumbers">
                            <I18nMessage message={navBar}
                                         pageStart={this.props.pageStart}
                                         pageEnd={this.props.pageEnd}
                            />
                        </div>
                        <NextLink pageCount={this.props.pageCount}
                                  pageEnd={this.props.pageEnd}
                                  getNextPage={this.props.getNextPage}
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
        getPreviousPage : PropTypes.func
    },

    render() {
        const previousButtonClassName = "previousButton " + (this.props.pageStart !== 1 ? "" : "disabled");
        return (
            <Tooltip tipId="fieldName" i18nMessageKey="report.previousToolTip">
                {/* For embedded reports, this button element is rendered inside a <form> element.
                    We need to specify type="button" to prevent form submission when clicked. */}
                <button tabIndex="0" className="navigationButton" onClick={this.props.getPreviousPage} type="button">
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
        pageCount : PropTypes.number,
        /**
         * Shows the last page number in the particular paginized record*/
        pageEnd : PropTypes.number,
        /**
         * Gets the next page available in the particular paginized record*/
        getNextPage : PropTypes.func
    },

    render() {
        const nextButtonClassName = "nextButton " + (this.props.pageCount !== this.props.pageEnd ? "" : "disabled");

        return (
            <Tooltip tipId="fieldName" i18nMessageKey="report.nextToolTip">
                {/* For embedded reports, this button element is rendered inside a <form> element.
                    We need to specify type="button" to prevent form submission when clicked. */}
                <button tabIndex="0" className="navigationButton" onClick={this.props.getNextPage} type="button">
                    <Icon className={nextButtonClassName} icon="caret-filled-right" />
                </button>
            </Tooltip>
        );
    }
};

export default Pagination;
