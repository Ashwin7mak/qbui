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
        if (newValue && (this.props.onChange || this.props.onDateTimeChange)) {
            // TODO: deal with QB implied dates like Jan 2004 == Jan 1 2004
            let formats = ['M-D-YYYY', 'M-DD-YYYY', 'MM-D-YYYY', 'M-DD-YYYY', 'MM-DD-YYYY',
                           'YYYY-M-D', 'YYYY-M-DD', 'YYYY-MM-D', 'YYYY-M-DD', 'YYYY-MM-DD',
                           'MMM D YYYY', 'MMM DD YYYY', 'MMM DD, YYYY', 'MMM D, YYYY'];
            let newDate = '';
            for (let idx = 0; idx < formats.length; idx++) {
                if (moment(newValue, formats[idx]).isValid()) {
                    newDate = moment(newValue, formats[idx]);
                    break;
                }
            }

            // if not a valid date, user is manually inputting
            if (newDate) {
                if (this.props.onDateTimeChange) {
                    this.props.onDateTimeChange(newDate);
                } else {
                    this.props.onChange(newDate);
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
        const defaultText = theDate ? theDate : format;

        return <div className={classes}>
            <DatePicker dateTime={theDate}
                        format={format}
                        inputFormat={format}
                        //onBlur={this.onBlur}
                        onChange={this.onChange}
                        mode="date"
                        defaultText={defaultText}/>
        </div>;
    }

});

export default DateFieldValueEditor;
