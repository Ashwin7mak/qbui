import React from 'react';
import ReactDOM from 'react-dom';
import './fields.scss';
import QBToolTip from '../qbToolTip/qbToolTip';
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
        //  extract the time from the original value
        let origValue = this.props.value ? this.props.value.replace(/(\[.*?\])/, '') : '';

        //  extract the time component from the original; otherwise use midnight
        let theDate = moment(origValue, "HH:mm:ss").isValid() ? moment(origValue) : moment().set({h:0, m:0, s:0, ms:0});

        this.props.onChange(newValue + theDate.format(" HH:mm:ss"));
    },

    //send up the chain an object with value and formatted display value
    onBlur(ev) {
        let theVals = this.getFormattedValues(ev.target.value);
        if (this.props.onBlur) {
            this.props.onBlur(theVals);
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

    getFormattedValues(newValue) {
        let theVals = {
            value: newValue
        };
        switch (this.props.type) {
        case FieldFormats.DATE_FORMAT:
            {
                // normalized form is YYYY-MM-DD
                theVals.display = dateTimeFormatter.format(theVals, this.props.colDef.datatypeAttributes);
                break;
            }
        case FieldFormats.TIME_FORMAT:
            {
                // normalized form is 1970-01-01THH:MM:SSZ
                theVals.display = timeOfDayFormatter.format(theVals, this.props.colDef.datatypeAttributes);
                break;
            }
        case FieldFormats.DATETIME_FORMAT:
            {
                // normalized form is YYYY-MM-DDTHH:MM:SSZ
                theVals.display = dateTimeFormatter.format(theVals, this.props.colDef.datatypeAttributes);
                break;
            }
        default:
            {
                theVals.display = newValue;
                break;
            }
        }
        return theVals;
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
        const defaultText = theDate ? theDate : format;

        return <div className={classes}>
            <DatePicker dateTime={theDate}
                        format={format}
                        inputFormat={format}
                        onBlur={this.onBlur}
                        onChange={this.onChange}
                        mode="date"
                        defaultText={defaultText}/>
        </div>;
    }

});

export default DateFieldValueEditor;
