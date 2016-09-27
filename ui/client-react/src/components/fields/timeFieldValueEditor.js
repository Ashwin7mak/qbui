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
import momentTz from 'moment-timezone';

/**
 * Return a map of times, in minutes, starting at midnight and adding
 * 'increment' minutes until the end of the day.
 *
 * @returns {Array}
 */
function getTimesInMinutes(increment, militaryTime) {
    let map = [];
    map.push({value:null, label:""});  // add empty entry

    let time = moment().startOf('day');
    let endOfDay = moment().endOf('day');

    //  Loop until we are on the next day
    while (time.isBefore(endOfDay)) {
        if (militaryTime) {
            map.push({value: time.format("HH:mm"), label: time.format("HH:mm")});
        } else {
            map.push({value:time.format("HH:mm"), label:time.format("hh:mm a")});
        }
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
    miliaryTimeDropList: getTimesInMinutes(30, true),

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
        if (newValue && (this.props.onChange || this.props.onDateTimeChange)) {
            //  value of null means the empty option was selected
            if (newValue.value === null || newValue.value) {
                if (this.props.onDateTimeChange) {
                    this.props.onDateTimeChange(newValue.value);
                } else {
                    this.props.onChange(newValue.value);
                }
            }
        }
    },

    onBlur(newValue) {
        if (newValue && (this.props.onBlur || this.props.onDateTimeBlur)) {
            if (newValue.value === null || newValue.value) {
                //  convert the entered time to military format
                let militaryTime = null;
                if (newValue.value) {
                    //  convert to military time
                    let formats = ['h:mm:ss a', 'h:mm:ss', 'h:mm a', 'h:mm'];
                    for (let idx = 0; idx < formats.length; idx++) {
                        if (moment(newValue.value, formats[idx]).isValid()) {
                            militaryTime = moment(newValue.value, formats[idx]).format('H:mm:ss');
                            break;
                        }
                    }
                }

                //  null means the time was cleared by the user.
                if (newValue.value === null || militaryTime) {
                    if (this.props.onDateTimeBlur) {
                        this.props.onDateTimeBlur(militaryTime);
                    } else {
                        let valueObj = {
                            value: militaryTime,
                            display: ''
                        };
                        valueObj.display = timeFormatter.format(valueObj, this.props.attributes);
                        this.props.onBlur(valueObj);
                    }
                }
            }
        }
    },

    renderClockIcon() {
        return (
            <span className="glyphicon glyphicon-time"></span>
        );
    },

    renderOption(option) {
        if (option.value === null) {
            return <div>&nbsp;</div>;
        }
        return (<div>{option.label}</div>);
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

        let theTime = null;
        if (this.props.value) {
            let inputValue = this.props.value.replace(/(\[.*?\])/, '');
            if (this.props.type === fieldFormats.TIME_FORMAT) {
                let timeFormat = timeFormatter.generateFormatterString(this.props.attributes);
                //  It's a time only field...just use today's date to format the time
                theTime = moment(inputValue, timeFormat).format(timeFormat);
            } else {
                let timeFormatForDate = dateTimeFormatter.getTimeFormat({showTime:true});

                //  Quickbase renders times based on the app setting, which may differ from the user's
                //  time zone.  Because MomentJs renders date/times in the user's timezone, which may
                //  not match the Quickbase setting, we must use the Quickbase setting to explicitly set
                //  the time based on the Quickbase time zone.
                let timeZone = dateTimeFormatter.getTimeZone(this.props.attributes);

                //  Firefox parser is more strict than others when parsing; so may need to specify
                //  the format of the input value if the moment parser can't parse the input value.
                let momentTime = moment(inputValue).isValid() ? momentTz.tz(inputValue, timeZone) : momentTz.tz(inputValue, "MM-DD-YYYY " + timeFormatForDate, timeZone);
                theTime = momentTime.format(timeFormatForDate);
            }
        }

        if (!theTime) {
            classes += ' ghost-text';
        }

        let placeholder = theTime;
        let useMilitaryTime = this.props.attributes && this.props.attributes.use24HourClock;
        if (!placeholder) {
            placeholder = this.props.attributes && this.props.attributes.scale ? this.props.attributes.scale.toLowerCase() : 'hh:mm';
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
                        value={theTime ? theTime : ''}
                        options={useMilitaryTime ? this.miliaryTimeDropList : this.timeDropList}
                        optionRenderer={this.renderOption}
                        placeholder={placeholder}
                        clearable={false}
                        arrowRenderer={this.renderClockIcon}
                    />
                </div>
        );
    }

});

export default TimeFieldValueEditor;
