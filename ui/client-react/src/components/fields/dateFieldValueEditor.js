import React from 'react';
import ReactDOM from 'react-dom';
import Logger from '../../utils/logger';
import QBToolTip from '../qbToolTip/qbToolTip';

import Breakpoints from "../../utils/breakpoints";
import './fields.scss';

import DatePicker from '../../components/node/datetimePicker/lib/DateTimeField';
import dateTimeFormatter from '../../../../common/src/formatter/dateTimeFormatter';

import '../node/datetimePicker/css/bootstrap-datetimepicker.css';
import './dateTimePicker.scss';

import moment from 'moment';
/**
 * # DateFieldValueEditor
 *
 * An editable rendering of a date field. The component can be supplied a value or not. Used within a FieldValueEditor
 *
 */

//  NOTE: change to the date_input format will require an update in the Date component onKeyPress function for the quickbase 't' shortcut
const DATE_INPUT = 'MM-DD-YYYY';
const DATE_FORMATTED = 'YYYY-MM-DD';

const DateFieldValueEditor = React.createClass({
    displayName: 'DateFieldValueEditor',

    propTypes: {
        /**
         * raw date value */
        value: React.PropTypes.string,

        /**
         * date attributes */
        attributes: React.PropTypes.object,

        /**
         * renders with red border if true */
        invalid: React.PropTypes.bool,

        /**
         * message to display in the tool tip when isInvalid */
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

        idKey: React.PropTypes.any
    },


    contextTypes: {
        touch: React.PropTypes.bool
    },

    getDefaultProps() {
        return {
            isInvalid: false
        };
    },

    /**
     * Must focus on the datePicker input box after selecting a date from the dropdown so
     * that blur is called when the user moves to a new field. This is important for
     * validation checks as validation is typically called onBlur. Without this, validation errors
     * may not be cleared correctly when a user fixes the field and then blurs out.
     * @private
     */
    _focusDateInputField() {
        // Can skip if datePicker is not defined because it is a native input
        if (this.refs.datePicker) {
            var datePickerInput = ReactDOM.findDOMNode(this.refs.datePicker).querySelector('input');
            if (datePickerInput) {
                datePickerInput.focus();
            } else {
                Logger().warn('Could not find input on DateTimeFieldValueEditor. Can not focus. onBlur validation may not be working correctly.');
            }
        }
    },

    onChange(newValue, enteredValue) {
        const onChange = this.props.onDateTimeChange || this.props.onChange;
        if (onChange) {
            if (newValue === null || newValue || enteredValue === '') {
                let formattedDate = null;
                if (moment(newValue, DATE_INPUT).isValid()) {
                    // format newValue passed in from the DatePicker component
                    formattedDate = moment(newValue, DATE_INPUT).format(DATE_FORMATTED);
                } else if (moment(newValue, DATE_FORMATTED).isValid()) {
                    // newValue was passed in via <input>, no need to change
                    formattedDate = newValue;
                }
                // onChange callbacks expect date in YYYY-MM-DD format
                onChange(formattedDate);
                this._focusDateInputField();
            }
        }
    },

    /**
     * Called via an <input> node.
     * @param {Event} event the change event
     */
    onInputChange(event) {
        const newValue = event.target.value || null;
        this.onChange(newValue);
    },

    //send up the chain an object with value and formatted display value
    onBlur(newValue) {
        if (this.props.onBlur || this.props.onDateTimeBlur) {
            if (newValue === null || newValue) {
                let newDate = null;
                if (moment(newValue, DATE_FORMATTED, true).isValid()) {
                    // newValue was passed in via <input>, no need to change
                    newDate = newValue;
                } else if (moment(newValue, DATE_INPUT, true).isValid()) {
                    // format newValue passed in from the DatePicker component
                    newDate = moment(newValue, DATE_INPUT).format(DATE_FORMATTED);
                }

                if (this.props.onDateTimeBlur) {
                    this.props.onDateTimeBlur(newDate);
                } else {
                    let valueObj = {
                        value: newDate,
                        display: ''
                    };
                    valueObj.display = dateTimeFormatter.format(valueObj, this.props.attributes);
                    this.props.onBlur(valueObj);
                }
            }
        }
    },

    /**
     * Called via an <input> node.
     * @param {Event} event the change event
     */
    onInputBlur(event) {
        const newValue = event.target.value || null;
        this.onBlur(newValue);
    },

    render() {
        //  display native input only for smallbreakpoint touch devices
        let useNativeInput = (Breakpoints.isSmallBreakpoint() && this.context.touch) ;
        let classes = ['cellEdit', 'dateCell', 'borderOnError', 'place'];

        // error state css class
        if (this.props.invalid) {
            classes.push('error');
        }
        if (this.props.classes) {
            classes.push(this.props.classes);
        }

        let theDate = undefined;
        if (this.props.value && this.props.value !== null) {
            if (useNativeInput) {
                theDate = moment(this.props.value.replace(/(\[.*?\])/, '')).format(DATE_FORMATTED);
            } else {
                theDate = moment(this.props.value.replace(/(\[.*?\])/, '')).format(DATE_INPUT);
            }
        }

        //  if no date, use the ghost format class for the help placeholder
        if (!theDate) {
            classes.push('ghost-text');
        }

        // display native input only for smallbreakpoint touch devices
        return (useNativeInput ?
            <div className={classes.concat('nativeInput').join(' ')}>
                <input type="date"
                    name="date-picker"
                    onBlur={this.onInputBlur}
                    onChange={this.onInputChange}
                    value={theDate}
                    placeholder={DATE_FORMATTED}/>
            </div> :
            <div className={classes.join(' ')}>
                <DatePicker
                    name="date-picker"
                    ref="datePicker"
                    dateTime={theDate}
                    format={DATE_INPUT}
                    inputFormat={DATE_INPUT}
                    onBlur={this.onBlur}
                    onChange={this.onChange}
                    showToday={true}
                    mode="date"
                    defaultText={theDate ? theDate : DATE_INPUT.toLowerCase()}/>
            </div>
        );
    }

});

export default DateFieldValueEditor;
