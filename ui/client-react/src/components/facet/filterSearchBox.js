import React from 'react';
import Logger from '../../utils/logger';
import {I18nMessage} from '../../utils/i18nMessage';

import './facet.scss';

let logger = new Logger();
/*
 FilterSearchBox component takes user input for filtering a report.
 Takes the function to call on changes to search string, what he list is known as default is Records
 */
var FilterSearchBox = React.createClass({
    propTypes: {
        onChange : React.PropTypes.func,
        nameForRecords: React.PropTypes.string
    },
    defaultProps: {
        nameForRecords :"Records"
    },
    render() {
        let placeMsg = (<I18nMessage message={"record.searchPlaceHolder"}  nameForRecords={this.props.nameForRecords} />);
        return (<input className="filterSearchBox" type="text" key="filterSearchBox"
                       onChange={this.props.onChange} placeholder={placeMsg}
                />
        );
    }
});

export default FilterSearchBox;
