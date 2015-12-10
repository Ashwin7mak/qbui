import React from 'react';

import Logger from '../../utils/logger';
let logger = new Logger();

import Fluxxor from 'fluxxor';
import './report.scss';
import {I18nMessage} from '../../../src/utils/i18nMessage';

let FluxMixin = Fluxxor.FluxMixin(React);
var RecordSearchBox = React.createClass({
    render() {
        var nameForRecords = "Records"; // todo get from table info
        var placeMsg = "Search these " + nameForRecords + "..."; //TODO put into i18n message
        return (<input className="recordSearchBox" type="text" placeholder={placeMsg}>
            </input>
        );
    }
});
export default RecordSearchBox;
