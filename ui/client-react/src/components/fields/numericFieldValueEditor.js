import React from 'react';
import './fields.scss';

import clearableInput from '../hoc/clearableInput';
import * as numericFormatter from '../../../../common/src/formatter/numericFormatter';
import * as consts from '../../../../common/src/constants';
import {ERROR_CSS_CLASSES} from '../../constants/componentConstants';

/**
 * # NumericFieldValueEditor
 *
 * An editable rendering of a number field as an input box. The component can be supplied a value or not. Used within a FieldValueEditor
 *
 */

const input = React.createClass({
    render() {
        return (
            <input
                className={this.props.classes}
                value={this.props.display ? this.props.display : this.props.value}
                type="text"
                key={'inp' + this.props.idKey}
                placeholder={this.props.placeholder}
                onChange={this.props.onChange}
                onBlur={this.props.onBlur}
                size={this.props.width}
                tabIndex={this.props.tabIndex}
                disabled={this.props.isDisabled}
            />
        );
    }
});
const ClearableNumericField = clearableInput(input);

const NumericFieldValueEditor = React.createClass({
    displayName: 'NumericFieldValueEditor',

    propTypes: {
        /**
         * the value to fill in the input box */
        value: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string, React.PropTypes.shape({
            numberStr: React.PropTypes.string
        })]), //as of now it should be a number only. if we decide to add currency symbol etc within the box then thats diff

        display: React.PropTypes.string,

        /**
         * A boolean to disabled field on form builder
         */
        isDisabled: React.PropTypes.bool,

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
         * listen for changes by setting a callback to the onChange prop.  */
        onChange: React.PropTypes.func,

        /**
         * listen for losing focus by setting a callback to the onBlur prop. */
        onBlur: React.PropTypes.func,

        /**
         * data type attributes for the field */
        fieldDef: React.PropTypes.object
    },

    getDefaultProps() {
        return {
            invalid: false
        };
    },
    onChange(ev) {
        if (this.props.onChange) {
            this.props.onChange(ev.target.value);
        }
    },
    getFormattedValues(value) {
        // the numericFormatter expects the string in a particular format - no comma as decimal marker, no multiple decimal markers etc
        // the following cleans up the input value before running it through formatter
        let datatypeAttributes = this.props.fieldDef && this.props.fieldDef.datatypeAttributes ? this.props.fieldDef.datatypeAttributes : {};
        let clientSideAttributes = datatypeAttributes.clientSideAttributes ? datatypeAttributes.clientSideAttributes : {};
        let decimalPlaces = datatypeAttributes.decimalPlaces;
        let decimalMark = decimalPlaces && clientSideAttributes.decimal_mark ? clientSideAttributes.decimal_mark : consts.NUMERIC_SEPARATOR.PERIOD;
        let currencySymbol = datatypeAttributes && datatypeAttributes.type === consts.CURRENCY &&  clientSideAttributes.symbol ?  clientSideAttributes.symbol : "";

        let theVals = {value: null, display: null};
        value = value.trim();
        if (value) {
            // user can enter a value with repeated decimal marks. We need to keep the 1st one and remove the rest
            // example 50.9.9 => 50.90 (for 2 decimal place)
            // so strip out everything but numbers and decimal mark, then keep index of 1st decimal and remove other decimals
            let isNegative = (value.indexOf('-') === 0) || (currencySymbol && value.indexOf(currencySymbol) === 0 ? value.indexOf('-') === 1 : false);

            // clean up everything except for numbers and the decimal mark
            if (decimalMark === consts.NUMERIC_SEPARATOR.PERIOD) {
                value = value.replace(/[^0-9.]/g, '');
            } else if (decimalMark === consts.NUMERIC_SEPARATOR.COMMA) {
                value = value.replace(/[^0-9,]/g, '');
            } else {
                value = value.replace(/[^0-9]/g, '');
            }

            // remove all decimal marks and then put back the 1st one
            let decimal_index = value.indexOf(decimalMark);
            value = value.replace(/[^0-9]/g, '');
            value = decimal_index >= 0 ? value.slice(0, decimal_index) + consts.NUMERIC_SEPARATOR.PERIOD + value.slice(decimal_index) : value;

            // convert to number
            theVals.value  = value && value.length ? +value : null;
            // put back the negative sign if needed.
            theVals.value = theVals.value && isNegative ? -theVals.value : theVals.value;
        }
        //if its a percent field the raw value is display value/100
        if (datatypeAttributes.type === consts.PERCENT) {
            theVals.value = theVals.value !== null ? theVals.value / 100 : null;
        }

        // for when value === 0
        if (typeof theVals.value === 'number') {
            theVals.display = numericFormatter.format(theVals, datatypeAttributes);
        } else {
            theVals.display = '';
        }
        return theVals;
    },

    //send up the chain an object with value and formatted display value
    onBlur(ev) {
        let theVals = this.getFormattedValues(ev.target.value);
        if (this.props.onBlur) {
            this.props.onBlur(theVals);
        }
    },

    render() {
        let placeholder = '';
        if (this.props.placeholder) {
            placeholder = this.props.placeholder;
        } else if (_.has(this.props, 'fieldDef.datatypeAttributes.clientSideAttributes.symbol')) {
            placeholder = this.props.fieldDef.datatypeAttributes.clientSideAttributes.symbol;
        }

        let classes = ['input', 'numericField'];
        // error state css class
        if (this.props.invalid) {
            classes = [...classes, ...ERROR_CSS_CLASSES];
        }
        classes.push(this.props.classes || '');

        let width = _.get(this.props, 'fieldDef.datatypeAttributes.clientSideAttributes.width', null);

        let Input = this.props.isDisabled ? input : ClearableNumericField;

        return (
            <Input
                {...this.props}
                onChange={this.onChange}
                onBlur={this.onBlur}
                classes={classes.join(' ')}
                placeholder={placeholder}
                width={width}
                />
        );
    }
});
export default NumericFieldValueEditor;
