import React from 'react';
import './fields.scss';

/**
 * a TextField read only rendering of the field that is a single line text field
 * the value can be rendered as bold or not and classes can be added to it for
 * custom styling
 */
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
        let classes = 'textField';
        if (this.props.classes) {
            classes += ' ' + this.props.classes;
        }

        if (this.props.isBold) {
            classes += " bold";
        }
        return <div className={classes}>{this.props.value}</div>;
    }
});


export default TextField;
