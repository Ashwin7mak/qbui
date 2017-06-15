import React, {PropTypes, Component} from 'react';
import Icon from 'REUSE/components/icon/icon';
import Tooltip from 'REUSE/components/tooltip/tooltip';
import {I18nMessage} from 'REUSE/utils/i18nMessage';
import './pagination.scss';

class Pagination extends Component {

 //Renders the logic for previous page button
    previousPageButton = () => {
        const previousButtonClassName = "previousButton " + (this.props.isPreviousDisabled ? "disabled" : "");
        return (
              <div className="prevPageButton">
                  <Tooltip tipId="fieldName" i18nMessageKey="report.previousToolTip" >
                      <button tabIndex="0" className="navigationButton navigationButtonPrevious" onClick={this.props.onClickPrevious} type="button" >
                          <Icon className={previousButtonClassName} icon="caret-filled-left" />
                      </button>
                  </Tooltip>
              </div>
        );
    };

  //Renders the logic for next page button
    nextPageButton = () => {
        const nextButtonClassName = "nextButton " + (this.props.isNextDisabled ? "disabled" : "");
        return (
              <div className="nextPageButton">
                  <Tooltip tipId="fieldName" i18nMessageKey="report.nextToolTip">
                      <button tabIndex="0" className="navigationButton navigationButtonNext" onClick={this.props.onClickNext} type="button" >
                          <Icon className={nextButtonClassName} icon="caret-filled-right" />
                      </button>
                  </Tooltip>
              </div>
        );
    };

    render() {
        let navBar = "report.reportNavigationBar";
        if (!this.props.isHidden) {
            return (
                    <div className="reportNavigation">
                        {this.previousPageButton()}
                            <span className="pageNumbers">
                                <I18nMessage  message={navBar}
                                              pageStart={this.props.startRecord}
                                              pageEnd={this.props.endRecord}
                                />
                            </span>
                        {this.nextPageButton()}
                    </div>
            );
        }
        return (<div className="spacer"></div>);
    }
}


Pagination.propTypes = {
    /*
    Current refers to the current record which is actually in view  { 21 - 40 }*/
    startRecord: React.PropTypes.number,
    /*
    * Shows the end number of the record available in view { 21 - 40 }*/
    endRecord: React.PropTypes.number,
    /*
    * Function that gets back the previous page */
    onClickPrevious: React.PropTypes.func,
    /*
    * Function that gets the next page */
    onClickNext: React.PropTypes.func,
    /*
    * Prop which shows that the previous page button is disabled*/
    isPreviousDisabled: React.PropTypes.bool,
    /*
    * Prop which shows that the next page button is disabled*/
    isNextDisabled: React.PropTypes.bool,
    /*
    * Prop which shows that the pagination */
    isHidden: React.PropTypes.bool,

};

Pagination.defaultProps = {
    /*
    * Default current page is 1 */
    startRecord: 1,
    /*
    * Default end page is 1 */
    endRecord: 1,
    /*
    * Since the default page is 1, previous button is disabled */
    isPreviousDisabled: true,
    /*
    * Set to default false as more pages might come in*/
    isNextDisabled: false,
    /*
    * Shows the pagination component unless its true */
    isHidden: false,
};

export default Pagination;
