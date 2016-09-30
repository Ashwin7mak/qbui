import React from 'react';
import ReactDOM from 'react-dom';

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
        isInvalid: React.PropTypes.bool,

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

    getDefaultProps() {
        return {
            isInvalid: false
        };
    },

    onChange(newValue) {
        if (this.props.onChange || this.props.onDateTimeChange) {
            if (newValue === null || newValue) {
                let formattedDate = null;
                if (newValue !== null && moment(newValue, DATE_INPUT).isValid()) {
                    formattedDate = moment(newValue, DATE_INPUT).format(DATE_FORMATTED);
                }

                if (this.props.onDateTimeChange) {
                    this.props.onDateTimeChange(formattedDate);
                } else {
                    this.props.onChange(formattedDate);
                }
            }
        }
    },

    //send up the chain an object with value and formatted display value
    onBlur(newValue) {
        if (this.props.onBlur || this.props.onDateTimeBlur) {
            if (newValue === null || newValue) {
                if (this.props.onDateTimeBlur) {
                    this.props.onDateTimeBlur(newValue);
                } else {
                    let newDate = null;
                    if (newValue) {
                        newDate = moment(newValue, DATE_INPUT).format(DATE_FORMATTED);
                    }

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

    render() {
        let classes = 'cellEdit dateCell';

        // error state css class
        if (this.props.isInvalid) {
            classes += ' error';
        }
        if (this.props.classes) {
            classes += ' ' + this.props.classes;
        }

        let theDate = null;
        if (this.props.value !== null) {
            theDate = this.props.value ? moment(this.props.value.replace(/(\[.*?\])/, '')).format(DATE_INPUT) : '';
        }

        //  if no date, use the ghost format class for the help placeholder
        if (!theDate) {
            classes += ' ghost-text';
        }

        //  TODO: verify small breakpoint once form edit is implemented
        return (Breakpoints.isSmallBreakpoint() ?
            <div className={classes}>
                <input type="date"
                    name="date-picker"
                    onBlur={this.onBlur}
                    onChange={this.onChange}/>
            </div> :
            <div className={classes}>
                <DatePicker
                    name="date-picker"
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
