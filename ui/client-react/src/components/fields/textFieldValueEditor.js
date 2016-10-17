import React from 'react';
import './fields.scss';
import QBToolTip from '../qbToolTip/qbToolTip';
import QBicon from '../qbIcon/qbIcon';
import * as textFormatter from '../../../../common/src/formatter/textFormatter';
import FieldUtils from '../../utils/fieldUtils';

/**
 * # TextFieldValueEditor
 *
 * An editable rendering of a single line text field as an input box. The component can be supplied a value or not. Used within a FieldValueEditor
 *
 */

const TextFieldValueEditor = React.createClass({
    displayName: 'TextFieldValueEditor',

    propTypes: {
        /**
         * the value to fill in the input box */
        value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),  // should be string but duration is a number for edit but rendered as text

        /**
         * optional string to display when input is empty aka ghost text */
        placeholder: React.PropTypes.string,

        /**
         * renders with red border if true */
        invalid: React.PropTypes.bool,

        /**
         * message to display in the tool tip when invalid */
        invalidMessage: React.PropTypes.string,

        /**
         * optional additional classes for the input to customize styling */
        classes: React.PropTypes.string,

        /**
        * shows a button that will allow a user to clear the field in one click */
        showClearButton: React.PropTypes.bool,

        /**
         * listen for changes by setting a callback to the onChange prop.  */
        onChange: React.PropTypes.func,

        /**
         * listen for losing focus by setting a callback to the onBlur prop. */
        onBlur: React.PropTypes.func,

        idKey: React.PropTypes.any,

        /**
         * data type attributes for the field */
        fieldDef: React.PropTypes.object,

        /**
        * Set the input type to either text, email, or url to allow better mobile keyboards */
        inputType: React.PropTypes.oneOf(['text', 'email', 'url', 'tel'])
    },

    getDefaultProps() {
        return {
            inputType: 'text',
            isInvalid: false,
            showClearButton: false
        };
    },

    onChange(ev) {
        if (this.props.onChange) {
            this.props.onChange(ev.target.value);
        }
    },

    clearInput(ev) {
        if (this.props.onChange) {
            this.props.onChange('');
            this.refs.textInput.focus();
        }
    },

    getValue() {
        /*
         Value is set to display by default because in most cases
         the user edits the display value and not the raw value.
         For example, the user edits '$5.50', not '550'.
         If you need the user to edit the raw value instead of
         the display value, then remove display from the props before passing
         to textFieldValueEditor.
         */
        let value = this.props.display ? this.props.display : this.props.value;
        // If it still is null, show as a blank string to avoid React input errors
        value = (value === null ? '' : value);
        return value;
    },

    renderInputBox(classes) {
        let maxLength = FieldUtils.getMaxLength(this.props.fieldDef);

        return <input ref="textInput"
                      className={classes}
                      value={this.getValue()}
                      maxLength={maxLength}
                      type={this.props.inputType}
                      key={'inp' + this.props.idKey}
                      placeholder={this.props.placeholder}
                      onChange={this.onChange}
                      onBlur={this.onBlur} />;
    },

    addClearButtonTo(inputBox) {
        return (
            <span className="inputDeleteIcon">
                {inputBox}
                <QBToolTip tipId="clearInput" i18nMessageKey="fields.textField.clear">
                    {/* Need to wrap QBicon in a div for tooltip to show */}
                    <div className="clearIcon">
                        <QBicon onClick={this.clearInput} icon="clear-mini" />
                    </div>
                </QBToolTip>
            </span>
        );
    },

    //send up the chain an object with value and formatted display value
    onBlur(ev) {
        let theVals = {
            value: ev.target.value
        };
        let attrs = null;
        if (this.props.fieldDef && this.props.fieldDef.datatypeAttributes) {
            attrs = this.props.fieldDef.datatypeAttributes;
        }
        theVals.display = textFormatter.format(theVals, attrs);
        if (this.props.onBlur) {
            this.props.onBlur({value: theVals.value, display: theVals.display});
        }
    },

    render() {
        let classes = 'input textField borderOnError';
        // error state css class
        if (this.props.invalid) {
            classes += ' error';
        }

        if (this.props.classes) {
            classes += ' ' + this.props.classes;
        }

        let inputBox = this.renderInputBox(classes);

        if (this.props.showClearButton) {
            return this.addClearButtonTo(inputBox);
        } else {
            return inputBox;
        }
    }
});

export default TextFieldValueEditor;
