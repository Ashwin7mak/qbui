import React, {PropTypes} from 'react';
import _ from 'lodash';

import CheckBoxFieldValueRenderer from './checkBoxFieldValueRenderer';

import './checkbox.scss';
/**
 * checkbox cell editor
 */
const CheckBoxFieldValueEditor = React.createClass({
    displayName: 'CheckBoxFieldValueEditor',
    propTypes: {
        value: PropTypes.bool,
        onChange: PropTypes.func,
        onBlur: PropTypes.func,
        label: PropTypes.string,
        id: PropTypes.string,
        invalid: PropTypes.bool,
        disabled: PropTypes.bool,
        readOnly: PropTypes.bool,
        required: PropTypes.bool
    },

    getDefaultProps() {
        return {
            value: false,
            label: ' ',
            invalid: false,
            disabled: false,
            readOnly: false,
            required: false
        };
    },

    onKeyDown(ev) {
        // Call on change if key press is space bar (for accessibility)
        if (ev.keyCode === 32) {
            this.onChange(ev);
        }
    },

    onBlur(ev) {
        if (this.props.onBlur) {
            this.props.onBlur(this.props.value);
        }
    },

    onChange(ev) {
        ev.preventDefault();

        // Don't change the value if the checkbox is disabled/read only
        if (this.props.disabled || this.props.readyOnly) {
            return;
        }

        const newValue = !this.props.value;
        if (this.props.onChange) {
            this.props.onChange(newValue);
        }
    },

    hasLabel() {
        return (this.props.label !== ' ');
    },

    renderLabel() {
        if (this.hasLabel()) {
            return (
                <label className="label" htmlFor={this.getNextHtmlFor()}>
                    {this.props.label}
                </label>
            );
        }
    },

    render() {
        let classes = "checkbox editor";
        classes += (this.hasLabel() ? ' hasLabel' : '');

        let checkBoxClasses = '';
        checkBoxClasses += (this.props.invalid ? 'invalid ' : '');
        checkBoxClasses += (this.props.required ? 'required' : '');

        let requiredSymbol;
        if (this.props.required) {
            let requiredSymbolClasses = 'required-symbol';
            requiredSymbolClasses += (this.props.invalid ? ' invalid' : '');
            requiredSymbol = <span className={requiredSymbolClasses}>*</span>;
        }

        // If a checkbox is readonly, return the renderer instead
        // Need to return a renderer if value is true and checkbox is disabled
        // because could not get the checkmark to be in the correct place
        if (this.props.readOnly || (this.props.disabled && this.props.value)) {
            return <CheckBoxFieldValueRenderer {...this.props} />;
        }

        return (
            <div className={classes}>
                <input className={checkBoxClasses}
                       checked={this.props.value}
                       ref="fieldInput"
                       type="checkbox"
                       onChange={this.onChange}
                       onBlur={this.props.onBlur}
                       tabIndex="0"
                       disabled={this.props.disabled} />
                <label className="label"
                       onClick={this.onChange}
                       tabIndex="0"
                       onKeyDown={this.onKeyDown} >
                    {this.props.label}
                </label>
                {requiredSymbol}
            </div>
        );
    }
});

export default CheckBoxFieldValueEditor;
