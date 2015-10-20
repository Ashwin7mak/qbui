import React from 'react';
import ReactIntl from 'react-intl';

import Loader  from 'react-loader';

import './record.scss';
var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

let LeftNav = React.createClass( {
    mixins: [IntlMixin],


    render: function() {

        return (

            <div>
                display record goes here
            </div>

        );
    }
});

export default LeftNav;