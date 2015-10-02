import React from 'react';

import {Nav,NavItem,Tooltip,OverlayTrigger,Glyphicon} from 'react-bootstrap';
import {Link} from 'react-router';

import './leftNav.scss';

let LeftNav = React.createClass( {


    selectItem: function (id) {
        if (id)
            this.props.itemSelection(id);
    },

    getGlyphName(item) {

        if (item.icon)
            return item.icon;
        else
            return 'th-list';
    },

    buildHeadingItem: function (item) {

        if (this.props.open)
            return (<li><a className='heading'>{item.name}</a></li>);
        else
            return (<li><a className='heading'></a></li>);

    },

    buildNavItem: function(item) {

        const tooltip = (
            <Tooltip id={item.id}>{item.name}</Tooltip>
        );

        if (this.props.open)
            return (
                <li>
                    <Link className='leftNavLink' to={item.link}>
                        <Glyphicon glyph={this.getGlyphName(item)}/> {item.name}
                    </Link>
                </li>);
        else
            return (
                <OverlayTrigger key={item.id} placement="right" overlay={tooltip}>
                    <li>
                        <Link className='leftNavLink' to={item.link}>
                            <Glyphicon glyph={this.getGlyphName(item)}/>
                        </Link>
                    </li>
                </OverlayTrigger>
            )
    },

    render: function() {


        return (
            <div className={(this.props.open ? "open " : "closed ") +"leftMenu"}>
                <Nav stacked activeKey={1} >
                    {this.props.items.map((item) => {
                        return this.buildNavItem(item);
                    })}

                    {this.props.reports ? this.buildHeadingItem({name:'Reports'}): ''}

                    {this.props.reports.map((item) => {
                        return this.buildNavItem(item);
                    })}
                </Nav>
            </div>
        );
    }
});

export default LeftNav;