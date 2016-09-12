'use strict';

var config = {javaHost: 'http://javaHost', SSL_KEY: {private: 'privateKey', cert: 'cert', requireCert: true}};
var sinon = require('sinon');
var assert = require('assert');
var requestHelper = require('./../../../src/api/quickbase/requestHelper')(config);
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

    describe("when getAppUsers is called", function() {
        var executeReqStub = null;

        beforeEach(function() {
            executeReqStub = sinon.stub(requestHelper, "executeRequest");
            appsApi.setRequestHelperObject(requestHelper);
        });

        afterEach(function() {
            executeReqStub.restore();
        });

        it('success return results ', function(done) {
            req.url = '/app/1/users';
            var targetObject = "{'body':[]}";
            executeReqStub.returns(Promise.resolve(targetObject));
            var promise = appsApi.getAppUsers(req);

            promise.then(
                function(response) {
                    assert.deepEqual(response, []);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve /app/1/users: ' + JSON.stringify(errorMsg)));
            });

        });

        it('fail return results ', function(done) {
            req.url = '/app/1/users';
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

});
