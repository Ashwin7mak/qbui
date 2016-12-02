import React, {PropTypes} from 'react';
import TextFieldValueEditor from './textFieldValueEditor';
import './phoneFieldValueEditor.scss';
import * as phoneNumberFormatter from '../../../../common/src/formatter/phoneNumberFormatter';

const PhoneFieldValueEditor = React.createClass({
    displayName: 'PhoneFieldValueEditor',
    propTypes: {
        /**
         * the value to render */
        value: PropTypes.any,
        /**
         * text field attributes, attributes.includeExtension is set to true it will include an extension input box
         */
        attributes: PropTypes.object

    },
    onChangeOfficeNumber(ev) {
        let phoneNumber = phoneNumberFormatter.onChangeMasking(ev);
        let updatedValue = phoneNumber;
        if (this.props.display && phoneNumberFormatter.getExtension(this.props.display)) {
            updatedValue = phoneNumberFormatter.getUpdatedPhoneNumberWithExt(phoneNumber, phoneNumberFormatter.getExtension(this.props.display));

        }
        if (this.props.onChange) {
            this.props.onChange(updatedValue);
        }
    },
    onChangeExtNumber(ev) {
        let updatedValue;
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
        placeholder = "(xxx) xxx-xxxx";
        let phoneNumber;
        let officeExt;
        if (value) {
            phoneNumber = phoneNumberFormatter.getPhoneNumber(display);
            officeExt = phoneNumberFormatter.getExtension(display);
        }

        if (this.props.attributes && this.props.attributes.includeExtension) {
            classes = {
                officeNumber: "officeNumber " + (this.props.classes ? this.props.classes : ''),
                extNumber: "extNumber " + (this.props.classes ? this.props.classes : '')
            };
            return (
                <div className="officePhone">
                    <TextFieldValueEditor type="tel"
                                          {...otherProps}
                                          classes={classes.officeNumber}
                                          placeholder={placeholder}
                                          onChange={this.onChangeOfficeNumber}
                                          onBlur={this.onBlur}
                                          value={phoneNumber || ''} />
                    <span className="x">{phoneNumberFormatter.EXTENSION_DELIM}</span>
                    <TextFieldValueEditor type="tel"
                                          {...otherProps}
                                          classes={classes.extNumber}
                                          onChange={this.onChangeExtNumber}
                                          onBlur={this.onBlur}
                                          value={officeExt || ''} />
                </div>
            );
        } else {
            return (
                    <TextFieldValueEditor type="tel"
                                          value={phoneNumber || ''}
                                          placeholder={placeholder}
                                          onChange={this.onChange}
                                          onBlur={this.onBlur}
                                          classes={classes || ''} />
            );
        }
    }
});

export default PhoneFieldValueEditor;
