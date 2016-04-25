import React from 'react';
import './style.css';

/**
 * an icon using a new qb icon font (from Lisa)
 */
const TableIcon = React.createClass({
    propTypes: {
        icon: React.PropTypes.string.isRequired,
        className: React.PropTypes.string
    },
    getDefaultProps() {
        return {
            className: ""
        };
    },
    render: function() {
        let className = 'qbIcon ' + this.props.icon;
        return (
            <span className={className}>
                {this.props.children}
            </span>
        );
    }
});

export default TableIcon;
