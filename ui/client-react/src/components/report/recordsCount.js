import React from 'react';

import Logger from '../../utils/logger';
let logger = new Logger();

import Fluxxor from 'fluxxor';
import './report.scss';
import {I18nMessage} from '../../../src/utils/i18nMessage';
import ReportSearchBox from '../facet/filterSearchBox';

let FluxMixin = Fluxxor.FluxMixin(React);


var RecordsCount = React.createClass({
    /**
     * renders the record count
     * if we have some dynamic filtering in effect include the number of filtered records out of the total
     * otherwise just show the reports total records
     */
    render() {
        let message = "report.recordCount";
        if (this.props.isFiltering) {
            message = "report.filteredRecordCount";
        }

        return (<div className="recordsCount">
                <I18nMessage message={message}
                    filteredRecordCount={this.props.filteredRecordCount}
                    recordCount={this.props.recordCount}
                    nameForRecords={this.props.nameForRecords}
                />
            </div>);
    }
});


export default RecordsCount;
