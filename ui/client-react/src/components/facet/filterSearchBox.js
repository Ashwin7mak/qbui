import React from 'react';
import Logger from '../../utils/logger';
import {I18nMessage} from '../../utils/i18nMessage';

import './facet.scss';

/*
 FilterSearchBox component takes user input for filtering a report.
 Takes the function to call on changes to search string, what he list is known as default is Records
 */
var FilterSearchBox = React.createClass({
    displayName: 'FilterSearchBox',
    propTypes: {
        onChange : React.PropTypes.func,
        nameForRecords: React.PropTypes.string,
        value : React.PropTypes.string.isRequired
    },
    defaultProps: {
        nameForRecords :"Records"
    },
    render() {
        //TODO: use Search these X records in i18n message formatter at "record.searchPlaceHolder" once React.intl
        // supports string only, currently it wraps the generated message with a span tag which is not valid
        // within a placeholder element attribute.
        //
        // looks like this will be supported in
        // reactintl 2.0 see - http://stackoverflow.com/questions/35286239/how-to-put-valuedata-into-html-attribute-with-reactjs-and-reactintl
        let placeMsg = "Search these " + this.props.nameForRecords + "...";
        return (<div className="filterSearchBoxContainer">
                    <input className="filterSearchBox" type="text"
                           key={"filterSearchBox_" + this.props.searchBoxKey}
                           value={this.props.value}
                           onChange={this.props.onChange} placeholder={placeMsg}/>
                </div>
        );
    }
});

export default FilterSearchBox;
