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
        if (this.props.onChange && value) {
            //  extract the time component from the original
            let origValue = this.props.value ? this.props.value.replace(/(\[.*?\])/, '') : '';

            //  if no time, then set to midnight
            let theOrigTime = origValue ? moment(origValue).format(" HH:mm:ss") : '00:00:00';

            //  TODO: not sure if should be returned in ISO format
            //let newDate = moment(value + theOrigTime).toISOString();
            let newDate = value + theOrigTime;

            this.props.onChange(newDate);
        }
    },

    onTimeChange(value) {
        if (this.props.onChange && value) {
            //  extract the date component from the original
            let origValue = this.props.value ? this.props.value.replace(/(\[.*?\])/, '') : '';

            //  if no original date, then set to now
            let dateFormat = "MM-DD-YYYY ";
            let theOrigDate = origValue ? moment(origValue).format(dateFormat) : moment().format(dateFormat);

            this.props.onChange(theOrigDate + value);
        }
    },

    onDateBlur(value) {
        if (this.props.onBlur && value) {
            let origValue = this.props.value ? this.props.value.replace(/(\[.*?\])/, '') : '';

            //  if no time, then set to midnight
            let theOrigTime = origValue ? moment(origValue).format(" HH:mm:ss") : '00:00:00';

            let valueObject = {
                value: moment(value + theOrigTime).toISOString(),
                display: ''
            };

            valueObject.display = dateTimeFormatter.format(valueObject, this.props.attributes);
            this.props.onBlur(valueObject);
        }
    },

    onTimeBlur(value) {

        if (this.props.onBlur && value) {
            let origValue = this.props.value ? this.props.value.replace(/(\[.*?\])/, '') : '';

            //  if no original date, then set to now
            let dateFormat = "MM-DD-YYYY ";
            let theOrigDate = origValue ? moment(origValue).format(dateFormat) : moment().format(dateFormat);

            let valueObject = {
                value: moment(theOrigDate + value).toISOString(),
                display: ''
            };

            valueObject.display = timeFormatter.format(valueObject, this.props.attributes);
            this.props.onBlur(valueObject);
        }
    },

    render() {
        return <div>
            <DateFieldValueEditor onDateTimeChange={this.onDateChange} onDateTimeBlur={this.onDateBlur} classes={'dateTimeField'} {...this.props}/>
            <TimeFieldValueEditor onDateTimeChange={this.onTimeChange} onDateTimeBlur={this.onTimeBlur} classes={'dateTimeField'} {...this.props}/>
        </div>;
    }

});

export default DateTimeFieldValueEditor;
