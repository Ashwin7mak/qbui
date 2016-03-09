/**
 * Created by xhe on 3/1/16.
 */
'use strict';

var config = {javaHost: 'http://javaHost', SSL_KEY: {private: 'privateKey', cert: 'cert', requireCert: true}};
var sinon = require('sinon');
var assert = require('assert');
var requestHelper = require('./../requestHelper')(config);
var recordsApi = require('../recordsApi')(config);

/**
 * Unit tests for records apis
 */
describe("Validate recordsApi", function() {
    var req = {
        headers: {
            'Content-Type': 'content-type'
        },
        'url': '',
        'method': 'get',
        param : function(key) {
            if (key === 'format') {
                return 'raw';
            } else {
                throw new Error("UNexpected key", key);
            }
        }
    };

    describe("when fetchRecords is called", function() {
        var executeReqStub = null;

        beforeEach(function() {
            executeReqStub = sinon.stub(requestHelper, "executeRequest");
            recordsApi.setRequestHelperObject(requestHelper);
        });

        afterEach(function() {
            executeReqStub.restore();
        });

        it('success return results ', function(done) {
            req.url = '/reports/2/reportComponents';

            var targetObject = "[{records: [], fields: []}, {records: [], fields: []}]";
            executeReqStub.returns(Promise.resolve(targetObject));
            var promise = recordsApi.fetchRecords(req);

            promise.then(
                function(response) {
                    assert.deepEqual(response, targetObject);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve all records: ' + JSON.stringify(errorMsg)));
            });

        });

        it('fail return results ', function(done) {
            req.url = '/reports/2/reportComponents';
            var error_message = "fail unit test case execution";

            executeReqStub.returns(Promise.reject(new Error(error_message)));
            var promise = recordsApi.fetchRecords(req);

            promise.then(
                function(error) {
                },
                function(error) {
                    assert.equal(error, "Error: fail unit test case execution");
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve all records: ' + JSON.stringify(errorMsg)));
            });

        });
    });

    describe("when fetchFields is called", function() {
        var executeReqStub = null;

        beforeEach(function() {
            executeReqStub = sinon.stub(requestHelper, "executeRequest");
            recordsApi.setRequestHelperObject(requestHelper);
        });

        afterEach(function() {
            executeReqStub.restore();
        });

        it('success return records array ', function(done) {
            req.url = '/reports/2/records';
            var targetObject = "[{records: [], fields: []}, {records: [], fields: []}]";

            executeReqStub.returns(Promise.resolve(targetObject));
            var promise = recordsApi.fetchFields(req);

            promise.then(
                function(response) {
                    assert.deepEqual(response, targetObject);

                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve all records: ' + JSON.stringify(errorMsg)));
            });
        });

        it('fail return value ', function(done) {
            req.url = '/reports/2/records';
            var error_message = "fail unit test case execution";

            executeReqStub.returns(Promise.reject(new Error(error_message)));
            var promise = recordsApi.fetchFields(req);

            promise.then(
                function(msg) {
                    done();
                },
                function(error) {
                    assert.equal(error, "Error: " + error_message);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve all records: ' + JSON.stringify(errorMsg)));
            });

        });
    });

    describe("when fetchSingleRecordAndFields is called", function() {
        var executeReqStub = null;

        beforeEach(function() {
            executeReqStub = sinon.stub(requestHelper, "executeRequest");
            recordsApi.setRequestHelperObject(requestHelper);
        });

        afterEach(function() {
            executeReqStub.restore();
        });

        it('success return records array with raw parameter type', function(done) {
            req.url = '/reports/2/records/2/fields';
            var expectedID = '12345.22';
            executeReqStub.returns(Promise.resolve({'body': expectedID}));
            var promise = recordsApi.fetchSingleRecordAndFields(req);
            promise.then(
                function(response) {
                    assert.equal(response, expectedID);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve all records: ' + JSON.stringify(errorMsg)));
            });

        });

        it('success return records array with display parameter type', function(done) {
            req.url = '/reports/2/records/2/fields';
            req.param = function(key) {
                return 'display';
            };
            var expectedID = "7777";
            executeReqStub.onCall(0).returns(Promise.resolve({'body': '[{ "id":2, "value": 1234525}, { "id":2, "value": 1234525}]'}));
            executeReqStub.onCall(1).returns(Promise.resolve({'body': '[{ "id":2, "value": 123454, "datatypeAttributes": { "type": "TEXT"}, "display": "12-3454"}, { "id":2, "value": 123454, "datatypeAttributes": { "type": "TEXT"}, "display": "12-3454"}]'}));
            var promise = recordsApi.fetchSingleRecordAndFields(req);
            promise.then(
                function(response) {
                    assert.equal(response.fields[0].display, '12-3454');
                    assert.equal(response.record[0].display, '1234525');
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve all records: ' + JSON.stringify(errorMsg)));
            });
        });
    });

    describe("when fetchRecordsAndFields is called", function() {
        var executeReqStub = null;

        beforeEach(function() {
            executeReqStub = sinon.stub(requestHelper, "executeRequest");
            recordsApi.setRequestHelperObject(requestHelper);
        });

        afterEach(function() {
            executeReqStub.restore();
        });

        it('success return records array with display parameter type', function(done) {
            req.url = '/reports/2/records/2/fields';
            req.param = function(key) {
                return 'display';
            };
            var expectedID = "7777";
            executeReqStub.onCall(0).returns(Promise.resolve({'body': '[[ {"id":2, "value": 1234525} ], [ {"id":2, "value": 1234525} ]]'}));
            executeReqStub.onCall(1).returns(Promise.resolve({'body': '[{ "id":2, "value": 123454, "datatypeAttributes": { "type": "TEXT"}, "display": "12-3454"}, { "id":2, "value": 123454, "datatypeAttributes": { "type": "TEXT"}, "display": "12-3454"}]'}));
            var promise = recordsApi.fetchRecordsAndFields(req);
            promise.then(
                function(response) {
                    assert.equal(response.fields[0].display, '12-3454');
                    assert.equal(response.records[0][0].display, '1234525');
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve all records: ' + JSON.stringify(errorMsg)));
            });
        });
    });
});
