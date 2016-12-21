import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import TextFieldValueEditor from './textFieldValueEditor';
import * as phoneNumberFormatter from '../../../../common/src/formatter/phoneNumberFormatter';
import Locale from '../../locales/locales';

import _ from 'lodash';

import './phoneField.scss';

const PhoneFieldValueEditor = React.createClass({
    displayName: 'PhoneFieldValueEditor',
    propTypes: {
        /**
         * the raw value to be saved */
        value: PropTypes.string,
        /**
         * the display to render */
        display: PropTypes.any,
        /**
         * the class to use */
        classes: PropTypes.string,
        /**
         * optional string to display when input is empty aka ghost text */
        placeholder: PropTypes.string,
        /**
         * phone field attributes
         */
        attributes: PropTypes.object,
        /**
         *listen for changes by setting a callback to the onChange prop */
        onChange: PropTypes.func,
        /**
         * listen for losing focus by setting a callback to the onBlur prop */
        onBlur: PropTypes.func,

    },

    pressedExtensionHotkey(value) {
        if (!value) {
            return false;
        }

        return value.charAt(value.length - 1) === phoneNumberFormatter.EXTENSION_DELIM;
    },

    /**
     *
     * When a user is typing in the officeNumber input box, this onChange will be triggered
     * The ext is stripped off of the phone number and then the user's new input value in the officeNumber
     * input box is then concatenated back with the ext
     *
     * @param newValue
     */
    onChangePhoneNumber(newValue) {
        if (this.pressedExtensionHotkey(newValue)) {
            this.focusOnExtension();
            return;
        }

        let phoneNumber = phoneNumberFormatter.onChangeMasking(newValue);
        let ext = phoneNumberFormatter.getExtension(this.props.display);
        let updatedValue = phoneNumber;
        if (this.props.value && ext) {
            updatedValue = phoneNumberFormatter.getUpdatedPhoneNumberWithExt(phoneNumber, ext);
        }
        if (this.props.onChange) {
            this.props.onChange(updatedValue);
        }
    },

    onChangeExtNumber(newValue) {
        /**
         * When a user is typing in the ext input box, this onChange will be triggered
         * The phone number is stripped out of the phone number and ext string, and then the user's new input value in the ext number
         * input box is then concatenated back with the phone number
         * */
        let updatedValue = this.props.display;
        // Check if the phone display is an object with a display property and use that value instead if it is
        if (this.props.display && this.props.display.display) {
            updatedValue = this.props.display.display + this.getExtraDigits();
        }

        updatedValue = phoneNumberFormatter.getPhoneNumber(updatedValue);
        if (newValue) {
            let extNumber = phoneNumberFormatter.onChangeMasking(newValue);
            updatedValue = phoneNumberFormatter.getUpdatedPhoneNumberWithExt(updatedValue, extNumber);
        }

        if (this.props.onChange) {
            this.props.onChange(updatedValue);
        }

    },

    onBlur() {
        if (!this.props.value) {
            this.props.onBlur({value: this.props.value, display: this.props.display});
        }

        let theVals = {
            value: phoneNumberFormatter.onBlurMasking(this.props.value),
        };

        // Format the value for easier user editing. Formatting is cleared on save.
        theVals.value = phoneNumberFormatter.format(theVals, this.props.fieldDef.datatypeAttributes);
        theVals.display = theVals.value;

        if (this.props.onBlur) {
            this.props.onBlur({value: theVals.value, display: theVals.display});
        }
    },

    focusOnExtension() {
        var extensionInput = ReactDOM.findDOMNode(this).querySelector('input.extension');

        if (this.hasExtension() && extensionInput) {
            extensionInput.focus();
        }
    },

    hasExtension() {
        return this.props.attributes && this.props.attributes.includeExtension;
    },

    getExtraDigits() {
        if (_.has(this.props, 'display.extraDigits') && this.props.display.extraDigits) {
            return ' ' + this.props.display.extraDigits;
        }

        return '';
    },

    render() {
        let {value, display, onBlur, onChange, classes, placeholder, ...otherProps} = this.props;
        placeholder = Locale.getMessage('placeholder.phone');
        let phoneNumber = '';
        let extension = '';
        if (display) {
            // We use the display value as the input value for the phoneNumber so that the user can edit a friendlier looking value
            // e.g., (555) 555-5555 instead of 5555555555 (we currently cannot save any special characters)
            phoneNumber = phoneNumberFormatter.getPhoneNumber(_.has(display, 'display') ? display.display : display);
            phoneNumber += this.getExtraDigits();
            extension = phoneNumberFormatter.getExtension(display);
        }

        /**
         * When a phone number has an extension, the phone number's input box is referred to as an office number
         * The office number input box needs to be styled differently than a regular phone number input box
         * */
        if (this.hasExtension()) {
            classes = {
                phoneNumber: "phoneNumber " + (classes || ''),
                extension: "extension " + (classes || '')
            };
        }
        const extInput = (<TextFieldValueEditor {...otherProps}
                                                classes={classes ? classes.extension : ''}
                                                onChange={this.onChangeExtNumber}
                                                onBlur={this.onBlur}
                                                value={extension || ''}
                                                inputType="tel" />);
        const ext = (<span className="ext">{phoneNumberFormatter.EXTENSION_DELIM}</span>);

        return (
            <div className="phoneWrapper">
                <TextFieldValueEditor {...otherProps}
                                      classes={classes && classes.phoneNumber ? classes.phoneNumber : classes}
                                      placeholder={placeholder}
                                      onChange={this.onChangePhoneNumber}
                                      onBlur={this.onBlur}
                                      value={phoneNumber || ''}
                                      inputType="tel" />
                {this.hasExtension() ? ext : null}
                {this.hasExtension() ? extInput : null}
            </div>
        );
    }
});

export default PhoneFieldValueEditor;
