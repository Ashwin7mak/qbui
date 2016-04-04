import React from 'react';
import Logger from '../../utils/logger';
import {I18nMessage} from '../../utils/i18nMessage';

import './facet.scss';
import Fluxxor from 'fluxxor';

let logger = new Logger();

let FluxMixin = Fluxxor.FluxMixin(React);
let StoreWatchMixin = Fluxxor.StoreWatchMixin;

/*
 FilterSearchBox component takes user input for filtering a report.
 Takes the function to call on changes to search string, what he list is known as default is Records
 */
var FilterSearchBox = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin('ReportDataSearchStore')],

    displayName: 'FilterSearchBox',
    propTypes: {
        onChange : React.PropTypes.func,
        nameForRecords: React.PropTypes.string
    },

    defaultProps: {
        nameForRecords :"Records"
    },

    getStateFromFlux() {
        let flux = this.getFlux();
        return flux.store('ReportDataSearchStore').getState();
    },

    render() {
        //TODO: use Search these X records in i18n message formatter at "record.searchPlaceHolder" once React.intl
        // supports string only, currently it wraps the generated message with a span tag which is not valid
        // within a placeholder element attribute.
        //
        // looks like this will be supported in
        // reactintl 2.0 see - http://stackoverflow.com/questions/35286239/how-to-put-valuedata-into-html-attribute-with-reactjs-and-reactintl
        let placeMsg = "Search these " + this.props.nameForRecords + "...";
        logger.debug('rendering search box with:' + this.state.searchStringInput);
        return (<div className="filterSearchBoxContainer">
                    <input className="filterSearchBox" type="text"
                           key={"filterSearchBox_" + this.props.searchBoxKey}
                           value={this.state.searchStringInput}
                           onChange={this.props.onChange}
                           placeholder={placeMsg}/>
                </div>
        );
    }
});

export default FilterSearchBox;
