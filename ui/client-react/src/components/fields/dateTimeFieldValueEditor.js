import React from 'react';
import ReactDOM from 'react-dom';
import './fields.scss';
import DateFieldValueEditor from './dateFieldValueEditor';
import TimeFieldValueEditor from './timeFieldValueEditor';
import dateTimeFormatter from '../../../../common/src/formatter/dateTimeFormatter';
import timeFormatter from '../../../../common/src/formatter/timeOfDayFormatter';
import moment from 'moment';
import momentTz from 'moment-timezone';

/**
 * # DateTimeFieldValueEditor
 *
 * An editable rendering of a date time field. The component may be supplied a value.
 * Used within a FieldValueEditor.
 *
 */
const DATE_FORMAT = 'MM-DD-YYYY';
const TIME_FORMAT = 'HH:mm:ss';
const DATE_TIME_FORMAT = DATE_FORMAT + ' ' + TIME_FORMAT;

const DateTimeFieldValueEditor = React.createClass({
    displayName: 'DateTimeFieldValueEditor',

    propTypes: {
        /**
         * the value to fill in the date component */
        value: React.PropTypes.string,

        /* the display value to fill in the date component */
        display: React.PropTypes.string,

        /* field attributes */
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

    /**
     * Return the original date and time supplied as a property to this component
     *
     * @returns {string}
     */
    getOrigValue() {
        return this.props.value ? this.props.value.replace(/(\[.*?\])/, '') : '';
    },

    /**
     * Get the original value supplied as a property to this component and extract out the time.  If there is
     * no time, then midnight is used.
     *
     * @returns {string}
     */
    getOrigTime() {
        let origValue = this.getOrigValue();
        if (origValue && moment(origValue).isValid()) {
            return moment(origValue).format(TIME_FORMAT);
        } else {
            let timeZone = dateTimeFormatter.getTimeZone(this.props.attributes);
            let today = moment().startOf('day').format(DATE_TIME_FORMAT);

            //  get midnight in app timezone
            let midnight = momentTz.tz(today, DATE_TIME_FORMAT, timeZone);

            //  get the utc time and return the time in the user's timezone
            let utc = midnight.utc().format();
            return moment(utc).format(TIME_FORMAT);
        }
    },

    /**
     * Get the original value supplied as a property to this component and extract out the date.  If there is no
     * original date, then the current date is used.  The date is formatted as MM-DD-YYYY
     *
     * @returns {string}
     */
    getOrigDate() {
        let origValue = this.getOrigValue();
        return origValue && moment(origValue).isValid() ? moment(origValue).format(DATE_FORMAT) : moment().format(DATE_FORMAT);
    },

    onDateChange(value) {
        if (this.props.onChange) {
            if (value === null || value) {
                let isoFormat = null;
                if (value !== null) {
                    //  have a new date; append the original time and return in UTC time.
                    let newDateTime = value + ' ' + this.getOrigTime();
                    isoFormat = moment(newDateTime).toISOString();
                }
                this.props.onChange(isoFormat);
            }
        }
    },

    onTimeChange(value) {
        if (this.props.onChange) {
            if (value === null || value) {
                let isoFormat = null;
                if (value !== null) {
                    //  get the original date and append the new time(time was entered based on app timezone); return in utc time.
                    let newDateTime = this.getOrigDate() + ' ' + value;
                    let m = momentTz.tz(newDateTime, DATE_TIME_FORMAT, dateTimeFormatter.getTimeZone(this.props.attributes));
                    isoFormat = m.utc().format();
                }
                this.props.onChange(isoFormat);
            }
        }
    },

    onDateBlur(value) {
        if (this.props.onBlur) {
            if (value === null || value) {
                let isoFormat = null;
                if (value !== null) {
                    //  have a new date; append the original time and return in UTC time.
                    let newDateTime = value + ' ' + this.getOrigTime();
                    isoFormat = moment(newDateTime).toISOString();
                }

                let valueObject = {
                    value: isoFormat,
                    display: ''
                };

                valueObject.display = dateTimeFormatter.format(valueObject, this.props.attributes);
                this.props.onBlur(valueObject);
            }
        }
    },

    onTimeBlur(value) {

        if (this.props.onBlur) {
            if (value === null || value) {
                let isoFormat = null;
                if (value !== null) {
                    //  get the original date and append the new time(time was entered based on app timezone); return in utc time.
                    let newDateTime = this.getOrigDate() + ' ' + value;
                    let m = momentTz.tz(newDateTime, DATE_TIME_FORMAT, dateTimeFormatter.getTimeZone(this.props.attributes));
                    isoFormat = m.utc().format();
                }
                let valueObject = {
                    value: isoFormat,
                    display: ''
                };

                valueObject.display = timeFormatter.format(valueObject, this.props.attributes);
                this.props.onBlur(valueObject);
            }
        }
    },

    render() {
        let showTimeEditor = true;
        let dateTimeClass = 'dateTimeField';

        if (this.props.attributes && this.props.attributes.showTime === false) {
            showTimeEditor = false;
            dateTimeClass = '';
        }

        return <div>
            <DateFieldValueEditor onDateTimeChange={this.onDateChange} onDateTimeBlur={this.onDateBlur} classes={dateTimeClass} {...this.props}/>
            {showTimeEditor ?
                <TimeFieldValueEditor onDateTimeChange={this.onTimeChange} onDateTimeBlur={this.onTimeBlur} classes={dateTimeClass} {...this.props}/> : null}
        </div>;
    }

});

export default DateTimeFieldValueEditor;
