import React, {PropTypes} from 'react';
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

        /* optional prop to pass in placeholder text. Defaults to: 'name@dimain.com'. */
        placeholder: PropTypes.string
    },
    getDefaultProps() {
        return {
            value: '',
            invalid: false,
            disabled: false,
            readOnly: false,
            placeholder: 'name@domain.com'
        };
    },
    onBlur(newValue) {
        let datatypeAttributes = (this.props.fieldDef ? this.props.fieldDef.datatypeAttributes : {});

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
