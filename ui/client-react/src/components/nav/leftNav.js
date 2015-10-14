import React from 'react';
import ReactIntl from 'react-intl';
import {Nav,NavItem,Tooltip,OverlayTrigger,Glyphicon} from 'react-bootstrap';
import {Link} from 'react-router';
import Loader  from 'react-loader';
import './leftNav.scss';
var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

let LeftNav = React.createClass( {
    mixins: [IntlMixin],

    getGlyphName(item) {

        if (item.icon)
            return item.icon;
        else
            return 'th-list';
    },

    buildHeadingItem: function (item, loadingCheck) {

        if (this.props.open)
            return (
                <li key={item.key}>
                    <Loader scale={.5} right={'90%'} loaded={!loadingCheck} />
                    <a className='heading'><FormattedMessage message={this.getIntlMessage(item.key)}/></a>
                </li>);

        else
            return (<li key={item.key}><a className='heading'></a></li>);

    },
    buildNavItem: function(item) {

        let label = item.key ? this.getIntlMessage(item.key) : item.name;

        const tooltip = (<Tooltip className={ this.props.open ? 'leftNavTooltip' : 'leftNavTooltip show' } id={label}>{label}</Tooltip>);

        return (
            <OverlayTrigger key={label} placement="right" overlay={tooltip}>
                <li>
                    <Link className='leftNavLink' to={item.link}>
                        <Glyphicon glyph={this.getGlyphName(item)}/> {label}
                    </Link>
                </li>
            </OverlayTrigger>
        )
    },

    render: function() {

        return (

            <div className={"leftMenu " + (this.props.open ? "open" : "closed")}>

                <Nav stacked activeKey={1} >
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

export default LeftNav;