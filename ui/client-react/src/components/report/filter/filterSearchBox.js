import React from 'react';

import Logger from '../../../utils/logger';
let logger = new Logger();

import Fluxxor from 'fluxxor';
import './filter.scss';
import {I18nMessage} from '../../../../src/utils/i18nMessage';

let FluxMixin = Fluxxor.FluxMixin(React);
var FilterSearchBox = React.createClass({
    mixins: [FluxMixin],

    render() {
        var nameForRecords = "Records"; // todo get from table info
        var placeMsg = "Search these " + nameForRecords + "..."; //TODO put into i18n message
        return (<input className="filterSearchBox" type="text" key="filterSearchBox"
                       onChange={this.props.onChange} placeholder={placeMsg}>
            </input>
        );
    }
});

export default FilterSearchBox;
