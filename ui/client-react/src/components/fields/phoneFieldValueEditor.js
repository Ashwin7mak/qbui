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
        let updatedValue = ev;
        if (this.props.value && phoneNumberFormatter.format(this.props.value).extensionVal) {
            updatedValue = ev + phoneNumberFormatter.ext() + phoneNumberFormatter.format(this.props.value).extensionVal;

        }
        if (this.props.onChange) {
            this.props.onChange(updatedValue);
        }
    },
    onChangeExtNumber(ev) {
        if (this.props.value) {
            let updatedValue = phoneNumberFormatter.format(this.props.value).phoneNumberVal;
            if (ev) {
                updatedValue += phoneNumberFormatter.ext()  + ev;
            }
            if (this.props.onChange) {
                this.props.onChange(updatedValue);
            }
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
        if (this.props.onBlur) {
            this.props.onBlur({value: theVals.value, display: theVals.display});
        }
    },
    render() {
        const placeholderNumber = "(xxx) xxx-xxxx";
        if (this.props.attributes && this.props.attributes.includeExtension) {
            let officeNumber;
            let officeExt;
            if (this.props.value) {
                officeNumber = phoneNumberFormatter.format(this.props.value).phoneNumberVal;
                officeExt = phoneNumberFormatter.format(this.props.value).extensionVal;
            }
            let classes = {
                officeNumber: "officeNumber " + (this.props.classes ? this.props.classes : 'cellEdit'),
                extNumber: "extNumber " + (this.props.classes ? this.props.classes : 'cellEdit')
            };
            return (
                <div className="officePhone">
                    <TextFieldValueEditor type="tel"
                                          classes={classes.officeNumber}
                                          placeholder={placeholderNumber}
                                          onChange={this.onChangeOfficeNumber}
                                          onBlur={this.onBlur}
                                          value={officeNumber || ''} />
                    <span className="x">{phoneNumberFormatter.ext()}</span>
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
                                          classes={this.props.classes || 'cellEdit'}/>
            );
        }
    }
});

export default PhoneFieldValueEditor;
