import React from 'react';
import Fluxxor from 'fluxxor';

import Logger from '../../utils/logger';
import {I18nMessage} from '../../utils/i18nMessage';

import './facet.scss';

let logger = new Logger();
let FluxMixin = Fluxxor.FluxMixin(React);

var FilterSearchBox = React.createClass({
    mixins: [FluxMixin],
    propTypes: {
        onChange : React.PropTypes.func,
        nameForRecords: React.PropTypes.string
    },
    defaultProps: {
        nameForRecords :"Records"
    },
    render() {
        //TODO put Search these X records into i18n message formatter
        let placeMsg = "Search these " + this.props.nameForRecords + "...";
        return (<input className="filterSearchBox" type="text" key="filterSearchBox"
                       onChange={this.props.onChange} placeholder={placeMsg}>
            </input>
        );
    }
});

export default FilterSearchBox;
