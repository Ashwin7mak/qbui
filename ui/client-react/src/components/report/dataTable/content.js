import React from 'react';
import ReactIntl from 'react-intl';

import '../../../assets/css/report.css';

var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

var Content = React.createClass({
    mixins: [IntlMixin],

    render: function() {
        return <div className="report-content"></div>
    }
})

export default Content;