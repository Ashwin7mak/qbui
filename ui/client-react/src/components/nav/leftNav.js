import React from 'react';

import {Nav,NavItem,Tooltip,OverlayTrigger,Glyphicon} from 'react-bootstrap';
import {Link} from 'react-router';

import './leftNav.scss';

let LeftNav = React.createClass( {

    getInitialState: function() {
        return {
            rendered:false,
        }
    },
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

    buildNavItem: function(item) {
        const tooltip = (
            <Tooltip id={item.id}>{item.name}</Tooltip>
        );

        if (this.props.visible)
            return (
                <li>
                    <Link className='leftNavLink' to={item.link}>
                        <Glyphicon glyph={this._getGlyphName(item)}/> {item.name}
                    </Link>
                </li>);
        else
            return (
                <OverlayTrigger key={item.id} placement="right" overlay={tooltip}>
                    <li>
                        <Link className='leftNavLink' to={item.link}>
                            <Glyphicon glyph={this._getGlyphName(item)}/>
                        </Link>
                    </li>
                </OverlayTrigger>
            )
    },
    render: function() {
        var styles={width: (this.props.visible ? 350 : 40) }
        return (
            <div style={styles} className={(this.props.visible ? "visible " : "") + "leftMenu"}>
                <Nav stacked activeKey={1} >
                    {this.props.items.map((item) => {
                        return this.buildNavItem(item);
                    })}
                </Nav>
            </div>
        );
    }
});

export default LeftNav;