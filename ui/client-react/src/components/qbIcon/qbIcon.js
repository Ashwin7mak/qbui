import React from 'react';
import './qbIcon.scss';
import './style.css';

/**
 * an icon using a new qb icon font (from Lisa)
 */
const QBicon = React.createClass({
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
        let className = this.props.className + ' qbIcon iconssturdy-' + this.props.icon;

        return (
            <span className={className}>
                {this.props.children}
            </span>
        );
    }
});

export default QBicon;
