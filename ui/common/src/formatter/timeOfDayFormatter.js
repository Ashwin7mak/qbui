/*
 Given a raw time of day field value and field meta data from the Java capabilities API, this module is capable of
 display formatting the time of day instance.
 */
(function() {
    'use strict';
    let moment = require('moment');
    let consts = require('../constants');
    //Module constants:
    let TWENTY_FOUR_HOUR_CLOCK = 'HH:';
    let TWELVE_HOUR_CLOCK = 'h:';
    let MM = 'mm';
    let SS = ':ss';
    let AM_PM = ' a';
    let DEFAULT_TIMEZONE = 'America/Los_Angeles';
    let ZONE_DESIGNATOR_CHAR = 'Z';

    let JAVA_FORMAT_TO_JS_FORMAT = {
        'HH:MM'   : MM,
        'HH:MM:SS': MM + SS
    };

    module.exports = {
        generateFormatterString: function(fieldInfo) {
            //Resolve formatting options
            let formatString;
            if (fieldInfo) {
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
        // TODO: this function is not used currently and commented out so that code coverage is not skewed...
        // TODO: could be here for future implementation so leaving..but should be reviewed and removed if not needed.
        //generateFormat         : function(fieldInfo) {
        //    //Resolve formatting options
        //    let formatString;
        //    if (fieldInfo) {
        //        formatString = JAVA_FORMAT_TO_JS_FORMAT[fieldInfo.scale];
        //    }
        //    if (!formatString) {
        //        formatString = MM;
        //    }
        //    //resolve 12 vs. 24 hour clock
        //    if (fieldInfo.use24HourClock) {
        //        formatString = TWENTY_FOUR_HOUR_CLOCK + formatString;
        //    } else {
        //        formatString = TWELVE_HOUR_CLOCK + formatString + AM_PM;
        //    }
        //    return formatString;
        //},
        // Given a raw number as input, formats as a legacy QuickBase phone number. Note, not internationalized
        // Unlike current stack, new stack timeOfDay field has a useTimezone boolean which when set the field works exactly like date/time field's time
        // Which means all values in core are stoed in UTC. But the UI will render the values (view and edit) in app's timezone.
        format                 : function(fieldValue, fieldInfo) {
            if (!fieldValue || !fieldValue.value) {
                return '';
            }

            fieldInfo = fieldInfo || {};

            //Declare the date and moment formatter
            let currentDate = new Date();
            let dd = currentDate.getDate().toString();
            let mm = (currentDate.getMonth() + 1).toString(); //January is 0
            let yyyy = currentDate.getFullYear();

            if (mm.length  < 2) {
                mm = '0' + mm;
            }

            if (dd.length  < 2) {
                dd = '0' + dd;
            }

            let dateStr = yyyy + '-' + mm + '-' + dd +  'T' + fieldValue.value.replace(/(\[.*?\])/, '');
            //if the useTimezone is set then assume that the incoming value is in UTC
            if (fieldInfo.useTimezone && fieldValue.value.indexOf('Z') === -1) {
                dateStr += ZONE_DESIGNATOR_CHAR;
            }
            //Resolve whether or not to shift based on useTimezone and app's timezone
            let m;
            if (fieldInfo.useTimezone) {
                let d = new Date(dateStr);
                let timeZone = consts.UTC_TIMEZONE;
                timeZone = fieldInfo.timeZone;
                if (!timeZone) {
                    timeZone = DEFAULT_TIMEZONE;
                }
                m = moment.tz(d, timeZone);
            } else {
                m = moment(dateStr);
            }

            //Resolve formatting options
            let formatString = fieldInfo.jsFormat;
            if (!formatString) {
                formatString = this.generateFormatterString(fieldInfo);
            }
            return m.format(formatString);
        }
    };
}());
