import React from 'react';
import './report.scss';
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
        if (this.props.isCounting) {
            return (<div className="recordsCount" onDoubleClick={dbl}>
                <I18nMessage message={placeHolderMessage}
                             nameForRecords={this.props.nameForRecords}
                />
            </div>);
        } else if ((this.props.isFiltered && (this.props.filteredRecordCount === null) || this.props.recordCount === null)) {
            // no records
            return null;
        } else {
            return (<div className="recordsCount" onDoubleClick={dbl}>
                <I18nMessage message={message}
                             filteredRecordCount={this.props.filteredRecordCount + ''}
                             recordCount={this.props.recordCount}
                             nameForRecords={this.props.nameForRecords}
                />
            </div>);
        }
    }
});


export default RecordsCount;
