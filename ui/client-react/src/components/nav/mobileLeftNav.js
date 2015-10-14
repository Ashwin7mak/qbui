import React from 'react';
import ReactIntl from 'react-intl';
import {Nav,Collapse,Glyphicon} from 'react-bootstrap';
import {Link} from 'react-router';
import Loader  from 'react-loader';
import './mobileLeftNav.scss';

var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;
import Fluxxor from 'fluxxor';

let FluxMixin = Fluxxor.FluxMixin(React);

let MobileLeftNav = React.createClass( {
    mixins: [FluxMixin,IntlMixin],

    toggleNav: function () {
        let flux = this.getFlux();
        flux.actions.toggleLeftNav();
    },

    getGlyphName(item) {

        if (item.icon)
            return item.icon;
        else
            return 'th-list';
    },

    buildHeadingItem: function (item, loadingCheck) {

        return (
            <li>
                <Loader scale={.5} right={'90%'} loaded={!loadingCheck} />
                <a className='heading'><FormattedMessage message={this.getIntlMessage('nav.reportsHeading')}/></a>
            </li>);
    },

    // set focus to nested anchor tag to select current report if there is one...
    navItemMounted: function (id, element) {

        if (element && id == this.props.reportID)
            element.firstChild.focus();
    },

    buildNavItem: function(item) {

        let label = item.key ? this.getIntlMessage(item.key) : item.name;

        return (
            <li ref={this.navItemMounted.bind(this, item.id)}>
                <Link className='leftNavLink' to={'/m'+item.link} onClick={this.toggleNav}>
                    <Glyphicon glyph={this.getGlyphName(item)}/> {label}
                </Link>
            </li>
        )
    },

    render: function() {

        return (
            <div className={"mobileLeftMenu " + (this.props.open ? "open" : "closed")}>
                <Nav stacked activeKey={1}>

                    {this.props.items.map((item) => {
                        return item.heading ?
                            this.buildHeadingItem(item)  :
                            this.buildNavItem(item);
                    })}

                    {this.buildHeadingItem({key:'nav.reportsHeading'},this.props.reportsData.loading)}

                    {this.props.reportsData.list ? this.props.reportsData.list.map((item) => {
                        return this.buildNavItem(item);
                    }) : ''}

                </Nav>

            </div>
        );
    }
});

export default MobileLeftNav;