import React from 'react';
import './fields.scss';
import QBToolTip from '../qbToolTip/qbToolTip';

/**
 * a TextFieldEditor editable rendering of the field that is a single line text field
 * the value can be rendered as invalid or not and classes can be added to it for
 * custom styling.
 * an optional placeholder will be shown when the value is empty
 * onBlur will be called when the editor is exited
 * onChange will be called when a change is made to the value
 */
export const TextFieldEditor = React.createClass({
    propTypes: {
        ref: React.PropTypes.any,
        isInvalid: React.PropTypes.bool,
        invalidMessage: React.PropTypes.string,
        value: React.PropTypes.any, // should be string but duration is a number but rendered as text
        classes: React.PropTypes.string,
        onChange: React.PropTypes.func.isRequired,
        onBlur: React.PropTypes.func.isRequired
    },

    onChange(ev) {
        //TODO: add debounce support for reduced re-rendering
        this.props.onChange(ev.target.value);
    },

    render() {
        let classes = 'input textField';
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
