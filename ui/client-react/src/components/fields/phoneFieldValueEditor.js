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
        let phoneNumber = phoneNumberFormatter.onChangeMasking(ev);
        let ext = phoneNumberFormatter.getExtension(this.props.display);
        let updatedValue = phoneNumber;
        if (this.props.display && ext) {
            updatedValue = phoneNumberFormatter.getUpdatedPhoneNumberWithExt(phoneNumber, ext);

        }
        if (this.props.onChange) {
            this.props.onChange(updatedValue);
        }
    },
    onChangeExtNumber(ev) {
        let updatedValue = phoneNumberFormatter.getPhoneNumber(this.props.display);
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
            value: phoneNumberFormatter.onBlurMasking(this.props.value)
        };
        theVals.display = phoneNumberFormatter.format(theVals, this.props.fieldDef.datatypeAttributes);
        if (this.props.onBlur) {
            this.props.onBlur({value: theVals.value, display: theVals.display});
        }
    },
    render() {
        let {value, display, onBlur, onChange, classes, placeholder, ...otherProps} = this.props;
        placeholder = phoneNumberFormatter.PLACEHOLDER || "(xxx) xxx-xxxx";
        let phoneNumber;
        let officeExt;
        let hasExtInput = this.props.attributes && this.props.attributes.includeExtension;
        if (value) {
            phoneNumber = phoneNumberFormatter.getPhoneNumber(display);
            officeExt = phoneNumberFormatter.getExtension(display);
        }

        if (hasExtInput) {
            classes = {
                officeNumber: "officeNumber " + (classes || ''),
                extNumber: "extNumber " + (classes || '')
            };
        }
        const extInput = (<TextFieldValueEditor {...otherProps}
                                                classes={classes.extNumber}
                                                onChange={this.onChangeExtNumber}
                                                onBlur={this.onBlur}
                                                value={officeExt || ''} />);
        const ext = (<span className="ext">{phoneNumberFormatter.EXTENSION_DELIM}</span>);

        return (
            <div className="phoneWrapper">
                <TextFieldValueEditor {...otherProps}
                                      classes={classes.officeNumber || classes}
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
