import React, {PropTypes} from 'react';
import EmailFormatter from '../../../../common/src/formatter/emailFormatter';
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

        readOnly: PropTypes.bool
    },
    getDefaultProps() {
        return {
            value: '',
            invalid: false,
            disabled: false,
            readOnly: false
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
        let {onChange, onBlur, display, value, ...otherProps} = this.props;
        return <TextFieldValueEditor onBlur={this.onBlur}
                                     onChange={this.onChange}
                                     value={this.props.value}
                                     placeholder='name@domain.com'
                                     inputType='email'
                                     invalidMessage={(this.props.invalidMessage || 'Email is required')}
                                     showClearButton={true}
                                     {...otherProps} />
    }
});

export default EmailFieldValueEditor;
