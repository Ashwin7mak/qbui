import React, {PropTypes} from 'react';
import TextFieldValueEditor from './textFieldValueEditor';
import './phoneField.scss';
import * as phoneNumberFormatter from '../../../../common/src/formatter/phoneNumberFormatter';

const PhoneFieldValueEditor = React.createClass({
    displayName: 'PhoneFieldValueEditor',
    propTypes: {
        /**
         * the raw value to be saved */
        value: React.PropTypes.string,
        /**
         * the display to render */
        display: React.PropTypes.any,
        /**
         * the class to use */
        classes: React.PropTypes.string,
        /**
         * optional string to display when input is empty aka ghost text */
        placeholder: React.PropTypes.string,
        /**
         * phone field attributes
         */
        attributes: React.PropTypes.object,
        /**
         *listen for changes by setting a callback to the onChange prop */
        onChange: React.PropTypes.func,
        /**
         * listen for losing focus by setting a callback to the onBlur prop */
        onBlur: React.PropTypes.func,

    },
    onChangeOfficeNumber(ev) {
        /**
         * When a user is typing in the officeNumber input box, this onChange will be triggered
         * The ext is stripped off of the phone number and then the user's new input value in the officeNumber
         * input box is then concatenated back with the ext
         * */
        let phoneNumber = phoneNumberFormatter.onChangeMasking(ev);
        let ext = phoneNumberFormatter.getExtension(this.props.value);
        let updatedValue = phoneNumber;
        if (this.props.value && ext) {
            updatedValue = phoneNumberFormatter.getUpdatedPhoneNumberWithExt(phoneNumber, ext);

        }
        if (this.props.onChange) {
            this.props.onChange(updatedValue);
        }
    },
    onChangeExtNumber(ev) {
        /**
         * When a user is typing in the ext input box, this onChange will be triggered
         * The phone number is stripped out of the phone number and ext string, and then the user's new input value in the ext number
         * input box is then concatenated back with the phone number
         * */
        let updatedValue = phoneNumberFormatter.getPhoneNumber(this.props.value);
        if (ev) {
            let extNumber = phoneNumberFormatter.onChangeMasking(ev);
            updatedValue = phoneNumberFormatter.getUpdatedPhoneNumberWithExt(phoneNumberFormatter.getPhoneNumber(this.props.display), extNumber);
        }
        if (this.props.onChange) {
            this.props.onChange(updatedValue);
        }

    },
    onChange(ev) {
        let phoneNumber = phoneNumberFormatter.onChangeMasking(ev);
        if (this.props.onChange) {
            this.props.onChange(phoneNumber);
        }
    },
    onBlur() {
        let theVals = {
            value: phoneNumberFormatter.onBlurMasking(this.props.value),
        };
        theVals.display = phoneNumberFormatter.format(theVals, this.props.fieldDef.datatypeAttributes);
        if (this.props.onBlur) {
            this.props.onBlur({value: theVals.value, display: theVals.display});
        }
    },
    render() {
        let {value, display, onBlur, onChange, classes, placeholder, ...otherProps} = this.props;
        placeholder = phoneNumberFormatter.PLACEHOLDER;
        let phoneNumber = '';
        let officeExt = '';
        let hasExtInput = this.props.attributes && this.props.attributes.includeExtension;
        if (value) {
            phoneNumber = phoneNumberFormatter.getPhoneNumber(value);
            officeExt = phoneNumberFormatter.getExtension(value);
        }

        /**
         * When a phone number has an extension, the phone number's input box is referred to as an office number
         * The office number input box needs to be styled differently than a regular phone number input box
         * */
        if (hasExtInput) {
            classes = {
                officeNumber: "officeNumber " + (classes || ''),
                extNumber: "extNumber " + (classes || '')
            };
        }
        const extInput = (<TextFieldValueEditor {...otherProps}
                                                classes={classes ? classes.extNumber : ''}
                                                onChange={this.onChangeExtNumber}
                                                onBlur={this.onBlur}
                                                value={officeExt || ''} />);
        const ext = (<span className="ext">{phoneNumberFormatter.EXTENSION_DELIM}</span>);

        return (
            <div className="phoneWrapper">
                <TextFieldValueEditor {...otherProps}
                                      classes={classes && classes.officeNumber ? classes.officeNumber : classes}
                                      placeholder={placeholder}
                                      onChange={this.onChangeOfficeNumber}
                                      onBlur={this.onBlur}
                                      value={phoneNumber || ''} />
                {hasExtInput ? ext : null}
                {hasExtInput ? extInput : null}
            </div>
        );
    }
});

export default PhoneFieldValueEditor;
