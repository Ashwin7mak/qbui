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

        return (
            <div className={'topNav mobile'}>
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

                {this.props.searchBarOpen ?
                    <MobileSearchBar /> : <div/>
                }

            </div>
        );
    }
});

export default MobileTopNav;