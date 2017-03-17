'use strict';

let config = {javaHost: 'http://javaHost', eeHost: 'http://eeHost', SSL_KEY: {private: 'privateKey', cert: 'cert', requireCert: true}};
let sinon = require('sinon');
let assert = require('assert');
let requestHelper = require('./../../../src/api/quickbase/requestHelper')(config);
let tablesApi = require('../../../src/api/quickbase/tablesApi')(config);
let reportsApi = require('../../../src/api/quickbase/reportsApi')(config);
let fieldsApi = require('../../../src/api/quickbase/fieldsApi')(config);
let formsApi = require('../../../src/api/quickbase/formsApi')(config);
let constants = require('../../../../common/src/constants');

/**
 * Unit tests for tables apis
 */
describe("Validate tablesApi", function() {
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
    describe("validate createTable function", function() {
        let executeReqStub = null;

        beforeEach(function() {
            executeReqStub = sinon.stub(requestHelper, "executeRequest");
            tablesApi.setRequestHelperObject(requestHelper);
            req.url = 'apps/123/tables/';
            req.method = 'post';
            req.rawBody = {name: "test"};
        });

        afterEach(function() {
            req.url = '';
            req.rawBody = {};
            executeReqStub.restore();
        });

        it('success return results ', function(done) {
            executeReqStub.returns(Promise.resolve({'body':"6"}));
            let promise = tablesApi.createTable(req);

            promise.then(
                function(response) {
                    assert.deepEqual(response, 6);
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return when testing createTable success"));
                }
            ).catch(function(errorMsg) {
                done(new Error('createTable: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });
        it('fail return results ', function(done) {
            let error_message = "fail unit test case execution";

            executeReqStub.returns(Promise.reject(new Error(error_message)));
            let promise = tablesApi.createTable(req);

            promise.then(
                function() {
                    done(new Error("Unexpected success promise return when testing createTable failure"));
                },
                function(error) {
                    assert.equal(error, "Error: fail unit test case execution");
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('createTable: exception processing failure test: ' + JSON.stringify(errorMsg)));
            });
        });
    });

    describe("validate deleteTable function", function() {
        let executeReqStub = null;

        beforeEach(function() {
            executeReqStub = sinon.stub(requestHelper, "executeRequest");
            tablesApi.setRequestHelperObject(requestHelper);
            req.url = 'apps/123/tables/456';
            req.method = 'post';
            req.rawBody = {name: "test"};
        });

        afterEach(function() {
            req.url = '';
            req.rawBody = {};
            executeReqStub.restore();
        });

        it('success return results ', function(done) {
            executeReqStub.returns(Promise.resolve({statusCode:"200"}));
            let promise = tablesApi.deleteTable(req, "456");

            promise.then(
                function(response) {
                    assert.deepEqual(response, {statusCode: 200});
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return when testing deleteTable success"));
                }
            ).catch(function(errorMsg) {
                done(new Error('deleteTable: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });

        it('fail return results ', function(done) {
            let error_message = "fail unit test case execution";

            executeReqStub.returns(Promise.reject(new Error(error_message)));
            let promise = tablesApi.deleteTable(req, "456");

            promise.then(
                function() {
                    done(new Error("Unexpected success promise return when testing deleteTable failure"));
                },
                function(error) {
                    assert.equal(error, "Error: fail unit test case execution");
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('deleteTable: exception processing failure test: ' + JSON.stringify(errorMsg)));
            });
        });
    });

    describe("validate createTableProperties function", function() {
        let executeReqStub = null;

        beforeEach(function() {
            executeReqStub = sinon.stub(requestHelper, "executeRequest");
            tablesApi.setRequestHelperObject(requestHelper);
            req.url = 'apps/123/tableproperties/';
            req.method = 'post';
            req.rawBody = {tableNoun: "test"};
        });

        afterEach(function() {
            req.url = '';
            req.rawBody = {};
            executeReqStub.restore();
        });

        it('success return results ', function(done) {
            executeReqStub.returns(Promise.resolve({body: '{"tableNoun": "test"}'}));
            let promise = tablesApi.createTableProperties(req);

            promise.then(
                function(response) {
                    assert.deepEqual(response, {tableNoun: "test"});
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return when testing createTableProperties success"));
                }
            ).catch(function(errorMsg) {
                done(new Error('createTableProperties: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });
        it('fail return results ', function(done) {
            let error_message = "fail unit test case execution";

            executeReqStub.returns(Promise.reject(new Error(error_message)));
            let promise = tablesApi.createTableProperties(req);

            promise.then(
                function() {
                    done(new Error("Unexpected success promise return when testing createTableProperties failure"));
                },
                function(error) {
                    assert.equal(error, "Error: fail unit test case execution");
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('createTableProperties: exception processing failure test: ' + JSON.stringify(errorMsg)));
            });
        });
    });

    describe("validate createTableComponents function", function() {
        let createTableStub = null;
        let createTablePropsStub = null;
        let createFieldStub = null;
        let createReportStub = null;
        let createFormStub = null;
        let deleteTableStub = null;
        let createTableResp = {'body':"123"};
        let createTablePropsResp = {body: '{"tableNoun": "test"}'};
        let deleteTableResp = {statusCode:"200"};
        let createFieldResp = {'body': '{"id": "6"}'};
        let createReportResp = {'body':'{"id":"1"}'};
        let createFormResp = {'body':'{"formId":"1"}'};

        beforeEach(function() {
            createTableStub = sinon.stub(tablesApi, "createTable");
            createTablePropsStub = sinon.stub(tablesApi, "createTableProperties");
            createFieldStub = sinon.stub(fieldsApi, "createField");
            createReportStub = sinon.stub(reportsApi, "createReport");
            createFormStub = sinon.stub(formsApi, "createForm");
            deleteTableStub = sinon.stub(tablesApi, "deleteTable");
            tablesApi.setFieldsApi(fieldsApi);
            tablesApi.setFormsApi(formsApi);
            tablesApi.setReportsApi(reportsApi);
            req.body = {name: "name", tableNoun: "noun", description: "desc", tableIcon: "icon"};
            req.url = 'apps/123/tables/tableComponents';
            req.method = 'post';

        });

        afterEach(function() {
            req.url = '';
            req.rawBody = {};
            createTableStub.restore();
            createTablePropsStub.restore();
            createFieldStub.restore();
            createReportStub.restore();
            createFormStub.restore();
            deleteTableStub.restore();
        });

        it('success return results ', function(done) {
            createTableStub.returns(Promise.resolve(createTableResp));
            createTablePropsStub.returns(Promise.resolve(createTablePropsResp));
            createFieldStub.returns(Promise.resolve(createFieldResp));
            createReportStub.returns(Promise.resolve(createReportResp));
            createFormStub.returns(Promise.resolve(createFormResp));
            deleteTableStub.returns(Promise.resolve(deleteTableResp));
            let promise = tablesApi.createTableComponents(req);

            promise.then(
                function(response) {
                    assert.equal(response.body, 123);
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return when testing createTableComponents success"));
                }
            ).catch(function(errorMsg) {
                done(new Error('createTableComponents: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });
    });
});
