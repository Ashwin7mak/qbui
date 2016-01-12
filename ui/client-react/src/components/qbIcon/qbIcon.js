import React from 'react';
import './quickBaseIcons.scss';

/**
 * an icon using a new qb icon font (from Lisa)
 */
const QBicon = React.createClass({
    propTypes: {
        icon: React.PropTypes.string.isRequired,
        className: React.PropTypes.string
    },

    render: function() {
        let className = this.props.className + ' qbIcon qbtest-' + this.props.icon;

        return (
            <span className={className}>
                {this.props.children}
            </span>
        );
    }
});

export default QBicon;
