import React from 'react';
import Nav from '../../../../node_modules/react-bootstrap/lib/Nav';
import NavItem from '../../../../node_modules/react-bootstrap/lib/NavItem';
import Navbar from '../../../../node_modules/react-bootstrap/lib/Navbar';
import {I18nMessage} from '../../../src/utils/i18nMessage';
import './footer.scss';

var Footer = React.createClass({
    render: function() {
        var currentYear = new Date().getFullYear();
        return <Navbar className="footer">
            <Nav right>
              <NavItem><I18nMessage message={'footer.copyright'} year={currentYear} /></NavItem>
            </Nav>
        </Navbar>;
    }
});

export default Footer;
