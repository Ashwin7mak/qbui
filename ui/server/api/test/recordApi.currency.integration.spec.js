'use strict';
var should = require('should');
var assert = require('assert');
var app = require('../../app');
var config = require('../../config/environment');
var recordBase = require('./recordApi.base')(config);
var Promise = require('bluebird');
var _ = require('lodash');

/**
 * Integration test for Currency field formatting
 */
describe('API - Currency record test cases', function () {
    var numberDecimalOnly = .74765432;
    var numberDouble = 98765432100.74765;
    var numberInt = 99;
    var numberNegative = -88.22;

    var appWithNoFlags = {
        "name": "Currency App - no flags",
        "tables": [{
                "name": "table1", "fields": [{
                    "name": "currency",
                    "type": "CURRENCY"
                }
         ]}
    ]};

    var appWithAllRightOfSignFlags = {
        "name": "Currency App - all 'right of sign' flags",
        "tables": [{
            "name": "table1", "fields": [{
                "name": "currency",
                "type": "CURRENCY",
                "decimalPlaces": 2,
                "clientSideAttributes": {
                    "width": 10,
                    "bold": false,
                    "word_wrap": false,
                    "help_text": "help",
                    "separator_start": 3,
                    "separator_mark": ".",
                    "separator_pattern": "THREE_THEN_TWO",
                    "decimal_mark": ",",
                    "position": "RIGHT_OF_SIGN",
                    "symbol": "X"

                }
            }
            ]}
        ]};

    var appWithAllLeftFlags = {
        "name": "Currency App - all 'left' flags",
        "tables": [{
            "name": "table1", "fields": [{
                "name": "currency",
                "type": "CURRENCY",
                "decimalPlaces": 2,
                "clientSideAttributes": {
                    "width": 10,
                    "bold": false,
                    "word_wrap": false,
                    "help_text": "help",
                    "separator_start": 3,
                    "separator_mark": ".",
                    "separator_pattern": "THREE_THEN_TWO",
                    "decimal_mark": ",",
                    "position": "LEFT",
                    "symbol": "\u20BD"

                }
            }
            ]}
        ]};

    var appWithAllRightFlags = {
        "name": "Currency App - all 'right' flags",
        "tables": [{
            "name": "table1", "fields": [{
                "name": "currency",
                "type": "CURRENCY",
                "decimalPlaces": 2,
                "clientSideAttributes": {
                    "width": 10,
                    "bold": false,
                    "word_wrap": false,
                    "help_text": "help",
                    "separator_start": 3,
                    "separator_mark": ".",
                    "separator_pattern": "THREE_THEN_TWO",
                    "decimal_mark": ",",
                    "position": "RIGHT",
                    "symbol": "!"

                }
            }
            ]}
        ]};

    /**
     * DataProvider containing Records and record display expectations for Currency field with no display props set
     */
    function  noFlagsCurrencyDataProvider(fid) {
        // Decimal number
        var decimalInput = [{"id": fid, "value": numberDecimalOnly}];
        var expectedDecimalRecord = {"id": fid, "value": numberDecimalOnly, "display": "$0.74765432000000"};

        // Double number
        var doubleInput = [{"id": fid, "value": numberDouble}];
        var expectedDoubleRecord = {"id": fid, "value": numberDouble, "display": "$98765432100.74765000000000"};

        // Negative number
        var negativeInput = [{"id": fid, "value": numberNegative}];
        var expectedNegativeRecord = {"id": fid, "value": numberNegative, "display": "$-88.22000000000000"};

        // Int number
        var intInput = [{"id": fid, "value": numberInt}];
        var expectedIntRecord = {"id": fid, "value": numberInt, "display": "$99.00000000000000"};

        // Null number
        var nullInput = [{"id": fid, "value": null}];
        var expectedNullRecord = {"id": fid, "value": 0, "display": ""};

        return [
            { message: "display decimal number with no format flags", record: decimalInput, format: "display", expectedFieldValue: expectedDecimalRecord },
            { message: "raw decimal number with no format flags", record: decimalInput, format: "raw", expectedFieldValue: decimalInput },
            { message: "display double number with no format flags", record: doubleInput, format: "display", expectedFieldValue: expectedDoubleRecord },
            { message: "raw double number with no format flags", record: doubleInput, format: "raw", expectedFieldValue: doubleInput },
            { message: "display negative number with no format flags", record: negativeInput, format: "display", expectedFieldValue: expectedNegativeRecord },
            { message: "raw negative number with no format flags", record: negativeInput, format: "raw", expectedFieldValue: negativeInput },
            { message: "display int number with no format flags", record: intInput, format: "display", expectedFieldValue: expectedIntRecord },
            { message: "raw int number with no format flags", record: intInput, format: "raw", expectedFieldValue: intInput },
            { message: "display null number with no format flags", record: nullInput, format: "display", expectedFieldValue: expectedNullRecord },
            { message: "raw null number with no format flags", record: nullInput, format: "raw", expectedFieldValue: nullInput }
        ]
    }

    /**
     * Integration test that validates Currency records formatting with no field property flags set
     */
    it('Should create and retrieve currency display records when no format flags set', function (done) {
        this.timeout(30000);
        recordBase.createApp(appWithNoFlags).then(function (appResponse) {
            var app = JSON.parse(appResponse.body);
            var currencyField;
            app.tables[0].fields.forEach(function (field) {
                if (field.name === 'currency') {
                    currencyField = field;
                }
            });
            assert(currencyField, 'failed to find currency field');
            var records = noFlagsCurrencyDataProvider(currencyField.id);
            //For each of the cases, create the record and execute the request
            var fetchRecordPromises = [];
            records.forEach(function (currentRecord) {
                var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[0].id);
                fetchRecordPromises.push(recordBase.createAndFetchRecord(recordsEndpoint, currentRecord.record, '?format='+currentRecord.format));
            });

            //When all the records have been created and fetched, assert the values match expectations
            Promise.all(fetchRecordPromises)
                .then(function (results) {
                    for (var i = 0; i < results.length; i++) {
                        var currentRecord = results[i];
                        if(results[i].record) {
                            currentRecord = results[i].record;
                        }
                        currentRecord.forEach(function (fieldValue) {
                            if (fieldValue.id === records[i].expectedFieldValue.id) {
                                assert.deepEqual(fieldValue, records[i].expectedFieldValue, 'Unexpected field value returned: '
                                + JSON.stringify(fieldValue) + ', ' + JSON.stringify(records[i].expectedFieldValue));
                            }
                        });
                    }
                    done();
                }).catch(function (errorMsg) {
                    assert(false, 'unable to resolve all records: ' + JSON.stringify(errorMsg));
                    done();
                });
        });
    });

    /**
     * DataProvider containing Records and record display expectations for Currency field with all 'right of sign' display props set
     */
    function  allRightOfSignFlagsCurrencyDataProvider(fid) {
        // Decimal number
        var decimalInput = [{"id": fid, "value": numberDecimalOnly}];
        var expectedDecimalRecord = {"id": fid, "value": numberDecimalOnly, "display": "0,75"};

        // Double number
        var doubleInput = [{"id": fid, "value": numberDouble}];
        var expectedDoubleRecord = {"id": fid, "value": numberDouble, "display": "98.76.54.32.100,75"};

        // Negative number
        var negativeInput = [{"id": fid, "value": numberNegative}];
        var expectedNegativeRecord = {"id": fid, "value": numberNegative, "display": "-X88,22"};

        // Int number
        var intInput = [{"id": fid, "value": numberInt}];
        var expectedIntRecord = {"id": fid, "value": numberInt, "display": "99,00"};

        // Null number
        var nullInput = [{"id": fid, "value": null}];
        var expectedNullRecord = {"id": fid, "value": 0, "display": ""};

        return [
            { message: "display decimal number with all 'right of sign' format flags", record: decimalInput, format: "display", expectedFieldValue: expectedDecimalRecord },
            { message: "raw decimal number with all 'right of sign' format flags", record: decimalInput, format: "raw", expectedFieldValue: decimalInput },
            { message: "display double number with all 'right of sign' format flags", record: doubleInput, format: "display", expectedFieldValue: expectedDoubleRecord },
            { message: "raw double number with all 'right of sign' format flags", record: doubleInput, format: "raw", expectedFieldValue: doubleInput },
            { message: "display negative number with all 'right of sign' format flags", record: negativeInput, format: "display", expectedFieldValue: expectedNegativeRecord },
            { message: "raw negative number with all 'right of sign' format flags", record: negativeInput, format: "raw", expectedFieldValue: negativeInput },
            { message: "display int number with all 'right of sign' format flags", record: intInput, format: "display", expectedFieldValue: expectedIntRecord },
            { message: "raw int number with all format 'right of sign' flags", record: intInput, format: "raw", expectedFieldValue: intInput },
            { message: "display null number with all 'right of sign' format flags", record: nullInput, format: "display", expectedFieldValue: expectedNullRecord },
            { message: "raw null number with all format 'right of sign' flags", record: nullInput, format: "raw", expectedFieldValue: nullInput }
        ]
    }

    /**
     * Integration test that validates Currency records formatting with all 'right of sign' field property flags set
     */
    it('Should create and retrieve currency display records when all "right of sign" format flags set', function (done) {
        this.timeout(30000);
        recordBase.createApp(appWithAllRightOfSignFlags).then(function (appResponse) {
            var app = JSON.parse(appResponse.body);
            var currencyField;
            app.tables[0].fields.forEach(function (field) {
                if (field.name === 'currency') {
                    currencyField = field;
                }
            });
            assert(currencyField, 'failed to find currency field');
            var records = allRightOfSignFlagsCurrencyDataProvider(currencyField.id);
            //For each of the cases, create the record and execute the request
            var fetchRecordPromises = [];
            records.forEach(function (currentRecord) {
                var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[0].id);
                fetchRecordPromises.push(recordBase.createAndFetchRecord(recordsEndpoint, currentRecord.record, '?format='+currentRecord.format));
            });

            //When all the records have been created and fetched, assert the values match expectations
            Promise.all(fetchRecordPromises)
                .then(function (results) {
                    for (var i = 0; i < results.length; i++) {
                        var currentRecord = results[i];
                        if(results[i].record) {
                            currentRecord = results[i].record;
                        }
                        currentRecord.forEach(function (fieldValue) {
                            if (fieldValue.id === records[i].expectedFieldValue.id) {
                                assert.deepEqual(fieldValue, records[i].expectedFieldValue, 'Unexpected field value returned: '
                                + JSON.stringify(fieldValue) + ', ' + JSON.stringify(records[i].expectedFieldValue));
                            }
                        });
                    }
                    done();
                }).catch(function (errorMsg) {
                    assert(false, 'unable to resolve all records: ' + JSON.stringify(errorMsg));
                    done();
                });
        });
    });

    /**
    * DataProvider containing Records and record display expectations for Currency field with all 'right' display props set
    */
    function  allRightFlagsCurrencyDataProvider(fid) {
        // Decimal number
        var decimalInput = [{"id": fid, "value": numberDecimalOnly}];
        var expectedDecimalRecord = {"id": fid, "value": numberDecimalOnly, "display": "0,75 !"};

        // Double number
        var doubleInput = [{"id": fid, "value": numberDouble}];
        var expectedDoubleRecord = {"id": fid, "value": numberDouble, "display": "98.76.54.32.100,75 !"};

        // Negative number
        var negativeInput = [{"id": fid, "value": numberNegative}];
        var expectedNegativeRecord = {"id": fid, "value": numberNegative, "display": "-88,22 !"};

        // Int number
        var intInput = [{"id": fid, "value": numberInt}];
        var expectedIntRecord = {"id": fid, "value": numberInt, "display": "99,00 !"};

        // Null number
        var nullInput = [{"id": fid, "value": null}];
        var expectedNullRecord = {"id": fid, "value": 0, "display": ""};

        return [
            { message: "display decimal number with all 'right' format flags", record: decimalInput, format: "display", expectedFieldValue: expectedDecimalRecord },
            { message: "raw decimal number with all 'right' format flags", record: decimalInput, format: "raw", expectedFieldValue: decimalInput },
            { message: "display double number with all 'right' format flags", record: doubleInput, format: "display", expectedFieldValue: expectedDoubleRecord },
            { message: "raw double number with all 'right' format flags", record: doubleInput, format: "raw", expectedFieldValue: doubleInput },
            { message: "display negative number with all 'right' format flags", record: negativeInput, format: "display", expectedFieldValue: expectedNegativeRecord },
            { message: "raw negative number with all 'right' format flags", record: negativeInput, format: "raw", expectedFieldValue: negativeInput },
            { message: "display int number with all 'right' format flags", record: intInput, format: "display", expectedFieldValue: expectedIntRecord },
            { message: "raw int number with all format 'right' flags", record: intInput, format: "raw", expectedFieldValue: intInput },
            { message: "display null number with all 'right' format flags", record: nullInput, format: "display", expectedFieldValue: expectedNullRecord },
            { message: "raw null number with all format 'right' flags", record: nullInput, format: "raw", expectedFieldValue: nullInput }
        ]
    }

    /**
    * Integration test that validates Currency records formatting with all 'right' field property flags set
    */
    it('Should create and retrieve currency display records when all "right" format flags set', function (done) {
        this.timeout(30000);
        recordBase.createApp(appWithAllRightFlags).then(function (appResponse) {
            var app = JSON.parse(appResponse.body);
            var currencyField;
            app.tables[0].fields.forEach(function (field) {
                if (field.name === 'currency') {
                    currencyField = field;
                }
            });
            assert(currencyField, 'failed to find currency field');
            var records = allRightFlagsCurrencyDataProvider(currencyField.id);
            //For each of the cases, create the record and execute the request
            var fetchRecordPromises = [];
            records.forEach(function (currentRecord) {
                var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[0].id);
                fetchRecordPromises.push(recordBase.createAndFetchRecord(recordsEndpoint, currentRecord.record, '?format='+currentRecord.format));
            });

            //When all the records have been created and fetched, assert the values match expectations
            Promise.all(fetchRecordPromises)
                .then(function (results) {
                    for (var i = 0; i < results.length; i++) {
                        var currentRecord = results[i];
                        if(results[i].record) {
                            currentRecord = results[i].record;
                        }
                        currentRecord.forEach(function (fieldValue) {
                            if (fieldValue.id === records[i].expectedFieldValue.id) {
                                assert.deepEqual(fieldValue, records[i].expectedFieldValue, 'Unexpected field value returned: '
                                + JSON.stringify(fieldValue) + ', ' + JSON.stringify(records[i].expectedFieldValue));
                            }
                        });
                    }
                    done();
                }).catch(function (errorMsg) {
                    assert(false, 'unable to resolve all records: ' + JSON.stringify(errorMsg));
                    done();
                });
        });
    });

    /**
     * DataProvider containing Records and record display expectations for Currency field with all 'left' display props set
     */
    function  allLeftFlagsCurrencyDataProvider(fid) {
        // Decimal number
        var decimalInput = [{"id": fid, "value": numberDecimalOnly}];
        var expectedDecimalRecord = {"id": fid, "value": numberDecimalOnly, "display": "\u20BD0,75"};

        // Double number
        var doubleInput = [{"id": fid, "value": numberDouble}];
        var expectedDoubleRecord = {"id": fid, "value": numberDouble, "display": "\u20BD98.76.54.32.100,75"};

        // Negative number
        var negativeInput = [{"id": fid, "value": numberNegative}];
        var expectedNegativeRecord = {"id": fid, "value": numberNegative, "display": "\u20BD-88,22"};

        // Int number
        var intInput = [{"id": fid, "value": numberInt}];
        var expectedIntRecord = {"id": fid, "value": numberInt, "display": "\u20BD99,00"};

        // Null number
        var nullInput = [{"id": fid, "value": null}];
        var expectedNullRecord = {"id": fid, "value": 0, "display": ""};

        return [
            { message: "display decimal number with all 'left' format flags", record: decimalInput, format: "display", expectedFieldValue: expectedDecimalRecord },
            { message: "raw decimal number with all 'left' format flags", record: decimalInput, format: "raw", expectedFieldValue: decimalInput },
            { message: "display double number with all 'left' format flags", record: doubleInput, format: "display", expectedFieldValue: expectedDoubleRecord },
            { message: "raw double number with all 'left' format flags", record: doubleInput, format: "raw", expectedFieldValue: doubleInput },
            { message: "display negative number with all 'left' format flags", record: negativeInput, format: "display", expectedFieldValue: expectedNegativeRecord },
            { message: "raw negative number with all 'left' format flags", record: negativeInput, format: "raw", expectedFieldValue: negativeInput },
            { message: "display int number with all 'left' format flags", record: intInput, format: "display", expectedFieldValue: expectedIntRecord },
            { message: "raw int number with all format 'left' flags", record: intInput, format: "raw", expectedFieldValue: intInput },
            { message: "display null number with all 'left' format flags", record: nullInput, format: "display", expectedFieldValue: expectedNullRecord },
            { message: "raw null number with all format 'left' flags", record: nullInput, format: "raw", expectedFieldValue: nullInput }
        ]
    }

    /**
     * Integration test that validates Currency records formatting with all 'left' field property flags set
     */
    it('Should create and retrieve currency display records when all "left" format flags set', function (done) {
        this.timeout(30000);
        recordBase.createApp(appWithAllLeftFlags).then(function (appResponse) {
            var app = JSON.parse(appResponse.body);
            var currencyField;
            app.tables[0].fields.forEach(function (field) {
                if (field.name === 'currency') {
                    currencyField = field;
                }
            });
            assert(currencyField, 'failed to find currency field');
            var records = allLeftFlagsCurrencyDataProvider(currencyField.id);
            //For each of the cases, create the record and execute the request
            var fetchRecordPromises = [];
            records.forEach(function (currentRecord) {
                var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[0].id);
                fetchRecordPromises.push(recordBase.createAndFetchRecord(recordsEndpoint, currentRecord.record, '?format='+currentRecord.format));
            });

            //When all the records have been created and fetched, assert the values match expectations
            Promise.all(fetchRecordPromises)
                .then(function (results) {
                    for (var i = 0; i < results.length; i++) {
                        var currentRecord = results[i];
                        if(results[i].record) {
                            currentRecord = results[i].record;
                        }
                        currentRecord.forEach(function (fieldValue) {
                            if (fieldValue.id === records[i].expectedFieldValue.id) {
                                assert.deepEqual(fieldValue, records[i].expectedFieldValue, 'Unexpected field value returned: '
                                + JSON.stringify(fieldValue) + ', ' + JSON.stringify(records[i].expectedFieldValue));
                            }
                        });
                    }
                    done();
                }).catch(function (errorMsg) {
                    assert(false, 'unable to resolve all records: ' + JSON.stringify(errorMsg));
                    done();
                });
        });
    });

    //Cleanup the test realm after all tests in the block
    after(function (done) {
        //Realm deletion takes time, bump the timeout
        this.timeout(20000);
        recordBase.apiBase.cleanup().then(function () {
            done();
        });
    });
});
