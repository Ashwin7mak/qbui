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
describe('Validate tablesApi', function() {
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
                throw new Error('Unexpected key', key);
            }
        }
    };
    describe('validate createTable function', function() {
        let executeReqStub = null;

        beforeEach(function() {
            executeReqStub = sinon.stub(requestHelper, 'executeRequest');
            tablesApi.setRequestHelperObject(requestHelper);
            req.url = 'apps/123/tables/';
            req.method = 'post';
            req.rawBody = {name: 'test'};
        });

        afterEach(function() {
            req.url = '';
            req.rawBody = {};
            executeReqStub.restore();
        });

        it('success return results ', function(done) {
            executeReqStub.returns(Promise.resolve({'body':'6'}));
            let promise = tablesApi.createTable(req);

            promise.then(
                function(response) {
                    assert.deepEqual(response, 6);
                    done();
                },
                function(error) {
                    done(new Error('Unexpected failure promise return when testing createTable success'));
                }
            ).catch(function(errorMsg) {
                done(new Error('createTable: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });
        it('fail return results ', function(done) {
            let error_message = 'fail unit test case execution';

            executeReqStub.returns(Promise.reject(new Error(error_message)));
            let promise = tablesApi.createTable(req);

            promise.then(
                function() {
                    done(new Error('Unexpected success promise return when testing createTable failure'));
                },
                function(error) {
                    assert.equal(error, 'Error: fail unit test case execution');
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('createTable: exception processing failure test: ' + JSON.stringify(errorMsg)));
            });
        });
    });

    describe('validate deleteTable function', function() {
        let executeReqStub = null;

        beforeEach(function() {
            executeReqStub = sinon.stub(requestHelper, 'executeRequest');
            tablesApi.setRequestHelperObject(requestHelper);
            req.url = 'apps/123/tables/456';
            req.method = 'post';
            req.rawBody = {name: 'test'};
        });

        afterEach(function() {
            req.url = '';
            req.rawBody = {};
            executeReqStub.restore();
        });

        it('success return results ', function(done) {
            executeReqStub.returns(Promise.resolve({statusCode:'200'}));
            let promise = tablesApi.deleteTable(req, '456');

            promise.then(
                function(response) {
                    assert.deepEqual(response, {statusCode: 200});
                    done();
                },
                function(error) {
                    done(new Error('Unexpected failure promise return when testing deleteTable success'));
                }
            ).catch(function(errorMsg) {
                done(new Error('deleteTable: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });

        it('fail return results ', function(done) {
            let error_message = 'fail unit test case execution';

            executeReqStub.returns(Promise.reject(new Error(error_message)));
            let promise = tablesApi.deleteTable(req, '456');

            promise.then(
                function() {
                    done(new Error('Unexpected success promise return when testing deleteTable failure'));
                },
                function(error) {
                    assert.equal(error, 'Error: fail unit test case execution');
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('deleteTable: exception processing failure test: ' + JSON.stringify(errorMsg)));
            });
        });
    });

    describe('validate patchTable function', function() {
        let executeReqStub = null;

        beforeEach(function() {
            executeReqStub = sinon.stub(requestHelper, 'executeRequest');
            tablesApi.setRequestHelperObject(requestHelper);
            req.url = 'apps/123/tables/';
            req.method = 'patch';
            req.rawBody = {name: 'test'};
        });

        afterEach(function() {
            req.url = '';
            req.rawBody = {};
            executeReqStub.restore();
        });

        it('success return results ', function(done) {
            executeReqStub.returns(Promise.resolve({'body':'6'}));
            let promise = tablesApi.patchTable(req);

            promise.then(
                function(response) {
                    assert.deepEqual(response, 6);
                    done();
                },
                function(error) {
                    done(new Error('Unexpected failure promise return when testing patchTable success'));
                }
            ).catch(function(errorMsg) {
                done(new Error('patchTable: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });
        it('fail return results ', function(done) {
            let error_message = 'fail unit test case execution';

            executeReqStub.returns(Promise.reject(new Error(error_message)));
            let promise = tablesApi.patchTable(req);

            promise.then(
                function() {
                    done(new Error('Unexpected success promise return when testing patchTable failure'));
                },
                function(error) {
                    assert.equal(error, 'Error: fail unit test case execution');
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('patchTable: exception processing failure test: ' + JSON.stringify(errorMsg)));
            });
        });
    });

    describe('validate createTableProperties function', function() {
        let executeReqStub = null;

        beforeEach(function() {
            executeReqStub = sinon.stub(requestHelper, 'executeRequest');
            tablesApi.setRequestHelperObject(requestHelper);
            req.url = 'apps/123/tableproperties/';
            req.method = 'post';
            req.rawBody = {tableNoun: 'test'};
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
                    assert.deepEqual(response, {tableNoun: 'test'});
                    done();
                },
                function(error) {
                    done(new Error('Unexpected failure promise return when testing createTableProperties success'));
                }
            ).catch(function(errorMsg) {
                done(new Error('createTableProperties: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });
        it('fail return results ', function(done) {
            let error_message = 'fail unit test case execution';

            executeReqStub.returns(Promise.reject(new Error(error_message)));
            let promise = tablesApi.createTableProperties(req);

            promise.then(
                function() {
                    done(new Error('Unexpected success promise return when testing createTableProperties failure'));
                },
                function(error) {
                    assert.equal(error, 'Error: fail unit test case execution');
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('createTableProperties: exception processing failure test: ' + JSON.stringify(errorMsg)));
            });
        });
    });

    describe('validate deleteTableProperties function', function() {
        let executeReqStub = null;

        beforeEach(function() {
            executeReqStub = sinon.stub(requestHelper, 'executeRequest');
            tablesApi.setRequestHelperObject(requestHelper);
            req.url = 'apps/123/tableproperties/456';
            req.method = 'delete';
        });

        afterEach(function() {
            req.url = '';
            executeReqStub.restore();
        });

        it('success return results ', function(done) {
            executeReqStub.returns(Promise.resolve({statusCode:'200'}));
            let promise = tablesApi.deleteTableProperties(req, '456');

            promise.then(
                function(response) {
                    assert.deepEqual(response, {statusCode: 200});
                    done();
                },
                function(error) {
                    done(new Error('Unexpected failure promise return when testing deleteTableProperties success'));
                }
            ).catch(function(errorMsg) {
                done(new Error('deleteTableProperties: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });

        it('fail return results ', function(done) {
            let error_message = 'fail unit test case execution';

            executeReqStub.returns(Promise.reject(new Error(error_message)));
            let promise = tablesApi.deleteTableProperties(req, '456');

            promise.then(
                function() {
                    done(new Error('Unexpected success promise return when testing deleteTableProperties failure'));
                },
                function(error) {
                    assert.equal(error, 'Error: fail unit test case execution');
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('deleteTableProperties: exception processing failure test: ' + JSON.stringify(errorMsg)));
            });
        });
    });

    describe('validate replaceTableProperties function', function() {
        let executeReqStub = null;
        let createTablePropertiesStub = null;
        let tableId = '456';

        beforeEach(function() {
            executeReqStub = sinon.stub(requestHelper, 'executeRequest');
            createTablePropertiesStub = sinon.stub(tablesApi, 'createTableProperties');
            tablesApi.setRequestHelperObject(requestHelper);
            req.url = 'apps/123/tableproperties/';
            req.method = 'post';
            req.rawBody = {tableNoun: 'Test'};
            req.body = {tableNoun: 'Update Table Noun', description: 'desc', tableIcon: 'icon'};
        });

        afterEach(function() {
            req.url = '';
            req.rawBody = {};
            req.body = {};
            executeReqStub.restore();
            createTablePropertiesStub.restore();
        });

        it('returns success response on valid input', function(done) {
            let executeReqStubResp = {body: '{"tableNoun": "test"}'};
            executeReqStub.onCall(0).returns(Promise.resolve(executeReqStubResp));
            let promise = tablesApi.replaceTableProperties(req, tableId);

            promise.then(
                function(response) {
                    assert.deepEqual(response, {tableNoun: 'test'});
                    assert.equal(createTablePropertiesStub.callCount, 0);
                    done();
                },
                function() {
                    done(new Error("Unexpected failure promise return when testing replaceTableProperties"));
                }
            ).catch(function(errorMsg) {
                done(new Error('replaceTableProperties: exception processing test: ' + JSON.stringify(errorMsg)));
            });
        });

        it('returns no response on error due to invalid input', function(done) {
            let executeReqStubResp = 'fail unit test case execution';
            executeReqStub.onCall(0).returns(Promise.reject(new Error(executeReqStubResp)));
            let promise = tablesApi.replaceTableProperties(req, tableId);

            promise.then(
                function() {
                    assert.equal(createTablePropertiesStub.callCount, 0);
                    done();
                },
                function() {
                    done(new Error("Unexpected failure promise return when testing replaceTableProperties"));
                }
            ).catch(function(errorMsg) {
                done(new Error('replaceTableProperties: exception processing test: ' + JSON.stringify(errorMsg)));
            });
        });

        it('results in failure of table props creation after a non 404 error', function(done) {
            let executeReqStubResp = {statusCode: 400};
            executeReqStub.onCall(0).returns(Promise.reject(executeReqStubResp));
            let promise = tablesApi.replaceTableProperties(req, tableId);

            promise.then(
                function() {
                    assert.equal(createTablePropertiesStub.callCount, 0);
                    done();
                },
                function() {
                    done(new Error("Unexpected failure promise return when testing replaceTableProperties"));
                }
            ).catch(function(errorMsg) {
                done(new Error('replaceTableProperties: exception processing test: ' + JSON.stringify(errorMsg)));
            });
        });

        it('successfully creates table props after a 404 error', function(done) {
            let executeReqStubResp = {statusCode: 404};
            executeReqStub.onCall(0).returns(Promise.reject(executeReqStubResp));
            let createTablePropsResp = {body: '{"tableNoun": "updated table noun"}'};
            createTablePropertiesStub.returns(Promise.resolve(createTablePropsResp));
            let promise = tablesApi.replaceTableProperties(req, tableId);

            promise.then(
                function(response) {
                    assert.equal(createTablePropertiesStub.callCount, 1);
                    assert.deepEqual(response, createTablePropsResp);
                    done();
                },
                function() {
                    done(new Error("Unexpected failure promise return when testing replaceTableProperties"));
                }
            ).catch(function(errorMsg) {
                done(new Error('replaceTableProperties: exception processing test: ' + JSON.stringify(errorMsg)));
            });
        });

        it('results in failure of table properties creation after a 404 error', function(done) {
            let executeReqStubResp = {statusCode: 404};
            executeReqStub.onCall(0).returns(Promise.reject(executeReqStubResp));
            let createTablePropsResp = {error: 'Some error'};
            createTablePropertiesStub.returns(Promise.reject(createTablePropsResp));
            let promise = tablesApi.replaceTableProperties(req, tableId);

            promise.then(
                function() {
                    done(new Error("Unexpected success promise return when testing replaceTableProperties"));
                },
                function(error) {
                    assert.equal(createTablePropertiesStub.callCount, 1);
                    assert.deepEqual(error, createTablePropsResp);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('replaceTableProperties: exception processing test: ' + JSON.stringify(errorMsg)));
            });
        });

    });


    describe('validate createTableComponents function', function() {
        let createTableStub = null;
        let createTablePropertiesStub = null;
        let createReportStub = null;
        let createFormStub = null;
        let getFieldsForTableStub = null;
        let deleteTableSpy = null;
        let deleteTablePropsSpy = null;
        let createTableResp = {'body':'123'};
        let createTablePropsResp = {body: '{"tableNoun": "test"}'};
        let createReportResp = {'body':'{"id":"1"}'};
        let createFormResp = {'body':'{"formId":"1"}'};
        let errorPromise = Promise.reject({error: 'some error'});
        let getFieldsForTableResp = [{"builtIn":false, "id":"6"}] ;

        beforeEach(function() {
            createTableStub = sinon.stub(tablesApi, 'createTable');
            createTablePropertiesStub = sinon.stub(tablesApi, 'createTableProperties');
            createReportStub = sinon.stub(reportsApi, 'createReport');
            createFormStub = sinon.stub(formsApi, 'createForm');
            getFieldsForTableStub = sinon.stub(fieldsApi, 'getFieldsForTable');
            tablesApi.setFieldsApi(fieldsApi);
            tablesApi.setFormsApi(formsApi);
            tablesApi.setReportsApi(reportsApi);
            req.body = {name: 'name', tableNoun: 'noun', description: 'desc', tableIcon: 'icon'};
            req.url = 'apps/123/tables/tableComponents';
            req.method = 'post';
            createTableStub.returns(Promise.resolve(createTableResp));
            createTablePropertiesStub.returns(Promise.resolve(createTablePropsResp));
            getFieldsForTableStub.returns(Promise.resolve(getFieldsForTableResp));
            createFormStub.returns(Promise.resolve(createFormResp));
            deleteTableSpy = sinon.spy(tablesApi, 'deleteTable');
            deleteTablePropsSpy = sinon.spy(tablesApi, 'deleteTableProperties');
        });

        afterEach(function() {
            req.url = '';
            req.rawBody = {};
            createTableStub.restore();
            createTablePropertiesStub.restore();
            createReportStub.restore();
            createFormStub.restore();
            getFieldsForTableStub.restore();
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
                    done(new Error('Unexpected failure promise return when testing createTableComponents success'));
                }
            ).catch(function(errorMsg) {
                done(new Error('createTableComponents: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });
        it('fails table name isnt passed in ', function(done) {
            req.body = {tableNoun: 'noun', description: 'desc', tableIcon: 'icon'};
            let promise = tablesApi.createTableComponents(req);

            promise.then(
                function(response) {
                    done(new Error('Unexpected success when missing required fields'));
                },
                function(error) {
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('createTableComponents: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });
        it('fails table noun isnt passed in ', function(done) {
            req.body = {name: 'name', description: 'desc', tableIcon: 'icon'};
            let promise = tablesApi.createTableComponents(req);

            promise.then(
                function(response) {
                    done(new Error('Unexpected success when missing required fields'));
                },
                function(error) {
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('createTableComponents: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });
        it('deletes table if table props creation fails', function(done) {
            createTablePropertiesStub.returns(errorPromise);
            let promise = tablesApi.createTableComponents(req);

            promise.then(
                function(response) {
                    done(new Error('Unexpected success when table props creation failed'));
                },
                function(error) {
                    assert(deleteTableSpy.called);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('createTableComponents: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });
        it('deletes table if call to get fields fail', function(done) {
            getFieldsForTableStub.returns(errorPromise);
            let promise = tablesApi.createTableComponents(req);

            promise.then(
                function(response) {
                    done(new Error('Unexpected success if field creation failed'));
                },
                function(error) {
                    assert(deleteTableSpy.called);
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
                    done(new Error('Unexpected success if report creation failed'));
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
                    done(new Error('Unexpected success if form creation failed'));
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
        it('get field is not called if table creation fails', function(done) {
            getFieldsForTableStub.restore();
            getFieldsForTableStub = sinon.stub(fieldsApi, 'getFieldsForTable');
            getFieldsForTableStub.returns(Promise.resolve(getFieldsForTableResp));
            createTableStub.returns(errorPromise);
            let promise = tablesApi.createTableComponents(req);

            promise.then(
                function(response) {
                    done(new Error('Unexpected success if table creation failed'));
                },
                function(error) {
                    assert.equal(getFieldsForTableStub.callCount, 0);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('createTableComponents: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });
        it('create table props is not called if table creation fails', function(done) {
            createTablePropertiesStub.restore();
            createTablePropertiesStub = sinon.spy(tablesApi, 'createTableProperties');
            createTableStub.returns(errorPromise);
            let promise = tablesApi.createTableComponents(req);

            promise.then(
                function(response) {
                    done(new Error('Unexpected success if table creation failed'));
                },
                function(error) {
                    assert.equal(createTablePropertiesStub.callCount, 0);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('createTableComponents: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });
        it('create report is not called if field creation fails', function(done) {
            createReportStub.restore();
            createReportStub = sinon.spy(reportsApi, 'createReport');
            getFieldsForTableStub.returns(errorPromise);
            let promise = tablesApi.createTableComponents(req);

            promise.then(
                function(response) {
                    done(new Error('Unexpected success if field creation failed'));
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
            createFormStub = sinon.spy(formsApi, 'createForm');
            getFieldsForTableStub.returns(errorPromise);
            let promise = tablesApi.createTableComponents(req);

            promise.then(
                function(response) {
                    done(new Error('Unexpected success if field creation failed'));
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

    describe('validate updateTable function', function() {
        let patchTableStub = null;
        let replaceTablePropsStub = null;
        let patchTableResp = {};
        let replaceTablePropsResp = {body: '{"tableNoun": "test"}'};
        let getFieldsStub = null;
        let patchFieldStub = null;
        let getFieldsResp = {id: 6};
        let patchFieldResp = {};
        let errorPromise = Promise.reject({error: 'some error'});

        beforeEach(function() {
            patchTableStub = sinon.stub(tablesApi, 'patchTable');
            replaceTablePropsStub = sinon.stub(tablesApi, 'replaceTableProperties');
            getFieldsStub = sinon.stub(fieldsApi, 'getField');
            patchFieldStub = sinon.stub(fieldsApi, 'patchField');
            req.body = {name: 'name', tableNoun: 'noun', description: 'desc', tableIcon: 'icon'};
            req.url = 'apps/123/tables/456';
            req.method = 'patch';
            req.params = {tableId: 456};
            patchTableStub.returns(Promise.resolve(patchTableResp));
            replaceTablePropsStub.returns(Promise.resolve(replaceTablePropsResp));
            getFieldsStub.returns(Promise.resolve(getFieldsResp));
            patchFieldStub.returns(Promise.resolve(patchFieldResp));
        });

        afterEach(function() {
            req.url = '';
            req.rawBody = {};
            patchTableStub.restore();
            replaceTablePropsStub.restore();
            getFieldsStub.restore();
            patchFieldStub.restore();
        });

        it('success return results ', function(done) {
            let promise = tablesApi.updateTable(req);

            promise.then(
                function(response) {
                    done();
                },
                function(error) {
                    done(new Error('Unexpected failure promise return when testing updateTable success'));
                }
            ).catch(function(errorMsg) {
                done(new Error('updateTable: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });
        it('doesnt call patchTable if name wasnt updated ', function(done) {
            patchTableStub.restore();
            patchTableStub = sinon.spy(tablesApi, 'patchTable');
            req.body = {tableNoun: 'noun', description: 'desc', tableIcon: 'icon'};
            let promise = tablesApi.updateTable(req);

            promise.then(
                function(response) {
                    assert.equal(patchTableStub.callCount, 0);
                    done();
                },
                function(error) {
                    done(new Error('Unexpected failure promise return when testing updateTable success'));
                }
            ).catch(function(errorMsg) {
                done(new Error('updateTable: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });
        it('fails if updateTable fails', function(done) {
            patchTableStub.returns(errorPromise);
            req.body = {name: 'name', tableNoun: 'noun', description: 'desc', tableIcon: 'icon'};
            let promise = tablesApi.updateTable(req);

            promise.then(
                function(response) {
                    done(new Error('Unexpected success promise return when patchTable failed'));
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
            req.body = {name: 'name', tableNoun: 'noun', description: 'desc', tableIcon: 'icon'};
            let promise = tablesApi.updateTable(req);

            promise.then(
                function(response) {
                    done(new Error('Unexpected success promise return when replaceTableProperties failed'));
                },
                function(error) {
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('updateTable: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });
        it('fails if getField fails', function(done) {
            getFieldsStub.restore();
            getFieldsStub.returns(errorPromise);
            req.body = {name: 'name', tableNoun: 'noun', description: 'desc', tableIcon: 'icon', recordTitleFieldId: 6};
            let promise = tablesApi.updateTable(req);

            promise.then(
                function(response) {
                    done(new Error('Unexpected success promise return when getField failed'));
                },
                function(error) {
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('updateTable: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });
        it('fails if patchField fails', function(done) {
            patchFieldStub.returns(errorPromise);
            req.body = {name: 'name', tableNoun: 'noun', description: 'desc', tableIcon: 'icon', recordTitleFieldId: 6};
            let promise = tablesApi.updateTable(req);

            promise.then(
                function(response) {
                    done(new Error('Unexpected success promise return when patchTable failed'));
                },
                function(error) {
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('updateTable: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });
        it('doesnt call getField if record title wasnt updated', function(done) {
            getFieldsStub.restore();
            getFieldsStub = sinon.spy(fieldsApi, 'getField');
            req.body = {tableNoun: 'noun', description: 'desc', tableIcon: 'icon'};
            let promise = tablesApi.updateTable(req);

            promise.then(
                function(response) {
                    assert.equal(getFieldsStub.callCount, 0);
                    done();
                },
                function(error) {
                    done(new Error('Unexpected failure promise return when testing updateTable success'));
                }
            ).catch(function(errorMsg) {
                done(new Error('updateTable: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });
    });
    describe('validate deleteTableEntities function', function() {
        let executeReqStub = null;

        beforeEach(function() {
            executeReqStub = sinon.stub(requestHelper, 'executeRequest');
            tablesApi.setRequestHelperObject(requestHelper);
            req.url = 'apps/123/tables/456';
            req.method = 'delete';
        });

        afterEach(function() {
            req.url = '';
            executeReqStub.restore();
        });

        it('success return results ', function(done) {
            executeReqStub.returns(Promise.resolve({statusCode:'200'}));
            let promise = tablesApi.deleteTableEntities(req, '456');

            promise.then(
                function(response) {
                    assert.deepEqual(response, {statusCode: 200});
                    done();
                },
                function(error) {
                    done(new Error('Unexpected failure promise return when testing deleteTableEntities success'));
                }
            ).catch(function(errorMsg) {
                done(new Error('deleteTableEntities: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });

        it('fail return results ', function(done) {
            let error_message = 'fail unit test case execution';

            executeReqStub.returns(Promise.reject(new Error(error_message)));
            let promise = tablesApi.deleteTableEntities(req, '456');

            promise.then(
                function() {
                    done(new Error('Unexpected success promise return when testing deleteTableEntities failure'));
                },
                function(error) {
                    assert.equal(error, 'Error: fail unit test case execution');
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('deleteTableEntities: exception processing failure test: ' + JSON.stringify(errorMsg)));
            });
        });
    });
    describe('validate deleteTableComponents function', function() {
        let deleteTableStub = null;
        let deleteTableEntitiesStub = null;
        let deleteTableResp = {};
        let deleteTableEntitiesResp = {};
        let errorPromise = Promise.reject({error: 'some error'});

        beforeEach(function() {
            deleteTableStub = sinon.stub(tablesApi, 'deleteTable');
            deleteTableEntitiesStub = sinon.stub(tablesApi, 'deleteTableEntities');
            req.url = 'apps/123/tables/456';
            req.method = 'delete';
            deleteTableStub.returns(Promise.resolve(deleteTableResp));
            deleteTableEntitiesStub.returns(Promise.resolve(deleteTableEntitiesResp));
        });

        afterEach(function() {
            req.url = '';
            req.rawBody = {};
            deleteTableStub.restore();
            deleteTableEntitiesStub.restore();
        });

        it('success return results ', function(done) {
            let promise = tablesApi.deleteTableComponents(req);

            promise.then(
                function(response) {
                    done();
                },
                function(error) {
                    done(new Error('Unexpected failure promise return when testing deleteTableComponents success'));
                }
            ).catch(function(errorMsg) {
                done(new Error('deleteTableComponents: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });
        it('fails if deleteTable fails', function(done) {
            deleteTableStub.returns(errorPromise);
            let promise = tablesApi.deleteTableComponents(req);

            promise.then(
                function(response) {
                    done(new Error('Unexpected success promise return when deleteTable failed'));
                },
                function(error) {
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('deleteTableComponents: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });
        it('success if deleteTableEntities fails', function(done) {
            deleteTableEntitiesStub.returns(errorPromise);
            let promise = tablesApi.deleteTableComponents(req);

            promise.then(
                function(response) {
                    done();
                },
                function(error) {
                    done(new Error('Unexpected failure promise return when testing deleteTableComponents success'));
                }
            ).catch(function(errorMsg) {
                done(new Error('deleteTableComponents: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });
    });


});
