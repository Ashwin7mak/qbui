import React from 'react';
import ReactDOM from 'react-dom';

import QBToolTip from '../qbToolTip/qbToolTip';
import QbIcon from '../qbIcon/qbIcon';

import Select from "react-select";
import 'react-select/dist/react-select.css';

import Breakpoints from "../../utils/breakpoints";
import fieldFormats from '../../utils/fieldFormats';
import './fields.scss';

import dateTimeFormatter from '../../../../common/src/formatter/dateTimeFormatter';
import timeFormatter from '../../../../common/src/formatter/timeOfDayFormatter';
import '../node/datetimePicker/css/bootstrap-datetimepicker.css';
import './dateTimePicker.scss';

import moment from 'moment';
import momentTz from 'moment-timezone';

import lodash from 'lodash';

const MILITARY_FORMAT_VALUE = 'HH:mm';
const DROPLIST_FORMAT_VALUE = MILITARY_FORMAT_VALUE;
const DROPLIST_FORMAT_LABEL = 'hh:mm a';
const DROPLIST_FORMAT_LABEL_MILITARY = 'HH:mm';

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
            map.push({value: time.format(DROPLIST_FORMAT_VALUE), label: time.format(DROPLIST_FORMAT_LABEL_MILITARY)});
        } else {
            map.push({value:time.format(DROPLIST_FORMAT_VALUE), label:time.format(DROPLIST_FORMAT_LABEL)});
        }
        time.add(increment, 'm');
    }
    return map;
}

/**
 * Insert a time into the drop list in sorted position.
 *
 * @param dropList - the list
 * @param obj - obj to insert into the list
 */
