/*
 Given raw records input and field meta data from the Java capabilities API, this module is capable of
 display formatting the raw record field values by adding a display properties attribute.
*/
(function () {
    'use strict';
    module.exports = function () {
        //Module constants:
        var OPEN_PAREN = '(';
        var CLOSE_PAREN = ') ';
        var DASH = '-';
        var PHONE_NUMBER = 'PHONE_NUMBER';

        //Given a raw number as input, formats as a legacy QuickBase phone number. Note, not internationalized
        function formatPhoneNumber(fieldValue, fieldInfo) {
            if(!fieldValue || fieldValue.value === undefined || fieldValue.value === null) {
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