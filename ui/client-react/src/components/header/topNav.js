import React from 'react';
import ReactIntl from 'react-intl';
import {I18nMessage, I18nDate} from '../../utils/i18nMessage';
import Locale from '../../locales/locales';
import GlobalActions from '../global/globalActions';
import Fluxxor from 'fluxxor';
import _ from 'lodash';
import QBicon from '../qbIcon/qbIcon';
let FluxMixin = Fluxxor.FluxMixin(React);
import {OverlayTrigger, Popover, ButtonGroup, Button, Input} from 'react-bootstrap';

import './topNav.scss';

var TopNav = React.createClass({
    mixins: [FluxMixin],

    searchChanged: function(ev) {
        const text = ev.target.value;
        let flux = this.getFlux();
        flux.actions.searchFor(text);
    },

    getTopTitle() {
        return this.props.title && (
                <div className="navItem topTitle">{this.props.title.icon &&
                    <QBicon icon={this.props.title.icon}/>}<span>{this.props.title.name}</span>
                </div>);
    },
    render: function() {
        const searchIcon = <QBicon icon="search" />;

        let eventKeyIdx = 20;

        return (
            <div className={'topNav'}>
                <div className="top">
                    <div className="navGroup left">
                        <div className="navItem ">
                            <a className="iconLink toggleNavButton" href="#" onClick={this.props.onNavClick}>
                                <QBicon icon="hamburger" />
                            </a>
                        </div>

                        {this.getTopTitle()}
                    </div>

                    <div className="navGroup center">
                        <ButtonGroup className="navItem" ButtonGroup>

                            <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={
                                <Popover id={0} className={'searchPopover'}  title="Search">
                                    <Input className="searchInput"
                                           key={'searchInput'}
                                           standalone
                                           type="text"
                                           placeholder={Locale.getMessage('nav.searchRecordsPlaceholder')}
                                           onChange={this.searchChanged} />
                                </Popover>}>

                                <Button><QBicon icon="search" /></Button>
                            </OverlayTrigger>

                            <Button className="favoritesButton"><QBicon icon="star-full" /></Button>
                        </ButtonGroup>
                    </div>

                    <div className="navGroup right">
                        {this.props.globalActions && <GlobalActions actions={this.props.globalActions} position={"top"}/>}
                    </div>
                </div>
            </div>
        );
    }
});

export default TopNav;
