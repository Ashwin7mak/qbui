/*
 Given raw records input and field meta data from the Java capabilities API, this module is capable of
 display formatting the raw record field values by adding a display properties attribute.
*/
(function () {
    'use strict';
    var moment = require('moment');
    module.exports = function () {
        //Module constants:
        var OPEN_PAREN = '(';
        var CLOSE_PAREN = ') ';
        var DASH = '-';
        var PHONE_NUMBER = 'PHONE_NUMBER';
        var DATE = 'DATE';
        var DATE_TIME = 'DATE_TIME';
        var DATE_FORMATS = {
            //FORMATTING COMPONENTS
            TWO_DIGIT_MONTH: 'MM',
            MONTH_ABBREV: 'MMM',
            DAY_OF_WEEK: 'dddd, ',
            TIME: 'h:mm A',
            FOUR_DIGIT_YEAR: 'YYYY',
            TWO_DIGIT_YEAR: 'YY',
            TWO_DIGIT_DAY: 'DD',
            //FULL FORMATS:
            MM_DD_YY:   this.TWO_DIGIT_MONTH + DASH + this.TWO_DIGIT_DAY + DASH + this.TWO_DIGIT_YEAR,
            MM_DD_YYYY: this.TWO_DIGIT_MONTH + DASH + this.TWO_DIGIT_DAY + DASH + this.FOUR_DIGIT_YEAR,
            DD_MM_YYYY: this.TWO_DIGIT_DAY + DASH + this.TWO_DIGIT_MONTH + DASH + this.TWO_DIGIT_YEAR,
            DD_DD_YY:   this.TWO_DIGIT_MONTH + DASH + this.TWO_DIGIT_DAY + DASH + this.TWO_DIGIT_YEAR,
            YYYY_MM_DD: this.FOUR_DIGIT_YEAR + DASH + this.TWO_DIGIT_MONTH +  + DASH + this.TWO_DIGIT_DAY
        };

        var JAVA_TO_JS_DATE_FORMATS = {
            'MM-dd-uu': DATE_FORMATS.MM_DD_YY,
            'MM-dd-uuuu': DATE_FORMATS.MM_DD_YYYY,
            'dd-MM-uuuu': DATE_FORMATS.DD_MM_YYYY,
            'dd-MM-uu': DATE_FORMATS.DD_MM_YY,
            'uuuu-MM-dd': DATE_FORMATS.YYYY_MM_DD
        };

        function showMonthAsName(formatString) {
            return formatString.replace(DATE_FORMATS.TWO_DIGIT_MONTH, DATE_FORMATS.MONTH_ABBREV);
        }

        function showDayOfWeek(formatString) {
            return DATE_FORMATS + formatString;
        }

        function hideYearIfCurrent(dateInput){
            //TODO: uh oh, figure this out
        }

        function showTime(formatString) {
            return formatString + DATE_FORMATS.TIME;
        }

        function showTimeZone(formatString, timeZone){
            return formatString + ' ([' + timeZone + '])';
        }

        function validValue(fieldValue) {
            if(!fieldValue || fieldValue.value === undefined || fieldValue.value === null) {
                return false;
            }
            return true;
        }
        function formatDateTime(fieldValue, fieldInfo) {
            if(!validValue(fieldvalue) || !validValue(fieldInfo)) {
                return null;
            }
            //Date constructor expects ISO8601 date
            var d = new Date(fieldValue);
            var m = moment(d);
            //TODO: get the date time format on the field info in the java code
            var jsDateFormat = JAVA_TO_JS_DATE_FORMATS[fieldInfo.format];
            if(!jsDateFormat) {
                jsDateFormat = DATE_FORMATS.MM_DD_YYYY;
            }
            if(fieldInfo.showTime){
                jsDateFormat = showTime(jsDateFormat);
            }
            if(fieldInfo.showTimeZone){
                //TODO: figure out how to get the app timezone into the field info
                jsDateFormat = showTimeZone(jsDateFormat, 'PST');
            }
            if(fieldInfo.showMonthAsName){
                jsDateFormat = showMonthAsName(jsDateFormat);
            }
            if(fieldInfo.showDayOfWeek){
                jsDateFormat = showDayOfWeek(jsDateFormat);
            }

            //produce the formatted date string
            var formattedDateString = m.format(jsDateFormat);
            if(fieldInfo.hideYearIfCurrent){
                formattedDateString = hideYearIfCurrent(formattedDateString);
            }
            return formattedDateString;
        }

        //Given a raw number as input, formats as a legacy QuickBase phone number. Note, not internationalized
        function formatPhoneNumber(fieldValue, fieldInfo) {
            if(!validValue(fieldValue)) {
                return null;
            }
            var baseValue = fieldValue.value;
            var len = baseValue.length;
            var areaCode = '';
            var centralOffice = '';
            var finalFour = '';

            //slice positions in raw string:
            var final4Start = len - 4;
            var middle3Start = len - 7;
            var first3Start = len - 10;
            //If there are 4 or more characters, grab them
            if(final4Start >= 0) {
                finalFour = baseValue.slice(final4Start);
                //If there are more than 4 chars, parse the middle chars and insert the '-'
                if(final4Start > 0) {
                    var startIndex = middle3Start;
                    if(startIndex < 0) {
                        startIndex = 0;
                    }
                    centralOffice = baseValue.slice(startIndex, final4Start) + DASH;
                    //if there are more than 7 chars, parse and insert the parens
                    if(middle3Start > 0) {
                        startIndex = first3Start;
                        if(first3Start < 0) {
                            startIndex = 0;
                        }
                        areaCode = OPEN_PAREN + baseValue.slice(startIndex, middle3Start) + CLOSE_PAREN;
                    }
                    //Pad the rest of the the digits to the left of the parens.  Such is life
                    if(first3Start > 0) {
                        areaCode = baseValue.slice(0, startIndex) + ' ' + areaCode;
                    }
                }
            } else {
                finalFour = fieldValue.value;
            }
            //Concatenate & return results
            return areaCode + centralOffice + finalFour;
        }

        //Display formats record field values according to the field's display settings
        function formatRecordValue(fieldValue, fieldInfo) {
            switch(fieldInfo.type) {
                case PHONE_NUMBER:
                    fieldValue.display = formatPhoneNumber(fieldValue, fieldInfo);
                    break;
                case DATE_TIME:
                    fieldValue.display = formatDateTime(fieldValue, fieldInfo);
                    break;
                default:
                    break;
            }
            return fieldValue;
        }

        var recordsFormatter = {
            //Given an array of records, array of fields format the record values for display
            formatRecords: function (records, fields) {
                if(records && fields) {
                    var fieldsMap = {};
                    var formattedRecords = [];
                    fields.forEach(function(entry) {
                        fieldsMap[entry.id] = entry;
                    });
                    records.forEach(function(record) {
                        var formattedRecord = [];
                        record.forEach(function(fieldValue) {
                            formattedRecord.push(
                                formatRecordValue(fieldValue, fieldsMap[fieldValue.id.toString()])
                            );
                        });
                        formattedRecords.push(formattedRecord);
                    });
                    return formattedRecords;
                }
                return records;
            }
        };
        return recordsFormatter;
    }
}());