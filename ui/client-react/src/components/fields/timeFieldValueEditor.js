import React from 'react';
import ReactDOM from 'react-dom';
import './fields.scss';
import QBToolTip from '../qbToolTip/qbToolTip';
import DatePicker from 'react-bootstrap-datetimepicker';
import moment from 'moment';
import {MenuItem, DropdownButton} from 'react-bootstrap';
/**
 * # TimeFieldValueEditor
 *
 * An editable rendering of a time field. The component can be supplied a value or not. Used within a FieldValueEditor
 *
 */

const TimeFieldValueEditor = React.createClass({
    displayName: 'TimeFieldValueEditor',

    propTypes: {
        /**
         * the raw date value in ISO format */
        value: React.PropTypes.string,

        /* the display time value */
        display: React.PropTypes.string,

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

    /**
     * Return a map of times for a day by minute, starting at midnight and incrementing per
     * increment input parameter until the end of the day.
     *
     * @returns {Array}
     */
    getTimes(increment) {
        let map = [];
        let time = moment().startOf('day');     // set to midnight
        let endOfDay = moment().endOf('day');

        //  Loop until we are on the next day
        while (time.isBefore(endOfDay)) {
            map.push({key:time.format("HH:mm"), display:time.format("hh:mm a")});
            time.add(increment, 'm');
        }
        return map;
    },

    render() {
        let classes = 'cellEdit dateTimeField timeCell';
        let singlePicker = true;

        // error state css class
        if (this.props.isInvalid) {
            classes += ' error';
        }
        if (this.props.classes) {
            classes += ' ' + this.props.classes;
        }

        //const defaultFormat = "HH:mm:ss";
        //const displayFormat = "hh:mm a";
        //const theTime = this.props.value ? moment(this.props.value.replace(/(\[.*?\])/, ''), defaultFormat).format(displayFormat) : moment().format(displayFormat);

        //<DropdownButton bsSize="small" title={theTime} key={this.props.key} id="dropdown-size-small">
        //    {this.getTimes(30).map(function(time, index) {
        //        return <MenuItem title={time.key}>{time.display}</MenuItem>;
        //    })}
        //</DropdownButton>
        //<div className="input-group date">
        //    <input type="text" className="form-control"/>
        //</div>

        let inputValue = this.props.value ? this.props.value.replace(/(\[.*?\])/, '') : '00:00:00';
        let timeOnlyFormat = 'HH:mm:ss';
        let pickerFormat = 'YYYY-MM-DD hh:mm a';
        let pickerDateTime = '';
        if (moment(inputValue, timeOnlyFormat, true).isValid()) {
            let today = moment().format("YYYY-MM-DD ") + inputValue;   // get today's date and append the time
            pickerDateTime = moment(today).format(pickerFormat);
        } else {
            pickerDateTime = inputValue ? moment(inputValue).format(pickerFormat) : moment().format(pickerFormat);
        }

        return <div className={classes}>
            <DatePicker dateTime={pickerDateTime}
                        format={pickerFormat}
                        inputFormat="hh:mm a"
                        onBlur={this.props.onBlur}
                        onChange={this.onChange}
                        mode="time"/>
        </div>;
    }

});

export default TimeFieldValueEditor;
