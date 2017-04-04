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
//
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

    const previousPageButton = () => {
      const previousButtonClassName = "previousButton " + (this.props.pageStart !== 1 ? "" : "disabled");
      return (
        <div className="prevPageButton">
      <Tooltip tipId="fieldName" i18nMessageKey="report.previousToolTip" >
      <button tabIndex="0" className="navigationButton" onClick={(e) => {
              e.preventDefault();
              if (hasPrevious) {
                onPageChange(page - 1);
              }
            }} type="button" >
            <Icon className={previousButtonClassName} icon="caret-filled-left" />
          </button>
        </Tooltip>
        </div>
      )
    }

    const nextPageButton = () => {
      const nextButtonClassName = "nextButton " + (this.props.pageCount !== this.props.pageEnd ? "" : "disabled");
      <div className="nextPageButton">
    <Tooltip tipId="fieldName" i18nMessageKey="report.nextToolTip" >
    <button tabIndex="0" className="navigationButton" onClick={(e) => {
            e.preventDefault();
            if (hasNext) {
              onPageChange(page - 1);
            }
          }} type="button" >
          <Icon className={nextButtonClassName} icon="caret-filled-right" />
        </button>
      </Tooltip>
      </div>
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

const mapStateToProps = {page: state.onPageChange};
const mapDispatchToProps = {onPageChange: pageChanged};
export default connect(mapStateToProps,mapDispatchToProps)(Pagination);
