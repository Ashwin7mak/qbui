import React from 'react';
import ReactIntl from 'react-intl';

import './mobileTopNav.scss';
import Fluxxor from 'fluxxor';
import {Glyphicon,Input,DropdownButton,MenuItem} from 'react-bootstrap'

import MobileSearchBar from '../search/mobileSearchBar';

let FluxMixin = Fluxxor.FluxMixin(React);

import Locale from '../../locales/locales';

var IntlMixin = ReactIntl.IntlMixin;
var FormattedDate = ReactIntl.FormattedDate;
var FormattedMessage = ReactIntl.FormattedMessage;


var MobileTopNav = React.createClass( {
    mixins: [IntlMixin, FluxMixin],

    toggleNav: function () {
        let flux = this.getFlux();
        flux.actions.toggleLeftNav();
    },
    toggleSearch: function () {
        let flux = this.getFlux();
        flux.actions.toggleSearch();
    },
    render: function () {
        const searchIcon = <Glyphicon glyph="search" />;

        let topClasses = 'topNav mobile';
        if (this.props.searching)
            topClasses += ' searching';
        if (this.props.searchBarOpen)
            topClasses += ' searchOpen';

        return (
            <div className={topClasses}>

                <div className='top'>
                    <div className='navGroup left'>
                        <div className='navItem '><a className='iconLink' href="#" onClick={this.toggleNav}><Glyphicon glyph="menu-hamburger" /> </a></div>
                    </div>

                    <div className='navGroup center'>
                        <div className='navItem'>{this.props.title}</div>
                    </div>

                    <div className='navGroup right'>
                        <div className='navItem'><a className='iconLink' href="#" onClick={this.toggleSearch}>{searchIcon} </a></div>
                    </div>
                </div>

                <MobileSearchBar searchOpen= {this.props.searchBarOpen} searching={this.props.searching} />


            </div>
        );
    }
});

export default MobileTopNav;