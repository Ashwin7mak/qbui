import React from 'react';
import ReactIntl from 'react-intl';

var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

var I18nMessage = React.createClass({
    mixins: [IntlMixin],

    render: function() {
        return <FormattedMessage message={this.getIntlMessage(this.props.message)}/>
    }
});

export default I18nMessage;