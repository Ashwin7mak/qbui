'use strict';

let config = {legacyBase: '.legacyBase', javaHost: 'http://javaHost', SSL_KEY: {private: 'privateKey', cert: 'cert', requireCert: true}};
let sinon = require('sinon');
let assert = require('assert');
let requestHelper = require('./../../../src/api/quickbase/requestHelper')(config);
let routeHelper = require('../../../src/routes/routeHelper');
let appsApi = require('../../../src/api/quickbase/appsApi')(config);
let constants = require('../../../../common/src/constants');

/**
 * Unit tests for records apis
 */
describe("Validate appsApi", function() {
    let req = {
        headers: {
            'Content-Type': 'content-type',
            'host': 'subdomain.domain.com:9000'
        },
        'url': '',
        'method': '',
        params: {
            appId: '123'
        },
        param : function(key) {
            if (key === 'format') {
                return 'raw';
            } else {
                throw new Error("Unexpected key", key);
            }
        }
    };

    describe("validate getAppUsers function", function() {
        let executeReqStub = null;

        beforeEach(function() {
            executeReqStub = sinon.stub(requestHelper, "executeRequest");
            appsApi.setRequestHelperObject(requestHelper);
            req.url = '/app/123';
            req.method = 'get';
        });

        afterEach(function() {
            req.method = 'get';
            req.url = '';
            executeReqStub.restore();
        });

        it('success return results ', function(done) {
            executeReqStub.returns(Promise.resolve({'body': '{"1": [{"id":1}]}'}));
            let promise = appsApi.getAppUsers(req);

            promise.then(
                function(response) {
                    assert.deepEqual(response, [[{"userId":1}], {"1": [{"userId":1}]}]);
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return when testing getAppUser success"));
                }
            ).catch(function(errorMsg) {
                done(new Error('getAppUsers: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });

        it('fail return results ', function(done) {
            let error_message = "fail unit test case execution";

            executeReqStub.returns(Promise.reject(new Error(error_message)));
            let promise = appsApi.getAppUsers(req);

            promise.then(
                function(error) {
                    done(new Error("Unexpected success promise return when testing getAppUser failure"));
                },
                function(error) {
                    assert.equal(error, "Error: fail unit test case execution");
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('getAppUsers: exception processing fail test: ' + JSON.stringify(errorMsg)));
            });
        });
    });

    describe("validate getRelationshipsForApp function", function() {
        let executeReqStub = null;
        let originalUrl;

        before(function() {
            originalUrl = req.url;
        });

        beforeEach(function() {
            executeReqStub = sinon.stub(requestHelper, "executeRequest");
            appsApi.setRequestHelperObject(requestHelper);
            req.url = '/apps/123/rest/of/url';
            req.method = 'get';
        });

        afterEach(function() {
            req.method = 'get';
            req.url = originalUrl;
            executeReqStub.restore();
        });

        it('success return results', function(done) {
            executeReqStub.returns(Promise.resolve({body: '[{"appId": 1}]'}));
            let promise = appsApi.getRelationshipsForApp(req);

            promise.then(
                function(response) {
                    assert.deepEqual(response, [{"appId":1}]);
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return when testing getRelationshipsForApp success"));
                }
            ).catch(function(errorMsg) {
                done(new Error('getRelationshipsForApp: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });

        it('fail return results ', function(done) {
            let error_message = "fail unit test case execution";

            executeReqStub.returns(Promise.reject(new Error(error_message)));
            let promise = appsApi.getAppUsers(req);

            promise.then(
                function(error) {
                    done(new Error("Unexpected success promise return when testing getRelationshipsForApp failure"));
                },
                function(error) {
                    assert.equal(error, "Error: fail unit test case execution");
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('getRelationshipsForApp: exception processing fail test: ' + JSON.stringify(errorMsg)));
            });
        });
    });

    describe("validate getAppAccessRights function", function() {
        let executeReqStub = null;

        beforeEach(function() {
            executeReqStub = sinon.stub(requestHelper, "executeRequest");
            appsApi.setRequestHelperObject(requestHelper);
            req.url = '/app/123';
            req.method = 'get';
        });

        afterEach(function() {
            req.method = 'get';
            req.url = '';
            executeReqStub.restore();
        });

        it('success return results ', function(done) {
            executeReqStub.returns(Promise.resolve({'body': '[{"id":1}]'}));
            let promise = appsApi.getAppAccessRights(req, req.params.appId);

            promise.then(
                function(response) {
                    assert.deepEqual(response, [{"id":1}]);
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return when testing getAppAccessRights success"));
                }
            ).catch(function(errorMsg) {
                done(new Error('getAppAccessRights: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });

        it('fail return results ', function(done) {
            let error_message = "fail unit test case execution";

            executeReqStub.returns(Promise.reject(new Error(error_message)));
            let promise = appsApi.getAppAccessRights(req, req.params.appId);

            promise.then(
                function(error) {
                    done(new Error("Unexpected success promise return when testing getAppAccessRights failure"));
                },
                function(error) {
                    assert.equal(error, "Error: fail unit test case execution");
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('getAppAccessRights: exception processing failure test: ' + JSON.stringify(errorMsg)));
            });
        });

        it('unexpected exception return results ', function(done) {
            let error_message = "unexpected exception unit test case execution";

            executeReqStub.returns(Promise.resolve(new Error(error_message)));
            let promise = appsApi.getAppAccessRights(req, req.params.appId);

            promise.then(
                function(error) {
                    done(new Error("Unexpected success promise return when testing getAppAccessRights exception"));
                },
                function(error) {
                    assert.ok(true);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('getAppAccessRights: exception processing exception test: ' + JSON.stringify(errorMsg)));
            });
        });
    });

    describe("validate getTableProperties function", function () {
        let executeReqStub = null;
        let createTablePropertiesStub = null;
        let testTable = {name: 'test', id: '456'};

        beforeEach(function () {
            executeReqStub = sinon.stub(requestHelper, "executeRequest");
            createTablePropertiesStub = sinon.stub(appsApi, "_createTableProperties");
            appsApi.setRequestHelperObject(requestHelper);
            req.url = 'apps/123/tables/456/tableproperties/';
            req.method = 'get';
        });

        afterEach(function () {
            req.method = 'get';
            req.url = '';
            createTablePropertiesStub.restore();
            executeReqStub.restore();
        });

        it("returns success response on a valid input", function (done) {
            let executeReqStubResp = {'body': '{"tableNoun": "test noun", "description": "desc", "tableIcon": "icon"}'};
            executeReqStub.returns(Promise.resolve(executeReqStubResp));
            let promise = appsApi.getTableProperties(req, testTable);

            promise.then(
                function (response) {
                    assert.deepEqual(response, {tableNoun: 'test noun', description: 'desc', tableIcon: 'icon'});
                    done();
                },
                function () {
                    done("Unexpected failure promise return when testing getTableProperties");
                }
            ).catch(function (errorMsg) {
                done(new Error('getTableProperties: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });

        it("fails to create table properties due to error", function (done) {
            let executeReqStubResp = 'fail unit test case execution';
            executeReqStub.returns(Promise.reject(executeReqStubResp));
            let promise = appsApi.getTableProperties(req, testTable);

            promise.then(
                function () {
                    done();
                },
                function () {
                    done("Unexpected failure promise return when testing getTableProperties");
                }
            ).catch(function (errorMsg) {
                done(new Error('getTableProperties: exception processing success test: ' + JSON.stringify(errorMsg)));
            });

        });

        it("fails to create table properties due to exception", function (done) {
            let executeReqStubResp = null;
            executeReqStub.returns(Promise.resolve(executeReqStubResp));
            let promise = appsApi.getTableProperties(req, testTable);

            promise.then(
                function () {
                    done();
                },
                function () {
                    done("Unexpected failure promise return when testing getTableProperties");
                }
            ).catch(function (errorMsg) {
                done(new Error('getTableProperties: exception processing success test: ' + JSON.stringify(errorMsg)));
            });

        });

        it("fails to create table properties for a non 404 error", function (done) {
            let executeReqStubResp = {statusCode: 400};
            executeReqStub.returns(Promise.reject(executeReqStubResp));
            let promise = appsApi.getTableProperties(req, testTable);

            promise.then(
                function () {
                    done();
                },
                function () {
                    done("Unexpected failure promise return when testing getTableProperties");
                }
            ).catch(function (errorMsg) {
                done(new Error('getTableProperties: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });


        it("successfully creates table properties after a 404 error", function (done) {
            let executeReqStubResp = {statusCode: 404};
            executeReqStub.returns(Promise.reject(executeReqStubResp));
            let createTablePropsResp = {body: '{"tableNoun": "test"}'};
            createTablePropertiesStub.returns(Promise.resolve(createTablePropsResp));
            let promise = appsApi.getTableProperties(req, testTable);

            promise.then(
                function (response) {
                    assert.deepEqual(response, {tableNoun: 'test'});
                    done();
                },
                function () {
                    done("Unexpected failure promise return when testing getTableProperties");
                }
            ).catch(function (errorMsg) {
                done(new Error('getTableProperties: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });

        it("fails to create table properties for a 404 error", function (done) {
            let executeReqStubResp = {statusCode: 404};
            executeReqStub.returns(Promise.reject(executeReqStubResp));
            let createTablePropsResp = {error: 'some error'};
            createTablePropertiesStub.returns(Promise.reject(createTablePropsResp));
            let promise = appsApi.getTableProperties(req, testTable);

            promise.then(
                function () {
                    done();
                },
                function () {
                    done("Unexpected failure promise return when testing getTableProperties");
                }
            ).catch(function (errorMsg) {
                done(new Error('getTableProperties: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });

        it("fails to create table properties for a 404 error due to exception", function (done) {
            let executeReqStubResp = {statusCode: 404};
            executeReqStub.returns(Promise.reject(executeReqStubResp));
            let createTablePropRespStub = null;
            createTablePropertiesStub.returns(Promise.resolve(createTablePropRespStub));

            let promise = appsApi.getTableProperties(req, testTable);

            promise.then(
                function () {
                    done();
                },
                function () {
                    done("Unexpected failure promise return when testing getTableProperties");
                }
            ).catch(function (errorMsg) {
                done(new Error('getTableProperties: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });
    });

    describe("validate getApp function", function() {
        let executeReqStub = null;
        let getTablePropertiesStub = null;
        let tablePropsSuccessResponse = {tableId: 1, icon: "test"};

        beforeEach(function() {
            executeReqStub = sinon.stub(requestHelper, "executeRequest");
            getTablePropertiesStub = sinon.stub(appsApi, "getTableProperties");
            appsApi.setRequestHelperObject(requestHelper);
            req.url = '/app/123';
            req.method = 'get';
        });

        afterEach(function() {
            req.method = 'get';
            req.url = '';
            getTablePropertiesStub.restore();
            executeReqStub.restore();
        });

        it('success return results ', function(done) {
            executeReqStub.returns(Promise.resolve({'body': '{"id":1, "tables": [{"id": 1, "name": "table1"}]}'}));
            getTablePropertiesStub.returns(Promise.resolve(tablePropsSuccessResponse));
            let promise = appsApi.getApp(req, req.params.appId);

            promise.then(
                function(response) {
                    assert.deepEqual(response, {id:1, tables: [{id: 1, tableId: 1, name: "table1", icon: "test"}]});
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return when testing getApp success"));
                }
            ).catch(function(errorMsg) {
                done(new Error('getApp: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });

        it('fail return results ', function(done) {
            let error_message = "fail unit test case execution";

            executeReqStub.returns(Promise.reject(new Error(error_message)));
            let promise = appsApi.getApp(req, req.params.appId);

            promise.then(
                function(error) {
                    done(new Error("Unexpected success promise return when testing getApp failure"));
                },
                function(error) {
                    assert.equal(error, "Error: fail unit test case execution");
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('getApp: exception processing failure test: ' + JSON.stringify(errorMsg)));
            });
        });

        it('error on getTableProps returns success results ', function(done) {
            executeReqStub.returns(Promise.resolve({'body': '{"id":1, "tables": [{"id": 1, "name": "table1"}]}'}));
            getTablePropertiesStub.returns(Promise.reject({error: "some error"}));
            let promise = appsApi.getApp(req, req.params.appId);

            promise.then(
                function(response) {
                    assert.deepEqual(response, {id:1, tables: [{id: 1, name: "table1"}]});
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return when testing getApp success"));
                }
            ).catch(function(errorMsg) {
                done(new Error('getApp: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });

        it('error on getTableProps returns success results 2', function(done) {
            executeReqStub.returns(Promise.resolve({'body': '{"id":1, "tables": [{"id": 1, "name": "table1"}]}'}));
            getTablePropertiesStub.returns();
            let promise = appsApi.getApp(req, req.params.appId);

            promise.then(
                function(response) {
                    assert.deepEqual(response, {id:1, tables: [{id: 1, name: "table1"}]});
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return when testing getApp success"));
                }
            ).catch(function(errorMsg) {
                done(new Error('getApp: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });

        it('exception on getTableProps returns success results', function(done) {
            executeReqStub.returns(Promise.resolve({'body': '{"id":1, "tables": [{"id": 1, "name": "table1"}]}'}));
            getTablePropertiesStub.returns();
            let promise = appsApi.getApp(req, req.params.appId);

            promise.then(
                function(response) {
                    assert.deepEqual(response, {id:1, tables: [{id: 1, name: "table1"}]});
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return when testing getApp success"));
                }
            ).catch(function(errorMsg) {
                done(new Error('getApp: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });

        it('unexpected exception return results ', function(done) {
            let error_message = "unexpected exception unit test case execution";

            executeReqStub.returns(Promise.resolve(new Error(error_message)));
            let promise = appsApi.getApp(req, req.params.appId);

            promise.then(
                function(error) {
                    done(new Error("Unexpected success promise return when testing getApp exception"));
                },
                function(error) {
                    assert.ok(true);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('getApp: exception processing exception test: ' + JSON.stringify(errorMsg)));
            });
        });
    });

    describe("validate getHydratedApp function", function() {
        let getAppStub = null;
        let getAppAccessRightsStub = null;

        beforeEach(function() {
            getAppStub = sinon.stub(appsApi, "getApp");
            getAppAccessRightsStub = sinon.stub(appsApi, "getAppAccessRights");

            req.url = '/app/123';
            req.method = 'get';
        });

        afterEach(function() {
            req.method = 'get';
            req.url = '';
            getAppStub.restore();
            getAppAccessRightsStub.restore();
        });

        it('success return results ', function(done) {
            let appResults = {"id":1};
            let rightsResults = {"tableRights": ""};

            getAppStub.returns(Promise.resolve(appResults));
            getAppAccessRightsStub.returns(Promise.resolve(rightsResults));

            //  build the expected response object
            let responseObj = appResults;
            responseObj.rights = rightsResults;

            let promise = appsApi.getHydratedApp(req, req.params.appId);
            promise.then(
                function(response) {
                    assert.deepEqual(response, responseObj);
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return when testing getApp success"));
                }
            ).catch(function(errorMsg) {
                done(new Error('getHydratedApp: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });

        it('fail return results with get app error', function(done) {
            let appResults = {"id":1};
            let rightsResults = {"tableRights": ""};

            let errMsg = new Error('errorMsg');
            getAppStub.returns(Promise.reject(errMsg));
            getAppAccessRightsStub.returns(Promise.resolve(rightsResults));

            let promise = appsApi.getHydratedApp(req, req.params.appId);
            promise.then(
                function(response) {
                    done(new Error("Unexpected success promise return when testing getApp failure"));
                },
                function(error) {
                    assert.deepEqual(error, errMsg);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('getHydratedApp: exception processing failure test: ' + JSON.stringify(errorMsg)));
            });
        });

        it('fail return results with get app access rights error', function(done) {
            let appResults = {"id":1};
            let rightsResults = {"tableRights": ""};

            let errMsg = new Error('errorMsg');
            getAppStub.returns(Promise.resolve(appResults));
            getAppAccessRightsStub.returns(Promise.reject(errMsg));

            let promise = appsApi.getHydratedApp(req, req.params.appId);
            promise.then(
                function(response) {
                    done(new Error("Unexpected success promise return when testing getAppAccessRights failure"));
                },
                function(error) {
                    assert.deepEqual(error, errMsg);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('getHydratedApp: exception processing failure test2: ' + JSON.stringify(errorMsg)));
            });
        });
    });

    describe("validate getApps function: hydate = false", function() {
        let executeReqStub = null;

        beforeEach(function() {
            executeReqStub = sinon.stub(requestHelper, "executeRequest");
            appsApi.setRequestHelperObject(requestHelper);

            req.url = '/app/123';
            req.method = 'get';
        });

        afterEach(function() {
            req.method = 'get';
            req.url = '';
            executeReqStub.restore();
        });

        it('success return results', function(done) {
            let resp = {'body': '[{"id":1},{"id":2}]'};
            executeReqStub.returns(Promise.resolve(resp));

            //  build the expected response object
            let responseObj = JSON.parse(resp.body);

            let promise = appsApi.getApps(req);
            promise.then(
                function(response) {
                    assert.deepEqual(response, responseObj);
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return when testing getApps success"));
                }
            ).catch(function(errorMsg) {
                done(new Error('getApps: exception processing success test(hydrate=false): ' + JSON.stringify(errorMsg)));
            });
        });

        it('failure return results', function(done) {
            let resp = new Error('errorMsg');
            executeReqStub.returns(Promise.reject(resp));

            let promise = appsApi.getApps(req);
            promise.then(
                function(response) {
                    done(new Error("Unexpected success promise return when testing getApps failure"));
                },
                function(error) {
                    assert.deepEqual(error, resp);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('getApps: exception processing failure test(hydrate=false): ' + JSON.stringify(errorMsg)));
            });
        });

        it('expection return results', function(done) {
            let resp = new Error('errorMsg');
            executeReqStub.returns(Promise.resolve(resp));

            let promise = appsApi.getApps(req);
            promise.then(
                function(response) {
                    done(new Error("Unexpected success promise return when testing getApps exception"));
                },
                function(error) {
                    assert.ok(true);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('getApps: exception processing exception test(hydrate=false): ' + JSON.stringify(errorMsg)));
            });
        });
    });

    describe("validate getApps function: hydate = true", function() {
        let executeReqStub = null;
        let hydratedAppStub = null;

        beforeEach(function() {
            hydratedAppStub = sinon.stub(appsApi, "getHydratedApp");
            executeReqStub = sinon.stub(requestHelper, "executeRequest");
            appsApi.setRequestHelperObject(requestHelper);

            req.url = '/app/123?hydrate=1';
            req.method = 'get';
            req.params.hydrate = true;
        });

        afterEach(function() {
            req.method = 'get';
            req.url = '';
            executeReqStub.restore();
            hydratedAppStub.restore();
        });

        it('success return results - 2 apps', function(done) {
            let resp = {'body': '[{"id":1},{"id":2}]'};
            let hydratedResp = {"id":1};
            executeReqStub.returns(Promise.resolve(resp));
            hydratedAppStub.returns(Promise.resolve(hydratedResp));

            //  build the expected response object
            let responseObj = JSON.parse(resp.body);

            let hydratedRespList = [];
            for (let i = 0; i < responseObj.length; i++) {
                hydratedRespList.push(hydratedResp);
            }

            let promise = appsApi.getApps(req);
            promise.then(
                function(response) {
                    assert.deepEqual(response, hydratedRespList);
                    assert.equal(hydratedAppStub.callCount, 2);
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return when testing getApps success"));
                }
            ).catch(function(errorMsg) {
                done(new Error('getApps: exception processing success test(hydrate=true): ' + JSON.stringify(errorMsg)));
            });
        });

        it('success return results - 0 apps', function(done) {
            let resp = {'body': '[]'};
            let hydratedResp = {};
            executeReqStub.returns(Promise.resolve(resp));
            hydratedAppStub.returns(Promise.resolve(hydratedResp));

            //  build the expected response object
            let responseObj = JSON.parse(resp.body);

            let hydratedRespList = [];
            for (let i = 0; i < responseObj.length; i++) {
                hydratedRespList.push(hydratedResp);
            }

            let promise = appsApi.getApps(req);
            promise.then(
                function(response) {
                    assert.deepEqual(response, hydratedRespList);
                    assert.equal(hydratedAppStub.callCount, 0);
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return when testing getApps success"));
                }
            ).catch(function(errorMsg) {
                done(new Error('getApps: exception processing success test2(hydrate=true): ' + JSON.stringify(errorMsg)));
            });
        });

        it('failure return results', function(done) {
            let resp = new Error('error');
            let hydratedResp = {"id":1};
            executeReqStub.returns(Promise.reject(resp));
            hydratedAppStub.returns(Promise.resolve(hydratedResp));

            let promise = appsApi.getApps(req);
            promise.then(
                function(response) {
                    done(new Error("Unexpected success promise return when testing getApps failure"));
                },
                function(error) {
                    assert.deepEqual(error, resp);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('getApps: exception processing failure test(hydrate=true): ' + JSON.stringify(errorMsg)));
            });
        });

        it('exception return results', function(done) {
            let resp = new Error('error');
            let hydratedResp = {"id":1};
            executeReqStub.returns(Promise.resolve(resp));
            hydratedAppStub.returns(Promise.resolve(hydratedResp));

            let promise = appsApi.getApps(req);
            promise.then(
                function(response) {
                    done(new Error("Unexpected success promise return when testing getApps exception"));
                },
                function(error) {
                    assert.deepEqual(error, resp);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('getApps: exception processing exception test(hydrate=true): ' + JSON.stringify(errorMsg)));
            });
        });

    });
});
