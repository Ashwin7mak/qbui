import React from 'react';
import './fields.scss';
import QBToolTip from '../qbToolTip/qbToolTip';
import QBicon from '../qbIcon/qbIcon';
import ClearableInput from '../hoc/ClearableInput';
import * as textFormatter from '../../../../common/src/formatter/textFormatter';
import FieldUtils from '../../utils/fieldUtils';

/**
 * # TextFieldValueEditor
 *
 * An editable rendering of a single line text field as an input box. The component can be supplied a value or not. Used within a FieldValueEditor
 *
 */
const TextInput = React.createClass({
    render() {
        let maxLength = FieldUtils.getMaxLength(this.props.fieldDef);
        return (<input
                       className={this.props.classes}
                       value={this.props.value || ''}
                       maxLength={maxLength}
                       type={this.props.inputType}
                       key={'inp' + this.props.idKey}
                       placeholder={this.props.placeholder}
                       onChange={this.props.onChange}
                       onBlur={this.props.onBlur}
                 />);
    }
});
const ClearableTextInput = ClearableInput(TextInput);

const TextFieldValueEditor = React.createClass({
    displayName: 'TextFieldValueEditor',

    propTypes: {
        /**
         * the value to fill in the input box */
        value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),  // should be string but duration is a number for edit but rendered as text

        /**
         * optional string to display when input is empty aka ghost text */
        placeholder: React.PropTypes.string,

        /**
         * renders with red border if true */
        invalid: React.PropTypes.bool,

        /**
         * message to display in the tool tip when invalid */
        invalidMessage: React.PropTypes.string,

        /**
         * optional additional classes for the input to customize styling */
        classes: React.PropTypes.string,

        /**
        * shows a button that will allow a user to clear the field in one click */
        showClearButton: React.PropTypes.bool,

        /**
         * listen for changes by setting a callback to the onChange prop.  */
        onChange: React.PropTypes.func,

        /**
         * listen for losing focus by setting a callback to the onBlur prop. */
        onBlur: React.PropTypes.func,

        idKey: React.PropTypes.any,

        /**
         * data type attributes for the field */
        fieldDef: React.PropTypes.object,

        /**
        * Set the input type to either text, email, or url to allow better mobile keyboards */
        inputType: React.PropTypes.oneOf(['text', 'email', 'url', 'tel'])
    },

    getDefaultProps() {
        return {
            inputType: 'text',
            isInvalid: false,
            showClearButton: false
        };
    },

    getInitialState() {
        return {
            isFocused: false,
        };
    },

    onChange(ev) {
        if (this.props.onChange) {
            this.props.onChange(ev.target.value);
        }
    },

    //send up the chain an object with value and formatted display value
    onBlur(ev) {
        let theVals = {
            value: ev.target.value
        };

        let attrs = null;
        if (this.props.fieldDef && this.props.fieldDef.datatypeAttributes) {
            attrs = this.props.fieldDef.datatypeAttributes;
        }
        theVals.display = textFormatter.format(theVals, attrs);

        if (this.props.onBlur) {
            this.props.onBlur({value: theVals.value, display: theVals.display});
        }
    },

    render() {
        let classNames = ['input', 'textField', 'borderOnError'];
        // error state css class
        classNames.push(this.props.invalid ? 'error' : '');
        classNames.push(this.props.classNames || '');

        let Input = this.props.showClearButton ? ClearableTextInput : TextInput;
        // use the raw value as the input value, not the formatted display value that may include escaped content
        return (<Input
                    {...this.props}
                    classes={classNames.join(' ')}
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                />);
    }
});

export default TextFieldValueEditor;
