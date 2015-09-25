import React from 'react';

import {Nav,NavItem} from 'react-bootstrap';

import './nav.css';

let LeftNav = React.createClass( {

    selectItem: function (id) {
        if (id)
            this.props.itemSelection(id);
    },

    render: function() {

        return (
            <div className={(this.props.visible ? "visible " : "") + "leftMenu"} onClick={this.selectItem.bind(this,null)}>
                <Nav stacked activeKey={1} >
                    {this.props.items.map((item) => {
                        return (
                            <NavItem key={item.id}
                                     onClick={this.selectItem.bind(this,item.id)}>
                                {item.name}
                            </NavItem>)
                    })}
                </Nav>
            </div>
        );
    }
});

export default LeftNav;