import React, {PropTypes, Component} from 'react';
import Icon from '../icon/icon';
import Tooltip from '../tooltip/tooltip';
import './pagination.scss';
import {I18nMessage} from '../../../../../client-react/src/src/utils/i18nMessage';
import Breakpoints from '../../../../../client-react/src/utils/breakpoints';
import StringUtils from "../../../../../client-react/src/utils/stringUtils";
import NumberUtils from "../../../../../client-react/src/utils/numberUtils";

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
        pageStart: PropTypes.number,
        pageEnd: PropTypes.number,
        getNextReportPage: PropTypes.func,
        getPreviousReportPage: PropTypes.func,
        recordsCount: PropTypes.number,
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
        pageStart : PropTypes.number,
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
        recordsCount : PropTypes.number,
        pageEnd : PropTypes.number,
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
