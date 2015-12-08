import React from 'react';
import ReactIntl from 'react-intl';
import {I18nMessage, I18nDate} from '../../utils/i18nMessage';
import Locale from '../../locales/locales';
import GlobalActions from '../global/GlobalActions';
import Fluxxor from 'fluxxor';
import _ from 'lodash';

let FluxMixin = Fluxxor.FluxMixin(React);
import {MenuItem, Dropdown, ButtonGroup, Button, OverlayTrigger, Popover, Glyphicon, Input} from 'react-bootstrap';

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

    searchChanged: function(ev) {
        const text = ev.target.value;
        let flux = this.getFlux();
        flux.actions.searchFor(text);
    },

    onSelect: function(ev) {
        let flux = this.getFlux();
        flux.actions.changeLocale(ev.currentTarget.title);
    },

    render: function() {
        const searchIcon = <Glyphicon glyph="search" />;
        let supportedLocales = Locale.getSupportedLocales();
        let eventKeyIdx = 20;

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

                        {this.props.globalActions && <GlobalActions actions={this.props.globalActions}/>}

                        <Dropdown id="nav-right-dropdown">

                            <a bsRole="toggle" className={"dropdownToggle"}><Glyphicon glyph="option-vertical"/> </a>

                            <Dropdown.Menu>
                                <MenuItem href="/user" eventKey={eventKeyIdx++}><I18nMessage message={'header.menu.preferences'}/></MenuItem>
                                <MenuItem divider />

                                {supportedLocales.length > 1 ? supportedLocales.map((locale) => {
                                    return <MenuItem href="#" className="localeLink" onSelect={this.onSelect} title={locale} key={eventKeyIdx} eventKey={eventKeyIdx++}><I18nMessage message={'header.menu.locale.' + locale}/></MenuItem>;
                                }) : null}
                                {supportedLocales.length > 1 ? <MenuItem divider /> : null}

                                <MenuItem href="/signout" eventKey={eventKeyIdx++}><I18nMessage message={'header.menu.sign_out'}/></MenuItem>
                            </Dropdown.Menu>
                        </Dropdown>
                        &nbsp;
                    </div>
                </div>
            </div>
        );
    }
});

export default TopNav;
