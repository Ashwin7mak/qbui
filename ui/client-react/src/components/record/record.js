import React from 'react';
import ReactIntl from 'react-intl';

import Loader  from 'react-loader';

import './record.scss';
var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

let Record = React.createClass( {
    mixins: [IntlMixin],


    render: function() {

        return (

            <div>
                display record here
            </div>

        );
    }
});

export default Record;