import React from 'react';
import ReactIntl from 'react-intl';

import '../../../assets/css/report.css';

var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

var Content = React.createClass({
    mixins: [IntlMixin],

    render: function() {
        return <div className="report-content">Todo: use mock table from flux store</div>
    }
})

export default Content;