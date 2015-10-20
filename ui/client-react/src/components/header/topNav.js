import React from 'react';
import ReactIntl from 'react-intl';
import ReactBootstrap from 'react-bootstrap';

import Fluxxor from 'fluxxor';

let FluxMixin = Fluxxor.FluxMixin(React);
import {Nav,NavItem,Navbar,MenuItem,NavDropdown,ButtonGroup,Button,OverlayTrigger,Popover,Glyphicon,Input} from 'react-bootstrap'

import Locale from '../../locales/locales';
import './topNav.scss'

var IntlMixin = ReactIntl.IntlMixin;
var FormattedDate = ReactIntl.FormattedDate;
var FormattedMessage = ReactIntl.FormattedMessage;

var CurrentDate = React.createClass({

    mixins: [IntlMixin],

    render: function() {
        return <FormattedDate locales={[Locale.getLocale()]} value={new Date()} day="numeric" month="long" year="numeric"/>
    }
});

const debounceSearchMillis = 500;

var TopNav = React.createClass( {
    mixins: [IntlMixin, FluxMixin],

    toggleNav: function () {
        let flux = this.getFlux();
        flux.actions.toggleLeftNav();
    },

    addNew: function () {
        let flux = this.getFlux();
        flux.actions.showTrouser();
    },

    onSelect: function(e) {
        let flux = this.getFlux();
        flux.actions.changeLocale(e.currentTarget.title);
    },

    searchChanged: function (ev) {
        ev.preventDefault();
        const text = ev.target.value;

        let flux = this.getFlux();
        flux.actions.searchFor(text);
    },
    render: function () {
        const searchIcon = <Glyphicon glyph="search" />;

        return (
            <div className={'topNav ' + (this.props.mobile ? 'mobile' : '')}>
                <div className='top'>
                <div className='navGroup left'>
                    <div className='navItem '><a className='iconLink' href="#" onClick={this.toggleNav}><Glyphicon glyph="menu-hamburger" /> </a></div>

                    <div className='navItem'>{this.props.title}</div>
                </div>

                <div className='navGroup center'>
                    <ButtonGroup className='navItem harmonyButtons' ButtonGroup>

                        <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={
                            <Popover id={0} className={'searchPopover'}  title="Search">
                                <Input addonBefore={searchIcon} type="text" placeholder="Search Records"  onChange={_.debounce(this.searchChanged, debounceSearchMillis)} />
                                <div className='buttonContainer'><Button bsStyle='success'>Go</Button></div>
                            </Popover>}
                            >

                            <Button><Glyphicon glyph="search" /></Button>
                        </OverlayTrigger>

                        <Button onClick={this.addNew} ><Glyphicon glyph="plus" /></Button>
                        <Button><Glyphicon glyph="time" /></Button>
                    </ButtonGroup>
                </div>

                <div className='navGroup right'>
                    <NavDropdown className='navItem' NavDropdown={true} navItem={true} eventKey={3} title={this.props.mobile ? <Glyphicon glyph="cog" /> : <CurrentDate/>} id='nav-right-dropdown'>
                        <MenuItem href="/user" eventKey={4}><FormattedMessage message={this.getIntlMessage('header.menu.preferences')}/></MenuItem>
                        <MenuItem divider />
                        <MenuItem href="#" onSelect={this.onSelect} title='en-us' eventKey={5}><FormattedMessage message={this.getIntlMessage('header.menu.locale.english')}/></MenuItem>
                        <MenuItem href="#" onSelect={this.onSelect} title='fr-fr' eventKey={6}><FormattedMessage message={this.getIntlMessage('header.menu.locale.french')}/></MenuItem>
                        <MenuItem href="#" onSelect={this.onSelect} title='de-de' eventKey={7}><FormattedMessage message={this.getIntlMessage('header.menu.locale.german')}/></MenuItem>
                        <MenuItem divider />
                        <MenuItem href="/signout" eventKey={8}><FormattedMessage message={this.getIntlMessage('header.menu.sign_out')}/></MenuItem>
                    </NavDropdown>
                    &nbsp;
                </div>
                </div>
            </div>
        );
    }
});

export default TopNav;