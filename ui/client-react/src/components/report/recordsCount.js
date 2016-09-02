import React from 'react';
import './report.scss';

import Loader  from 'react-loader';
import {I18nMessage} from '../../../src/utils/i18nMessage';
import Breakpoints from "../../utils/breakpoints";

const largeBreakpointColor = '#404040';
const smallBreakpointColor = '#ffffff';

var RecordsCount = React.createClass({
    propTypes: {
        isFiltered: React.PropTypes.bool,
        recordCount: React.PropTypes.number,
        filteredRecordCount: React.PropTypes.number,
        nameForRecords: React.PropTypes.string,
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
        let message = "report.recordCount";
        let placeHolderMessage = "report.recordCountPlaceHolder";
        let dbl = null;
        if (Breakpoints.isSmallBreakpoint()) {
            placeHolderMessage = "report.cardViewCountPlaceHolder";
        }

        if (this.props.isFiltered) {
            message = "report.filteredRecordCount";
            dbl = this.props.clearAllFilters;
        }
        // TODO Code hygiene, set up loader options as an external constant. https://quickbase.atlassian.net/browse/MB-503
        var loaderOptions = {
            lines: 7,
            length: 0,
            width: 5,
            radius: 5,
            scale: 1,
            corners: 1,
            opacity: 0,
            rotate: 0,
            direction: 1,
            speed: 1.1,
            trail: 60,
            fps: 20,
            zIndex: 2e9,
            color: !Breakpoints.isSmallBreakpoint() ? largeBreakpointColor : smallBreakpointColor,
            className: 'spinner',
            top: '54%',
            left: '33%',
            shadow: false,
            hwaccel: false,
            position: 'absolute'
        };
        if ((this.props.isFiltered && (this.props.filteredRecordCount === null) || this.props.recordCount === null)) {
            // no records
            return null;
        } else {
            return (
                <div className="recordsCountLoaderContainer">
                    <Loader loaded={!this.props.isCounting} options={loaderOptions}>
                            <div className="recordsCount" onDoubleClick={dbl}>
                                <I18nMessage message={message}
                                             filteredRecordCount={this.props.filteredRecordCount + ''}
                                             recordCount={this.props.recordCount + ''}
                                             nameForRecords={this.props.nameForRecords}
                                />
                            </div>
                    </Loader>
                    {   this.props.isCounting ?
                        <div className="recordsCount">
                            <I18nMessage message={placeHolderMessage} nameForRecords={this.props.nameForRecords} />
                        </div> :
                        null
                    }
                </div>
            );
        }
    }
});


export default RecordsCount;
