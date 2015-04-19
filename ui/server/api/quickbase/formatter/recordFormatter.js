/*
 Given raw records input and field meta data from the Java capabilities API, this module is capable of
 display formatting the raw record field values by adding a display properties attribute.
 */
(function () {
    'use strict';
    var dateFormatter = require('./dateTimeFormatter');
    var phoneFormatter = require('./phoneNumberFormatter');
    var todFormatter = require('./timeOfDayFormatter');
    var numericFormatter = require('./numericFormatter');
    //module constants
    var PHONE_NUMBER = 'PHONE_NUMBER';
    var DATE_TIME = 'DATE_TIME';
    var FORMULA_DATE_TIME = 'FORMULA_DATE_TIME';
    var DATE = 'DATE';
    var FORMULA_DATE = 'FORMULA_DATE';
    var FORMULA_TIME_OF_DAY = 'FORMULA_TIME_OF_DAY';
    var TIME_OF_DAY = 'TIME_OF_DAY';
    var NUMERIC = 'NUMERIC';
    var FORMULA_NUMERIC = 'FORMULA_NUMERIC';

    /**
     * Certain fields may require generation of a formatter string that will be used for each record in the
     * field for example, Date, DateTime and TimeOfDay fields. Rather than recalculate this formatter string
     * for each record value encountered, we generate it once, and cache it on the fieldInfo for the field
     * in question.  The display formatter will then look for this value 'jsFormat' and if populated,
     * use it instead of recalculating the formatter string.
     * @param fieldInfos The array of field meta data for the fields in the records
     */
    function precalculateFormatterStringsForFields(fieldInfos) {
        for(var i = 0; i < fieldInfos.length; i++) {
            switch (fieldInfos[i].type) {
                case DATE_TIME:
                case DATE:
                case FORMULA_DATE_TIME:
                case FORMULA_DATE:
                    fieldInfos[i].jsFormat = dateFormatter.generateFormat(fieldInfos[i]);
                    break;
                case TIME_OF_DAY:
                case FORMULA_TIME_OF_DAY:
                    fieldInfos[i].jsFormat = todFormatter.generateFormat(fieldInfos[i]);
                    break;
                case NUMERIC:
                case FORMULA_NUMERIC:
                    fieldInfos[i].jsFormat = numericFormatter.generateFormat(fieldInfos[i]);
                default:
                    break;
            }
        }
    }
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
                case NUMERIC:
                case FORMULA_NUMERIC:
                    fieldValue.display = numericFormatter.format(fieldValue, fieldInfo);
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
                    //Precalculate any formatter strings
                    precalculateFormatterStringsForFields(fields);
                    //Generate a map for O(1) lookup on each field get
                    fields.forEach(function (entry) {
                        fieldsMap[entry.id] = entry;
                    });
                    //For each record, for each value, display format it!
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