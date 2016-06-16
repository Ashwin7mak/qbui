/**
 * A test to test our test generation code
 * Created by cschneider1 on 6/1/15.
 */
(function() {
    'use strict';

    var tableGenerator = require('../table.generator');
    var fieldGenerator = require('../field.generator');
    var tableConsts = require('../table.constants');
    var fieldConsts = require('../field.constants');
    var datatypeConsts = require('../datatype.attributes.constants');
    var consts = require('../../server/src/api/constants');
    var _ = require('lodash');
    var assert = require('assert');

    /**
     * Unit tests for field generator
     */
    describe('Table generator unit test', function() {

        /**
         * Unit test that validates generating a table with all field types
         */
        describe('test generating a table with all field types', function() {
            var table = tableGenerator.generateTableWithAllFieldTypes();

            if (!table[tableConsts.NAME]) {
                assert.fail('Table should be generated with a name');
            }

            var fields = table[tableConsts.FIELDS];
            var availableFieldTypes = fieldGenerator.getAvailableFieldTypes();
            var availableDataTypes = fieldGenerator.getAvailableDataTypes();

            if (fields.length !== (availableFieldTypes.length * availableDataTypes.length)) {
                assert.fail('Did not find the right number of fields. Expected ' +
                            fieldGenerator.getAvailableFieldTypes().length + '. Table: ' +
                            tableGenerator.tableToJsonString(table));
            }

            var fieldsCreated = {};

            _.forEach(fields, function(field) {
                if (!fieldsCreated[field[fieldConsts.fieldKeys.TYPE]]) {
                    fieldsCreated[field[fieldConsts.fieldKeys.TYPE]] = {};
                }

                if (!fieldsCreated[field[fieldConsts.fieldKeys.TYPE][datatypeConsts.dataTypeKeys.TYPE]]) {
                    fieldsCreated[field[fieldConsts.fieldKeys.TYPE]][field[fieldConsts.fieldKeys.DATA_TYPE_ATTRIBUTES][datatypeConsts.dataTypeKeys.TYPE]] = 1;
                } else {
                    fieldsCreated[field[fieldConsts.fieldKeys.TYPE]][field[fieldConsts.fieldKeys.DATA_TYPE_ATTRIBUTES][datatypeConsts.dataTypeKeys.TYPE]] += 1;
                }
            });

            _.forEach(availableFieldTypes, function(fieldType) {
                _.forEach(availableDataTypes, function(dataType) {
                    assert.equal(fieldsCreated[fieldType][dataType], 1, 'We should have a single field per field type / data type combination');
                });
            });
        });

        /**
         * Unit test that validates generating a table with a random number of fields
         */
        describe('test generating a table with all field types', function() {
            var table = tableGenerator.generateTable();

            if (!table[tableConsts.NAME]) {
                assert.fail('Table should be generated with a name');
            }

            var fields = table[tableConsts.FIELDS];

            if (fields.length > tableGenerator.getMaxNumberRandomFields()) {
                assert.fail('Did not find the right number of fields. Expected a number less than ' +
                            tableGenerator.getMaxNumberRandomFields() + ' but got number ' + fields.length + ' . Table: ' +
                            tableGenerator.tableToJsonString(table));
            }
        });

        function tableOfCertainSizeAndTypeProvider() {
            return [
                {message: 'checkbox field table', numFields: 10, fieldType: consts.SCALAR, dataType: consts.CHECKBOX},
                {message: 'text field table', numFields: 10, fieldType: consts.SCALAR, dataType: consts.TEXT},
                {message: 'phone number field table', numFields: 10, fieldType: consts.SCALAR, dataType: consts.PHONE_NUMBER},
                {message: 'date field table', numFields: 10, fieldType: consts.SCALAR, dataType: consts.DATE},
                {message: 'formula duration field table', numFields: 10, fieldType: consts.FORMULA, dataType: consts.DURATION},
                {message: 'formula date field table', numFields: 10, fieldType: consts.FORMULA, dataType: consts.DATE},
                {message: 'duration field table', numFields: 10, fieldType: consts.SCALAR, dataType: consts.DURATION},
                {message: 'formula time of day field table', numFields: 10, fieldType: consts.FORMULA, dataType: consts.TIME_OF_DAY},
                {message: 'time of day field table', numFields: 10, fieldType: consts.SCALAR, dataType: consts.TIME_OF_DAY},
                {message: 'numeric field table', numFields: 10, fieldType: consts.SCALAR, dataType: consts.NUMERIC},
                {message: 'formula numeric field table', numFields: 10, fieldType: consts.FORMULA, dataType: consts.NUMERIC},
                {message: 'currency field table', numFields: 10, fieldType: consts.SCALAR, dataType: consts.CURRENCY},
                {message: 'rating field table', numFields: 10, fieldType: consts.SCALAR, dataType: consts.RATING},
                {message: 'formula currency field table', numFields: 10, fieldType: consts.FORMULA, dataType: consts.CURRENCY},
                {message: 'percent field table', numFields: 10, fieldType: consts.SCALAR, dataType: consts.PERCENT},
                {message: 'formula percent field table', numFields: 10, fieldType: consts.FORMULA, dataType: consts.PERCENT},
                {message: 'url field table', numFields: 10, fieldType: consts.SCALAR, dataType: consts.URL},
                {message: 'email address field table', numFields: 10, fieldType: consts.SCALAR, dataType: consts.EMAIL_ADDRESS},
                {message: 'user field table', numFields: 10, fieldType: consts.SCALAR, dataType: consts.USER},
                {message: 'formula user field table', numFields: 10, fieldType: consts.FORMULA, dataType: consts.USER},
                {message: 'file attachment field table', numFields: 10, fieldType: consts.SCALAR, dataType: consts.FILE_ATTACHMENT},
                {message: 'report link field table', numFields: 10, fieldType: consts.SCALAR, dataType: consts.REPORT_LINK},
                {message: 'summary field table', numFields: 10, fieldType: consts.SCALAR, dataType: consts.SUMMARY},
                {message: 'lookup field table', numFields: 10, fieldType: consts.SCALAR, dataType: consts.LOOKUP},
                {message: 'formula phone number field table', numFields: 10, fieldType: consts.FORMULA, dataType: consts.PHONE_NUMBER},
                {message: 'formula url field table', numFields: 10, fieldType: consts.FORMULA, dataType: consts.URL},
                {message: 'formula checkbox field table', numFields: 10, fieldType: consts.FORMULA, dataType: consts.CHECKBOX},
                {message: 'formula text field table', numFields: 10, fieldType: consts.FORMULA, dataType: consts.TEXT},
                {message: 'formula email address field table', numFields: 10, fieldType: consts.FORMULA, dataType: consts.EMAIL_ADDRESS},
                {message: 'text field table with no fields', numFields: 0, fieldType: consts.SCALAR, dataType: consts.TEXT},
                {message: 'text field table with 1 field', numFields: 1, fieldType: consts.SCALAR, dataType: consts.TEXT},
            ];
        }

        /**
         * Unit test that validates generating a table with a fixed number of fields of a particular type
         */
        describe('test generating a table with fixed name and type', function() {
            tableOfCertainSizeAndTypeProvider().forEach(function(entry) {
                it('Test case: ' + entry.message, function(done) {
                    var numFields = 14;
                    var table = tableGenerator.generateTableWithFieldsOfType(numFields, entry.fieldType, entry.dataType);

                    if (!table[tableConsts.NAME]) {
                        assert.fail('Table should be generated with a name');
                    }

                    var fields = table[tableConsts.FIELDS];

                    if (fields.length !== numFields) {
                        assert.fail('Did not find the right number of fields. Expected ' + numFields +
                                    '. Table: ' +
                                    tableGenerator.tableToJsonString(table));
                    }

                    _.forEach(fields, function(field) {
                        if (field[fieldConsts.fieldKeys.TYPE] !== entry.fieldType) {
                            assert.fail('Did not find the right fieldType. Expected ' +
                                        entry.fieldType + '. Table: ' +
                                        tableGenerator.tableToJsonString(table));
                        }

                        if (field[fieldConsts.fieldKeys.DATA_TYPE_ATTRIBUTES][datatypeConsts.dataTypeKeys.TYPE] !== entry.dataType) {
                            assert.fail('Did not find the right dataType. Expected ' +
                                        entry.dataType + '. Table: ' +
                                        tableGenerator.tableToJsonString(table));
                        }
                    });

                    done();
                });
            });
        });

        function tableFromFieldMapProvider() {
            var fieldNameToTypeMap = {};
            fieldNameToTypeMap['checkbox field'] = {fieldType: consts.SCALAR, dataType: consts.CHECKBOX};
            fieldNameToTypeMap['text field'] = {fieldType: consts.SCALAR, dataType: consts.TEXT};
            fieldNameToTypeMap['phone number field'] = {fieldType: consts.SCALAR, dataType: consts.PHONE_NUMBER};
            fieldNameToTypeMap['date field'] = {fieldType: consts.SCALAR, dataType: consts.DATE};
            fieldNameToTypeMap['formula duration field'] = {fieldType: consts.FORMULA, dataType: consts.DURATION};
            fieldNameToTypeMap['formula date field'] = {fieldType: consts.FORMULA, dataType: consts.DATE};
            fieldNameToTypeMap['duration field'] = {fieldType: consts.SCALAR, dataType: consts.DURATION};
            fieldNameToTypeMap['formula time of day field'] = {fieldType: consts.FORMULA, dataType: consts.TIME_OF_DAY};
            fieldNameToTypeMap['time of day field'] = {fieldType: consts.SCALAR, dataType: consts.TIME_OF_DAY};
            fieldNameToTypeMap['numeric field'] = {fieldType: consts.SCALAR, dataType: consts.NUMERIC};
            fieldNameToTypeMap['formula numeric field'] = {fieldType: consts.FORMULA, dataType: consts.NUMERIC};
            fieldNameToTypeMap['currency field'] = {fieldType: consts.SCALAR, dataType: consts.CURRENCY};
            fieldNameToTypeMap['rating field'] = {fieldType: consts.SCALAR, dataType: consts.RATING};
            fieldNameToTypeMap['formula currency field'] = {fieldType: consts.FORMULA, dataType: consts.CURRENCY};
            fieldNameToTypeMap['percent field'] = {fieldType: consts.SCALAR, dataType: consts.PERCENT};
            fieldNameToTypeMap['formula percent field'] = {fieldType: consts.FORMULA, dataType: consts.PERCENT};
            fieldNameToTypeMap['url field'] = {fieldType: consts.SCALAR, dataType: consts.URL};
            fieldNameToTypeMap['email address field'] = {fieldType: consts.SCALAR, dataType: consts.EMAIL_ADDRESS};
            fieldNameToTypeMap['user field'] = {fieldType: consts.SCALAR, dataType: consts.USER};
            fieldNameToTypeMap['formula user field'] = {fieldType: consts.FORMULA, dataType: consts.USER};
            fieldNameToTypeMap['file attachment field'] = {fieldType: consts.SCALAR, dataType: consts.FILE_ATTACHMENT};
            fieldNameToTypeMap['report link field'] = {fieldType: consts.SCALAR, dataType: consts.REPORT_LINK};
            fieldNameToTypeMap['summary field'] = {fieldType: consts.SUMMARY, dataType: consts.NUMERIC};
            fieldNameToTypeMap['lookup field'] = {fieldType: consts.LOOKUP, dataType: consts.TEXT};
            fieldNameToTypeMap['formula phone number field'] = {fieldType: consts.FORMULA, dataType: consts.PHONE_NUMBER};
            fieldNameToTypeMap['formula url field'] = {fieldType: consts.FORMULA, dataType: consts.URL};
            fieldNameToTypeMap['formula checkbox field'] = {fieldType: consts.FORMULA, dataType: consts.CHECKBOX};
            fieldNameToTypeMap['formula text field'] = {fieldType: consts.FORMULA, dataType: consts.TEXT};
            fieldNameToTypeMap['formula email address field'] = {fieldType: consts.FORMULA, dataType: consts.EMAIL_ADDRESS};


            return [
                {message: 'generate a table based on a map holding custom names and all field types', fieldMap: fieldNameToTypeMap}
            ];
        }

        /**
         * Unit test that validates generating a table based on a map of fieldName: fieldType
         */
        describe('test generating a table with a map of custom name to field type ', function() {
            tableFromFieldMapProvider().forEach(function(entry) {
                it('Test case: ' + entry.message, function(done) {
                    var fieldMap = entry.fieldMap;
                    var table = tableGenerator.generateTableWithFieldMap(fieldMap);

                    if (!table[tableConsts.NAME]) {
                        assert.fail('Table should be generated with a name');
                    }

                    var fields = table[tableConsts.FIELDS];
                    var fieldNames = Object.keys(fieldMap);
                    if (fields.length !== fieldNames.length) {
                        assert.fail('Did not find the right number of fields. Expected ' + fieldNames.length +
                                    '. Table: ' +
                                    tableGenerator.tableToJsonString(table));
                    }

                    var fieldFoundMap = {};
                    _.forEach(fields, function(field) {
                        _.forEach(fieldMap, function(fieldType, fieldName) {
                            //If we have found the field that we expect to have been generated from the map, then put it in the fieldFoundMap
                            if (field[fieldConsts.fieldKeys.TYPE] === fieldMap[fieldName].fieldType &&
                                field[fieldConsts.fieldKeys.DATA_TYPE_ATTRIBUTES][datatypeConsts.dataTypeKeys.TYPE] === fieldMap[fieldName].dataType &&
                                field[fieldConsts.fieldKeys.NAME] === fieldName) {

                                if (!fieldFoundMap[field[fieldConsts.fieldKeys.NAME]]) {
                                    fieldFoundMap[field[fieldConsts.fieldKeys.NAME]] = 1;
                                } else {
                                    fieldFoundMap[field[fieldConsts.fieldKeys.NAME]] += 1;
                                }
                            }
                        });
                    });

                    fieldNames.forEach(function(fieldName) {
                        if (!fieldFoundMap[fieldName] || fieldFoundMap[fieldName] > 1) {
                            assert.fail('Could not find expected field with name' + fieldName +
                                        ' and type ' + fieldMap[fieldName] + '. Table created: ' +
                                        tableGenerator.tableToJsonString(table));
                        }
                    });

                    done();
                });
            });
        });

        function tableOfCertainSizeAndSetOfTypesProvider() {
            return [
                {
                    message     : 'all Types, 50 fields', numFields: 50,
                    choicesArray: [
                        consts.BIGTEXT,
                        consts.CHECKBOX,
                        consts.CURRENCY,
                        consts.DATE,
                        consts.DATE_TIME,
                        consts.DURATION,
                        consts.EMAIL_ADDRESS,
                        consts.FILE_ATTACHMENT,
                        consts.LOOKUP,
                        consts.NUMERIC,
                        consts.PERCENT,
                        consts.PHONE_NUMBER,
                        consts.RATING,
                        consts.REPORT_LINK,
                        consts.SUMMARY,
                        consts.TEXT,
                        consts.TIME_OF_DAY,
                        consts.URL,
                        consts.USER
                    ]
                },
                {
                    message     : 'text Types 5 fields', numFields: 5,
                    choicesArray: [consts.TEXT, consts.NUMERIC, consts.DATE]
                },
                {
                    message     : 'null Types 1 fields', numFields: 1,
                    choicesArray: null
                },
                {
                    message     : '1 Types 0 fields', numFields: 0,
                    choicesArray: [consts.URL]
                },
                {
                    message     : '0 Types 0 fields', numFields: 0,
                    choicesArray: []
                }
            ];
        }

        /**
         * Unit test that validates generating a table with a fixed number of fields of allowed types
         */
        describe('test generating a table with number of fields of allowed set of types', function() {
            tableOfCertainSizeAndSetOfTypesProvider().forEach(function(entry) {
                it('Test case: ' + entry.message, function(done) {
                    var numFields = entry.numFields;
                    var table = tableGenerator.generateTableWithFieldsOfAllowedTypes(numFields, entry.choicesArray);

                    if (!table[tableConsts.NAME]) {
                        assert.fail('Table should be generated with a name');
                    }

                    var fields = table[tableConsts.FIELDS];

                    if (numFields === 0 || !entry.choicesArray) {
                        assert.strictEqual(fields, undefined, 'expected table with no fields');
                    } else if (fields && fields.length !== numFields) {
                        assert.fail('Did not find the right number of fields. Expected ' + numFields +
                                    '. Table: ' +
                                    tableGenerator.tableToJsonString(table));
                    }

                    _.forEach(fields, function(field) {
                        if (!_.includes(entry.choicesArray, field[fieldConsts.fieldKeys.TYPE])) {
                            assert.fail('Did not find a valid fieldType. one of allowed but got ' +
                                        field[fieldConsts.fieldKeys.TYPE] + '. Table: ' +
                                        tableGenerator.tableToJsonString(table));
                        }
                    });

                    done();
                });
            });
        });

    });

}());


