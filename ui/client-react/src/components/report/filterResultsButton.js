import React from 'react';

import Logger from '../../utils/logger';
let logger = new Logger();

import Fluxxor from 'fluxxor';
import './report.scss';
import {I18nMessage} from '../../../src/utils/i18nMessage';
import ReportSearchBox from './RecordSearchBox';

let FluxMixin = Fluxxor.FluxMixin(React);


var FilterResultsButton = React.createClass({
    render() {
        return (<div className="filterResultsButton">
            FilterIcon
        </div>);
    }
});

export default FilterResultsButton;