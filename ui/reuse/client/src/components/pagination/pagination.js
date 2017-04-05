import React, {PropTypes, Component} from 'react';
import Icon from '../icon/icon';
import {connect} from 'react-redux';
import {CHANGE_PAGE_NUMBER} from './commonPaginationActions'
import Tooltip from '../tooltip/tooltip';
import {I18nMessage} from '../../utils/i18nMessage';
import Breakpoints from '../../../../../client-react/src/utils/breakpoints';
import StringUtils from "../../../../../client-react/src/utils/stringUtils";
import NumberUtils from "../../../../../client-react/src/utils/numberUtils";
import constants from '../../../../../common/src/constants';
import './pagination.scss';


const propTypes = {
  /**
  Page is the actual page being rendered */
  page: PropTypes.number.isRequired,
  /**
  pageCount refers to the total number of pages to be present */
  pageCount: PropTypes.number.isRequired,
  /**
  pageSize refers to the count of rows in a table/record to be paginated. It is default to 20 */
  pageSize: PropTypes.number.isRequired,
  /**
  onPageChange is the function to get the next or previous page */
  onPageChange: PropTypes.func.isRequired,
  /**
  autoHidePagination hides pagination if pageCount is less than or equal to 1, default to true initially */
  autoHidePagination: PropTypes.bool,
};

class Pagination extends Component {
  render() {
    const {
      page,
      pageSize,
      onPageChange,
      autoHidePagination,
      pageCount,
    } = this.props;
    let hasPrevious = page > 0;
    let autoHidePagination = true;
    let hasNext = page < pageCount - 1;
    if (pageSize < 1) {
      pageCount = 1;
      hasPrevious = false;
      hasNext = false;
    }

    const previousPageButton = () => {
      const previousButtonClassName = "previousButton " + (this.props.pageStart !== 1 ? "" : "disabled");
      return (
        <div className="prevPageButton">
          <Tooltip tipId="fieldName" i18nMessageKey="report.previousToolTip" >
            <button tabIndex="0" className="navigationButton navigationButtonPrevious" onClick={(e) => {e.preventDefault(); if (hasPrevious) { onPageChange(page - 1); } }} type="button" >
         <Icon className={previousButtonClassName} icon="caret-filled-left" />
            </button>
          </Tooltip>
        </div>
        )
    }

    const nextPageButton = () => {
      const nextButtonClassName = "nextButton " + (this.props.pageCount !== this.props.pageEnd ? "" : "disabled");
      return(
        <div className="nextPageButton">
         <Tooltip tipId="fieldName" i18nMessageKey="report.nextToolTip">
           <button tabIndex="0" className="navigationButton navigationButtonNext" onClick={(e)=> { e.preventDefault(); if (hasNext) { onPageChange(page + 1); } }} type="button" >
              <Icon className={nextButtonClassName} icon="caret-filled-right" />
           </button>
        </Tooltip>
       </div>
    )
  }

    let navBar = "report.reportNavigationBar";
    if (pageCount > 1 || !autoHidePagination) {
      return (
          <div className="reportNavigation">
            {prevPageButton()}
              <div className="pageNumbers">
                <I18nMessage message={navBar}
                             pageStart={this.props.pageStart}
                             pageEnd={this.props.pageEnd}
                />
              </div>
              {nextPageButton()}
            </div>
            );
    }
    return null;
  }
}

//Have created an action and a reducer which works well with this component. Feel free to use it.
export default Pagination;
