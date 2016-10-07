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
            req.params = {};
        });

        it('success return select all fields with no parameter ', function(done) {
            req.url = '/apps/1/tables/1/fields';
            var targetObject = "{'body':[]}";
            executeReqStub.returns(Promise.resolve(targetObject));
            var promise = fieldsApi.fetchFields(req);

            promise.then(
                function(response) {
                    assert.deepEqual(response, targetObject);
                    done();
                },
                function(error) {
                    assert.fail('fail', 'success', 'failure response returned when success expected');
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve /apps/1/tables/1/fields: ' + JSON.stringify(errorMsg)));
            });

        });

        it('success return select field with parameter ', function(done) {
            req.url = '/apps/123/tables/456/fields/789?show=tell';
            req.params.fieldId = '789';

            var targetObject = "[{fields: []}]";

            executeReqStub.returns(Promise.resolve(targetObject));
            var promise = fieldsApi.fetchFields(req);

            promise.then(
                function(response) {
                    assert.deepEqual(response, targetObject);
                    done();
                },
                function(error) {
                    assert.fail('fail', 'success', 'failure response returned when success expected');
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve all records: ' + JSON.stringify(errorMsg)));
            });
        });

        it('fail return results ', function(done) {
            req.url = '/apps/1/tables/1/fields';
            var error_message = "fail fieldsApi unit test case execution";

            executeReqStub.returns(Promise.reject(new Error(error_message)));
            var promise = fieldsApi.fetchFields(req);

            promise.then(
                function(success) {
                    assert.fail('success', 'fail', 'Test fail promise error and success promise returned');
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
