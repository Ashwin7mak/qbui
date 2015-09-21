import React from 'react';
import './header.css';

class Header extends React.Component {
    render() {
        return <header className="layout-header">
            <div className="leftContent">{this.props.leftContent}</div>
            <div className="rightContent">{this.props.rightContent}</div>
        </header>;
    }
}

export default Header;