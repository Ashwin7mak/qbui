/*
 Given raw records input and field meta data from the Java capabilities API, this module is capable of
 display formatting the raw record field values by adding a display properties attribute.
 */
(function () {
    'use strict';
    var _ = require('lodash');
    var consts = require('../../constants');
    var dateFormatter = require('./dateTimeFormatter');
    var phoneFormatter = require('./phoneNumberFormatter');
    var todFormatter = require('./timeOfDayFormatter');
    var numericFormatter = require('./numericFormatter');
    var urlAndFileReportLinkFormatter = require('./urlFileAttachmentReportLinkFormatter');
    var emailFormatter = require('./emailFormatter');
    var durationFormatter = require('./durationFormatter');
    var userFormatter = require('./userFormatter');

    /**
     * Certain fields may require generation of a formatter options that will be used for each record in the
     * field, for example, Date, DateTime and TimeOfDay fields. Rather than recalculate this formatter string
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
                case consts.SUMMARY:
                case consts.NUMERIC:
                case consts.FORMULA_NUMERIC:
                case consts.CURRENCY:
                case consts.FORMULA_CURRENCY:
                case consts.PERCENT:
                case consts.FORMULA_PERCENT:
                    fieldInfos[i].jsFormat = numericFormatter.generateFormat(fieldInfos[i]);
                    break;
                case consts.DURATION:
                case consts.FORMULA_DURATION:
                    fieldInfos[i].jsFormat = durationFormatter.generateFormat(fieldInfos[i]);
                    break;
                default:
                    break;
            }
        }
    }

    module.exports = function () {
        //Display formats record field values according to the field's display settings
        function formatRecordValue(fieldValue, fieldInfo) {
            var tempFieldInfo = _.cloneDeep(fieldInfo.datatypeAttributes);
            switch (tempFieldInfo.type) {
                case consts.PHONE_NUMBER:
                    fieldValue.display = phoneFormatter.format(fieldValue, tempFieldInfo);
                    break;
                case consts.DATE_TIME:
                case consts.DATE:
                case consts.FORMULA_DATE_TIME:
                case consts.FORMULA_DATE:
                    fieldValue.display = dateFormatter.format(fieldValue, tempFieldInfo);
                    break;
                case consts.TIME_OF_DAY:
                case consts.FORMULA_TIME_OF_DAY:
                    fieldValue.display = todFormatter.format(fieldValue, tempFieldInfo);
                    break;
                case consts.NUMERIC:
                case consts.FORMULA_NUMERIC:
                case consts.CURRENCY:
                case consts.FORMULA_CURRENCY:
                case consts.PERCENT:
                case consts.FORMULA_PERCENT:
                    fieldValue.display = numericFormatter.format(fieldValue, tempFieldInfo);
                    break;
                case consts.URL:
                case consts.FILE_ATTACHMENT:
                case consts.REPORT_LINK:
                    fieldValue.display = urlAndFileReportLinkFormatter.format(fieldValue, tempFieldInfo);
                    break;
                case consts.EMAIL_ADDRESS:
                    fieldValue.display = emailFormatter.format(fieldValue, tempFieldInfo);
                    break;
                case consts.DURATION:
                case consts.FORMULA_DURATION:
                    fieldValue.display = durationFormatter.format(fieldValue, tempFieldInfo);
                    break;
                case consts.USER:
                case consts.FORMULA_USER:
                    fieldValue.display = userFormatter.format(fieldValue, tempFieldInfo);
                    break;
                default:
                    //TODO: handle LOOKUP fields, need to return rootFieldType in the fieldInfo in order to display format properly
                    fieldValue.display = fieldValue.value;
                    if (!fieldValue.display) {
                        fieldValue.display = '';
                    }
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

                    //Precalculate any formatter strings & Generate a map for O(1) lookup on each field get
                    precalculateFormatterStringsForFields(fields);
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
    };
}());