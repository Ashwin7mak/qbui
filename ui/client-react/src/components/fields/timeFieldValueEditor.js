import React from 'react';
import ReactDOM from 'react-dom';
import './fields.scss';
import QBToolTip from '../qbToolTip/qbToolTip';
import {MenuItem, DropdownButton} from 'react-bootstrap';
import Select from "react-select";
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
        //  extract the date from the original value
        let origValue = this.props.value ? this.props.value.replace(/(\[.*?\])/, '') : '';

        //  extract the date component from the original; otherwise use today's date
        let theDate = moment(origValue, "YYYY-MM-DD").isValid() ? moment(origValue) : moment();

        this.props.onChange(theDate.format("YYYY-MM-DD ") + newValue.value);
    },

    //send up the chain an object with value and formatted display value
    onBlur(ev) {
        //TODO onInputChange instead ??
        let theVals = this.getFormattedValues(ev.target.value);
        if (this.props.onBlur) {
            this.props.onBlur(theVals);
        }
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
        let classes = 'cellEdit timeCell';

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
            <Select
                name="time-select"
                //onBlur={this.onBlur}
                onChange={this.onChange}
                //onInputChange={this.onInputChange}
                value={theTime}
                options={options}
                placeholder={theTime ? theTime : 'hh:mm'}
                clearable={false}
            />
        </div>;
    }

});

export default TimeFieldValueEditor;
