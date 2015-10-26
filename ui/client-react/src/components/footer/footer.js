import React from 'react';
import Nav from '../../../../node_modules/react-bootstrap/lib/Nav';
import NavItem from '../../../../node_modules/react-bootstrap/lib/NavItem'
import Navbar from '../../../../node_modules/react-bootstrap/lib/Navbar'
import './footer.css';

import ReactIntl from 'react-intl';
var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

var I18nMessage = React.createClass({
    mixins: [IntlMixin],

    render: function() {
        return (
            <FormattedMessage message={this.getIntlMessage(this.props.message)} year={this.props.year} />
        );
    }
});


var Footer = React.createClass({
    mixins: [IntlMixin],

    render: function() {
        var currentYear = new Date().getFullYear();
        return <Navbar className='footer'>
            <Nav right>
              <NavItem><I18nMessage message={'footer.copyright'} year={currentYear} /></NavItem>
            </Nav>
        </Navbar>
    }
});


export default Footer;