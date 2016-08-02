import React from 'react';
import './report.scss';

import Loader  from 'react-loader';
import {I18nMessage} from '../../../src/utils/i18nMessage';


var RecordsCount = React.createClass({
    propTypes: {
        isFiltered : React.PropTypes.bool,
        recordCount : React.PropTypes.number,
        filteredRecordCount : React.PropTypes.number,
        nameForRecords : React.PropTypes.string,
        clearAllFilters : React.PropTypes.func,
        isCounting : React.PropTypes.bool,
    },


    /**
     * renders the record count
     * if we have some dynamic filtering in effect include the number of filtered records out of the total
     * otherwise just show the reports total records
     */
    render() {
        let message = "report.recordCount";
        let placeHolderMessage = "report.recordCountPlaceHolder";
        let dbl = null;
        if (this.props.isFiltered) {
            message = "report.filteredRecordCount";
            dbl = this.props.clearAllFilters;
        }
        var loaderOptions = {
            lines: 7 // The number of lines to draw
            , length: 0 // The length of each line
            , width: 5 // The line thickness
            , radius: 5 // The radius of the inner circle
            , scale: 1 // Scales overall size of the spinner
            , corners: 1 // Corner roundness (0..1)
            , color: '#000' // #rgb or #rrggbb or array of colors
            , opacity: 0 // Opacity of the lines
            , rotate: 0 // The rotation offset
            , direction: 1 // 1: clockwise, -1: counterclockwise
            , speed: 1.1 // Rounds per second
            , trail: 60 // Afterglow percentage
            , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
            , zIndex: 2e9 // The z-index (defaults to 2000000000)
            , className: 'spinner' // The CSS class to assign to the spinner
            , top: '54%' // Top position relative to parent
            , left: '33%' // Left position relative to parent
            , shadow: false // Whether to render a shadow
            , hwaccel: false // Whether to use hardware acceleration
            , position: 'absolute' // Element positioning
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
                                         recordCount={this.props.recordCount}
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
