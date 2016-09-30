/**
 * Created by xhe on 3/1/16.
 */
'use strict';

var config = {javaHost: 'http://javaHost', SSL_KEY: {private: 'privateKey', cert: 'cert', requireCert: true}};
var sinon = require('sinon');
var assert = require('assert');
var requestHelper = require('./../../../src/api/quickbase/requestHelper')(config);
var recordsApi = require('../../../src/api/quickbase/recordsApi')(config);
var constants = require('../../../../common/src/constants');
var dataErrorCodes = require('../../../../common/src/dataEntryErrorCodes');

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
        params: {},
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
            req.params = {};
        });

        it('success return results for all records', function(done) {
            req.url = '/apps/123/tables/456/records';

            var targetObject = "[{records: [], fields: []}, {records: [], fields: []}]";
            executeReqStub.returns(Promise.resolve(targetObject));
            var promise = recordsApi.fetchRecords(req);

            promise.then(
                function(response) {
                    assert.deepEqual(response, targetObject);
                    done();
                },
                function(error) {
                    assert.fail('fail', 'success', 'failure response returned when success expected');
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve all records: ' + JSON.stringify(errorMsg)));
            });
        });

        it('success return results for record 1', function(done) {
            req.url = '/apps/123/tables/456/records/1?param=true';
            req.params.recordId = 1;

            var targetObject = "[{records: [], fields: []}, {records: [], fields: []}]";
            executeReqStub.returns(Promise.resolve(targetObject));
            var promise = recordsApi.fetchRecords(req);

            promise.then(
                function(response) {
                    assert.deepEqual(response, targetObject);
                    done();
                },
                function(error) {
                    assert.fail('fail', 'success', 'failure response returned when success expected');
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve all records: ' + JSON.stringify(errorMsg)));
            });
        });

        it('success return results for reportComponents', function(done) {
            req.url = '/apps/123/tables/456/reports/2/reportComponents';

            var targetObject = "[{records: [], fields: []}, {records: [], fields: []}]";
            executeReqStub.returns(Promise.resolve(targetObject));
            var promise = recordsApi.fetchRecords(req);

            promise.then(
                function(response) {
                    assert.deepEqual(response, targetObject);
                    done();
                },
                function(error) {
                    assert.fail('fail', 'success', 'failure response returned when success expected');
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve all records: ' + JSON.stringify(errorMsg)));
            });
        });

        it('success return results for reportComponents with sortList', function(done) {
            req.url = '/apps/123/tables/456/reports/2/reportComponents?sortList=1';
            req.params.sortList = '1';

            var targetObject = "[{records: [], fields: []}, {records: [], fields: []}]";
            executeReqStub.returns(Promise.resolve(targetObject));
            var promise = recordsApi.fetchRecords(req);

            promise.then(
                function(response) {
                    assert.deepEqual(response, targetObject);
                    done();
                },
                function(error) {
                    assert.fail('fail', 'success', 'failure response returned when success expected');
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
                    assert.fail('success', 'fail', 'success response returned when fail expected');
                    done();
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
            req.params = {};
        });

        it('success return select field with parameter ', function(done) {
            req.url = '/apps/123/tables/456/fields/789?show=tell';
            req.params.fieldId = '789';

            var targetObject = "[{records: [], fields: []}, {records: [], fields: []}]";

            executeReqStub.returns(Promise.resolve(targetObject));
            var promise = recordsApi.fetchFields(req);

            promise.then(
                function(response) {
                    assert.deepEqual(response, targetObject);
                    done();
                },
                function(error) {
                    assert.fail('fail', 'success', 'failure response returned when success expected');
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve all records: ' + JSON.stringify(errorMsg)));
            });
        });

        it('success return fields array', function(done) {
            req.url = '/apps/123/tables/456/fields';

            var targetObject = "[{records: [], fields: []}, {records: [], fields: []}]";

            executeReqStub.returns(Promise.resolve(targetObject));
            var promise = recordsApi.fetchFields(req);

            promise.then(
                function(response) {
                    assert.deepEqual(response, targetObject);
                    done();
                },
                function(error) {
                    assert.fail('fail', 'success', 'failure response returned when success expected');
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve all records: ' + JSON.stringify(errorMsg)));
            });
        });

        it('fail return fields with non-fields request url', function(done) {
            req.url = '/reports/2/records';
            var error_message = "fail unit test case execution";

            executeReqStub.returns(Promise.reject(new Error(error_message)));
            var promise = recordsApi.fetchFields(req);

            promise.then(
                function(error) {
                    assert.fail('success', 'fail', 'success response returned when fail expected');
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
            req.url = '/apps/1/tables/2/records/3?format=raw';
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
            req.url = '/apps/1/tables/2/records/3?format=display';
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

        it('success return records array with display parameter type and no grouping', function(done) {
            req.url = '/apps/1/tables/2/records/3?format=display';
            req.url += '&' + constants.REQUEST_PARAMETER.SORT_LIST + '=1:V';

            executeReqStub.onCall(0).returns(Promise.resolve({'body': '[[ {"id":2, "value": 1234525} ], [ {"id":2, "value": 1234525} ]]'}));
            executeReqStub.onCall(1).returns(Promise.resolve({'body': '[{ "id":2, "value": 123454, "datatypeAttributes": { "type": "TEXT"}, "display": "12-3454"}, { "id":2, "value": 123454, "datatypeAttributes": { "type": "TEXT"}, "display": "12-3454"}]'}));
            executeReqStub.onCall(2).returns(Promise.resolve({'body': '10'}));
            var promise = recordsApi.fetchRecordsAndFields(req);
            promise.then(
                function(response) {
                    assert.equal(response.fields[0].display, '12-3454');
                    assert.equal(response.records[0][0].display, '1234525');
                    assert.equal(response.filteredCount, '10');
                    assert.notEqual(response.groups.hasGrouping, true);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve all records: ' + JSON.stringify(errorMsg)));
            });
        });

        it('success return records array with raw parameter type', function(done) {
            req.url = '/apps/1/tables/2/records/3?format=raw';
            executeReqStub.onCall(0).returns(Promise.resolve({'body': '[[ {"id":2, "value": 1234525} ], [ {"id":2, "value": 1234525} ]]'}));
            executeReqStub.onCall(1).returns(Promise.resolve({'body': '[{ "id":2, "value": 123454, "datatypeAttributes": { "type": "TEXT"}, "display": "12-3454"}, { "id":2, "value": 123454, "datatypeAttributes": { "type": "TEXT"}, "display": "12-3454"}]'}));
            var promise = recordsApi.fetchRecordsAndFields(req);
            promise.then(
                function(response) {
                    assert.equal(response.fields, undefined);
                    assert.equal(response.records, undefined);
                    assert.equal(response.groups, undefined);
                    assert.equal(response.length, 2);
                    assert.equal(response[0][0].id, 2);
                    assert.equal(response[0][0].value, '1234525');
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve all records: ' + JSON.stringify(errorMsg)));
            });
        });

        it('success return records array with display parameter type with grouping', function(done) {
            req.url = '/apps/1/tables/2/records/3?format=display';
            req.url += '&' + constants.REQUEST_PARAMETER.SORT_LIST + '=2:V';
            executeReqStub.onCall(0).returns(Promise.resolve({'body': '[[ {"id":2, "value": 1234525} ], [ {"id":2, "value": 1234525} ]]'}));
            executeReqStub.onCall(1).returns(Promise.resolve({'body': '[{ "id":2, "value": 123454, "datatypeAttributes": { "type": "TEXT"}, "display": "12-3454"}, { "id":2, "value": 123454, "datatypeAttributes": { "type": "TEXT"}, "display": "12-3454"}]'}));
            var promise = recordsApi.fetchRecordsAndFields(req);
            promise.then(
                function(response) {
                    assert.equal(response.fields[0].display, '12-3454');
                    assert.equal(response.groups.fields[0].field.display, '12-3454');
                    assert.equal(response.groups.hasGrouping, true);
                    assert.equal(response.groups.totalRows, 2);
                    assert.equal(response.records.length, 0);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve all records: ' + JSON.stringify(errorMsg)));
            });
        });
    });

    describe("when fetchCountForRecords is called", function() {
        var executeReqStub = null;

        beforeEach(function() {
            executeReqStub = sinon.stub(requestHelper, "executeRequest");
            recordsApi.setRequestHelperObject(requestHelper);
        });

        afterEach(function() {
            executeReqStub.restore();
        });

        it('success return count when no query parameter is set', function(done) {
            req.url = '/apps/1/tables/2/records/countQuery';
            executeReqStub.onCall(0).returns(Promise.resolve({'body': '10'}));
            var promise = recordsApi.fetchCountForRecords(req);
            promise.then(
                function(response) {
                    assert.equal(response.body, '10');
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve all records: ' + JSON.stringify(errorMsg)));
            });
        });

        it('success return count when query is set', function(done) {
            req.url = '/apps/1/tables/2/records/countQuery';
            req.url += '&' + constants.REQUEST_PARAMETER.SORT_LIST + '=1:V';
            executeReqStub.onCall(0).returns(Promise.resolve({'body': '10'}));
            var promise = recordsApi.fetchCountForRecords(req);
            promise.then(
                function(response) {
                    assert.equal(response.body, '10');
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve all records: ' + JSON.stringify(errorMsg)));
            });
        });
    });

    describe("when saveSingleRecord is called", function() {
        var executeReqStub = null;

        beforeEach(function() {
            executeReqStub = sinon.stub(requestHelper, "executeRequest");
            recordsApi.setRequestHelperObject(requestHelper);
        });

        afterEach(function() {
            executeReqStub.restore();
        });

        it('success return results ', function(done) {
            req.url = '/records/2';
            req.body = [];
            var targetObject = "{}";
            executeReqStub.returns(Promise.resolve(targetObject));
            var promise = recordsApi.saveSingleRecord(req);

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
            req.url = '/records/2';
            var error_message = "fail unit test case execution";

            executeReqStub.returns(Promise.reject(new Error(error_message)));
            var promise = recordsApi.saveSingleRecord(req);

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
    describe("when saveSingleRecord with body to validate is called", function() {
        var executeReqStub = null;

        beforeEach(function() {
            executeReqStub = sinon.stub(requestHelper, "executeRequest");
            recordsApi.setRequestHelperObject(requestHelper);
        });

        afterEach(function() {
            executeReqStub.restore();
        });

        it('success return results ', function(done) {
            req.url = '/records/2';
            req.body = [{value: "1234", field : {type: "TEXT", clientSideAttributes : {max_chars : 4}}}];
            var targetObject = "{}";
            executeReqStub.returns(Promise.resolve(targetObject));
            var promise = recordsApi.saveSingleRecord(req);

            promise.then(
                function(response) {
                    assert.deepEqual(response, targetObject);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve all records: ' + JSON.stringify(errorMsg)));
            });

        });

        it('fail return results max_chars', function(done) {
            let testField =  {datatypeAttributes :{type: "TEXT", clientSideAttributes : {max_chars : 4}}};
            req.url = '/records/2';
            req.body = [{value: "12345", fieldDef: testField}];
            let errType = dataErrorCodes.MAX_LEN_EXCEEDED;
            var promise = recordsApi.saveSingleRecord(req);

            promise.then(
                function(error) {
                },
                function(error) {
                    assert.equal(error.response.errors[0].error.code, errType);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve all tests: ' + JSON.stringify(errorMsg)));
            });
        });

        it('fail return results required field', function(done) {
            let testField =  {datatypeAttributes :{type: "TEXT"}, required : true};
            req.url = '/records/2';
            req.body = [{value: "", fieldDef: testField}];
            var errType = dataErrorCodes.REQUIRED_FIELD_EMPTY;
            var promise = recordsApi.saveSingleRecord(req);

            promise.then(
                function(error) {
                },
                function(error) {
                    assert.equal(error.response.errors[0].error.code, errType);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve all tests: ' + JSON.stringify(errorMsg)));
            });
        });
    });
    describe("when createSingleRecord is called", function() {
        var executeReqStub = null;

        beforeEach(function() {
            executeReqStub = sinon.stub(requestHelper, "executeRequest");
            recordsApi.setRequestHelperObject(requestHelper);
        });

        afterEach(function() {
            executeReqStub.restore();
        });

        it('success return results ', function(done) {
            req.url = '/records/';
            req.body = {data:'here'};
            var targetObject = "{}";
            executeReqStub.returns(Promise.resolve(targetObject));
            var promise = recordsApi.createSingleRecord(req);

            promise.then(
                function(response) {
                    assert.deepEqual(response, targetObject);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve records: ' + JSON.stringify(errorMsg)));
            });

        });

        it('fail return results ', function(done) {
            req.url = '/records/';
            var error_message = "fail unit test case execution";

            executeReqStub.returns(Promise.reject(new Error(error_message)));
            var promise = recordsApi.createSingleRecord(req);

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

    describe("when deleteSingleRecord is called", function() {
        var executeReqStub = null;

        beforeEach(function() {
            executeReqStub = sinon.stub(requestHelper, "executeRequest");
            recordsApi.setRequestHelperObject(requestHelper);
        });

        afterEach(function() {
            executeReqStub.restore();
        });

        it('success return results ', function(done) {
            req.url = '/record/';
            req.body = {data:'here'};
            var targetObject = "{}";
            executeReqStub.returns(Promise.resolve(targetObject));
            var promise = recordsApi.deleteSingleRecord(req);

            promise.then(
                function(response) {
                    assert.deepEqual(response, targetObject);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve record: ' + JSON.stringify(errorMsg)));
            });

        });

        it('fail return results ', function(done) {
            req.url = '/record/';
            var error_message = "fail unit test case execution";

            executeReqStub.returns(Promise.reject(new Error(error_message)));
            var promise = recordsApi.deleteSingleRecord(req);

            promise.then(
                function(error) {
                },
                function(error) {
                    assert.equal(error, "Error: fail unit test case execution");
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve all record: ' + JSON.stringify(errorMsg)));
            });

        });
    });

    describe("when deleteRecordsBulk is called", function() {
        var executeReqStub = null;

        beforeEach(function() {
            executeReqStub = sinon.stub(requestHelper, "executeRequest");
            recordsApi.setRequestHelperObject(requestHelper);
        });

        afterEach(function() {
            executeReqStub.restore();
        });

        it('success return results ', function(done) {
            req.url = '/records/bulk/';
            req.body = {data:'here'};
            var targetObject = "{}";
            executeReqStub.returns(Promise.resolve(targetObject));
            var promise = recordsApi.deleteRecordsBulk(req);

            promise.then(
                function(response) {
                    assert.deepEqual(response, targetObject);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve record: ' + JSON.stringify(errorMsg)));
            });

        });

        it('fail return results ', function(done) {
            req.url = '/records/bulk/';
            var error_message = "fail unit test case execution";

            executeReqStub.returns(Promise.reject(new Error(error_message)));
            var promise = recordsApi.deleteRecordsBulk(req);

            promise.then(
                function(error) {
                },
                function(error) {
                    assert.equal(error, "Error: fail unit test case execution");
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve all record: ' + JSON.stringify(errorMsg)));
            });

        });
    });

});
