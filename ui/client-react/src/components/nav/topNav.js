import React from 'react';
import ReactIntl from 'react-intl';
import ReactBootstrap from 'react-bootstrap';

import Fluxxor from 'fluxxor';

let FluxMixin = Fluxxor.FluxMixin(React);
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



var TopNav = React.createClass( {
    mixins: [FluxMixin],

    showNav: function () {
        let flux = this.getFlux();
        flux.actions.toggleLeftNav();
    },

    addNew: function () {
        let flux = this.getFlux();
        flux.actions.showTrouser();
    },

    render: function () {

        return (
            <div className='topNav'>
                <div className='navGroup left'>
                    <div className='navItem '><a className='iconLink' href="#" onClick={this.showNav}><Glyphicon glyph="menu-hamburger" /> </a></div>

                    <div className='navItem'>Intuit QuickBase</div>
                </div>

                <div className='navGroup center'>
                    <ButtonGroup className='navItem' ButtonGroup>

                        <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={<Popover id={0} style={{whiteSpace:'nowrap'}} title="Search Records"><strong>Search:</strong> <input /> <Button bsStyle='success'>Go</Button></Popover>}>
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
});

export default TopNav;