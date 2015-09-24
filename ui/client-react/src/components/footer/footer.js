import React from 'react';
import ReactIntl from 'react-intl';
import './footer.css';

import Nav from '../../../../node_modules/react-bootstrap/lib/Nav';

import NavItem from '../../../../node_modules/react-bootstrap/lib/NavItem'
import Navbar from '../../../../node_modules/react-bootstrap/lib/Navbar'

var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

var Footer = React.createClass({
    mixins: [IntlMixin],

    render: function() {
        var currentYear = new Date().getFullYear();
        return <Navbar fixedBottom>
            <Nav right>
              <NavItem>&#169;<FormattedMessage message={this.getIntlMessage('footer.copyright')} year={currentYear} /></NavItem>
            </Nav>
        </Navbar>
    }
});

/*
class Footer extends React.Component {

    render() {

        var currentYear = new Date().getFullYear();

        return <footer className="layout-footer">
                 <span className="layout-footer-content">&#169;{currentYear} Intuit Inc. All rights reserved.</span>
               </footer>
    }
}
*/
export default Footer;