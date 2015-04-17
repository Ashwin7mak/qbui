/*
 Given raw records input and field meta data from the Java capabilities API, this module is capable of
 display formatting the raw record field values by adding a display properties attribute.
 */
(function () {
    'use strict';
    var dateFormatter = require('./dateTimeFormatter');
    var phoneFormatter = require('./phoneNumberFormatter');
    var todFormatter = require('./../timeOfDayFormatter');
    //module constants
    var PHONE_NUMBER = 'PHONE_NUMBER';
    var DATE_TIME = 'DATE_TIME';
    var FORMULA_DATE_TIME = 'FORMULA_DATE_TIME';
    var DATE = 'DATE';
    var FORMULA_DATE = 'FORMULA_DATE';
    var FORMULA_TIME_OF_DAY = 'FORMULA_TIME_OF_DAY';
    var TIME_OF_DAY = 'TIME_OF_DAY';

    module.exports = function () {
        //Display formats record field values according to the field's display settings
        function formatRecordValue(fieldValue, fieldInfo) {
            switch (fieldInfo.type) {
                case PHONE_NUMBER:
                    fieldValue.display = phoneFormatter.format(fieldValue, fieldInfo);
                    break;
                case DATE_TIME:
                case DATE:
                case FORMULA_DATE_TIME:
                case FORMULA_DATE:
                    fieldValue.display = dateFormatter.format(fieldValue, fieldInfo);
                    break;
                case TIME_OF_DAY:
                case FORMULA_TIME_OF_DAY:
                    fieldValue.display = todFormatter.format(fieldValue, fieldInfo);
                    break;
                default:
                    break;
            }
            return fieldValue;
        }

        var recordsFormatter = {
            //Given an array of records, array of fields format the record values for display
            formatRecords: function (records, fields) {
                if (records && fields) {
                    var fieldsMap = {};
                    var formattedRecords = [];
                    fields.forEach(function (entry) {
                        fieldsMap[entry.id] = entry;
                    });
                    records.forEach(function (record) {
                        var formattedRecord = [];
                        record.forEach(function (fieldValue) {
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