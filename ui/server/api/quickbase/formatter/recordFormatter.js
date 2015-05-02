/*
 Given raw records input and field meta data from the Java capabilities API, this module is capable of
 display formatting the raw record field values by adding a display properties attribute.
 */
(function () {
    'use strict';
    var consts = require('../../constants');
    var dateFormatter = require('./dateTimeFormatter');
    var phoneFormatter = require('./phoneNumberFormatter');
    var todFormatter = require('./timeOfDayFormatter');
    var numericFormatter = require('./numericFormatter');
    var urlFormatter = require('./urlFormatter');

    /**
     * Certain fields may require generation of a formatter string that will be used for each record in the
     * field for example, Date, DateTime and TimeOfDay fields. Rather than recalculate this formatter string
     * for each record value encountered, we generate it once, and cache it on the fieldInfo for the field
     * in question.  The display formatter will then look for this value 'jsFormat' and if populated,
     * use it instead of recalculating the formatter string.
     * @param fieldInfos The array of field meta data for the fields in the records
     */
    function precalculateFormatterStringsForFields(fieldInfos) {
        for (var i = 0; i < fieldInfos.length; i++) {
            switch (fieldInfos[i].type) {
                case consts.DATE_TIME:
                case consts.DATE:
                case consts.FORMULA_DATE_TIME:
                case consts.FORMULA_DATE:
                    fieldInfos[i].jsFormat = dateFormatter.generateFormat(fieldInfos[i]);
                    break;
                case consts.TIME_OF_DAY:
                case consts.FORMULA_TIME_OF_DAY:
                    fieldInfos[i].jsFormat = todFormatter.generateFormat(fieldInfos[i]);
                    break;
                case consts.NUMERIC:
                case consts.FORMULA_NUMERIC:
                case consts.CURRENCY:
                case consts.FORMULA_CURRENCY:
                case consts.PERCENT:
                case consts.FORMULA_PERCENT:
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
                case consts.PHONE_NUMBER:
                    fieldValue.display = phoneFormatter.format(fieldValue, fieldInfo);
                    break;
                case consts.DATE_TIME:
                case consts.DATE:
                case consts.FORMULA_DATE_TIME:
                case consts.FORMULA_DATE:
                    fieldValue.display = dateFormatter.format(fieldValue, fieldInfo);
                    break;
                case consts.TIME_OF_DAY:
                case consts.FORMULA_TIME_OF_DAY:
                    fieldValue.display = todFormatter.format(fieldValue, fieldInfo);
                    break;
                case consts.NUMERIC:
                case consts.FORMULA_NUMERIC:
                case consts.CURRENCY:
                case consts.FORMULA_CURRENCY:
                case consts.PERCENT:
                case consts.FORMULA_PERCENT:
                    fieldValue.display = numericFormatter.format(fieldValue, fieldInfo);
                    break;
                case consts.URL:
                    fieldValue.display = urlFormatter.format(fieldValue, fieldInfo);
                    break;
                default:
                    fieldValue.display = fieldValue.value;
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