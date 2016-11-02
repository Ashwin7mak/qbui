import React from 'react';
import ReactIntl from 'react-intl';
import {I18nMessage, I18nDate} from '../../utils/i18nMessage';
import Locale from '../../locales/locales';
import GlobalActions from '../actions/globalActions';
import Fluxxor from 'fluxxor';
import QBicon from '../qbIcon/qbIcon';
import QBToolTip from '../qbToolTip/qbToolTip';
let FluxMixin = Fluxxor.FluxMixin(React);
import {OverlayTrigger, Popover, ButtonGroup, Button, Input, Tooltip} from 'react-bootstrap';
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
    render() {

        const classes = "topNav" + (this.props.showOnSmall ? "" : " hideSmall");

        const unimplementedSearchTip = <Tooltip id="unimplemented.search.tt"><I18nMessage message="unimplemented.search"/></Tooltip>;
        const unimplementedFavoritesTip = <Tooltip id="unimplemented.favorites.tt"><I18nMessage message="unimplemented.favorites"/></Tooltip>;
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

                            <OverlayTrigger placement="bottom" trigger={['hover', 'click']}
                                            overlay={unimplementedSearchTip}>
                                <Button tabIndex="2" className="disabled"><QBicon icon="search" /></Button>
                            </OverlayTrigger>

                            <OverlayTrigger placement="bottom" trigger={['hover', 'click']}
                                            overlay={unimplementedFavoritesTip}>
                                <Button tabIndex="3" className="disabled"><QBicon icon="star-full" /></Button>
                            </OverlayTrigger>
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
