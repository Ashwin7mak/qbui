import React from 'react';
import './fields.scss';
import QBToolTip from '../qbToolTip/qbToolTip';

/**
 * # TextFieldEditor
 *
 * An editable rendering of a single line text field as an input box. The component can be supplied a value or not. Used within a FieldEditor
 *
 */

const TextFieldEditor = React.createClass({
    propTypes: {
        /**
         * the value to fill in the input box */
        value: React.PropTypes.any, // should be string but duration is a number but rendered as text

        /**
         * optional string to display when input is empty aka ghost text */
        placeholder: React.PropTypes.string,

        /**
         * renders with red border if true */
        isInvalid: React.PropTypes.bool,

        /**
         * message to display in the tool tip when isInvalid */
        invalidMessage: React.PropTypes.string,

        /**
         * optional additional classes for the input to customize styling */
        classes: React.PropTypes.string,

        /**
         * listen for changes by setting a callback to the onChange prop.  */
        onChange: React.PropTypes.func,

        /**
         * listen for losing focus by setting a callback to the onBlur prop. */
        onBlur: React.PropTypes.func,
        
        /**
         * attach a ref to reference the backing instance of the component. */
        ref: React.PropTypes.any
    },

    getDefaultProps() {
    return {
        isInvalid: false
    };
},
    onChange(ev) {
        //TODO: add debounce support for reduced re-rendering
        if (this.props.onChange) {
            this.props.onChange(ev.target.value);
        }
    },

    render() {
        let classes = 'input textField';
        // error state css class
        if (this.props.isInvalid) {
            classes += ' error';
        }
        if (this.props.classes) {
            classes += ' ' + this.props.classes;
        }
        let inputBox = <input ref={this.props.ref}
                          className={classes}
                          value={this.props.value}
                          type="text"
                          placeholder={this.props.placeholder}
                          onChange={this.onChange}
                          onBlur={this.props.onBlur} />;


        return  (this.props.isInvalid ?
                (<QBToolTip location="top" tipId="invalidInput" delayHide={3000}
                            plainMessage={this.props.invalidMessage}>
                    {inputBox}
                </QBToolTip>) :
                inputBox
        );
    }
});

export default TextFieldEditor;
