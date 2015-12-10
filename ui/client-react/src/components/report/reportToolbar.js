import React from 'react';

import Logger from '../../utils/logger';
let logger = new Logger();

import Fluxxor from 'fluxxor';
import './report.scss';
import {I18nMessage} from '../../../src/utils/i18nMessage';
import RecordSearchBox from './RecordSearchBox';
import FilterResultsButton from './FilterResultsButton';
import RecordsCount from './RecordsCount';

let FluxMixin = Fluxxor.FluxMixin(React);


var ReportToolbar = React.createClass({
    mixins: [FluxMixin],

    componentDidMount() {

        if (this.props.params) {
            //this.loadReportFromParams(this.props.params);
        }
    },
    render() {
        return (<div className="reportToolbar">
                <RecordSearchBox></RecordSearchBox>
                <FilterResultsButton></FilterResultsButton>
                <RecordsCount numberRecords="100" nameforRecords="Records"></RecordsCount>
        </div>);
    }
});

export default ReportToolbar;


