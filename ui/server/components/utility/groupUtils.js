(function() {
    'use strict';

    var constants = require('../../api/constants');
    var groupTypes = require('../../api/groupTypes');
    var moment = require('moment');
    var emailAddress = require('email-addresses');

    module.exports = {

        /**
         * Is the dataType GroupType combination supported.
         *
         * @param dataType
         * @param groupType
         * @returns {boolean}
         */
        isValidGroupType: function(dataType, groupType) {

            switch (dataType) {
            case constants.DATE_TIME:
            case constants.DATE:
                switch (groupType) {
                case groupTypes.DATE.equals: return true;
                case groupTypes.DATE.day: return true;
                case groupTypes.DATE.week: return true;
                case groupTypes.DATE.month: return true;
                case groupTypes.DATE.year: return true;
                case groupTypes.DATE.quarter: return true;
                case groupTypes.DATE.fiscalQuarter: return true;
                case groupTypes.DATE.fiscalYear: return true;
                case groupTypes.DATE.decade: return true;
                }
                return false;
            case constants.DURATION:
                switch (groupType) {
                case groupTypes.DURATION.equals: return true;
                case groupTypes.DURATION.second: return true;
                case groupTypes.DURATION.minute: return true;
                case groupTypes.DURATION.hour: return true;
                case groupTypes.DURATION.week: return true;
                case groupTypes.DURATION.day: return true;
                }
                return false;
            case constants.EMAIL_ADDRESS:
                switch (groupType) {
                case groupTypes.EMAIL_ADDRESS.equals: return true;
                case groupTypes.EMAIL_ADDRESS.domain: return true;
                case groupTypes.EMAIL_ADDRESS.domain_topLevel: return true;
                case groupTypes.EMAIL_ADDRESS.name: return true;
                }
                return false;
            case constants.CURRENCY:
            case constants.RATING:
            case constants.PERCENT:
            case constants.NUMERIC:
                switch (groupType) {
                case groupTypes.NUMERIC.equals: return true;
                case groupTypes.NUMERIC.thousandth: return true;
                case groupTypes.NUMERIC.hundredth: return true;
                case groupTypes.NUMERIC.tenth: return true;
                case groupTypes.NUMERIC.one: return true;
                case groupTypes.NUMERIC.five: return true;
                case groupTypes.NUMERIC.ten: return true;
                case groupTypes.NUMERIC.hundred: return true;
                case groupTypes.NUMERIC.one_k: return true;
                case groupTypes.NUMERIC.ten_k: return true;
                case groupTypes.NUMERIC.hundred_k: return true;
                case groupTypes.NUMERIC.million: return true;
                }
                return false;
            case constants.TEXT:
                switch (groupType) {
                case groupTypes.TEXT.equals: return true;
                case groupTypes.TEXT.firstLetter: return true;
                case groupTypes.TEXT.firstWord: return true;
                }
                return false;
            case constants.USER:
                switch (groupType) {
                case groupTypes.USER.equals: return true;
                case groupTypes.USER.firstLetter: return true;
                case groupTypes.USER.firstWord: return true;
                }
                return false;
            }

            return false;

        },

        /**
         * Extract the first word from the given content.
         * Will return the original content if any exception is thrown.
         *
         * @param content
         * @returns first word found in the content.
         */
        getFirstWord: function(content) {
            try {
                return content.split(' ')[0];
            } catch (e) {
                // do nothing..just return the original content
            }
            return content;
        },

        /**
         * Extract the first letter from the given content.
         * Will return the original content if invalid input or
         * an exception is thrown.
         *
         * @param content
         * @returns first letter found in the content.
         */
        getFirstLetter: function(content) {
            try {
                return content.substr(0, 1);
            } catch (e) {
                // do nothing..just return the original content
            }
            return content;
        },

        /**
         * Return the first day of the week of a given date.  QuickBase considers Monday as the first day
         * of the(work) week, so the date returned will be the preceding Monday in the format specified.
         *
         * Strict parsing is enforced.  This means the displayDate string must match the format.
         * For example:
         *
         *      ...('2015-05-31','YYYY-MM-DD') is a valid date
         *      ...('05-31-2015','YYYY-MM-DD') is an invalid date
         *
         * Invalid input will result in an empty string being returned.
         *
         * @param displayDate
         * @param format
         * @returns {*}
         */
        getFirstDayOfWeek: function(displayDate, format) {
            if (displayDate) {
                let momentDate = moment(displayDate, format, true);
                if (momentDate.isValid()) {
                    return momentDate.startOf('isoWeek').format(format);
                }
            }
            return '';
        },

        /**
         * Return the Month and year of a given date.
         *
         * Strict parsing is enforced.  This means the displayDate string must match the format.
         * For example:
         *
         *      ...('2015-04-30','YYYY-MM-DD') is a valid date
         *      ...('04-30-2015','YYYY-MM-DD') is an invalid date
         *
         * If the input date is Apr 30, 2015, and it is parsed successfully, the return
         * value is 'Apr 2015'.  Invalid input will result in an empty string being returned.
         *
         * @param displayDate
         * @param format
         * @returns {*}
         */
        getMonth: function(displayDate, format) {
            if (displayDate) {
                let momentDate = moment(displayDate, format, true);
                if (momentDate.isValid()) {
                    let monthYear = momentDate.format('MMM YYYY');
                    return monthYear.replace(" ", groupTypes.delimiter);
                }
            }
            return '';
        },

        /**
         * Return the Year of a given date.
         *
         * Strict parsing is enforced.  This means the displayDate string must match the format.
         * For example:
         *
         *      ...('2015-05-31','YYYY-MM-DD') is a valid date
         *      ...('05-31-2015','YYYY-MM-DD') is an invalid date
         *
         * If the input date is May 31, 2015, and it is parsed successfully, the return
         * value is '2015'.  Invalid input will result in an empty string being returned.
         *
         * @param displayDate
         * @param format
         * @returns {*}
         */
        getYear: function(displayDate, format) {
            if (displayDate) {
                let momentDate = moment(displayDate, format, true);
                if (momentDate.isValid()) {
                    return momentDate.format('YYYY');
                }
            }
            return '';
        },

        /**
         * Return the Calendar quarter and Year of the given date.
         *
         * Strict parsing is enforced.  This means the displayDate string must match the format.
         * For example:
         *
         *      ...('2015-05-31','YYYY-MM-DD') is a valid date
         *      ...('05-31-2015','YYYY-MM-DD') is an invalid date
         *
         * If the input date is May 31, 2015, and it is parsed successfully, the return
         * value is 'Q2 2015'.  Invalid input will result in an empty string being returned.
         *
         * @param displayDate
         * @param format
         * @returns {*}
         */
        getQuarter: function(displayDate, format) {
            if (displayDate) {
                let momentDate = moment(displayDate, format, true);
                if (momentDate.isValid()) {
                    //return constants.GROUPING.QUARTER + momentDate.quarter() + ' ' + momentDate.format('YYYY');
                    return momentDate.quarter() + groupTypes.delimiter + momentDate.format('YYYY');
                }
            }
            return '';
        },

        /**
         * Return the Fiscal quarter and Year of the given date.
         *
         * Strict parsing is enforced.  This means the displayDate string must match the format.
         * For example:
         *
         *      ...('2015-05-31','YYYY-MM-DD') is a valid date
         *      ...('05-31-2015','YYYY-MM-DD') is an invalid date
         *
         * If the input date is May 31, 2015, and it is parsed successfully, the return
         * value is 'Q2 FY2015'.  Invalid input will result in an empty string being returned.
         *
         * @param displayDate
         * @param format
         * @returns {*}
         */
        getFiscalQuarter: function(displayDate, format) {
            if (displayDate) {
                let momentDate = moment(displayDate, format, true);
                if (momentDate.isValid()) {
                    //return constants.GROUPING.QUARTER + momentDate.quarter() + ' ' + constants.GROUPING.FISCAL_YR + momentDate.format('YYYY');
                    return momentDate.quarter() + groupTypes.delimiter + momentDate.format('YYYY');
                }
            }
            return '';
        },

        /**
         * Return the Fiscal Year of the given date.
         *
         * Strict parsing is enforced.  This means the displayDate string must match the format.
         * For example:
         *
         *      ...('2015-05-31','YYYY-MM-DD') is a valid date
         *      ...('05-31-2015','YYYY-MM-DD') is an invalid date
         *
         * If the input date is May 31, 2015, and it is parsed successfully, the return
         * value is 'FY2015'.  Invalid input will result in an empty string being returned.
         *
         * @param displayDate
         * @param format
         * @returns {*}
         */
        getFiscalYear: function(displayDate, format) {
            if (displayDate) {
                let momentDate = moment(displayDate, format, true);
                if (momentDate.isValid()) {
                    //return constants.GROUPING.FISCAL_YR + momentDate.format('YYYY');
                    return momentDate.format('YYYY');
                }
            }
            return '';
        },

        /**
         * Return the Decade of the given date.
         *
         * Strict parsing is enforced.  This means the displayDate string must match the format.
         * For example:
         *
         *      ...('2015-05-31','YYYY-MM-DD') is a valid date
         *      ...('05-31-2015','YYYY-MM-DD') is an invalid date
         *
         * If the input date is May 31, 2015, and it is parsed successfully, the return
         * value is '2010'.  Invalid input will result in an empty string being returned.
         *
         * @param displayDate
         * @param format
         * @returns {*}
         */
        getDecade: function(displayDate, format) {
            if (displayDate) {
                let momentDate = moment(displayDate, format, true);
                if (momentDate.isValid()) {
                    let year = momentDate.year();
                    return (year - (year % 10)).toString();
                }
            }
            return '';
        },

        /**
         * Return the lower and upper range bounds for the input value base
         * on the supplied scale. This function is used when grouping numeric
         * values where the range is less than or equal to 1.
         *
         * Scales map to grouping range ..for example:
         *    4 --> thousandth   (2.0000 - 2.0010)
         *    3 --> hundredth    (2.000 - 2.010)
         *    2 --> tenth        (2.00 - 2.10)
         *    1 --> integer      (2 - 3)
         *
         * @param input
         * @param scale
         * @returns {{lower: null, upper: null}}
         */
        getRangeFraction: function(input, scale) {
            var range = {
                lower: null,
                upper: null
            };

            if (typeof input === 'number' && typeof scale === 'number') {

                var factor = Math.pow(10, scale - 1);

                //  remove trailing zeros(if any) after the decimal point from the input value
                //   so that we can figure out the scal.  For example: 21.76000 --> 21.76
                var value = (input * factor) / factor;

                //  figure out the scale(if any) of the input value.  For example:
                //      20.39  ==> scale of 2
                //      20.4  ==> scale of 1
                //      20     ==> scale of 0
                var s = value.toString().split('.');
                var valueScale = s.length > 1 ? s[1].length : 0;

                //  if the scale of the input number is less than the scale requested, we need to adjust the
                //  value to match the requested scale to ensure correct precision with the returned range values
                if (valueScale < scale) {
                    value = value + (1 / (factor * 10));
                }

                //  calculate the upper and lower boundary ranges based on the requested scale
                range.upper = (Math.ceil(value * factor) / factor).toFixed(scale);
                range.lower = (Math.floor(value * factor) / factor).toFixed(scale);

                //  for scale of 1, adjust the ranges to return the integer value.  IE:  76.0 --> 76
                if (scale === 1) {
                    range.upper = Number.parseFloat(range.upper).toFixed(0);
                    range.lower = Number.parseFloat(range.lower).toFixed(0);
                }
            }

            return range;
        },

        /**
         * Return the lower and upper range bounds for the input value base
         * on the supplied factor. This function is used when grouping numeric
         * values where the range is greater than or equal to 1.
         *
         * Factors map to grouping ranges ..for example:
         *    5   -->  (0 - 5, 5 - 10, ..., 50 - 55)
         *    10  -->  (0 - 10, 10 - 20, ..., 50 - 60)
         *    100 -->  (0 - 100, 100 - 200, ..., 500 - 600)
         *
         * @param input
         * @param factor
         * @returns {{lower: null, upper: null}}
         */
        getRangeWhole: function(input, factor) {
            var range = {
                lower: null,
                upper: null
            };

            if (typeof input === 'number' && typeof factor === 'number') {
                if (factor !== 0) {
                    range.lower = factor * (Math.floor(input / factor));
                    range.upper = range.lower + factor;
                }
            }

            return range;
        },

        /**
         * Extract the email name portion from an email address.
         * Example:  getEmailName(johnSmith@test.com) ==> johnSmith
         *
         * @param emailAddr
         * @returns {*} email name segment of the email address
         */
        getEmailName: function(emailAddr) {
            if (emailAddr) {
                let parts = emailAddress.parseOneAddress(emailAddr);
                if (parts) {
                    return parts.local;
                }
            }
            return '';
        },

        /**
         * Extract the domain portion from an email address.
         * Example:  getEmailDomain(johnSmith@test.com) ==> test.com
         *
         * @param emailAddr
         * @returns {*} email domain segment of the email address
         */
        getEmailDomain: function(emailAddr) {
            if (emailAddr) {
                let parts = emailAddress.parseOneAddress(emailAddr);
                if (parts) {
                    return parts.domain;
                }
            }
            return '';
        },

        /**
         * Extract the domain topLevel portion from an email address.
         * Example:  getEmailDomainTopLevel(johnSmith@test.com) ==> com
         *
         * @param emailAddr
         * @returns {*} top level segment of the email address domain
         */
        getEmailDomainTopLevel: function(emailAddr) {
            if (emailAddr) {
                let parts = emailAddress.parseOneAddress(emailAddr);
                if (parts && parts.domain) {
                    let domainParts = parts.domain.split('.');
                    if (domainParts.length > 0) {
                        return domainParts[domainParts.length - 1];
                    }
                }
            }
            return '';
        },

        /**
         * Determine which group is appropriate for the given duration value and
         * return the grouping value based on the duration.
         *
         * For example, the smallest group that the duration qualifies for is outputted:
         *      - duration of < 1 minute belongs in the seconds group;
         *      - duration of < 1 hour belongs in the minute group
         *      - duration of < 1 day belongs in the hour group
         *      - duration of < 1 week belongs in the day group
         *      - duration of >= 1 week belongs in the week group
         *
         * Negative durations are supported by testing against the absolute value.
         *
         * @param duration (ms)
         * @returns {*}
         */
        getDurationEquals: function(duration) {

            let seconds = this.convertDuration(duration, constants.GROUPING.SECOND);
            if (seconds !== null && Math.abs(seconds) < 60) {
                //return seconds + ' ' + (Math.abs(seconds) === 1 ? constants.GROUPING.SECOND : constants.GROUPING.SECONDS);
                return seconds + groupTypes.delimiter + groupTypes.DURATION.second;
            }

            let minutes = this.convertDuration(duration, constants.GROUPING.MINUTE);
            if (minutes !== null && Math.abs(minutes) < 60) {
                //return minutes + ' ' + (Math.abs(minutes) === 1 ? constants.GROUPING.MINUTE : constants.GROUPING.MINUTES);
                return minutes + groupTypes.delimiter + groupTypes.DURATION.minute;
            }

            let hours = this.convertDuration(duration, constants.GROUPING.HOUR);
            if (hours !== null && Math.abs(hours) < 24) {
                //return hours + ' ' + (Math.abs(hours) === 1 ? constants.GROUPING.HOUR : constants.GROUPING.HOURS);
                return hours + groupTypes.delimiter + groupTypes.DURATION.hour;
            }

            let days = this.convertDuration(duration, constants.GROUPING.DAY);
            if (days !== null && Math.abs(days) < 7) {
                //return days + ' ' + (Math.abs(days) === 1 ? constants.GROUPING.DAY : constants.GROUPING.DAYS);
                return days + groupTypes.delimiter + groupTypes.DURATION.day;
            }

            let weeks = this.convertDuration(duration, constants.GROUPING.WEEK);
            if (weeks !== null) {
                //return weeks + ' ' + (Math.abs(weeks) === 1 ? constants.GROUPING.WEEK : constants.GROUPING.WEEKS);
                return weeks + groupTypes.delimiter + groupTypes.DURATION.week;
            }

            return '';
        },

        /**
         * Return the duration in seconds.  Fractional seconds are rounded down.
         *
         * @param duration (ms)
         * @returns {*}
         */
        getDurationInSeconds: function(duration) {
            let seconds = this.convertDuration(duration, constants.GROUPING.SECOND, true);
            if (seconds !== null) {
                return seconds;// + ' ' + (Math.abs(seconds) === 1 ? constants.GROUPING.SECOND : constants.GROUPING.SECONDS);
            }
            return '';
        },

        /**
         * Return the duration in minutes.  Fractional minutes are round down to the largest integer less
         * than or equal to the given number.
         *
         * @param duration (ms)
         * @returns {*}
         */
        getDurationInMinutes: function(duration) {
            let minutes = this.convertDuration(duration, constants.GROUPING.MINUTE, true);
            if (minutes !== null) {
                return minutes;// + ' ' + (Math.abs(minutes) === 1 ? constants.GROUPING.MINUTE : constants.GROUPING.MINUTES);
            }
            return '';
        },

        /**
         * Return the duration in hours.  Fractional hours are rounded down to the largest integer less
         * than or equal to the given number.
         *
         * @param duration (ms)
         * @returns {*}
         */
        getDurationInHours: function(duration) {
            let hours = this.convertDuration(duration, constants.GROUPING.HOUR, true);
            if (hours !== null) {
                return hours;// + ' ' + (Math.abs(hours) === 1 ? constants.GROUPING.HOUR : constants.GROUPING.HOURS);
            }
            return '';
        },

        /**
         * Return the duration in days.  Fractional days are rounded down to the largest integer less
         * than or equal to the given number.
         *
         * @param duration (ms)
         * @returns {*}
         */
        getDurationInDays: function(duration) {
            let days = this.convertDuration(duration, constants.GROUPING.DAY, true);
            if (days !== null) {
                return days;// + ' ' + (Math.abs(days) === 1 ? constants.GROUPING.DAY : constants.GROUPING.DAYS);
            }
            return '';
        },

        /**
         * Return the duration in weeks.  Fractional weeks are rounded down to the largest integer less
         * than or equal to the given number.
         *
         * @param duration (ms)
         * @returns {*}
         */
        getDurationInWeeks: function(duration) {
            let weeks = this.convertDuration(duration, constants.GROUPING.WEEK, true);
            if (weeks !== null) {
                return weeks;// + ' ' + (Math.abs(weeks) === 1 ? constants.GROUPING.WEEK : constants.GROUPING.WEEKS);
            }
            return '';
        },

        /**
         * Convert the duration(ms) to the given precision(hours, minutes, seconds, days, weeks).
         *
         * @param duration (ms)
         * @param precision - the conversion percision (hours, minutes, seconds, days, weeks)
         * @param rounded - are fractional values rounded down to the largest integer less than or equal to the value
         * @returns {*}
         */
        convertDuration: function(duration, precision, rounded) {
            let value = null;
            if (typeof duration === 'number') {
                switch (precision) {
                case constants.GROUPING.SECOND:
                    value = duration / constants.MILLI.ONE_SECOND;
                    break;
                case constants.GROUPING.MINUTE:
                    value = duration / constants.MILLI.ONE_MINUTE;
                    break;
                case constants.GROUPING.HOUR:
                    value = duration / constants.MILLI.ONE_HOUR;
                    break;
                case constants.GROUPING.DAY:
                    value = duration / constants.MILLI.ONE_DAY;
                    break;
                case constants.GROUPING.WEEK:
                    value = duration / constants.MILLI.ONE_WEEK;
                    break;
                }
                if (typeof value === 'number' && rounded === true) {
                    value = Math.floor(value);
                }
            }
            return value;
        }

    };

}());
