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


Pagination.propTypes = {
  current: React.PropTypes.number,
  defaultCurrent: React.PropTypes.number,
  total: React.PropTypes.number,
  pageSize: React.PropTypes.number,
  defaultPageSize: React.PropTypes.number,
  onChange: React.PropTypes.func,
  showTotal: React.PropTypes.func,
};

Pagination.defaultProps = {
  defaultCurrent: 1,
  total: 0,
  defaultPageSize: 20,
  onChange: noop,
  className: '',
};

class Pagination extends Component {
  constructor(props) {
      super(props);

    const hasOnChange = props.onChange;
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
      'render',
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

  _prev() {
    if (this._hasPrev()) {
      this._handleChange(this.state.current - 1);
    }
  }

  _next() {
    if (this._hasNext()) {
      this._handleChange(this.state.current + 1);
    }
  }

  _hasPrev() {
    return this.state.current > 1;
  }

  _hasNext() {
    return this.state.current < this._calcPage();
  }



  //move previous and next page funciton here
  render() {
    const props = this.props;
    const allPages = this._calcPage();
    const { current, pageSize } = this.state;

    const previousPageButton = () => {
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

    const nextPageButton = () =>  {
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


    let navBar = "report.reportNavigationBar";
    if (props.simple) {
      return (
          <div className="reportNavigation">
            {previousPageButton()}
              <div className="pageNumbers">
                <I18nMessage message={navBar}
                             pageStart={this.state._current}
                             pageEnd={allPages}
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
