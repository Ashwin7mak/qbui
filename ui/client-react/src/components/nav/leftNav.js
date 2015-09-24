import React from 'react';
import ReactBootstrap from 'react-bootstrap';

import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
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
                            <NavItem eventKey={item.id} key={item.id}
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