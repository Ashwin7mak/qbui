import React from 'react';
import './qbIcon.scss';
import './style.css';

/**
 * an icon using a new qb icon font (from Lisa)
 */
const QBicon = React.createClass({
    propTypes: {
        icon: React.PropTypes.string.isRequired,
        className: React.PropTypes.string,
        onClick: React.PropTypes.func
    },
    getDefaultProps() {
        return {
            className: ""
        };
    },
    render: function() {
        let className = this.props.className + ' qbIcon iconssturdy-' + this.props.icon;

        return (
            <span className={className} onClick={this.props.onClick}>
                {this.props.children}
            </span>
        );
    }
});

export default QBicon;
