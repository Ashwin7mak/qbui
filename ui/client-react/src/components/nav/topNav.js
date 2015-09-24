import React from 'react';
import ReactIntl from 'react-intl';
import ReactBootstrap from 'react-bootstrap';

import './nav.css';

import Nav from '../../../../node_modules/react-bootstrap/lib/Nav';


import NavItem from '../../../../node_modules/react-bootstrap/lib/NavItem'
import Navbar from '../../../../node_modules/react-bootstrap/lib/Navbar'
import MenuItem from '../../../../node_modules/react-bootstrap/lib/MenuItem'
import NavDropdown from '../../../../node_modules/react-bootstrap/lib/NavDropdown'

import { Locale, getI18nBundle } from '../../locales/locales';
var i18n = getI18nBundle();

var IntlMixin = ReactIntl.IntlMixin;
var FormattedDate = ReactIntl.FormattedDate;

var CurrentDate = React.createClass({

    mixins: [IntlMixin],

    render: function() {
        return <FormattedDate locales={[Locale]} value={new Date()} day="numeric" month="long" year="numeric"/>
    }
});


class TopNav extends React.Component {

    constructor(props) {
        super(props);

        // no autobinding for es6
        this.showNav = this.showNav.bind(this);
        this.addNew = this.addNew.bind(this);
    }

    showNav(e) {
        this.props.onNavClick();
    }

    addNew() {
        this.props.onAddClicked();
    }

    render() {

        return (
            <Navbar fixedTop inverse brand={<a href="#" onClick={this.showNav}><i className="fa fa-bars"></i> </a> }>
                <Nav left>
                    <NavItem eventKey={1} href='#'>Intuit QuickBase</NavItem>
                    <NavItem eventKey={2} href='#' onClick={this.addNew}>Add...</NavItem>
                </Nav>

                <Nav right>
                    <NavDropdown NavDropdown={true} navItem={true} eventKey={3} title={<CurrentDate/>} id='nav-right-dropdown'>
                        <MenuItem href="/user" eventKey={4}>Prefs...</MenuItem>

                        <MenuItem divider />
                        <MenuItem href="/signout" eventKey={5}>Sign Out</MenuItem>
                    </NavDropdown>
                </Nav>

            </Navbar>
        );
    }
}

export default TopNav;