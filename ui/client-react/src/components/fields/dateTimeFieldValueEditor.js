import React from 'react';
import ReactDOM from 'react-dom';
import './fields.scss';
import QBToolTip from '../qbToolTip/qbToolTip';
import DatePicker from 'react-bootstrap-datetimepicker';
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

    render() {
        let classes = 'cellEdit dateTimeField';
        let singlePicker = true;

        // error state css class
        if (this.props.isInvalid) {
            classes += ' error';
        }
        if (this.props.classes) {
            classes += ' ' + this.props.classes;
        }

        const format = "YYYY-MM-DD";
        const fixedDate = this.props.value ? this.props.value.replace(/(\[.*?\])/, '') : moment().format(format);
        return <div className={classes}>
            <DatePicker dateTime={fixedDate}
                        format={format}
                        inputFormat="MM/DD/YYYY"
                        onBlur={this.props.onBlur}
                        onChange={this.onChange}
                        mode="date"/>
        </div>;
    }

});

export default DateTimeFieldValueEditor;
