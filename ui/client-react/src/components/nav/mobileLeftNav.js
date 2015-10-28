import React from 'react';

import {Nav, Glyphicon} from 'react-bootstrap';
import {Link} from 'react-router';
import Loader  from 'react-loader';
import './mobileLeftNav.scss';
import {I18nMessage} from '../../utils/i18nMessage';

import Fluxxor from 'fluxxor';

let FluxMixin = Fluxxor.FluxMixin(React);

let MobileLeftNav = React.createClass({
    mixins: [FluxMixin],

    toggleNav: function() {
        let flux = this.getFlux();
        flux.actions.toggleLeftNav();
    },

    getGlyphName(item) {

        if (item.icon) {
            return item.icon;
        } else {
            return 'th-list';
        }
    },

    buildHeadingItem: function(item, loadingCheck) {

        return (
            <li>
                <Loader scale={.5} right={'90%'} loaded={!loadingCheck} />
                <a className="mobileHeading"><I18nMessage message={'nav.reportsHeading'}/></a>
            </li>);
    },


    buildNavItem: function(item) {

        let label = item.key ? item.key : item.name;
        let selectedClass = item.id && (item.id === this.props.reportID) ? 'selected' : '';

        return (
            <li key={label} className={selectedClass}>
                <Link className="leftNavLink" to={'/m' + item.link} onClick={this.toggleNav}>
                    <Glyphicon glyph={this.getGlyphName(item)}/> {label}
                </Link>
            </li>
        );
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

                    {this.buildHeadingItem({key: 'nav.reportsHeading'}, this.props.reportsData.loading)}

                    {this.props.reportsData.list ? this.props.reportsData.list.map((item) => {
                        return this.buildNavItem(item);
                    }) : ''}

                </Nav>

            </div>
        );
    }
});

export default MobileLeftNav;
