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

    describe("validate patchTable function", function() {
        let executeReqStub = null;

        beforeEach(function() {
            executeReqStub = sinon.stub(requestHelper, "executeRequest");
            tablesApi.setRequestHelperObject(requestHelper);
            req.url = 'apps/123/tables/';
            req.method = 'patch';
            req.rawBody = {name: "test"};
        });

        afterEach(function() {
            req.url = '';
            req.rawBody = {};
            executeReqStub.restore();
        });

        it('success return results ', function(done) {
            executeReqStub.returns(Promise.resolve({'body':"6"}));
            let promise = tablesApi.patchTable(req);

            promise.then(
                function(response) {
                    assert.deepEqual(response, 6);
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return when testing patchTable success"));
                }
            ).catch(function(errorMsg) {
                done(new Error('patchTable: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });
        it('fail return results ', function(done) {
            let error_message = "fail unit test case execution";

            executeReqStub.returns(Promise.reject(new Error(error_message)));
            let promise = tablesApi.patchTable(req);

            promise.then(
                function() {
                    done(new Error("Unexpected success promise return when testing patchTable failure"));
                },
                function(error) {
                    assert.equal(error, "Error: fail unit test case execution");
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('patchTable: exception processing failure test: ' + JSON.stringify(errorMsg)));
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

    describe("validate deleteTableProperties function", function() {
        let executeReqStub = null;

        beforeEach(function() {
            executeReqStub = sinon.stub(requestHelper, "executeRequest");
            tablesApi.setRequestHelperObject(requestHelper);
            req.url = 'apps/123/tableproperties/456';
            req.method = 'delete';
        });

        afterEach(function() {
            req.url = '';
            executeReqStub.restore();
        });

        it('success return results ', function(done) {
            executeReqStub.returns(Promise.resolve({statusCode:"200"}));
            let promise = tablesApi.deleteTableProperties(req, "456");

            promise.then(
                function(response) {
                    assert.deepEqual(response, {statusCode: 200});
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return when testing deleteTableProperties success"));
                }
            ).catch(function(errorMsg) {
                done(new Error('deleteTableProperties: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });

        it('fail return results ', function(done) {
            let error_message = "fail unit test case execution";

            executeReqStub.returns(Promise.reject(new Error(error_message)));
            let promise = tablesApi.deleteTableProperties(req, "456");

            promise.then(
                function() {
                    done(new Error("Unexpected success promise return when testing deleteTableProperties failure"));
                },
                function(error) {
                    assert.equal(error, "Error: fail unit test case execution");
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('deleteTableProperties: exception processing failure test: ' + JSON.stringify(errorMsg)));
            });
        });
    });

    describe("validate replaceTableProperties function", function() {
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
            let promise = tablesApi.replaceTableProperties(req);

            promise.then(
                function(response) {
                    assert.deepEqual(response, {tableNoun: "test"});
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return when testing replaceTableProperties success"));
                }
            ).catch(function(errorMsg) {
                done(new Error('replaceTableProperties: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });
        it('fail return results ', function(done) {
            let error_message = "fail unit test case execution";

            executeReqStub.returns(Promise.reject(new Error(error_message)));
            let promise = tablesApi.createTableProperties(req);

            promise.then(
                function() {
                    done(new Error("Unexpected success promise return when testing replaceTableProperties failure"));
                },
                function(error) {
                    assert.equal(error, "Error: fail unit test case execution");
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('replaceTableProperties: exception processing failure test: ' + JSON.stringify(errorMsg)));
            });
        });
    });


    describe("validate createTableComponents function", function() {
        let createTableStub = null;
        let createTablePropsStub = null;
        let createFieldStub = null;
        let createReportStub = null;
        let createFormStub = null;
        let deleteTableSpy = null;
        let deleteTablePropsSpy = null;
        let createTableResp = {'body':"123"};
        let createTablePropsResp = {body: '{"tableNoun": "test"}'};
        let createFieldResp = {'body': '{"id": "6"}'};
        let createReportResp = {'body':'{"id":"1"}'};
        let createFormResp = {'body':'{"formId":"1"}'};
        let errorPromise = Promise.reject({error: "some error"});

        beforeEach(function() {
            createTableStub = sinon.stub(tablesApi, "createTable");
            createTablePropsStub = sinon.stub(tablesApi, "createTableProperties");
            createFieldStub = sinon.stub(fieldsApi, "createField");
            createReportStub = sinon.stub(reportsApi, "createReport");
            createFormStub = sinon.stub(formsApi, "createForm");
            tablesApi.setFieldsApi(fieldsApi);
            tablesApi.setFormsApi(formsApi);
            tablesApi.setReportsApi(reportsApi);
            req.body = {name: "name", tableNoun: "noun", description: "desc", tableIcon: "icon"};
            req.url = 'apps/123/tables/tableComponents';
            req.method = 'post';
            createTableStub.returns(Promise.resolve(createTableResp));
            createTablePropsStub.returns(Promise.resolve(createTablePropsResp));
            createFieldStub.returns(Promise.resolve(createFieldResp));
            createReportStub.returns(Promise.resolve(createReportResp));
            createFormStub.returns(Promise.resolve(createFormResp));
            deleteTableSpy = sinon.spy(tablesApi, "deleteTable");
            deleteTablePropsSpy = sinon.spy(tablesApi, "deleteTableProperties");
        });

        afterEach(function() {
            req.url = '';
            req.rawBody = {};
            createTableStub.restore();
            createTablePropsStub.restore();
            createFieldStub.restore();
            createReportStub.restore();
            createFormStub.restore();
            deleteTableSpy.restore();
            deleteTablePropsSpy.restore();
        });

        it('success return results ', function(done) {
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
        it('fails table name isnt passed in ', function(done) {
            req.body = {tableNoun: "noun", description: "desc", tableIcon: "icon"};
            let promise = tablesApi.createTableComponents(req);

            promise.then(
                function(response) {
                    done(new Error("Unexpected success when missing required fields"));
                },
                function(error) {
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('createTableComponents: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });
        it('fails table noun isnt passed in ', function(done) {
            req.body = {name: "name", description: "desc", tableIcon: "icon"};
            let promise = tablesApi.createTableComponents(req);

            promise.then(
                function(response) {
                    done(new Error("Unexpected success when missing required fields"));
                },
                function(error) {
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('createTableComponents: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });
        it('deletes table if table props creation fails', function(done) {
            createTablePropsStub.returns(errorPromise);
            let promise = tablesApi.createTableComponents(req);

            promise.then(
                function(response) {
                    done(new Error("Unexpected success when table props creation failed"));
                },
                function(error) {
                    assert(deleteTableSpy.called);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('createTableComponents: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });
        it('deletes table & props if field creation fails', function(done) {
            createFieldStub.returns(errorPromise);
            let promise = tablesApi.createTableComponents(req);

            promise.then(
                function(response) {
                    done(new Error("Unexpected success if field creation failed"));
                },
                function(error) {
                    assert(deleteTableSpy.called);
                    assert(deleteTablePropsSpy.called);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('createTableComponents: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });
        it('deletes table & props if report creation fails', function(done) {
            createReportStub.returns(errorPromise);
            let promise = tablesApi.createTableComponents(req);

            promise.then(
                function(response) {
                    done(new Error("Unexpected success if report creation failed"));
                },
                function(error) {
                    assert(deleteTableSpy.called);
                    assert(deleteTablePropsSpy.called);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('createTableComponents: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });
        it('deletes table & props if form creation fails', function(done) {
            createFormStub.returns(errorPromise);
            let promise = tablesApi.createTableComponents(req);

            promise.then(
                function(response) {
                    done(new Error("Unexpected success if form creation failed"));
                },
                function(error) {
                    assert(deleteTableSpy.called);
                    assert(deleteTablePropsSpy.called);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('createTableComponents: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });
        it('create field is not called if table creation fails', function(done) {
            createFieldStub.restore();
            createFieldStub = sinon.spy(fieldsApi, "createField");
            createTableStub.returns(errorPromise);
            let promise = tablesApi.createTableComponents(req);

            promise.then(
                function(response) {
                    done(new Error("Unexpected success if table creation failed"));
                },
                function(error) {
                    assert.equal(createFieldStub.callCount, 0);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('createTableComponents: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });
        it('create table props is not called if table creation fails', function(done) {
            createTablePropsStub.restore();
            createTablePropsStub = sinon.spy(tablesApi, "createTableProperties");
            createTableStub.returns(errorPromise);
            let promise = tablesApi.createTableComponents(req);

            promise.then(
                function(response) {
                    done(new Error("Unexpected success if table creation failed"));
                },
                function(error) {
                    assert.equal(createTablePropsStub.callCount, 0);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('createTableComponents: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });
        it('create report is not called if field creation fails', function(done) {
            createReportStub.restore();
            createReportStub = sinon.spy(reportsApi, "createReport");
            createFieldStub.returns(errorPromise);
            let promise = tablesApi.createTableComponents(req);

            promise.then(
                function(response) {
                    done(new Error("Unexpected success if field creation failed"));
                },
                function(error) {
                    assert.equal(createReportStub.callCount, 0);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('createTableComponents: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });
        it('create form is not called if field creation fails', function(done) {
            createFormStub.restore();
            createFormStub = sinon.spy(formsApi, "createForm");
            createFieldStub.returns(errorPromise);
            let promise = tablesApi.createTableComponents(req);

            promise.then(
                function(response) {
                    done(new Error("Unexpected success if field creation failed"));
                },
                function(error) {
                    assert.equal(createFormStub.callCount, 0);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('createTableComponents: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });
    });

    describe("validate updateTable function", function() {
        let patchTableStub = null;
        let replaceTablePropsStub = null;
        let patchTableResp = {};
        let replaceTablePropsResp = {body: '{"tableNoun": "test"}'};
        let errorPromise = Promise.reject({error: "some error"});

        beforeEach(function() {
            patchTableStub = sinon.stub(tablesApi, "patchTable");
            replaceTablePropsStub = sinon.stub(tablesApi, "replaceTableProperties");
            req.body = {name: "name", tableNoun: "noun", description: "desc", tableIcon: "icon"};
            req.url = 'apps/123/tables/456';
            req.method = 'patch';
            patchTableStub.returns(Promise.resolve(patchTableResp));
            replaceTablePropsStub.returns(Promise.resolve(replaceTablePropsResp));
        });

        afterEach(function() {
            req.url = '';
            req.rawBody = {};
            patchTableStub.restore();
            replaceTablePropsStub.restore();
        });

        it('success return results ', function(done) {
            let promise = tablesApi.updateTable(req);

            promise.then(
                function(response) {
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return when testing updateTable success"));
                }
            ).catch(function(errorMsg) {
                done(new Error('updateTable: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });
        it('doesnt call patchTable if name wasnt updated ', function(done) {
            patchTableStub.restore();
            patchTableStub = sinon.spy(tablesApi, "patchTable");
            req.body = {tableNoun: "noun", description: "desc", tableIcon: "icon"};
            let promise = tablesApi.updateTable(req);

            promise.then(
                function(response) {
                    assert.equal(patchTableStub.callCount, 0);
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return when testing updateTable success"));
                }
            ).catch(function(errorMsg) {
                done(new Error('updateTable: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });
        it('fails if updateTable fails', function(done) {
            patchTableStub.returns(errorPromise);
            req.body = {name: "name", tableNoun: "noun", description: "desc", tableIcon: "icon"};
            let promise = tablesApi.updateTable(req);

            promise.then(
                function(response) {
                    done(new Error("Unexpected success promise return when patchTable failed"));
                },
                function(error) {
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('updateTable: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });
        it('fails if replaceTableProperties fails', function(done) {
            replaceTablePropsStub.returns(errorPromise);
            req.body = {name: "name", tableNoun: "noun", description: "desc", tableIcon: "icon"};
            let promise = tablesApi.updateTable(req);

            promise.then(
                function(response) {
                    done(new Error("Unexpected success promise return when replaceTableProperties failed"));
                },
                function(error) {
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('updateTable: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });
    });
});
