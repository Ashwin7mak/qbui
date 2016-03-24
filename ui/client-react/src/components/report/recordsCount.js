import React from 'react';

import Logger from '../../utils/logger';
let logger = new Logger();

import Fluxxor from 'fluxxor';
import './report.scss';
import {I18nMessage} from '../../../src/utils/i18nMessage';
import ReportSearchBox from '../facet/filterSearchBox';

let FluxMixin = Fluxxor.FluxMixin(React);


var RecordsCount = React.createClass({
    propTypes: {
        isFiltered : React.PropTypes.bool,
        isLoading : React.PropTypes.bool,
        recordCount : React.PropTypes.number,
        filteredRecordCount : React.PropTypes.number,
        nameForRecords : React.PropTypes.string,
    },

    shouldComponentUpdate(nextProps, nextState) {
        return (this.props.isLoading !== nextProps.isLoading) && (!nextProps.isLoading);
    },

    /**
     * renders the record count
     * if we have some dynamic filtering in effect include the number of filtered records out of the total
     * otherwise just show the reports total records
     */
    render() {
        let message = "report.recordCount";
        if (this.props.isFiltered) {
            message = "report.filteredRecordCount";
        }
        if ((this.props.isFiltered && (this.props.filteredRecordCount === null) || this.props.recordCount === null)) {
            // no records
            return null;
        } else {
            let numberOfDigits = Math.log(this.props.recordCount) * Math.LOG10E + 1 | 0;  // for positive integers
            let numberOfFilteredDigits = Math.log(this.props.filteredRecordCount) * Math.LOG10E + 1 | 0;
            let paddingNeeded = numberOfDigits - numberOfFilteredDigits;
            return (<div className="recordsCount">
                <I18nMessage message={message}
                             padding={paddingNeeded ? (("         ").slice(-(paddingNeeded))) : ""}
                             filteredRecordCount={this.props.filteredRecordCount + ""}
                             recordCount={this.props.recordCount}
                             nameForRecords={this.props.nameForRecords}
                />
            </div>);
        }
    }
});


export default RecordsCount;
