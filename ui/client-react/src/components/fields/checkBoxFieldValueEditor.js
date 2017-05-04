import React, {PropTypes} from 'react';
import _ from 'lodash';
import {ENTER_KEY, SPACE_KEY} from '../../../../reuse/client/src/components/keyboardShortcuts/keyCodeConstants';
import CheckBoxFieldValueRenderer from './checkBoxFieldValueRenderer';

import './checkbox.scss';

/**
 * # CheckBoxFieldValueEditor
 *
 * An editable checkbox for boolean or yes/no values.
 *
 */
const CheckBoxFieldValueEditor = React.createClass({
    displayName: 'CheckBoxFieldValueEditor',
    propTypes: {
        /**
         * The value of the checkbox (true/false) */
        value: PropTypes.bool,

        onChange: PropTypes.func,

        onBlur: PropTypes.func,

        /**
         * Set the label that displays next to the checkbox */
        label: PropTypes.string,

        invalid: PropTypes.bool,

        /**
         * A boolean to disabled field on form builder
         */
        isDisabled: PropTypes.bool,

        readOnly: PropTypes.bool,

        /**
         * Set a checkbox as required (i.e., must be checked) */
        required: PropTypes.bool,

        /**
         * Change the symbol to show when a checkbox is required (default: *) */
        requiredSymbol: PropTypes.string
    },

    getDefaultProps() {
        return {
            value: false,
            label: ' ',
            invalid: false,
            isDisabled: false,
            readOnly: false,
            required: false,
            requiredSymbol: '*'
        };
    },

    onKeyDown(ev) {
        // Call on change if key press is space bar (for accessibility)
        if (!this.props.isDisabled && ev.keyCode === SPACE_KEY || ev.keyCode === ENTER_KEY) {
            this.onChange(ev);
        }
    },

    onBlur() {
        if (this.props.onBlur) {
            this.props.onBlur({value: this.props.value});
        }
    },

    onChange(ev) {
        ev.preventDefault();

        // Don't change the value if the checkbox is disabled/read only
        if (this.props.isDisabled || this.props.readOnly) {
            return;
        }

        let newValue = !this.props.value;
        if (this.props.onChange) {
            this.props.onChange(newValue);
        }
    },

    hasLabel() {
        // Because the visible checkbox is just CSS on the label
        // the label will default to a space to ensure the checkbox appears
        // but that shouldn't count as having a label. Passing in {null} or a blank
        // space for the label will still work correctly.
        return (this.props.label && this.props.label !== ' ');
    },

    isInvalid() {
        return this.props.invalid;
    },

    renderRequiredSymbol() {
        let requiredSymbol = null;

        if (this.props.required && this.hasLabel()) {
            let requiredSymbolClasses = 'required-symbol';
            requiredSymbolClasses += (this.isInvalid() ? ' invalid' : '');
            requiredSymbol = <span className={requiredSymbolClasses}>{this.props.requiredSymbol}</span>;
        }

        return requiredSymbol;
    },

    setGeneralClasses() {
        let classes = "checkbox editor";
        classes += (this.hasLabel() ? ' hasLabel' : '');
        return classes;
    },

    setCheckBoxClasses() {
        let checkBoxClasses = '';
        checkBoxClasses += (this.isInvalid() ? 'invalid ' : '');
        checkBoxClasses += (this.props.required ? 'required' : '');
        return checkBoxClasses;
    },

    renderLabel() {
        let labelText = (this.hasLabel() ? this.props.label : ' ');

        return (
            <label className="label">
                {labelText}
            </label>
        );
    },

    render() {
        // If a checkbox is readonly, return the renderer instead
        // Need to return a renderer if value is true and checkbox is disabled
        // because could not get the checkmark to be in the correct place
        if (this.props.readOnly || (this.props.isDisabled && this.props.value)) {
            return <CheckBoxFieldValueRenderer {...this.props} />;
        }

        return (
            <div className={this.setGeneralClasses()} tabIndex={this.props.tabIndex} onKeyDown={this.onKeyDown} onClick={this.onChange} onBlur={this.onBlur}>
                <input className={this.setCheckBoxClasses()}
                       checked={this.props.value}
                       ref="fieldInput"
                       type="checkbox"
                       onChange={this.onChange}
                       tabIndex="-1" />
                {this.renderLabel()}
                {this.renderRequiredSymbol()}
            </div>
        );
    }
});

export default CheckBoxFieldValueEditor;
