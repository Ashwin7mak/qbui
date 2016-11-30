'use strict';

var config = {legacyHost: 'http://legacyHost', javaHost: 'http://javaHost', SSL_KEY: {private: 'privateKey', cert: 'cert', requireCert: true}};
var sinon = require('sinon');
var assert = require('assert');
var requestHelper = require('./../../../src/api/quickbase/requestHelper')(config);
var routeHelper = require('../../../src/routes/routeHelper');
var appsApi = require('../../../src/api/quickbase/appsApi')(config);
var constants = require('../../../../common/src/constants');

/**
 * Unit tests for records apis
 */
describe("Validate appsApi", function() {
    var req = {
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
        var executeReqStub = null;

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
            var promise = appsApi.getAppUsers(req);

            promise.then(
                function(response) {
                    assert.deepEqual(response, [{"userId":1}]);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve /app/1/users: ' + JSON.stringify(errorMsg)));
            });

        });

        it('fail return results ', function(done) {
            var error_message = "fail unit test case execution";

            executeReqStub.returns(Promise.reject(new Error(error_message)));
            var promise = appsApi.getAppUsers(req);

            promise.then(
                function(error) {
                },
                function(error) {
                    assert.equal(error, "Error: fail unit test case execution");
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve /app/1/users: ' + JSON.stringify(errorMsg)));
            });

        });
    });

    describe("validate stack preference function", function() {
        var executeReqStub = null;
        var opts = null;

        beforeEach(function() {
            executeReqStub = sinon.stub(requestHelper, "executeRequest");
            req.url = '/apps/123/stack';
            appsApi.setRequestHelperObject(requestHelper);
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

            executeReqStub.returns(Promise.resolve('ok'));
            var promise = appsApi.stackPreference(req);

            promise.then(
                function(response) {
                    assert(executeReqStub.calledWith(sinon.match.any, opts), 'Assert failure calling get stack preference.  Options mismatch.');
                    done();
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

            executeReqStub.returns(Promise.resolve('ok'));
            var promise = appsApi.stackPreference(req);

            promise.then(
                function(response) {
                    assert(executeReqStub.calledWith(sinon.match.any, opts), 'Assert failure calling post stack preference with openInV3=true. Options mismatch.');
                    done();
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

            executeReqStub.returns(Promise.resolve('ok'));
            var promise = appsApi.stackPreference(req);

            promise.then(
                function(response) {
                    assert(executeReqStub.calledWith(sinon.match.any, opts), 'Assert failure calling post stack preference with openInV3=false. Options mismatch: ');
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve /app/1/users: ' + JSON.stringify(errorMsg)));
            });

        });
    });

});