function insertTimeIntoList(dropList, time, militaryTime) {

    let obj = {
        value: time.format(DROPLIST_FORMAT_VALUE),
        label: time.format(militaryTime ? DROPLIST_FORMAT_LABEL_MILITARY : DROPLIST_FORMAT_LABEL)
    };

    //  Is the time in the list
    let el = dropList.find(function(e) {
        return e.value === obj.value;
    });

    //  insert if not already in list
    if (el === undefined) {
        //  find the index to insert the time
        let idx = lodash.sortedIndexBy(dropList, obj,
            function(o) {
                return o.value;
            }
        );
        //  insert the obj at the specified index
        dropList.splice(idx, 0, obj);
    }
}

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
         *  the raw date value in ISO format */
        value: React.PropTypes.string,

        /**
         *  field attributes */
        attributes: React.PropTypes.object,

        /**
         *  field type - could be Time or DateTime */
        type: React.PropTypes.number,

        /**
         *  renders with red border if true */
        isInvalid: React.PropTypes.bool,

        /**
         *  message to display in the tool tip when isInvalid */
        invalidMessage: React.PropTypes.string,

        /**
         *  optional additional classes for the input to customize styling */
        classes: React.PropTypes.string,

        /**
         *  listen for changes by setting a callback to the onChange prop.  */
        onChange: React.PropTypes.func,

        /**
         *  listen for losing focus by setting a callback to the onBlur prop. */
        onBlur: React.PropTypes.func,

        idKey: React.PropTypes.any

    },

    contextTypes: {
        touch: React.PropTypes.bool
    },

    getDefaultProps() {
        return {
            isInvalid: false
        };
    },

    /**
     * Passes the new time value up to onChange callbacks.
     * @param {Object} newValue:
     *     {
     *          value: <String || null> The new time as a string. Expects `null` for a falsy value.
     *     }
     */
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

    /**
     * Called via an <input> node.
     * @param {Event} event the change event
     */
    onInputChange(event) {
        this.onChange({value: event.target.value || null});
    },

    onBlur(event) {
        var newValue = event.target === null ? event : event.target.value;

        if (this.props.onBlur || this.props.onDateTimeBlur) {
            if (newValue === null || newValue) {
                //  convert the entered time to military format
                let militaryTime = null;
                if (newValue) {
                    //  convert to military time
                    let formats = ['h:mm:ss a', 'h:mm:ss', 'h:mm a', 'h:mm'];
                    for (let idx = 0; idx < formats.length; idx++) {
                        if (moment(newValue, formats[idx]).isValid()) {
                            militaryTime = moment(newValue, formats[idx]).format('H:mm:ss');
                            break;
                        }
                    }
                }

                //  null means the time was cleared by the user.
                if (newValue === null || militaryTime) {
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

    /**
     * Converts `this.props.value` and returns a MomentJS instance.
     * @return {Moment}
     */
    formatTime() {
        let momentTime = null;
        if (this.props.value) {
            let inputValue = this.props.value.replace(/(\[.*?\])/, '');
            let timeFormat = null;

            if (this.props.type === fieldFormats.TIME_FORMAT) {
                //  use the TimeFormatter to get the time format
                timeFormat = timeFormatter.generateFormatterString(this.props.attributes);

                //  It's a time only field...just use today's date to format the time
                momentTime = moment(inputValue, timeFormat);
            } else {
                //  it's a date time object; use the dateTimeFormatter to get the time format
                timeFormat = dateTimeFormatter.getTimeFormat({showTime:true});

                //  Quickbase renders times based on the app setting, which may differ from the user's
                //  time zone.  Because MomentJs renders date/times in the user's timezone, which may
                //  not match the Quickbase setting, we must use the Quickbase setting to explicitly set
                //  the time based on the Quickbase time zone.
                let timeZone = dateTimeFormatter.getTimeZone(this.props.attributes);

                //  Firefox parser is more strict than others when parsing; so specify the
                //  format of the input value if the moment parser can't parse the input value.
                momentTime = moment(inputValue).isValid() ? momentTz.tz(inputValue, timeZone) : momentTz.tz(inputValue, "MM-DD-YYYY " + timeFormat, timeZone);
            }
        }
        return momentTime;
    },

    /**
     * Formats `this.props.value` in the expected format to be displayed in the Select/input node.
     * @return {string}
     */
    getDisplayTime() {
        let timeFormat = null;
        if (this.props.value) {
            if (this.props.type === fieldFormats.TIME_FORMAT) {
                //  use the TimeFormatter to get the time format
                timeFormat = timeFormatter.generateFormatterString(this.props.attributes);
            } else {
                //  it's a date time object; use the dateTimeFormatter to get the time format
                timeFormat = dateTimeFormatter.getTimeFormat({showTime:true});
            }
        }
        //  convert the moment time into militaryTime
        let momentTime = this.formatTime();
        return momentTime && momentTime.format(timeFormat);
    },

    /**
     * Formats `this.props.value` to the expected format used in the Select dropdown.
     * @return {string}
     */
    getMilitaryTime() {
        let momentTime = this.formatTime();
        return momentTime && momentTime.format(MILITARY_FORMAT_VALUE);
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
        let dropListTime = this.getMilitaryTime();
        let isSelected = dropListTime === option.value;
        return (
            <div>
                {isSelected && <QbIcon className="choiceQBIcon" icon="check-reversed"/>}
                <div>{option.label}</div>
            </div>);
    },

    render() {
        //  display native input only for smallbreakpoint touch devices
        let useNativeInput = (Breakpoints.isSmallBreakpoint() && this.context.touch);
        let classes = ['cellEdit', 'timeCell', 'borderOnError'];

        //  error state css class
        if (this.props.isInvalid) {
            classes.push('error');
        }
        if (this.props.classes) {
            classes.push(this.props.classes);
        }

        //  build the droplist based on how the time element is displayed
        let showAsMilitaryTime = this.props.attributes && this.props.attributes.use24HourClock;
        let timeDropList = getTimesInMinutes(30, showAsMilitaryTime);

        let theTime = this.getDisplayTime();
        let dropListTime = this.getMilitaryTime();

        if (this.props.value) {
            //  if the time is not in the droplist, add it
            let momentTime = this.formatTime();
            insertTimeIntoList(timeDropList, momentTime, showAsMilitaryTime);
        }

        let placeholder = theTime;
        if (!theTime) {
            classes.push('ghost-text');
            placeholder = this.props.attributes && this.props.attributes.scale ? this.props.attributes.scale.toLowerCase() : 'hh:mm';
        }

        return (useNativeInput ?
                <div className={classes.concat('nativeInput').join(' ')}>
                    <input type="time"
                        name="time-select"
                        onChange={this.onInputChange}
                        onBlur={this.onBlur}
                        value={this.getMilitaryTime() || ''}
                    />
                </div> :
                <div className={classes.join(' ')}>
                    <Select
                        name="time-select"
                        onBlur={this.onBlur}
                        onChange={this.onChange}
                        value={dropListTime || ''}
                        options={timeDropList}
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
