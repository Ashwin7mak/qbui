import React from 'react';
import ReactIntl from 'react-intl';
import {I18nMessage, I18nDate} from '../../utils/i18nMessage';
import Locale from '../../locales/locales';
import GlobalActions from '../actions/globalActions';
import Fluxxor from 'fluxxor';
import QBicon from '../qbIcon/qbIcon';
let FluxMixin = Fluxxor.FluxMixin(React);
import {OverlayTrigger, Popover, ButtonGroup, Button, Input} from 'react-bootstrap';
import SearchBox from '../search/searchBox';

import './topNav.scss';

var TopNav = React.createClass({
    mixins: [FluxMixin],

    propTypes: {
        showOnSmall: React.PropTypes.bool,
        title: React.PropTypes.node,
        onNavClick: React.PropTypes.func,
        globalActions: React.PropTypes.element
    },
    getInitialState() {
        return {
            searchText:""
        };
    },

    searchChanged: function(ev) {
        const text = ev.target.value;
        this.setState({searchText: text});
        //let flux = this.getFlux();
        //flux.actions.searchFor(text);
    },
    searchCleared: function() {
        this.setState({searchText: ""});
    },

    getTopTitle() {
        return this.props.title && (
                <div className="topTitle">
                    {this.props.title}
                </div>);
    },
    render: function() {
        const searchIcon = <QBicon icon="search" />;

        let eventKeyIdx = 20;

        const classes = "topNav" + (this.props.showOnSmall ? "" : " hideSmall");
        return (
            <div className={classes}>
                <div className="top">
                    <div className="navGroup left">
                        <ButtonGroup className="navItem">
                            <Button tabIndex="1"  className="iconLink toggleNavButton" onClick={this.props.onNavClick}>
                                <QBicon icon="hamburger" />
                            </Button>

                        {this.getTopTitle()}
                        </ButtonGroup>
                    </div>

                    <div className="navGroup center">

                        <ButtonGroup className="navItem">

                            <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={
                                <Popover id={0} className={'searchPopover'}  title="Search">
                                    <SearchBox
                                           value={this.state.searchText}
                                           onChange={this.searchChanged}
                                           onClearSearch={this.searchCleared}
                                           placeholder={Locale.getMessage('nav.searchRecordsPlaceholder')} />
                                </Popover>}>


                                <Button tabIndex="2"><QBicon icon="search" /></Button>
                            </OverlayTrigger>

                            <Button tabIndex="3" className="favoritesButton"><QBicon icon="star-full" /></Button>
                        </ButtonGroup>
                    </div>

                    <div className="navGroup right">
                        {this.props.globalActions}
                    </div>
                </div>
            </div>
        );
    }
});

export default TopNav;
