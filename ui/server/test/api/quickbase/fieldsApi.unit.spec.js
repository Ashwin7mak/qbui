'use strict';

var config = {javaHost: 'http://javaHost', SSL_KEY: {private: 'privateKey', cert: 'cert', requireCert: true}};
var sinon = require('sinon');
var assert = require('assert');
var requestHelper = require('./../../../src/api/quickbase/requestHelper')(config);
var fieldsApi = require('../../../src/api/quickbase/fieldsApi')(config);
var constants = require('../../../../common/src/constants');

/**
 * Unit tests for fields apis
 */
describe("Validate fieldsApi", function() {
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

    describe("when getFields is called", function() {
        var executeReqStub = null;

        beforeEach(function() {
            executeReqStub = sinon.stub(requestHelper, "executeRequest");
            fieldsApi.setRequestHelperObject(requestHelper);
        });

        afterEach(function() {
            executeReqStub.restore();
        });

        it('success return results ', function(done) {
            req.url = '/apps/1/tables/1/fields?param=1';
            var targetObject = "{'body':[]}";
            executeReqStub.returns(Promise.resolve(targetObject));
            var promise = fieldsApi.fetchFields(req);

            promise.then(
                function(response) {
                    assert.deepEqual(response, targetObject);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve /apps/1/tables/1/fields: ' + JSON.stringify(errorMsg)));
            });

        });

        it('fail return results ', function(done) {
            req.url = '/apps/1/tables/1/fields';
            var error_message = "fail fieldsApi unit test case execution";

            executeReqStub.returns(Promise.reject(new Error(error_message)));
            var promise = fieldsApi.fetchFields(req);

            promise.then(
                function(success) {
                    assert.fail('Test fail promise error and success promise returned');
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

});
