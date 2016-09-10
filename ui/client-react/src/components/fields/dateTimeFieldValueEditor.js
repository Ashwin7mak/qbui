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
            let theOrigTime = moment(origValue).format(" HH:mm:ss");

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
            let theOrigDate = moment(origValue).format("MM-DD-YYYY ");

            //  TODO: not sure if should be returned in ISO format
            //let newDate = moment(theOrigDate + value).toISOString();
            let newDate = theOrigDate + value;

            this.props.onChange(newDate);
        }
    },

    onDateBlur(value) {
        if (this.props.onBlur && value) {
            let origValue = this.props.value ? this.props.value.replace(/(\[.*?\])/, '') : '';
            let theOrigTime = moment(origValue).format(" HH:mm:ss");
            let isoDate = moment(value + theOrigTime).toISOString();

            let vals = {
                value: isoDate,
                display: ''
            };

            vals.display = dateTimeFormatter.format(vals, this.props.attributes);
            this.props.onBlur(vals);
        }


        //  TODO From timeFieldValueEditor onBlur event
        //let origValue = this.props.value ? this.props.value.replace(/(\[.*?\])/, '') : '';

        //if (fieldFormats.TIME_FORMAT === this.props.type) {
        //    vals.value = ev.target.value;
        //    vals.display = timeFormatter.format(vals, this.props.attributes);
        //} else {
        //    //  extract the date component from the original; otherwise use epoch date
        //    let origDate = moment(origValue).format("YYYY-MM-DD ") + ev.target.value;
        //    let theDate = moment(origDate).format(moment.ISO_8601);
        //
        //    vals.value = theDate;
        //    vals.display = dateTimeFormatter.format(vals, this.props.attributes);
        //}

        //  TODO From dateFieldValueEditor onBlur event
        //let origValue = this.props.value ? this.props.value.replace(/(\[.*?\])/, '') : '';

        //  extract the time component from the original; otherwise use midnight
        //let origMoment = moment(origValue);
        //let newMoment = moment(ev.target.value);

        //let theDate = moment(origValue, "HH:mm:ss").isValid() ? moment(origValue) : moment().set({h: 0, m: 0, s: 0, ms: 0});
        //let newDate = ev.target.value + theDate.format(" HH:mm:ss");


    },

    onTimeBlur(value) {

        if (this.props.onBlur && value) {
            let origValue = this.props.value ? this.props.value.replace(/(\[.*?\])/, '') : '';
            let theOrigDate = moment(origValue).format("MM-DD-YYYY ");

            let isoDate = moment(theOrigDate + value).toISOString();

            let vals = {
                value: isoDate,
                display: ''
            };

            vals.display = timeFormatter.format(vals, this.props.attributes);
            this.props.onBlur(vals);
        }
    },

    render() {
        return <div>
            <DateFieldValueEditor onDateTimeChange={this.onDateChange} onDateTimeBlur={this.onDateBlur} classes={'dateTimeField'} id={this.props.idKey} {...this.props}/>
            <TimeFieldValueEditor onDateTimeChange={this.onTimeChange} onDateTimeBlur={this.onTimeBlur} classes={'dateTimeField'} id={this.props.idKey} {...this.props} />
        </div>;
    }

});

export default DateTimeFieldValueEditor;
