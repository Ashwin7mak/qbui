'use strict';
var should = require('should');
var assert = require('assert');
var app = require('../../app');
var config = require('../../config/environment');
var recordBase = require('./recordApi.base')(config);
var Promise = require('bluebird');
var _ = require('lodash');
var consts = require('../constants');
var log = require('../../logger').getLogger();


describe('API - Validate report execution', function () {
    var numberDecimalOnly = '0.74765432';
    var appWithNoFlags = {
        "name": "Percent App - no flags",
        "tables": [{
            "name": "table1", "fields": [{
                "name": "percent",
                "type": "PERCENT"
            }
            ]}
        ]};

    function  recordProvider(fid) {
        // Decimal number
        var decimalInput = '[{"id": ' + fid + ', "value": ' + numberDecimalOnly + '}]';
        var expectedDecimalRecord = '{"id": ' + fid + ', "value": ' + numberDecimalOnly + ', "display": "0.74765432000000%"}';
        return { message: "display decimal number with no format flags",
                record: decimalInput,
                format: "display",
                expectedFieldValue: expectedDecimalRecord };
    }

    it('Should create an app, add a record, create a report, execute the report, and validate the resulting ' +
        'record matches the created record', function (done) {
        this.timeout(30000);
        recordBase.createApp(appWithNoFlags).then(function (appResponse) {
            var app = JSON.parse(appResponse.body);
            var percentField;
            app.tables[0].fields.forEach(function (field) {
                if (field.name === 'percent') {
                    percentField = field;
                }
            });
            assert(percentField, 'failed to find percent field');
            var testCase = recordProvider(percentField.id);
            //For each of the cases, create the record and execute the request
            var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[0].id);
            recordBase.createAndFetchRecord(recordsEndpoint, JSON.parse(testCase.record), '?format=' + testCase.format);

            var reportEndpoint = recordBase.apiBase.resolveReportsEndpoint(app.id, app.tables[0].id);
            var reportToCreate = {
                "name": "test report",
                "type": "TABLE",
                "tableId": app.tables[0].id
            };
            recordBase.apiBase.executeRequest(reportEndpoint, consts.POST, reportToCreate)
                .then(function(report) {
                    var r = JSON.parse(report.body);
                    recordBase.apiBase.executeRequest(reportEndpoint + r.id + '/results?format=' + testCase.format, consts.GET)
                        .then(function(reportResults) {
                            var results = JSON.parse(reportResults.body);
                            for (var i = 0; i < results.records.length; i++) {
                                var currentRecord = results.records[i];
                                currentRecord.forEach(function (fieldValue) {
                                    if (fieldValue.id === JSON.parse(testCase.expectedFieldValue).id) {
                                        assert.deepEqual(fieldValue, JSON.parse(testCase.expectedFieldValue),
                                            'Unexpected field value returned: '
                                            + JSON.stringify(fieldValue) + ', ' + testCase.expectedFieldValue);
                                    }
                                });
                            }
                            done();
                        });
                }).catch(function(error){ log.error(JSON.stringify(error)); });
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
