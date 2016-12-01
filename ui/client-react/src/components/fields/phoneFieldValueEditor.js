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
        let updatedValue;
        if (this.props.value && phoneNumberFormatter.getExtension(this.props.value)) {
            updatedValue = phoneNumberFormatter.getUpdatedPhoneNumberWithExt(ev, phoneNumberFormatter.getExtension(this.props.value));

        }
        if (this.props.onChange) {
            this.props.onChange(updatedValue);
        }
    },
    onChangeExtNumber(ev) {
        let updatedValue;
        if (ev) {
            updatedValue = phoneNumberFormatter.getUpdatedPhoneNumberWithExt(phoneNumberFormatter.getPhoneNumber(this.props.value), ev);
        }
        if (this.props.onChange) {
            this.props.onChange(updatedValue);
        }

    },
    onChange(ev) {
        if (this.props.onChange) {
            this.props.onChange(ev.target.value);
        }

    },
    onBlur() {
        let theVals = {
            value: this.props.value
        };
        theVals.display = phoneNumberFormatter.format(theVals, this.props.fieldDef.datatypeAttributes);
        //function that strips special characters from theVals.value
        if (this.props.onBlur) {
            this.props.onBlur({value: theVals.value, display: theVals.display});
        }
    },
    render() {
        const placeholderNumber = "(xxx) xxx-xxxx";
        if (this.props.attributes && this.props.attributes.includeExtension) {
            let officeNumber;
            let officeExt;
            if (this.props && this.props.value) {
                officeNumber = phoneNumberFormatter.getPhoneNumber(this.props.value);
                officeExt = phoneNumberFormatter.getExtension(this.props.value);
            }
            let classes = {
                officeNumber: "officeNumber " + (this.props.classes ? this.props.classes : ''),
                extNumber: "extNumber " + (this.props.classes ? this.props.classes : '')
            };
            return (
                <div className="officePhone">
                    <TextFieldValueEditor type="tel"
                                          classes={classes.officeNumber}
                                          placeholder={placeholderNumber}
                                          onChange={this.onChangeOfficeNumber}
                                          onBlur={this.onBlur}
                                          value={officeNumber || ''} />
                    <span className="x">{phoneNumberFormatter.EXTENSION_DELIM}</span>
                    <TextFieldValueEditor type="tel"
                                          classes={classes.extNumber}
                                          onChange={this.onChangeExtNumber}
                                          onBlur={this.onBlur}
                                          value={officeExt || ''} />
                </div>
            );
        } else {
            return (
                    <TextFieldValueEditor type="tel"
                                          value={this.props.value || ''}
                                          placeholder={placeholderNumber}
                                          onChange={this.onChange}
                                          onBlur={this.onBlur}
                                          classes={this.props.classes || 'cellEdit'} />
            );
        }
    }
});

export default PhoneFieldValueEditor;
