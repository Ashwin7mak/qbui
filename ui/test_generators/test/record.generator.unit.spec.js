/**
 * Unit tests for record.generator.js
 * Created by klabak on 6/1/15.
 */

'use strict';

var consts = require('../../server/api/constants');
var fieldGenerator = require('./../field.generator.js');
var recordGenerator = require('./../record.generator.js');
var assert = require('assert');

describe('Record generator', function () {

    it('Should generate a record with values based on the field type', function () {
        // Generate fields
        var textField = fieldGenerator.generateBaseField(consts.MULTI_LINE_TEXT);
        console.log('field: ' + JSON.stringify(textField));

        var timeOfDayField = fieldGenerator.generateBaseField(consts.TIME_OF_DAY);
        console.log('field: ' + JSON.stringify(timeOfDayField));

        var fields = [];
        fields.push(textField);
        fields.push(timeOfDayField);

        var recordJson = recordGenerator.generateRecord(fields);
        console.log(recordJson);
    });

});

