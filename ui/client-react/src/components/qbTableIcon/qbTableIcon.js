import React from 'react';
import './style.css';

/**
 * an icon using a new qb icon font (from Lisa)
 */
const TableIcon = React.createClass({
    propTypes: {
        icon: React.PropTypes.string.isRequired,
        classes: React.PropTypes.string
    },
    render: function() {
        let className = 'qbIcon ' + this.props.icon;
        if (this.props.classes) {
            className += ' ' +  this.props.classes;
        }
        return (
            <span className={className}>
                {this.props.children}
            </span>
        );
    }
});

export default TableIcon;
