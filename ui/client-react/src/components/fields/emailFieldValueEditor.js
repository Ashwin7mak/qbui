import React, {PropTypes} from 'react';
import Locales from "../../locales/locales";
import Breakpoints from '../../utils/breakpoints';

import EmailFormatter from '../../../../common/src/formatter/emailFormatter';

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

        /** Optional prop to pass in placeholder text. Defaults to: 'name@domain.com' (internationalized). */
        placeholder: PropTypes.string
    },
    getDefaultProps() {
        return {
            value: '',
            validateFieldValue: true,
            invalid: false,
            disabled: false,
            readOnly: false,
        };
    },
    onBlur(newValue) {
        let datatypeAttributes = (this.props.fieldDef ? this.props.fieldDef.datatypeAttributes : {});

        let value = EmailFormatter.addDefaultDomain(newValue.value, datatypeAttributes.defaultDomain);

        if (this.props.onBlur) {
            this.props.onBlur({
                display: EmailFormatter.formatListOfEmails(value, datatypeAttributes),
                value: value
            });
        }
    },
    onChange(newValue) {
        if (this.props.onChange) {
            this.props.onChange(newValue);
        }
    },
    render() {
        // Remove some properties before passing to TextFieldValueEditor
        // TextFieldValueEditor uses the display value by default, so it cannot be passed in for Email and URL
        let {onChange, onBlur, display, placeholder, disabled, readOnly, ...otherProps} = this.props;

        if (disabled || readOnly) {
            // Return a read only email
            return <EmailFieldValueRenderer display={display} {...otherProps} />;
        }

        return <TextFieldValueEditor onBlur={this.onBlur}
                                     onChange={this.onChange}
                                     placeholder={(this.props.placeholder || Locales.getMessage('placeholder.email'))}
                                     inputType="email"
                                     invalidMessage={(this.props.invalidMessage || 'Email is required')}
                                     showClearButton={Breakpoints.isSmallBreakpoint()}
                                     {...otherProps} />;
    }
});

export default EmailFieldValueEditor;
