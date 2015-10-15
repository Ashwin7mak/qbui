import React from 'react';
import ReactIntl from 'react-intl';

import './mobileAddFooter.scss';

import {Glyphicon} from 'react-bootstrap';

var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

var MobileAddFooter = React.createClass({
    mixins: [IntlMixin],

    addNew: function() {

    },

    render: function() {

        return (
            <div className='mobileAddFooter'>
                <Glyphicon onClick={this.addNew} glyph={'plus-sign'} />
            </div>);
    }
});


export default MobileAddFooter;