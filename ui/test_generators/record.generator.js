/**
 * record.generator.js will generate valid json for record values and allow you to create a record in a table
 * containing generated data based on the provided field types
 * Created by klabak on 6/01/15.
 */

(function () {
    'use strict';
    var consts = require('../server/api/constants');
    var fieldConsts = require('./field.constants');
    var rawValueGenerator = require('./rawValue.generator');

    module.exports = {
        /*
         @params: List of generated fields
         For each field type do the following:
         Generate the value for the field based on type (call the appropriate rawValue generator)
         Add it to the JSON blob

         This method assumes you have already added the field to the table and generated a proper field ID,
         otherwise the id will come back as undefined.
         */
        generateRecord : function (fields) {
            var recordJson = [];
            for (var i = 0; i < fields.length; i++) {
                var field = fields[i];
                console.log('Generating field value for type ' + field[fieldConsts.fieldKeys.TYPE]);

                recordJson.push({
                    id: field[fieldConsts.fieldKeys.ID],
                    value: generateRecordValueForFieldType(field[fieldConsts.fieldKeys.TYPE])
                });
            }
            return recordJson;
        }

        //TODO: Method to generate a record if you give it a table instead of the list of fields
    };

    //For a given field type, apply any default values that are not currently present in the map
    function generateRecordValueForFieldType(type) {
        var functionToCall = recordTypeMapping[type];
        return functionToCall();
    }

    var recordTypeMapping = {};

    //map fields by type so that we know what kind of data to generate and plug into the record
    //concrete/scalar fields
    recordTypeMapping[consts.PERCENT] = function (){ return rawValueGenerator.generateDouble(1.5, 10.5); };
    recordTypeMapping[consts.NUMERIC] = function (){ return rawValueGenerator.generateDouble(0, 10.5); };
    recordTypeMapping[consts.CURRENCY] = function (){ return rawValueGenerator.generateDouble(0, 100); };
    recordTypeMapping[consts.RATING] = function (){ return rawValueGenerator.generateDouble(0, 10); };
    recordTypeMapping[consts.DURATION] = function (){ return rawValueGenerator.generateDouble(0, 5); };
    recordTypeMapping[consts.TEXT] = function (){ return rawValueGenerator.generateString(10); };
    recordTypeMapping[consts.MULTI_LINE_TEXT] = function (){ return rawValueGenerator.generateString(100); };
    recordTypeMapping[consts.BIGTEXT] = function (){ return rawValueGenerator.generateString(1000); };
    recordTypeMapping[consts.URL] = function (){ return rawValueGenerator.generateUrl(); };
    recordTypeMapping[consts.EMAIL_ADDRESS] = function (){ return rawValueGenerator.generateEmailInDomain('gmail.com'); };
    recordTypeMapping[consts.PHONE_NUMBER] = function (){ return rawValueGenerator.generatePhoneNumber() };
    recordTypeMapping[consts.CHECKBOX] = function (){ return rawValueGenerator.generateBool()};
    // TODO: Write generators for Date/DateTime/TOD/FileAttach/User fields
    recordTypeMapping[consts.DATE_TIME] = function (){ return rawValueGenerator.generateDate() };
    recordTypeMapping[consts.DATE] = function (){ return rawValueGenerator.generateDateTime() };
    recordTypeMapping[consts.TIME_OF_DAY] = function (){ return rawValueGenerator.generateTime()};
    recordTypeMapping[consts.FILE_ATTACHMENT] = function (){ return rawValueGenerator.generateUrl();};
    recordTypeMapping[consts.USER] = function (){ return 'uid' };

}());
