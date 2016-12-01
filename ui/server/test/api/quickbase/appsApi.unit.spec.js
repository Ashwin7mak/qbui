'use strict';

let config = {legacyHost: 'http://legacyHost', javaHost: 'http://javaHost', SSL_KEY: {private: 'privateKey', cert: 'cert', requireCert: true}};
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
            'Content-Type': 'content-type'
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
            req.url = '/app/123/users';
            req.method = 'get';
        });

        afterEach(function() {
            req.method = 'get';
            req.url = '';
            executeReqStub.restore();
        });

        it('success return results ', function(done) {
            executeReqStub.returns(Promise.resolve({'body': '[{"id":1}]'}));
            let promise = appsApi.getAppUsers(req);

            promise.then(
                function(response) {
                    assert.deepEqual(response, [{"userId":1}]);
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return when testing getAppUser success"));
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve /app/1/users: ' + JSON.stringify(errorMsg)));
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
                done(new Error('unable to resolve /app/1/users: ' + JSON.stringify(errorMsg)));
            });
        });

        it('unexpected fail return results ', function(done) {
            let error_message = "unexpected exception unit test case execution";

            executeReqStub.returns(Promise.resolve(new Error(error_message)));
            let promise = appsApi.getAppUsers(req);

            promise.then(
                function(error) {
                    done(new Error("Unexpected success promise return when testing getAppUser exception"));
                },
                function(error) {
                    assert.ok(true);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve /app/1/users: ' + JSON.stringify(errorMsg)));
            });
        });
    });

    describe("validate getAppAccessRights function", function() {
        let executeReqStub = null;

        beforeEach(function() {
            executeReqStub = sinon.stub(requestHelper, "executeRequest");
            appsApi.setRequestHelperObject(requestHelper);
            req.url = '/app/123/users';
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
                done(new Error('unable to resolve /app/1/users: ' + JSON.stringify(errorMsg)));
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
                done(new Error('unable to resolve /app/1/users: ' + JSON.stringify(errorMsg)));
            });
        });

        it('unexpected fail return results ', function(done) {
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
                done(new Error('unable to resolve /app/1/users: ' + JSON.stringify(errorMsg)));
            });
        });
    });

    describe("validate getApp function", function() {
        let executeReqStub = null;

        beforeEach(function() {
            executeReqStub = sinon.stub(requestHelper, "executeRequest");
            appsApi.setRequestHelperObject(requestHelper);
            req.url = '/app/123/users';
            req.method = 'get';
        });

        afterEach(function() {
            req.method = 'get';
            req.url = '';
            executeReqStub.restore();
        });

        it('success return results ', function(done) {
            executeReqStub.returns(Promise.resolve({'body': '[{"id":1}]'}));
            let promise = appsApi.getApp(req, req.params.appId);

            promise.then(
                function(response) {
                    assert.deepEqual(response, [{"id":1}]);
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return when testing getApp success"));
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve /app/1/users: ' + JSON.stringify(errorMsg)));
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
                done(new Error('unable to resolve /app/1/users: ' + JSON.stringify(errorMsg)));
            });
        });

        it('unexpected fail return results ', function(done) {
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
                done(new Error('unable to resolve /app/1/users: ' + JSON.stringify(errorMsg)));
            });
        });
    });

    describe("validate getHydratedApp function", function() {
        let getAppStub = null;
        let getAppAccessRightsStub = null;
        let getStackPrefStub = null;

        beforeEach(function() {
            getAppStub = sinon.stub(appsApi, "getApp");
            getAppAccessRightsStub = sinon.stub(appsApi, "getAppAccessRights");
            getStackPrefStub = sinon.stub(appsApi, "stackPreference");

            req.url = '/app/123/users';
            req.method = 'get';
        });

        afterEach(function() {
            req.method = 'get';
            req.url = '';
            getAppStub.restore();
            getAppAccessRightsStub.restore();
            getStackPrefStub.restore();
        });

        it('success return results ', function(done) {
            let appResults = {"id":1};
            let rightsResults = {"tableRights": ""};
            let stackPrefResults = {"errorCode":0, "v3Status":"true"};

            getAppStub.returns(Promise.resolve(appResults));
            getAppAccessRightsStub.returns(Promise.resolve(rightsResults));
            getStackPrefStub.returns(Promise.resolve(stackPrefResults));

            //  build the expected response object
            let responseObj = appResults;
            responseObj.rights = rightsResults;
            responseObj.openInV3 = stackPrefResults.v3Status;

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
                done(new Error('unable to resolve /app/1/users: ' + JSON.stringify(errorMsg)));
            });
        });

        it('success return results with cur stack error', function(done) {
            let appResults = {"id":1};
            let rightsResults = {"tableRights": ""};
            let stackPrefResults = {"errorCode":99, "v3Status":"false"};

            getAppStub.returns(Promise.resolve(appResults));
            getAppAccessRightsStub.returns(Promise.resolve(rightsResults));
            getStackPrefStub.returns(Promise.resolve(stackPrefResults));

            //  build the expected response object
            let responseObj = appResults;
            responseObj.rights = rightsResults;
            responseObj.openInV3 = true;

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
                done(new Error('unable to resolve /app/1/users: ' + JSON.stringify(errorMsg)));
            });
        });

        it('fail return results with get app error', function(done) {
            let appResults = {"id":1};
            let rightsResults = {"tableRights": ""};
            let stackPrefResults = {"errorCode":0, "v3Status":"true"};

            let errMsg = new Error('errorMsg');
            getAppStub.returns(Promise.reject(errMsg));
            getAppAccessRightsStub.returns(Promise.resolve(rightsResults));
            getStackPrefStub.returns(Promise.resolve(stackPrefResults));

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
                done(new Error('unable to resolve /app/1/users: ' + JSON.stringify(errorMsg)));
            });
        });

        it('fail return results with get app access rights error', function(done) {
            let appResults = {"id":1};
            let rightsResults = {"tableRights": ""};
            let stackPrefResults = {"errorCode":0, "v3Status":"true"};

            let errMsg = new Error('errorMsg');
            getAppStub.returns(Promise.resolve(appResults));
            getAppAccessRightsStub.returns(Promise.reject(errMsg));
            getStackPrefStub.returns(Promise.resolve(stackPrefResults));

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
                done(new Error('unable to resolve /app/1/users: ' + JSON.stringify(errorMsg)));
            });
        });
    });

    describe("validate stack preference function", function() {
        let executeReqStub = null;
        let opts = null;
        let resp;
        let respObj;

        beforeEach(function() {
            executeReqStub = sinon.stub(requestHelper, "executeRequest");
            req.url = '/apps/123/stack';
            appsApi.setRequestHelperObject(requestHelper);

            resp = {'body':'{"errorCode":0, "openInV3":"true"}'};
            respObj = JSON.parse(resp.body);
        });

        afterEach(function() {
            executeReqStub.restore();
            req.method = 'get';
            req.url = '';
            opts = null;
        });

        it('get request', function(done) {
            //  setup options for the get request
            opts = requestHelper.setOptions(req);
            opts.headers[constants.CONTENT_TYPE] = constants.APPLICATION_JSON;
            opts.url = requestHelper.getLegacyHost() + routeHelper.getApplicationStackPreferenceRoute(req.params.appId);

            executeReqStub.returns(Promise.resolve(resp));
            let promise = appsApi.stackPreference(req, req.params.appId);
            promise.then(
                function(response) {
                    assert(executeReqStub.calledWith(sinon.match.any, opts), 'Assert failure calling get stack preference.  Options mismatch.');
                    assert.deepEqual(response, respObj);
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return with testing get stack preference"));
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve /app/1/users: ' + JSON.stringify(errorMsg)));
            });
        });

        it('get request with success error', function(done) {
            //  setup options for the get request
            opts = requestHelper.setOptions(req);
            opts.headers[constants.CONTENT_TYPE] = constants.APPLICATION_JSON;
            opts.url = requestHelper.getLegacyHost() + routeHelper.getApplicationStackPreferenceRoute(req.params.appId);

            resp = {'body':'{"errorCode":1, "v3Status":"true"}'};
            respObj = JSON.parse(resp.body);
            executeReqStub.returns(Promise.resolve(resp));
            let promise = appsApi.stackPreference(req, req.params.appId);
            promise.then(
                function(response) {
                    assert(executeReqStub.calledWith(sinon.match.any, opts), 'Assert failure calling get stack preference.  Options mismatch.');
                    assert.deepEqual(response, respObj);
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return with testing get stack preference with success error"));
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve /app/1/users: ' + JSON.stringify(errorMsg)));
            });
        });

        it('get request with failure', function(done) {
            //  setup options for the get request
            opts = requestHelper.setOptions(req);
            opts.headers[constants.CONTENT_TYPE] = constants.APPLICATION_JSON;
            opts.url = requestHelper.getLegacyHost() + routeHelper.getApplicationStackPreferenceRoute(req.params.appId);

            let errorResp = {"errorCode":99, "v3Status":"true"};
            executeReqStub.returns(Promise.reject(errorResp));

            let promise = appsApi.stackPreference(req, req.params.appId);
            promise.then(
                function(response) {
                    assert(executeReqStub.calledWith(sinon.match.any, opts), 'Assert failure calling get stack preference error.  Options mismatch.');
                    assert.deepEqual(response, errorResp);
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return with testing get stack preference failure"));
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve /app/1/users: ' + JSON.stringify(errorMsg)));
            });
        });

        it('get request with unexpected failure', function(done) {
            //  setup options for the get request
            opts = requestHelper.setOptions(req);
            opts.headers[constants.CONTENT_TYPE] = constants.APPLICATION_JSON;
            opts.url = requestHelper.getLegacyHost() + routeHelper.getApplicationStackPreferenceRoute(req.params.appId);

            let badResp = {"errorCode":99, "v3Status":"true"};
            executeReqStub.returns(Promise.resolve(badResp));

            let promise = appsApi.stackPreference(req, req.params.appId);
            promise.then(
                function(response) {
                    assert(executeReqStub.calledWith(sinon.match.any, opts), 'Assert failure calling get stack preference exception.  Options mismatch.');
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return with testing get stack preference exception"));
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve /app/1/users: ' + JSON.stringify(errorMsg)));
            });
        });

        it('post request with openInV3 true', function(done) {
            //  setup options for the post request
            req.method = 'post';
            req.rawBody = '{"openInV3":true}';
            //  setup options for the get request
            opts = requestHelper.setOptions(req);
            opts.headers[constants.CONTENT_TYPE] = constants.APPLICATION_JSON;
            opts.url = requestHelper.getLegacyHost() + routeHelper.getApplicationStackPreferenceRoute(req.params.appId, true, 1);

            executeReqStub.returns(Promise.resolve(resp));
            let promise = appsApi.stackPreference(req, req.params.appId);

            promise.then(
                function(response) {
                    assert(executeReqStub.calledWith(sinon.match.any, opts), 'Assert failure calling post stack preference with openInV3=true. Options mismatch.');
                    assert.deepEqual(response, respObj);
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return with testing post stack preference with openInV3=true"));
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve /app/1/users: ' + JSON.stringify(errorMsg)));
            });
        });

        it('post request with openInV3 false', function(done) {
            //  setup options for the post request
            req.method = 'post';
            req.rawBody = '{"openInV3":false}';
            //  setup options for the get request
            opts = requestHelper.setOptions(req);
            opts.headers[constants.CONTENT_TYPE] = constants.APPLICATION_JSON;
            opts.url = requestHelper.getLegacyHost() + routeHelper.getApplicationStackPreferenceRoute(req.params.appId, true, 0);

            executeReqStub.returns(Promise.resolve(resp));
            let promise = appsApi.stackPreference(req, req.params.appId);

            promise.then(
                function(response) {
                    assert(executeReqStub.calledWith(sinon.match.any, opts), 'Assert failure calling post stack preference with openInV3=false. Options mismatch: ');
                    assert.deepEqual(response, respObj);
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return with testing post stack preference with openInV3=false"));
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve /app/1/users: ' + JSON.stringify(errorMsg)));
            });

        });
    });

});
