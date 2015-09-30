import React from 'react';

import {Nav,NavItem,Tooltip,OverlayTrigger,Glyphicon} from 'react-bootstrap';

import './leftNav.scss';

let LeftNav = React.createClass( {

    selectItem: function (id) {
        if (id)
            this.props.itemSelection(id);
    },

    _getGlyphName(item) {

        if (item.id==1)
            return 'home';
        else
            return 'th-list';

    },
    render: function() {

        var styles={width: (this.props.visible ? 450 : 40) }
        return (
            <div style={styles} className={(this.props.visible ? "visible " : "") + "leftMenu"}>
                <Nav stacked activeKey={1} >
                    {this.props.items.map((item) => {
                        const tooltip = (
                            <Tooltip>{item.name}</Tooltip>
                        );
                        return (this.props.visible ?
                            (<NavItem key={item.id}
                                     onClick={this.selectItem.bind(this,item.id)}>
                                <Glyphicon glyph={this._getGlyphName(item)}/> {item.name}
                            </NavItem>)
                            :
                            (<OverlayTrigger placement="right" overlay={tooltip}>
                                <NavItem key={item.id}
                                         onClick={this.selectItem.bind(this,item.id)}>
                                    <Glyphicon glyph={this._getGlyphName(item)}/>
                                </NavItem>
                            </OverlayTrigger>));
                    })}
                </Nav>
            </div>
        );
    }
});

export default LeftNav;