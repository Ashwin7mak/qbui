import React from 'react';
import './quickBaseIcons.scss';

const QBicon = React.createClass({
    propTypes: {
        icon: React.PropTypes.string.isRequired
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
