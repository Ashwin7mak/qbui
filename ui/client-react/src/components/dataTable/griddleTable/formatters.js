/* Defines custom formatters that can be used for customComponents for griddle columns*/
/* TODO: define exclusion in case server has some conflicting attributes -
*    for example for a numeric field server lets you select separator pattern - in that case should we ignore locale?
*
* */
import React from 'react';
import {I18nDate, I18nNumber} from '../../../utils/i18nMessage';

export var DateFormatter = React.createClass({
    render: function() {
        var data = "";
        if (this.props.data) { //for griddle
            data = this.props.data;
        } else if (this.props.params.value) { //for ag grid
            data = this.props.params.value;
        }
        if (data !== "") {
            return <I18nDate value={data}/>;
        }
        return null;
    }
});

export var NumericFormatter = React.createClass({
    render: function() {
        var data = "";
        if (this.props.data) { //for griddle
            data = this.props.data;
        } else if (this.props.params.value) { //for ag grid
            data = this.props.params.value;
        }
        if (data !== "") {
            return <I18nNumber value={data}/>;
        }
        return null;
    }
});
