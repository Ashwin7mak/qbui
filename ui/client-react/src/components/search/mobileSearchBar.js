import React from 'react';
import ReactIntl from 'react-intl';

import _ from 'lodash';

import './mobileSearchBar.scss';
import Fluxxor from 'fluxxor';
import {Glyphicon,Input,DropdownButton,MenuItem} from 'react-bootstrap'

let FluxMixin = Fluxxor.FluxMixin(React);

import Locale from '../../locales/locales';

var IntlMixin = ReactIntl.IntlMixin;
var FormattedDate = ReactIntl.FormattedDate;
var FormattedMessage = ReactIntl.FormattedMessage;

const debounceSearchMillis = 500;

var MobileSearchBar = React.createClass( {
    mixins: [IntlMixin, FluxMixin],

    searchChanged: function (ev) {
        const text = ev.target.value;

        let flux = this.getFlux();
        flux.actions.searchFor(text);
    },

    render: function () {
        const searchIcon = <Glyphicon glyph="search" />;

        return (
            <div className={'searchBar open'}>
                <div className={'searchLine'}>
                    <Input type="text" placeholder="Search Records" addonBefore={searchIcon} onChange={_.debounce(this.searchChanged, debounceSearchMillis)}/>
                </div>
                <div className={'filterLine'}>
                    <DropdownButton bsStyle={'link'} title={'Filter by'} id={'searchDropDown'} >
                        <MenuItem>todo...</MenuItem>
                    </DropdownButton>
                </div>
            </div>
        );
    }
});

export default MobileSearchBar;