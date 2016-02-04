import React from 'react';
import './harmony.scss';

const Hicon = React.createClass({
    propTypes: {
        icon: React.PropTypes.string.isRequired
    },
    getDefaultProps() {
        return {
            className: ""
        };
    },
    render: function() {
        let className = this.props.className + ' hi hi-' + this.props.icon;

        return (
            <span className={className}>
                {this.props.children}
            </span>
        );
    }
});

export default Hicon;
