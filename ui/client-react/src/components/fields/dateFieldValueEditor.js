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
        this.props.onChange(newValue);
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
        let classes = 'cellEdit dateTimeField dateCell';
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
                        onBlur={this.props.onBlur}
                        onChange={this.onChange}
                        mode="date"
                        defaultText={defaultText}/>
        </div>;
    }

});

export default DateFieldValueEditor;
