import React, {PropTypes} from 'react';
import Locales from "../../locales/locales";

import EmailFormatter from '../../../../common/src/formatter/emailFormatter';
import EmailValidator from '../../../../common/src/validator/emailValidator';

import EmailFieldValueRenderer from './emailFieldValueRenderer';
import TextFieldValueEditor from './textFieldValueEditor';

/**
 * # EmailFieldValueEditor
 *
 * A simple wrapper around TextFieldValueEditor for editing emails
 *
 */
const EmailFieldValueEditor = React.createClass({
    displayName: 'EmailFieldValueEditor',
    propTypes: {
        value: PropTypes.string,

        onChange: PropTypes.func,

        onBlur: PropTypes.func,

        invalid: PropTypes.bool,

        disabled: PropTypes.bool,

        readOnly: PropTypes.bool,

        /** Optional prop to pass in placeholder text. Defaults to: 'name@dimain.com'. */
        placeholder: PropTypes.string,

        /** Flag to turn on and off email validation. `onValidated` function must also be supplied */
        validateFieldValue: PropTypes.bool,

        /** Function used to pass validation results to the parent component. `validate` prop must also be true */
        onValidated: PropTypes.func

    },
    getDefaultProps() {
        return {
            value: '',
            validateFieldValue: false,
            invalid: false,
            disabled: false,
            readOnly: false,
            placeholder: 'name@domain.com'
        };
    },
    /**
     * Validation for the email field occurs here because it is specific to this field.
     * Generic validators occur within validationUtils.js
     */
    validateEmail(email) {
        if (this.props.validateFieldValue && this.props.onValidated) {
            var fieldName = 'Email';
            if (this.props.fieldDef && this.props.fieldDef.headerName) {
                fieldName = this.props.fieldDef.headerName;
            }

            var isInvalid = EmailValidator.isInvalid(email);

            this.props.onValidated({
                isInvalid: isInvalid,
                invalidMessage: Locales.getMessage('invalidMsg.email', {fieldName: 'email'})
            });
        }
    },
    onBlur(newValue) {
        let datatypeAttributes = (this.props.fieldDef ? this.props.fieldDef.datatypeAttributes : {});

        this.validateEmail(newValue.value);

        if (this.props.onBlur) {
            this.props.onBlur({
                display: EmailFormatter.format(newValue, datatypeAttributes),
                value: EmailFormatter.addDefaultDomain(newValue.value, datatypeAttributes.defaultDomain)
            });
        }
    },
    onChange(newValue) {
        if (this.props.onChange) {
            this.props.onChange(newValue);
        }
    },
    render() {
        let {onChange, onBlur, disabled, readOnly, ...otherProps} = this.props;

        if (disabled || readOnly) {
            // Return a read only email
            return <EmailFieldValueRenderer {...otherProps} />;
        }

        return <TextFieldValueEditor onBlur={this.onBlur}
                                     onChange={this.onChange}
                                     placeholder={this.props.placeholder}
                                     inputType="email"
                                     invalidMessage={(this.props.invalidMessage || 'Email is required')}
                                     showClearButton={true}
                                     {...otherProps} />;
    }
});

export default EmailFieldValueEditor;
