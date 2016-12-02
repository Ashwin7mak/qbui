'use strict';

let config = {javaHost: 'http://javaHost', SSL_KEY: {private: 'privateKey', cert: 'cert', requireCert: true}};
let sinon = require('sinon');
let assert = require('assert');
let requestHelper = require('./../../../src/api/quickbase/requestHelper')(config);
let fieldsApi = require('../../../src/api/quickbase/fieldsApi')(config);
let constants = require('../../../../common/src/constants');

/**
 * Unit tests for fields apis
 */
describe("Validate fieldsApi", function() {
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
                throw new Error("Unexpected key", key);
            }
        }
    };

    describe("test removeUnusedFields", function() {

        let fieldList = [];

        beforeEach(function() {
            fieldList = [];
        });

        function addRecords(i) {
            let recordList = [];
            for (let idx = 0; idx < i; idx++) {
                recordList.push({id: idx});
            }
            return recordList;
        }

        function addFields(i) {
            fieldList = [];
            for (let idx = 0; idx < i; idx++) {
                fieldList.push({id:idx});
            }
            return fieldList;
        }

        function getFields(i) {
            let list = [];
            for (let idx = 0; idx < i; idx++) {
                if (idx < fieldList.length) {
                    list.push(fieldList[idx]);
                }
            }
            return list;
        }

        let testCases = [
            {name: 'record and fields empty', records: [], fields: [], expectation: []},
            {name: 'record and fields not arrays', records: 'rec', fields: 5, expectation: 5},
            {name: 'record and fields - test 1', records: addRecords(3), fields: addFields(3), expectation: getFields(3)},
            {name: 'record and fields - test 2', records: addRecords(3), fields: addFields(1), expectation: getFields(1)}
        ];

        testCases.forEach(function(testCase) {
            it('Test case: ' + testCase.name, function(done) {
                let flds = fieldsApi.removeUnusedFields(testCase.records, testCase.fields);
                assert.deepEqual(flds, testCase.expectation);
                done();
            });
        });
    });

    describe("when getFields is called", function() {
        let executeReqStub = null;

        beforeEach(function() {
            executeReqStub = sinon.stub(requestHelper, "executeRequest");
            fieldsApi.setRequestHelperObject(requestHelper);
        });

        afterEach(function() {
            executeReqStub.restore();
            req.params = {};
        });

        it('success return select all fields with no parameter ', function(done) {
            req.url = '/apps/1/tables/1/fields';
            let targetObject = "{'body':[]}";
            executeReqStub.returns(Promise.resolve(targetObject));
            let promise = fieldsApi.fetchFields(req);

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
                done(new Error('unable to resolve /apps/1/tables/1/fields: ' + JSON.stringify(errorMsg)));
            });

        });

        it('success return select field with parameter and includeQueryParameter=true', function(done) {
            req.url = '/apps/123/tables/456/fields/789?show=tell';
            req.params.fieldId = '789';

            let targetObject = "[{fields: []}]";

            executeReqStub.returns(Promise.resolve(targetObject));
            let promise = fieldsApi.fetchFields(req, true);

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

        it('success return select field with no parameter and includeQueryParameter=true', function(done) {
            req.url = '/apps/123/tables/456/fields/789';
            req.params.fieldId = '789';

            let targetObject = "[{fields: []}]";

            executeReqStub.returns(Promise.resolve(targetObject));
            let promise = fieldsApi.fetchFields(req, true);

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

        it('success return select field with parameter but do not include', function(done) {
            req.url = '/apps/123/tables/456/fields/789?show=tell';
            req.params.fieldId = '789';

            let targetObject = "[{fields: []}]";

            executeReqStub.returns(Promise.resolve(targetObject));
            let promise = fieldsApi.fetchFields(req);

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
            req.url = '/apps/1/tables/1/fields';
            let error_message = "fail fieldsApi unit test case execution";

            executeReqStub.returns(Promise.reject(new Error(error_message)));
            let promise = fieldsApi.fetchFields(req);

            promise.then(
                function(success) {
                    assert.fail('success', 'fail', 'Test fail promise error and success promise returned');
                },
                function(error) {
                    assert.equal(error, "Error: " + error_message);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve /apps/1/tables/1/fields: ' + JSON.stringify(errorMsg)));
            });

        });
    });

});
