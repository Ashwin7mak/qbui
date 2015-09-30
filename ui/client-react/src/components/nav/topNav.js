import React from 'react';
import ReactIntl from 'react-intl';
import ReactBootstrap from 'react-bootstrap';

import {Nav,NavItem,Navbar,MenuItem,NavDropdown,ButtonGroup,Button,OverlayTrigger,Popover,Glyphicon} from '../../../../node_modules/react-bootstrap/lib'

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
            <div className='topNav'>
                <div className='navGroup left'>
                    <div className='navItem '><a className='iconLink' href="#" onClick={this.showNav}><Glyphicon glyph="menu-hamburger" /> </a></div>

                    <div className='navItem'>Intuit QuickBase</div>
                </div>

                <div className='navGroup center'>
                    <ButtonGroup className='navItem' ButtonGroup>

                        <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={<Popover style={{whiteSpace:'nowrap'}} title="Search Records"><strong>Search:</strong> <input /> <Button bsStyle='success'>Go</Button></Popover>}>
                            <Button><Glyphicon glyph="search" /></Button>
                        </OverlayTrigger>



                        <Button onClick={this.addNew} ><Glyphicon glyph="plus" /></Button>
                        <Button><Glyphicon glyph="time" /></Button>
                    </ButtonGroup>
                </div>

                <div className='navGroup right'>
                    <NavDropdown className='navItem' NavDropdown={true} navItem={true} eventKey={3} title={<CurrentDate/>} id='nav-right-dropdown'>
                        <MenuItem href="/user" eventKey={4}>Prefs...</MenuItem>

                        <MenuItem divider />
                        <MenuItem href="/signout" eventKey={5}>Sign Out</MenuItem>
                    </NavDropdown>
                    <a className='iconLink' href="#" ><Glyphicon glyph="cog" /></a>
                </div>

            </div>
        );
    }
    render2() {

        return (
            <Navbar inverse brand={<a href="#" onClick={this.showNav}><i className="fa fa-bars"></i> </a> }>
                <Nav left>
                    <NavItem eventKey={1} href='#'>Intuit QuickBase</NavItem>
                </Nav>

                <Nav>
                    <ButtonGroup>
                        <Button><Glyphicon glyph="search" /></Button>
                        <Button onClick={this.addNew} ><Glyphicon glyph="plus" /></Button>
                        <Button><Glyphicon glyph="time" /></Button>
                    </ButtonGroup>
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