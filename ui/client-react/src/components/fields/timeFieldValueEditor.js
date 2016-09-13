import React from 'react';
import ReactDOM from 'react-dom';

import QBToolTip from '../qbToolTip/qbToolTip';

import Select from "react-select";
import 'react-select/dist/react-select.css';

import Breakpoints from "../../utils/breakpoints";
import fieldFormats from '../../utils/fieldFormats';
import './fields.scss';

import dateTimeFormatter from '../../../../common/src/formatter/dateTimeFormatter';
import timeFormatter from '../../../../common/src/formatter/timeOfDayFormatter';
import moment from 'moment';

/**
 * Return a map of times, in minutes, starting at midnight and adding
 * 'increment' minutes until the end of the day.
 *
 * @returns {Array}
 */
function getTimesInMinutes(increment) {
    let map = [];
    let time = moment().startOf('day');
    let endOfDay = moment().endOf('day');

    //  Loop until we are on the next day
    while (time.isBefore(endOfDay)) {
        map.push({value:time.format("HH:mm"), label:time.format("hh:mm a")});
        time.add(increment, 'm');
    }
    return map;
}

/**
 * # TimeFieldValueEditor
 *
 * An editable rendering of a time field. The component can be supplied a value or not. Used within a FieldValueEditor
 *
 */
const TimeFieldValueEditor = React.createClass({
    displayName: 'TimeFieldValueEditor',
    timeDropList:  getTimesInMinutes(30),

    propTypes: {
        /**
         * the raw date value in ISO format */
        value: React.PropTypes.string,

        /* the display time value */
        display: React.PropTypes.string,

        /* field attributes */
        attributes: React.PropTypes.object,

        /* field type */
        type: React.PropTypes.number,

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
        if (newValue && newValue.value && (this.props.onChange || this.props.onDateTimeChange)) {
            if (this.props.onDateTimeChange) {
                this.props.onDateTimeChange(newValue.value);
            } else {
                this.props.onChange(newValue.value);
            }
        }
    },

    onBlur(ev) {
        if (ev.target && ev.target.value && (this.props.onBlur || this.props.onDateTimeBlur)) {

            //  convert to military time
            let formats = ['h:mm a', 'h:mm', 'h:mma'];
            let militaryTime = 'invalid';
            for (let idx = 0; idx < formats.length; idx++) {
                if (moment(ev.target.value, formats[idx]).isValid()) {
                    militaryTime = moment(ev.target.value, formats[idx]).format('H:mm');
                    break;
                }
            }

            if (this.props.onDateTimeBlur) {
                this.props.onDateTimeBlur(militaryTime);
            } else {
                let vals = {
                    value: militaryTime,
                    display: ''
                };
                vals.display = timeFormatter.format(vals, this.props.attributes);
                this.props.onBlur(vals);
            }
        }
    },

    renderClockIcon() {
        return (
            <span className={glyphicon}></span>
        );
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

        let timeFormat = dateTimeFormatter.getTimeFormat(this.props.attributes);
        let dateTimeFormat = "MM-DD-YYYY " + timeFormat;

        let inputValue = this.props.value ? this.props.value.replace(/(\[.*?\])/, '') : '';
        let theTime = '';
        if (inputValue) {
            if (fieldFormats.TIME_FORMAT === this.props.type) {
                //  It's a time only field...just use today's date to allow us to format the time
                let now = moment().format("MM-DD-YYYY ") + inputValue;
                theTime = moment(now, dateTimeFormat).format(timeFormat);
            } else {
                //  Firefox parser is more strict than others when parsing; so may need to specify
                //  the format of the input value if the moment parser can't parse the input value.
                let momentTime = moment(inputValue).isValid() ? moment(inputValue) : moment(inputValue, dateTimeFormat);
                theTime = momentTime.format(timeFormat);
            }
        }

        if (!theTime) {
            classes += ' ghost-text';
        }

        //  TODO: verify small breakpoint once form edit is implemented
        return (Breakpoints.isSmallBreakpoint() ?
                <div className={classes}>
                    <input type="time"
                        name="time-select"
                        onChange={this.onChange}
                        value={theTime}
                    />
                </div> :
                <div className={classes}>
                    <Select
                        name="time-select"
                        onBlur={this.onBlur}
                        onChange={this.onChange}
                        value={theTime}
                        options={this.timeDropList}
                        placeholder={theTime ? theTime : 'hh:mm'}
                        clearable={false}
                        arrowRenderer={this.renderClockIcon}
                    />
                </div>
        );
    }

});

export default TimeFieldValueEditor;
