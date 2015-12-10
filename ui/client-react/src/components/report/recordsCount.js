import React from 'react';

import Logger from '../../utils/logger';
let logger = new Logger();

import Fluxxor from 'fluxxor';
import './report.scss';
import {I18nMessage} from '../../../src/utils/i18nMessage';
import ReportSearchBox from './RecordSearchBox';
import FilterResultsButton from './FilterResultsButton';

let FluxMixin = Fluxxor.FluxMixin(React);


var RecordsCount = React.createClass({
    render() {
        return (<div className="recordsCount">
            {// to do globalize this
            }
            {this.props.numberRecords} {this.props.nameforRecords}
        </div>);
    }
});


export default RecordsCount;
