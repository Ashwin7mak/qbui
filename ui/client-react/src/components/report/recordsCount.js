import React from 'react';
import './report.scss';

import Loader  from 'react-loader';
import {I18nMessage} from '../../../src/utils/i18nMessage';
import * as SpinnerConfigurations from "../../constants/spinnerConfigurations";
import Breakpoints from "../../utils/breakpoints";

const largeBreakpointColor = '#404040';
const smallBreakpointColor = '#ffffff';

var RecordsCount = React.createClass({
    propTypes: {
        isFiltered: React.PropTypes.bool,
        recordCount: React.PropTypes.number,
        filteredRecordCount: React.PropTypes.number,
        clearAllFilters: React.PropTypes.func,
        isCounting: React.PropTypes.bool,
    },
    /**
     * renders the record count
     * if we have some dynamic filtering in effect include the number of filtered records out of the total
     * otherwise just show the reports total records
     *
     * If it isSmall then we change the color fo the loader to match the color of the text for small breakpoints
     * and it changes the text header from 'Counting {records}' to 'Counting...'
     */
    render() {
        // No records check
        if ((this.props.isFiltered && (this.props.filteredRecordCount === null) || this.props.recordCount === null)) {
            return null;
        }
        // Set resource property name
        let message = (this.props.recordCount === 1) ? "report.singleRecordCount" : "report.recordCount";
        let placeHolderMessage = (Breakpoints.isSmallBreakpoint()) ? "report.cardViewCountPlaceHolder" : "report.recordCountPlaceHolder";

        let dbl = null;

        if (this.props.isFiltered) {
            dbl = this.props.clearAllFilters;
            message = (this.props.recordCount === 1) ? "report.filteredSingleRecordCount" : "report.filteredRecordCount";
        }

        let loaderOptions = SpinnerConfigurations.RECORD_COUNT;
        loaderOptions.color = !Breakpoints.isSmallBreakpoint() ? largeBreakpointColor : smallBreakpointColor;
        return (
            <div className="recordsCountLoaderContainer">
                <Loader loaded={!this.props.isCounting} options={loaderOptions}>
                        <div className="recordsCount" onDoubleClick={dbl}>
                            <I18nMessage message={message}
                                         filteredRecordCount={this.props.filteredRecordCount + ''}
                                         recordCount={this.props.recordCount + ''}
                            />
                        </div>
                </Loader>
                {   this.props.isCounting ?
                    <div className="recordsCount">
                        <I18nMessage message={placeHolderMessage} />
                    </div> :
                    null
                }
            </div>
        );
    }
});


export default RecordsCount;
