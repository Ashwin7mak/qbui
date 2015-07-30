/*
 Given a raw time of day field value and field meta data from the Java capabilities API, this module is capable of
 display formatting the time of day instance.
 */
(function () {
    'use strict';
    var moment = require('moment-timezone');
    var consts = require('../../constants');
    //Module constants:
    var TWENTY_FOUR_HOUR_CLOCK = 'HH:';
    var TWELVE_HOUR_CLOCK = 'h:';
    var MM = 'mm';
    var SS = ':ss';
    var AM_PM = ' A';

    var JAVA_FORMAT_TO_JS_FORMAT = {
        'HH:MM': MM,
        'HH:MM:SS': MM + SS
    };

    module.exports = {
        generateFormatterString: function(fieldInfo) {
            //Resolve formatting options
            var formatString;
            if(fieldInfo) {
                formatString = JAVA_FORMAT_TO_JS_FORMAT[fieldInfo.scale];
            }
            if (!formatString) {
                formatString = MM;
            }
            //resolve 12 vs. 24 hour clock
            if (fieldInfo.use24HourClock) {
                formatString = TWENTY_FOUR_HOUR_CLOCK + formatString;
            } else {
                formatString = TWELVE_HOUR_CLOCK + formatString + AM_PM;
            }
            return formatString;
        },
        generateFormat: function(fieldInfo) {
            //Resolve formatting options
            var formatString;
            if(fieldInfo) {
                formatString = JAVA_FORMAT_TO_JS_FORMAT[fieldInfo.scale];
            }
            if (!formatString) {
                formatString = MM;
            }
            //resolve 12 vs. 24 hour clock
            if (fieldInfo.use24HourClock) {
                formatString = TWENTY_FOUR_HOUR_CLOCK + formatString;
            } else {
                formatString = TWELVE_HOUR_CLOCK + formatString + AM_PM;
            }
            return formatString;
        },
        //Given a raw number as input, formats as a legacy QuickBase phone number. Note, not internationalized
        format: function (fieldValue, fieldInfo) {
            if (!fieldValue || !fieldValue.value) {
                return '';
            }

            //Declare the date and moment formatter
            var d = new Date(fieldValue.value.replace(/(\[.*?\])/, ''));
            //Resolve whether or not to shift based on timezone
            var timeZone = consts.UTC_TIMEZONE;
            if (fieldInfo.useTimezone) {
                timeZone = fieldInfo.timeZone;
                if (!timeZone) {
                    timeZone = DEFAULT_TIMEZONE;
                }
            }
            var m = moment.tz(d, timeZone);

            //Resolve formatting options
            var formatString = fieldInfo.jsFormat;
            if(!formatString) {
                formatString = this.generateFormatterString(fieldInfo);
            }
            return m.format(formatString);
        }
    };
}());