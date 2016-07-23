import React from 'react';
import './fields.scss';

export const TextField = React.createClass({

    propTypes: {
        value: React.PropTypes.any,
        classes: React.PropTypes.string,
        isBold: React.PropTypes.bool
    },

    getDefaultProps() {
        return {
            isBold: false
        };
    },

    render() {
        let classes = this.props.classes;
        if (this.props.isBold) {
            classes += " bold";
        }
        return <div className={classes}>{this.props.value}</div>;
    }
});


export default TextField;