import React from 'react';
import Logger from '../../utils/logger';
import {I18nMessage} from '../../utils/i18nMessage';
import Locale from '../../locales/locales';
import './facet.scss';
import Fluxxor from 'fluxxor';

let logger = new Logger();

let FluxMixin = Fluxxor.FluxMixin(React);
let StoreWatchMixin = Fluxxor.StoreWatchMixin;

/*
 FilterSearchBox component takes user input for filtering a report.
 Takes the function to call on changes to search string, what he list is known as default is Records
 */
const FilterSearchBox = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin('ReportDataSearchStore')],

    displayName: 'FilterSearchBox',
    propTypes: {
        onChange : React.PropTypes.func
    },

    getStateFromFlux() {
        let flux = this.getFlux();
        return flux.store('ReportDataSearchStore').getState();
    },

    render() {

        let placeMsg = Locale.getMessage("report.searchPlaceHolder") + " " + Locale.getMessage("records.plural") + "...";

        logger.debug('rendering search box with:' + this.state.searchStringInput);
        return (<div className="filterSearchBoxContainer">
                    <input className="filterSearchBox" type="text"
                           key={"filterSearchBox_" + this.props.searchBoxKey}
                           value={this.state.searchStringInput}
                           onChange={this.props.onChange}
                           onDoubleClick={this.props.clearSearchString} // till we get the icon
                           placeholder={placeMsg}/>
                </div>
        );
    }
});

export default FilterSearchBox;
