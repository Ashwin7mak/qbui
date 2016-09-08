import React from 'react';
import ReactDOM from 'react-dom';
import './fields.scss';
import QBToolTip from '../qbToolTip/qbToolTip';
import {MenuItem, DropdownButton} from 'react-bootstrap';
import ReactSelect from "react-select";
import 'react-select/dist/react-select.css';
import dateTimeFormatter from '../../../../common/src/formatter/dateTimeFormatter';
import moment from 'moment';

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
    getTimes(increment, attributes) {
        let map = [];
        let time = moment().startOf('day');     // set to midnight
        let endOfDay = moment().endOf('day');
        let format = dateTimeFormatter.getTimeFormat(attributes);

        //  Loop until we are on the next day
        while (time.isBefore(endOfDay)) {
            map.push({value:time.format("HH:mm"), label:time.format(format)});
            time.add(increment, 'm');
        }
        return map;
    },

    render() {
        let classes = 'cellEdit dateTimeField timeCell';

        // error state css class
        if (this.props.isInvalid) {
            classes += ' error';
        }
        if (this.props.classes) {
            classes += ' ' + this.props.classes;
        }

        let theTime = '';

        let inputValue = this.props.value ? this.props.value.replace(/(\[.*?\])/, '') : '';
        if (inputValue) {
            let timeOnlyFormat = 'HH:mm:ss';
            let format = dateTimeFormatter.getTimeFormat(this.props.attributes);
            if (moment(inputValue, timeOnlyFormat, true).isValid()) {
                let today = moment().format("YYYY-MM-DD ") + inputValue;   // get today's date and append the time
                theTime = moment(today).format(format);
            } else {
                theTime = moment(inputValue).format(format);
            }
        }

        let options = this.getTimes(30, this.props.attributes);

        return <div className={classes}>
            <ReactSelect
                name="time-select"
                onBlur={this.props.onBlur}
                onChange={this.onChange}
                value={theTime}
                options={options}
                placeholder={theTime ? theTime : 'hh:mm'}
                clearable={false}
            />
        </div>;
    }

});

export default TimeFieldValueEditor;
