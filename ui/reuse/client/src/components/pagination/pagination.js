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


function paginate() {
}

class Pagination extends Component {
  constructor(props) {
      super(props);

    this.previousPageButton = this.previousPageButton.bind(this);
    this.nextPageButton = this.nextPageButton.bind(this);

    const hasOnChange = props.onChange !== paginate;
    const hasCurrent = ('current' in props);

    let current = props.defaultCurrent;
    if ('current' in props) {
      current = props.current;
    }

    let pageSize = props.defaultPageSize;
    if ('pageSize' in props) {
      pageSize = props.pageSize;
    }

    this.state = {
      current,
      _current: current,
      pageSize,
    };

    [
      '_isValid',
      '_prev',
      '_next',
      '_hasPrev',
      '_hasNext',
    ].forEach((method) => this[method] = this[method].bind(this));
  }

  componentWillReceiveProps(nextProps) {
    if ('current' in nextProps) {
      this.setState({
        current: nextProps.current,
        _current: nextProps.current,
      });
    }
  }

 //Calculates the total number of pages available
  _calcPage(p) {
    let pageSize = p;
    if (typeof pageSize === 'undefined') {
      pageSize = this.state.pageSize;
    }
    return Math.floor((this.props.total - 1) / pageSize) + 1;
  }

  _isValid(page) {
    return typeof page === 'number' && page >= 1 && page !== this.state.current;
  }

  //Function that handles the change of pages
  _handleChange(p) {
    let page = p;
    if (this._isValid(page)) {
      if (page > this._calcPage()) {
        page = this._calcPage();
      }

      if (!('current' in this.props)) {
        this.setState({
          current: page,
          _current: page,
        });
      }

      const pageSize = this.state.pageSize;
      this.props.onChange(page, pageSize);

      return page;
    }

    return this.state.current;
  }

  //Fetches the previous page
  _prev() {
    if (this._hasPrev()) {
      this._handleChange(this.state.current - 1);
    }
  }

  //Fetches the next page
  _next() {
    if (this._hasNext()) {
      this._handleChange(this.state.current + 1);
    }
  }

 //Checks whether a previous page is present
  _hasPrev() {
    return this.state.current > 1;
  }

  //Checks whether a next page is present
  _hasNext() {
    return this.state.current < this._calcPage();
  }

 //Renders the logic for previous page button
  previousPageButton() {
    const previousButtonClassName = "previousButton " + (this._hasPrev() ? "" : "disabled");
    return (
          <div className="prevPageButton">
            <Tooltip tipId="fieldName" i18nMessageKey="report.previousToolTip" >
              <button tabIndex="0" className="navigationButton navigationButtonPrevious" onClick={this._prev} type="button" >
                <Icon className={previousButtonClassName} icon="caret-filled-left" />
              </button>
            </Tooltip>
          </div>
           )
  };

  //Renders the logic for next page button
  nextPageButton(){
   const nextButtonClassName = "nextButton " + (this._hasNext() ? "" : "disabled");
   return(
     <div className="nextPageButton">
      <Tooltip tipId="fieldName" i18nMessageKey="report.nextToolTip">
        <button tabIndex="0" className="navigationButton navigationButtonNext" onClick={this._next} type="button" >
           <Icon className={nextButtonClassName} icon="caret-filled-right" />
        </button>
     </Tooltip>
    </div>
 )
};

  render() {
    const props = this.props;
    const allPages = this._calcPage();
    const { current, pageSize } = this.state;

    let navBar = "report.reportNavigationBar";
    if (props.pagingData) {
      return (
          <div className="reportNavigation">
            {this.previousPageButton()}
              <div className="pageNumbers">
                <I18nMessage message={navBar}
                             pageStart={this.state._current}
                             pageEnd={allPages}
                />
              </div>
              {this.nextPageButton()}
            </div>
            );
    }
    return null;
  }
}

Pagination.propTypes = {
  /*
  // The data to be passed in for the paginated component to work */
  pagingData: React.PropTypes.bool,
  /*
  // Current refers to the current page which is actually in view */
  current: React.PropTypes.number,
  /*
  //Default current is the current page to be loaded when the component loads up - Default set to 1st page */
  defaultCurrent: React.PropTypes.number,
  /*
  // Total number of records available */
  total: React.PropTypes.number,
  /*
  pageSize is the total number of rows per page */
  pageSize: React.PropTypes.number,
  /*
  defaultPageSize is the total number of rows per page - default to 20 */
  defaultPageSize: React.PropTypes.number,
  /*
  Function that renders the change */
  onChange: React.PropTypes.func,
  };

Pagination.defaultProps = {
  /*
  Default current page is 1 */
  defaultCurrent: 1,
  /*
  Default number of records to be paginated is 0 */
  total: 0,
  /*
  Default page size is 20 i.e., 20 records per page */
  defaultPageSize: 20,
  onChange: paginate,
  className: '',
};

//Have created an action and a reducer which works well with this component. Feel free to use it.
export default Pagination;
