'use strict';

let config = {legacyHost: 'http://legacyHost', javaHost: 'http://javaHost', SSL_KEY: {private: 'privateKey', cert: 'cert', requireCert: true}};
let sinon = require('sinon');
let assert = require('assert');
let requestHelper = require('./../../../src/api/quickbase/requestHelper')(config);
let routeHelper = require('../../../src/routes/routeHelper');
let usersApi = require('../../../src/api/quickbase/usersApi')(config);
let constants = require('../../../../common/src/constants');

/**
 * Unit tests for users apis
 */
describe("Validate usersApi", function() {
    describe("validate getUserById function", function() {
        let req = {
            headers: {
                'Content-Type': 'content-type',
                'host': 'subdomain.domain.com:9000'
            },
            'url': '',
            'method': '',
            params: {
                userId: '1234'
            },
            param: function(key) {
                if (key === 'format') {
                    return 'raw';
                } else {
                    throw new Error("Unexpected key", key);
                }
            }
        };
        let executeReqStub = null;

        beforeEach(function() {
            executeReqStub = sinon.stub(requestHelper, "executeRequest");
            usersApi.setRequestHelperObject(requestHelper);
            req.url = '/users/1234';
            req.method = 'get';
        });

        afterEach(function() {
            req.method = 'get';
            req.url = '';
            executeReqStub.restore();
        });

        it('success return results ', function(done) {
            executeReqStub.returns(Promise.resolve({'body': '[{"id":1234, "administrator": false}]'}));
            let promise = usersApi.getUserById(req, req.params.userId);

            promise.then(
                function(response) {
                    assert.deepEqual(response, [{"id":1234, "administrator": false}]);
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return when testing getUserById success"));
                }
            ).catch(function(errorMsg) {
                done(new Error('getUserById: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });

        it('fail return results ', function(done) {
            let error_message = "fail unit test case execution";

            executeReqStub.returns(Promise.reject(new Error(error_message)));
            let promise = usersApi.getUserById(req, req.params.userId);

            promise.then(
                function(error) {
                    done(new Error("Unexpected success promise return when testing getUserById failure"));
                },
                function(error) {
                    assert.equal(error, "Error: fail unit test case execution");
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('getUserById: exception processing failure test: ' + JSON.stringify(errorMsg)));
            });
        });

        it('unexpected exception return results ', function(done) {
            let error_message = "unexpected exception unit test case execution";

            executeReqStub.returns(Promise.resolve(new Error(error_message)));
            let promise = usersApi.getUserById(req, req.params.userId);

            promise.then(
                function(error) {
                    done(new Error("Unexpected success promise return when testing getUserById exception"));
                },
                function(error) {
                    assert.ok(true);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('getUserById: exception processing exception test: ' + JSON.stringify(errorMsg)));
            });
        });
    });

    describe("validate getReqUser function", function() {
        let req = {
            headers: {
                'Content-Type': 'content-type',
                'host': 'subdomain.domain.com:9000'
            },
            cookies: {
                'TICKET': '8_bmmjq9qj3_j2s_ct8wen_a_h4bce9bkfvvej7tyi99dt8xr5cbt2xq2zyh3tkab6z9z69gr2gzj'
            },
            'url': '',
            'method': '',
            param: function(key) {
                if (key === 'format') {
                    return 'raw';
                } else {
                    throw new Error("Unexpected key", key);
                }
            }
        };
        let executeReqStub = null;

        beforeEach(function() {
            executeReqStub = sinon.stub(requestHelper, "executeRequest");
            usersApi.setRequestHelperObject(requestHelper);
            req.url = '/reqUser';
            req.method = 'get';
        });

        afterEach(function() {
            req.method = 'get';
            req.url = '';
            executeReqStub.restore();
        });

        it('success return results ', function(done) {
            executeReqStub.returns(Promise.resolve({'body': '[{"id":1234, "administrator": false}]'}));
            let promise = usersApi.getReqUser(req);

            promise.then(
                function(response) {
                    assert.deepEqual(response, [{"id":1234, "administrator": false}]);
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return when testing getReqUser success"));
                }
            ).catch(function(errorMsg) {
                done(new Error('getReqUser: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });

        it('fail return results ', function(done) {
            let error_message = "fail unit test case execution";

            executeReqStub.returns(Promise.reject(new Error(error_message)));
            let promise = usersApi.getReqUser(req);

            promise.then(
                function(error) {
                    done(new Error("Unexpected success promise return when testing getReqUser failure"));
                },
                function(error) {
                    assert.equal(error, "Error: fail unit test case execution");
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('getReqUser: exception processing failure test: ' + JSON.stringify(errorMsg)));
            });
        });

        it('unexpected exception return results ', function(done) {
            let error_message = "unexpected exception unit test case execution";

            executeReqStub.returns(Promise.resolve(new Error(error_message)));
            let promise = usersApi.getReqUser(req);

            promise.then(
                function(error) {
                    done(new Error("Unexpected success promise return when testing getReqUser exception"));
                },
                function(error) {
                    assert.ok(true);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('getReqUser: exception processing exception test: ' + JSON.stringify(errorMsg)));
            });
        });
    });
});
