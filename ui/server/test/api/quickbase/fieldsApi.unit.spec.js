'use strict';

let config = {javaHost: 'http://javaHost', eeHost: 'http://eeHost', SSL_KEY: {private: 'privateKey', cert: 'cert', requireCert: true}};
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

    describe("validate createField function", function() {
        let executeReqStub = null;

        beforeEach(function() {
            executeReqStub = sinon.stub(requestHelper, "executeRequest");
            fieldsApi.setRequestHelperObject(requestHelper);
            req.url = 'tables/123/fields';
            req.method = 'post';
            req.rawBody = {name: "test", type: 'TEXT'};
        });

        afterEach(function() {
            req.url = '';
            req.rawBody = {};
            executeReqStub.restore();
        });

        it('success return results ', function(done) {
            executeReqStub.returns(Promise.resolve({'body': '{"id": "6"}'}));
            let promise = fieldsApi.createField(req);

            promise.then(
                function(response) {
                    assert.deepEqual(response, 6);
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return when testing createField success"));
                }
            ).catch(function(errorMsg) {
                done(new Error('createField: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });

        it('fail return results ', function(done) {
            let error_message = "fail unit test case execution";

            executeReqStub.returns(Promise.reject(new Error(error_message)));
            let promise = fieldsApi.createField(req);

            promise.then(
                function() {
                    done(new Error("Unexpected success promise return when testing createField failure"));
                },
                function(error) {
                    assert.equal(error, "Error: fail unit test case execution");
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('createField: exception processing failure test: ' + JSON.stringify(errorMsg)));
            });
        });
    });

    describe('validate getFieldsForTable function', function() {
        let fetchFieldsStub = null;
        let errorPromise = Promise.reject({error: 'some error'});
        let tableId = "456";
        let fetchFieldsStubResp = {};
        fetchFieldsStubResp.body = '[{}]';

        beforeEach(function() {
            fetchFieldsStub = sinon.stub(fieldsApi, 'fetchFields');
            req.url = 'apps/123/tables';
            req.method = 'get';
            fetchFieldsStub.returns(Promise.resolve(fetchFieldsStubResp));
        });

        afterEach(function() {
            req.url = '';
            req.rawBody = {};
            fetchFieldsStub.restore();
        });

        it('success return results ', function(done) {
            req.url = 'apps/123/tables';
            req.method = 'get';
            fetchFieldsStub.returns(Promise.resolve(fetchFieldsStubResp));
            let promise = fieldsApi.getFieldsForTable(req, tableId);

            promise.then(
                function(response) {
                    done();
                },
                function(error) {
                    done(new Error('Unexpected failure promise return when testing getFieldsForTable success'));
                }
            ).catch(function(errorMsg) {
                done(new Error('getFieldsForTable: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });
        it('fails if fetchFields fails', function(done) {
            fetchFieldsStub.returns(errorPromise);
            let promise = fieldsApi.getFieldsForTable(req, tableId);

            promise.then(
                function(response) {
                    done(new Error('Unexpected success promise return when fetchFields in getFieldsForTable failed'));
                },
                function(error) {
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('getFieldsForTable: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });
    });

    describe("validate patchField function", function() {
        let executeReqStub = null;

        beforeEach(function() {
            executeReqStub = sinon.stub(requestHelper, "executeRequest");
            fieldsApi.setRequestHelperObject(requestHelper);
            req.url = 'tables/123/fields/4';
            req.method = 'patch';
            req.rawBody = {name: "test", type: 'TEXT'};
        });

        afterEach(function() {
            req.url = '';
            req.rawBody = {};
            executeReqStub.restore();
        });

        it('success return results ', function(done) {
            executeReqStub.returns(Promise.resolve({'body': ''}));
            let promise = fieldsApi.patchField(req, '123', 4);

            promise.then(
                function(response) {
                    assert.equal(response.body, '');
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return when testing patchField success"));
                }
            ).catch(function(errorMsg) {
                done(new Error('patchField: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });

        it('fail return results ', function(done) {
            let error_message = "fail unit test case execution";

            executeReqStub.returns(Promise.reject(new Error(error_message)));
            let promise = fieldsApi.patchField(req, '123', 4);

            promise.then(
                function() {
                    done(new Error("Unexpected success promise return when testing patchField failure"));
                },
                function(error) {
                    assert.equal(error, "Error: fail unit test case execution");
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('patchField: exception processing failure test: ' + JSON.stringify(errorMsg)));
            });
        });
    });

    describe("validate getField function", function() {
        let executeReqStub = null;

        beforeEach(function() {
            executeReqStub = sinon.stub(requestHelper, "executeRequest");
            fieldsApi.setRequestHelperObject(requestHelper);
            req.url = 'tables/123/fields/4';
            req.method = 'get';
            req.rawBody = {name: "test", type: 'TEXT'};
        });

        afterEach(function() {
            req.url = '';
            req.rawBody = {};
            executeReqStub.restore();
        });

        it('success return results ', function(done) {
            executeReqStub.returns(Promise.resolve({'body': '{"id": "6"}'}));
            let promise = fieldsApi.getField(req, '123', 4);

            promise.then(
                function(response) {
                    assert.deepEqual(response, {id: 6});
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return when testing getField success"));
                }
            ).catch(function(errorMsg) {
                done(new Error('getField: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });

        it('fail return results ', function(done) {
            let error_message = "fail unit test case execution";

            executeReqStub.returns(Promise.reject(new Error(error_message)));
            let promise = fieldsApi.getField(req, '123', 4);

            promise.then(
                function() {
                    done(new Error("Unexpected success promise return when testing getField failure"));
                },
                function(error) {
                    assert.equal(error, "Error: fail unit test case execution");
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('getField: exception processing failure test: ' + JSON.stringify(errorMsg)));
            });
        });
    });

});
