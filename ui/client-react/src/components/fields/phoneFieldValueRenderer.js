import React from 'react';
import './fields.scss';
/**
 * # TextFieldValueRenderer
 *
 * A TextFieldValueRenderer is a read only rendering of the field containing a single line text.
 *
 * The value can be rendered as bold or not and classes can be optionally pass in for custom styling.
 */
const PhoneFieldValueRenderer = React.createClass({
    displayName: 'PhoneFieldValueRenderer',
    propTypes: {
        /**
         * the value to render */
        value: React.PropTypes.any,

        /**
         * optional additional classes for the input to customize styling */
        classes: React.PropTypes.string,
        /**
         * text field attributes
         */
        attributes: React.PropTypes.object

    },
    render() {
        let classes = 'textField';
        if (this.props.classes) {
            classes += ' ' + this.props.classes;
        }
        return <div className={classes}>{this.props.value}</div>;
    }
});


export default PhoneFieldValueRenderer;
