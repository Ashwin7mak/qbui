/**
 * Created by rbeyer on 2/21/17.
 */
'use strict';

let config = {legacyHost: 'http://legacyHost', javaHost: 'http://javaHost', SSL_KEY: {private: 'privateKey', cert: 'cert', requireCert: true}};
let sinon = require('sinon');
let assert = require('assert');
let requestHelper = require('./../../../src/api/quickbase/requestHelper')(config);
let routeHelper = require('../../../src/routes/routeHelper');
let rolesApi = require('../../../src/api/quickbase/rolesApi')(config);
let constants = require('../../../../common/src/constants');

/**
 * Unit tests for records apis
 */
describe("Validate rolesApi", function() {
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

    describe("validate getAppRoles function", function() {
        let executeReqStub = null;

        beforeEach(function() {
            executeReqStub = sinon.stub(requestHelper, "executeRequest");
            rolesApi.setRequestHelperObject(requestHelper);
            req.url = '/app/123/roles';
            req.method = 'get';
        });

        afterEach(function() {
            req.method = 'get';
            req.url = '';
            executeReqStub.restore();
        });

        it('success return results ', function(done) {
            executeReqStub.returns(Promise.resolve({'body': '[{"id": 1, "name": "none", "tableRights": {}, "fieldRights": {}, "description": "", "access": "NONE"}]'}));
            let promise = rolesApi.getAppRoles(req);

            promise.then(
                function(response) {
                    assert.deepEqual(response, [{"id": 1, "name": "none", "tableRights": {}, "fieldRights": {}, "description": "", "access": "NONE"}]);
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return when testing getAppRoles success"));
                }
            ).catch(function(errorMsg) {
                done(new Error('getAppUsers: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });

        it('fail return results ', function(done) {
            let error_message = "fail unit test case execution";

            executeReqStub.returns(Promise.reject(new Error(error_message)));
            let promise = rolesApi.getAppRoles(req);

            promise.then(
                function(error) {
                    done(new Error("Unexpected success promise return when testing getAppRoles failure"));
                },
                function(error) {
                    assert.equal(error, "Error: fail unit test case execution");
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('getAppUsers: exception processing fail test: ' + JSON.stringify(errorMsg)));
            });
        });

        it('unexpected exception return results ', function(done) {
            let error_message = "unexpected exception unit test case execution";

            executeReqStub.returns(Promise.resolve(new Error(error_message)));
            let promise = rolesApi.getAppRoles(req);

            promise.then(
                function(error) {
                    done(new Error("Unexpected success promise return when testing getAppRoles exception"));
                },
                function(error) {
                    assert.ok(true);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('getAppRoles: exception processing exception test: ' + JSON.stringify(errorMsg)));
            });
        });
    });
});
