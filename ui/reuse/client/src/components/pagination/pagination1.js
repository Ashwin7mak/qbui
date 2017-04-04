import React, {PropTypes, Component} from 'react';
import Icon from '../icon/icon';
import { connect } from 'react-redux';
import { CHANGE_PAGE_NUMBER } from './commonPaginationActions'
import Tooltip from '../tooltip/tooltip';
import './pagination.scss';
import {I18nMessage} from '../../utils/i18nMessage';
import Breakpoints from '../../../../../client-react/src/utils/breakpoints';
import StringUtils from "../../../../../client-react/src/utils/stringUtils";
import NumberUtils from "../../../../../client-react/src/utils/numberUtils";
import constants from '../../../../../common/src/constants';

const propTypes = {
  page: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  autoHidePagination: PropTypes.bool,
};

class Pagination extends Component {
  render() {
    const {
      page,
      pageSize,
      onPageChange,
      autoHidePagination,
    } = this.props;
    let { pageCount } = this.props;
    let hasPrevious = page > 0;
    let hasNext = page < pageCount - 1;
    if (pageSize < 1) {
      pageCount = 1;
      hasPrevious = false;
      hasNext = false;
    }

    if (!this.props.pagingData) {
        return (<div className="spacer"></div>);
    }
    let isSmall = Breakpoints.isSmallBreakpoint();
    let isError = this.props.pagingData.error ? true : false;
    let isLoading = this.props.pagingData.loading ? true : false;
    let isCountingRecords = this.props.pagingData.countingTotalRecords ? true : false;

    let showNavigation = !(this.props.pageCount === this.props.pageEnd && this.props.pageStart === 1) && this.props.pageCount !== 0;

        let navBar = "report.reportNavigationBar";
        if (showComponent) {
            return (
              <div className="reportNavigation">

                        <PreviousLink pageStart={this.props.pageStart}/>
                        <div className="pageNumbers">
                            <I18nMessage message={navBar}
                                         pageStart={this.props.pageStart}
                                         pageEnd={this.props.pageEnd}
                            />
                        </div>
                        <NextLink pageCount={this.props.pageCount}
                                  pageEnd={this.props.pageEnd}
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
        pageStart : PropTypes.number
    },

    render() {
        const previousButtonClassName = "previousButton " + (this.props.pageStart !== 1 ? "" : "disabled");
        return (
            <Tooltip tipId="fieldName" i18nMessageKey="report.previousToolTip">
                {/* For embedded reports, this button element is rendered inside a <form> element.
                    We need to specify type="button" to prevent form submission when clicked. */}
                <button tabIndex="0" className="navigationButton" onClick={(e) => {
                  e.preventDefault();
                  if (hasPrevious) {
                    onPageChange(page - 1);
                  }
                }} type="button">
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
        pageEnd : PropTypes.number
    },

    render() {
        const nextButtonClassName = "nextButton " + (this.props.pageCount !== this.props.pageEnd ? "" : "disabled");

        return (
            <Tooltip tipId="fieldName" i18nMessageKey="report.nextToolTip">
                {/* For embedded reports, this button element is rendered inside a <form> element.
                    We need to specify type="button" to prevent form submission when clicked. */}
                <button tabIndex="0" className="navigationButton" onClick={(e) => {
                  e.preventDefault();
                  if (hasNext) {
                    onPageChange(page + 1);
                  }
                }} type="button">
                    <Icon className={nextButtonClassName} icon="caret-filled-right" />
                </button>
            </Tooltip>
        );
    }
};

function mapDispatchToProps = (dispatch) => {
  onPageChange: (page) => dispatch(pageChanged(page)),
}
export default connect(mapDispatchToProps)(Pagination);
