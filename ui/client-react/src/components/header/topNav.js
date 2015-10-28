import React from 'react';
import ReactIntl from 'react-intl';
import {I18nMessage, I18nDate} from '../../utils/i18nMessage';

import Fluxxor from 'fluxxor';
import _ from 'lodash';

let FluxMixin = Fluxxor.FluxMixin(React);
import {MenuItem, NavDropdown, ButtonGroup, Button, OverlayTrigger, Popover, Glyphicon, Input} from 'react-bootstrap';

import './topNav.scss';

var CurrentDate = React.createClass({

    render: function() {
        return <I18nDate value={new Date()} day="numeric" month="long" year="numeric"/>;
    }
});

const debounceSearchMillis = 100;

var TopNav = React.createClass({
    mixins: [FluxMixin],

    toggleNav: function() {
        let flux = this.getFlux();
        flux.actions.toggleLeftNav();
    },

    addNew: function() {
        let flux = this.getFlux();
        flux.actions.showTrouser();
    },

    onSelect: function(ev) {
        let flux = this.getFlux();
        flux.actions.changeLocale(ev.currentTarget.title);
    },

    searchChanged: function(ev) {
        const text = ev.target.value;
        let flux = this.getFlux();
        flux.actions.searchFor(text);
    },
    render: function() {
        const searchIcon = <Glyphicon glyph="search" />;

        return (
            <div className={'topNav'}>
                <div className="top">
                    <div className="navGroup left">
                        <div className="navItem "><a className="iconLink toggleNavButton" href="#" onClick={this.toggleNav}><Glyphicon glyph="menu-hamburger" /> </a></div>

                        <div className="navItem">{this.props.title}</div>
                    </div>

                    <div className="navGroup center">
                        <ButtonGroup className="navItem harmonyButtons" ButtonGroup>

                            <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={
                            <Popover id={0} className={'searchPopover'}  title="Search">
                                <Input className="searchInputBox" key={'searchInput'} standalone addonBefore={searchIcon} type="text" placeholder="Search Records"  onChange={this.searchChanged} />
                            </Popover>}>

                                <Button><Glyphicon glyph="search" /></Button>
                            </OverlayTrigger>

                            <Button className="addNewButton" onClick={this.addNew} ><Glyphicon glyph="plus" /></Button>
                            <Button><Glyphicon glyph="time" /></Button>
                        </ButtonGroup>
                    </div>

                    <div className="navGroup right">
                        <NavDropdown className="navItem" NavDropdown={true} navItem={true} eventKey={3} title={<CurrentDate/>} id="nav-right-dropdown">
                            <MenuItem href="/user" eventKey={4}><I18nMessage message={'header.menu.preferences'}/></MenuItem>
                            <MenuItem divider />
                            <MenuItem href="#" className="localeLink" onSelect={this.onSelect} title="en-us" eventKey={5}><I18nMessage message={'header.menu.locale.english'}/></MenuItem>
                            <MenuItem href="#" className="localeLink" onSelect={this.onSelect} title="fr-fr" eventKey={6}><I18nMessage message={'header.menu.locale.french'}/></MenuItem>
                            <MenuItem href="#" className="localeLink" onSelect={this.onSelect} title="de-de" eventKey={7}><I18nMessage message={'header.menu.locale.german'}/></MenuItem>
                            <MenuItem divider />
                            <MenuItem href="/signout" eventKey={8}><I18nMessage message={'header.menu.sign_out'}/></MenuItem>
                        </NavDropdown>
                        &nbsp;
                    </div>
                </div>
            </div>
        );
    }
});

export default TopNav;
