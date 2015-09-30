import React from 'react';

import {Nav,NavItem,Tooltip,OverlayTrigger,Glyphicon} from 'react-bootstrap';
import {Link} from 'react-router';

import './leftNav.scss';

let LeftNav = React.createClass( {

    selectItem: function (id) {
        if (id)
            this.props.itemSelection(id);
    },

    _getGlyphName(item) {

        if (item.icon)
            return item.icon;
        else
            return 'th-list';

    },
    render: function() {

        var styles={width: (this.props.visible ? 350 : 40) }
        return (
            <div style={styles} className={(this.props.visible ? "visible " : "") + "leftMenu"}>
                <Nav stacked activeKey={1} >
                    {this.props.items.map((item) => {
                        const tooltip = (
                            <Tooltip id={item.id}>{item.name}</Tooltip>
                        );

                        return (this.props.visible ?
                            (<li key={item.id}><Link className='leftNavLink' to={item.link}>
                                <Glyphicon glyph={this._getGlyphName(item)}/> {item.name}
                            </Link></li>)
                            :
                            (<OverlayTrigger key={item.id} placement="right" overlay={tooltip}>
                                <li><Link className='leftNavLink' to={item.link}>
                                    <Glyphicon glyph={this._getGlyphName(item)}/>
                                </Link></li>
                            </OverlayTrigger>));
                    })}
                </Nav>
            </div>
        );
    }
});

export default LeftNav;