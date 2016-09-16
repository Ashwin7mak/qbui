import React from 'react';
import ReactDOM from 'react-dom';
import './fields.scss';
import DateFieldValueEditor from './dateFieldValueEditor';
import TimeFieldValueEditor from './timeFieldValueEditor';
import dateTimeFormatter from '../../../../common/src/formatter/dateTimeFormatter';
import timeFormatter from '../../../../common/src/formatter/timeOfDayFormatter';
import moment from 'moment';

/**
 * # DateTimeFieldValueEditor
 *
 * An editable rendering of a date time field. The component can be supplied a value or not. Used within a FieldValueEditor
 *
 */

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

    onDateChange(value) {
        if (this.props.onChange) {
            if (value === null || value) {
                let isoFormat = null;
                if (value !== null) {
                    //  extract the time component from the original
                    let origValue = this.props.value ? this.props.value.replace(/(\[.*?\])/, '') : '';

                    //  if no time, then set to midnight
                    let theOrigTime = origValue && moment(origValue).isValid ? moment(origValue).format(" HH:mm:ss") : ' 00:00:00';
                    isoFormat = moment(value + theOrigTime).toISOString();
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
                    //  extract the date component from the original
                    let origValue = this.props.value ? this.props.value.replace(/(\[.*?\])/, '') : '';

                    //  if no original date, then set to now
                    let dateFormat = "MM-DD-YYYY ";
                    let theOrigDate = origValue && moment(origValue).isValid ? moment(origValue).format(dateFormat) : moment().format(dateFormat);

                    //  need to convert to ISO_DATE_TIME supported format
                    isoFormat = moment(theOrigDate + value).toISOString();
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
                    let origValue = this.props.value ? this.props.value.replace(/(\[.*?\])/, '') : '';

                    //  if no time, then set to midnight
                    let theOrigTime = origValue && moment(origValue).isValid ? moment(origValue).format(" HH:mm:ss") : ' 00:00:00';
                    isoFormat = moment(value + theOrigTime).toISOString();
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
                    let origValue = this.props.value ? this.props.value.replace(/(\[.*?\])/, '') : '';

                    //  if no original date, then set to now
                    let dateFormat = "MM-DD-YYYY ";
                    let theOrigDate = origValue && moment(origValue).isValid ? moment(origValue).format(dateFormat) : moment().format(dateFormat);
                    isoFormat = moment(theOrigDate + value).toISOString();
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
