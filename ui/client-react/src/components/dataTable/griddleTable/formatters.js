/* Defines custom formatters that can be used for customComponents for griddle columns*/
/* TODO: define exclusion in case server has some conflicting attributes -
*    for example for a numeric field server lets you select separator pattern - in that case should we ignore locale?
*
* */
import React from 'react';
import ReactIntl from 'react-intl';

var FormattedDate = ReactIntl.FormattedDate;
var FormattedNumber = ReactIntl.FormattedNumber;

export var DateFormatter = React.createClass({
    render: function(){
        if (this.props.data != "")
            return <FormattedDate value={this.props.data} />
        return null;
    }
});


export var NumericFormatter = React.createClass({
    render: function(){
        if (this.props.data != "")
            return <FormattedNumber value={this.props.data} />
        return null;
    }
});
