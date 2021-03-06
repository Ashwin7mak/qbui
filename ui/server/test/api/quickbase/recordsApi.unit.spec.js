/**
 * Created by xhe on 3/1/16.
 */
'use strict';

let config = {javaHost: 'http://javaHost', eeHost: 'http://eeHost', SSL_KEY: {private: 'privateKey', cert: 'cert', requireCert: true}};
let sinon = require('sinon');
let assert = require('assert');
let requestHelper = require('./../../../src/api/quickbase/requestHelper')(config);
let recordsApi = require('../../../src/api/quickbase/recordsApi')(config);
let constants = require('../../../../common/src/constants');
let dataErrorCodes = require('../../../../common/src/dataEntryErrorCodes');
let groupTypes = require('../../../../common/src/groupTypes').GROUP_TYPE;

/**
 * Unit tests for records apis
 */
describe("Validate recordsApi", function() {
    let req = {
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

    let executeReqStub = null;
    let fieldsApiStub = null;

    beforeEach(function() {
        executeReqStub = sinon.stub(requestHelper, "executeRequest");
        recordsApi.setRequestHelperObject(requestHelper);

        fieldsApiStub = sinon.stub(recordsApi, "fetchFields");
        fieldsApiStub.returns(Promise.resolve({'body': '[{ "id":2, "value": 123454, "datatypeAttributes": { "type": "TEXT"}, "display": "12-3454"}, { "id":2, "value": 123454, "datatypeAttributes": { "type": "TEXT"}, "display": "12-3454"}]'}));
    });

    afterEach(function() {
        executeReqStub.restore();
        fieldsApiStub.restore();
        req.params = {};
    });

    describe("when fetchRecords is called", function() {

        it('success return results for all records', function(done) {
            req.url = '/apps/123/tables/456/records';

            let targetObject = "[{records: [], fields: []}, {records: [], fields: []}]";
            executeReqStub.returns(Promise.resolve(targetObject));
            let promise = recordsApi.fetchRecords(req);

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
            req.url = '/apps/123/tables/456/records/1?param=true&offset=0&numRows=' + constants.PAGE.MAX_NUM_ROWS + 1;
            req.params.recordId = 1;

            let targetObject = "[{records: [], fields: []}, {records: [], fields: []}]";
            executeReqStub.returns(Promise.resolve(targetObject));
            let promise = recordsApi.fetchRecords(req);

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

        it('success return results for report results', function(done) {
            req.url = '/apps/123/tables/456/reports/2/results';

            let targetObject = "[{records: [], fields: []}, {records: [], fields: []}]";
            executeReqStub.returns(Promise.resolve(targetObject));
            let promise = recordsApi.fetchRecords(req);

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

        it('success return results for report results with sortList', function(done) {
            req.url = '/apps/123/tables/456/reports/2/results?sortList=1';
            req.params.sortList = '1';

            let targetObject = "[{records: [], fields: []}, {records: [], fields: []}]";
            executeReqStub.returns(Promise.resolve(targetObject));
            let promise = recordsApi.fetchRecords(req);

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
            req.url = '/reports/2/results';
            let error_message = "fail unit test case execution";

            executeReqStub.returns(Promise.reject(new Error(error_message)));
            let promise = recordsApi.fetchRecords(req);

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

    describe("when fetchSingleRecordAndFields is called", function() {

        it('success return records array with raw parameter type', function(done) {
            req.url = '/apps/1/tables/2/records/3?format=raw';
            let expectedID = '12345.22';
            executeReqStub.returns(Promise.resolve({'body': expectedID}));
            let promise = recordsApi.fetchSingleRecordAndFields(req);
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
            let promise = recordsApi.fetchSingleRecordAndFields(req);
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

        it('success return records array with display parameter type and no grouping', function(done) {
            req.url = '/apps/1/tables/2/records/3?format=display';

            executeReqStub.onCall(0).returns(Promise.resolve({'body': '[[ {"id":2, "value": 1234525} ], [ {"id":2, "value": 1234525} ]]'}));
            //fetch fields is already stubbed
            executeReqStub.onCall(1).returns(Promise.resolve({'body': '10'}));
            let promise = recordsApi.fetchRecordsAndFields(req);
            promise.then(
                function(response) {
                    assert.equal(response.fields[0].display, '12-3454');
                    assert.equal(response.records[0][0].display, '1234525');
                    assert.equal(response.filteredCount, '10');
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve all records: ' + JSON.stringify(errorMsg)));
            });
        });

        it('success return records array with raw parameter type', function(done) {
            req.url = '/apps/1/tables/2/records/3?format=raw';
            executeReqStub.onCall(0).returns(Promise.resolve({'body': '[[ {"id":2, "value": 1234525} ], [ {"id":2, "value": 1234525} ]]'}));
            let promise = recordsApi.fetchRecordsAndFields(req);
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
    });

    describe("when fetchCountForRecords is called", function() {

        it('success return count when no query parameter is set', function(done) {
            req.url = '/apps/1/tables/2/records/countQuery';
            executeReqStub.onCall(0).returns(Promise.resolve({'body': '10'}));
            let promise = recordsApi.fetchCountForRecords(req);
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
            req.params[constants.REQUEST_PARAMETER.SORT_LIST] = '1:' + groupTypes.COMMON.equals;
            req.params[constants.REQUEST_PARAMETER.QUERY] = '{1.EX.2}';

            req.url = '/apps/1/tables/2/records/countQuery';
            req.url += '?' + constants.REQUEST_PARAMETER.SORT_LIST + '=' + req.params[constants.REQUEST_PARAMETER.SORT_LIST];
            req.url += '&' + constants.REQUEST_PARAMETER.QUERY + '=' + req.params[constants.REQUEST_PARAMETER.QUERY];

            executeReqStub.onCall(0).returns(Promise.resolve({'body': '10'}));

            let promise = recordsApi.fetchCountForRecords(req);
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
        it('success return results ', function(done) {
            req.url = '/records/2';
            req.body = [];
            let targetObject = "{}";
            executeReqStub.returns(Promise.resolve(targetObject));
            let promise = recordsApi.saveSingleRecord(req);

            promise.then(
                function(response) {
                    assert.deepEqual(response, targetObject);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve all records: ' + JSON.stringify(errorMsg)));
            });

        });

        it('fail return results ', function() {
            req.url = '/records/2';
            let errorMessage = "fail unit test case execution";

            executeReqStub.returns(Promise.reject({message: errorMessage, statusCode: 500}));
            let promise = recordsApi.saveSingleRecord(req);

            return promise.then(function() {
                assert(false, 'saveSingleRecord request should have failed, but it succeeded');
            }).catch(function(error) {
                assert.equal(error.message, errorMessage);
                assert.equal(error.statusCode, 500);
            });
        });
    });
    describe("when saveSingleRecord with body to validate is called", function() {

        it('success return results ', function(done) {
            req.url = '/records/2';
            req.body = [{value: "1234", field : {type: "TEXT", clientSideAttributes : {max_chars : 4}}}];
            let targetObject = "{}";
            executeReqStub.returns(Promise.resolve(targetObject));
            let promise = recordsApi.saveSingleRecord(req);

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
            let promise = recordsApi.saveSingleRecord(req);

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
            let errType = dataErrorCodes.REQUIRED_FIELD_EMPTY;
            let promise = recordsApi.saveSingleRecord(req);

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

        it('success return results ', function(done) {
            req.url = '/records/';
            req.body = {data:'here'};
            let targetObject = "{}";
            executeReqStub.returns(Promise.resolve(targetObject));
            let promise = recordsApi.createSingleRecord(req);

            promise.then(
                function(response) {
                    assert.deepEqual(response, targetObject);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve records: ' + JSON.stringify(errorMsg)));
            });

        });

        it('fail return results ', function() {
            req.url = '/records/';
            let errorMessage = "fail unit test case execution";

            executeReqStub.returns(Promise.reject({message: errorMessage, statusCode: 500}));
            let promise = recordsApi.createSingleRecord(req);

            return promise.then(function() {
                assert(false, 'createSingleRecord request should have failed, but it succeeded');
            }).catch(function(error) {
                assert.equal(error.message, errorMessage);
                assert.equal(error.statusCode, 500);
            });
        });

        it('fail return results required field', function(done) {
            let testField =  {datatypeAttributes :{type: "TEXT"}, required : true};
            req.url = '/records/2';
            req.body = [{value: "", fieldDef: testField}];
            let errType = dataErrorCodes.REQUIRED_FIELD_EMPTY;
            let promise = recordsApi.createSingleRecord(req);

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

    describe("when deleteSingleRecord is called", function() {

        it('success return results ', function(done) {
            req.url = '/record/';
            req.body = {data:'here'};
            let targetObject = "{}";
            executeReqStub.returns(Promise.resolve(targetObject));
            let promise = recordsApi.deleteSingleRecord(req);

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
            let error_message = "fail unit test case execution";

            executeReqStub.returns(Promise.reject(new Error(error_message)));
            let promise = recordsApi.deleteSingleRecord(req);

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

        it('success return results ', function(done) {
            req.url = '/records/bulk/';
            req.body = {data:'here'};
            let targetObject = "{}";
            executeReqStub.returns(Promise.resolve(targetObject));
            let promise = recordsApi.deleteRecordsBulk(req);

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
            let error_message = "fail unit test case execution";

            executeReqStub.returns(Promise.reject(new Error(error_message)));
            let promise = recordsApi.deleteRecordsBulk(req);

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
