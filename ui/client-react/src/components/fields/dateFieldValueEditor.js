import React from 'react';
import ReactDOM from 'react-dom';

import QBToolTip from '../qbToolTip/qbToolTip';

import Breakpoints from "../../utils/breakpoints";
import './fields.scss';

import DatePicker from 'react-bootstrap-datetimepicker';
import dateTimeFormatter from '../../../../common/src/formatter/dateTimeFormatter';
import moment from 'moment';

/**
 * # DateFieldValueEditor
 *
 * An editable rendering of a date field. The component can be supplied a value or not. Used within a FieldValueEditor
 *
 */

const DateFieldValueEditor = React.createClass({
    displayName: 'DateFieldValueEditor',

    propTypes: {
        /**
         * the raw date value in ISO format */
        value: React.PropTypes.string,

        /* the display date value */
        display: React.PropTypes.string,

        /* date attributes */
        attributes: React.PropTypes.object,

        /**
         * renders with red border if true */
        isInvalid: React.PropTypes.bool,

        /**
         * message to display in the tool tip when isInvalid */
        invalidMessage: React.PropTypes.string,

        /**
         * optional additional classes for the input to customize styling */
        classes: React.PropTypes.string,

        onChange: React.PropTypes.func,
        onBlur: React.PropTypes.func,

        idKey: React.PropTypes.any
    },

    getDefaultProps() {
        return {
            isInvalid: false
        };
    },

    onChange(newValue) {
        if (newValue && (this.props.onChange || this.props.onDateTimeChange)) {
            //  if the date is value, propagate the event
            if (moment(newValue, 'MM-DD-YYYY').isValid()) {
                if (this.props.onDateTimeChange) {
                    this.props.onDateTimeChange(newValue);
                } else {
                    this.props.onChange(newValue);
                }
            }
        }
    },

    //send up the chain an object with value and formatted display value
    onBlur(ev) {
        if (ev.target && ev.target.value && (this.props.onBlur || this.props.onDateTimeBlur)) {
            if (this.props.onDateTimeBlur) {
                this.props.onDateTimeBlur(ev.target.value);
            } else {
                let vals = {
                    value: ev.target.value,
                    display: ''
                };

                vals.display = dateTimeFormatter.format(vals, this.props.attributes);
                this.props.onBlur(vals);
            }
        }
    },

    getDateFormat() {
        let formatter = 'MM-DD-YYYY';   //default
        if (this.props.attributes && this.props.attributes.dateFormat) {
            let formatters = dateTimeFormatter.getJavaToJavaScriptDateFormats();
            formatter = formatters[this.props.attributes.dateFormat];
        }
        return formatter;
    },

    render() {
        let classes = 'cellEdit dateCell';
        let singlePicker = true;

        // error state css class
        if (this.props.isInvalid) {
            classes += ' error';
        }
        if (this.props.classes) {
            classes += ' ' + this.props.classes;
        }

        let format = dateTimeFormatter.getDateFormat(this.props.attributes);

        const theDate = this.props.value ? moment(this.props.value.replace(/(\[.*?\])/, '')).format(format) : '';

        //  if no date, then use the format as help placeholder
        const defaultText = theDate ? theDate : format.toLowerCase();

        //  TODO: verify small breakpoint once form edit is implemented
        return (Breakpoints.isSmallBreakpoint() ?
            <div className={classes}>
                <input type="date"
                    name="date-picker"
                    //onBlur={this.onBlur}
                    onChange={this.onChange}/>
            </div> :
            <div className={classes}>
                <DatePicker
                    name="date-picker"
                    dateTime={theDate}
                    format={'MM-DD-YYYY'}
                    inputFormat={theDate ? format : ''}
                    onBlur={this.onBlur}
                    onChange={this.onChange}
                    mode="date"
                    defaultText={defaultText}/>
            </div>
        );
    }

});

export default DateFieldValueEditor;
