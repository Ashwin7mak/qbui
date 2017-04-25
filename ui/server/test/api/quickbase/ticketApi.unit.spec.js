'use strict';

let config = {legacyBase: '.legacyBase', javaHost: 'http://javaHost', SSL_KEY: {private: 'privateKey', cert: 'cert', requireCert: true}};
let sinon = require('sinon');
let assert = require('assert');
let requestHelper = require('./../../../src/api/quickbase/requestHelper')(config);
let routeHelper = require('../../../src/routes/routeHelper');
let ticketApi = require('../../../src/api/quickbase/ticketApi')(config);
let constants = require('../../../../common/src/constants');

/**
 * Unit tests for ticket apis
 */
describe("Validate ticketApis", function() {
    let req = {
        headers: {
            'Content-Type': 'content-type',
            'host': 'subdomain.domain.com:9000'
        },
        'url': '',
        'method': '',
        params: {
            realmId: '1234'
        },
        param: function(key) {
            if (key === 'format') {
                return 'raw';
            } else {
                throw new Error("Unexpected key", key);
            }
        }
    };
    describe("validate whoAmI function", function() {
        let executeReqStub = null;

        beforeEach(function() {
            executeReqStub = sinon.stub(requestHelper, "executeRequest");
            ticketApi.setRequestHelperObject(requestHelper);
            req.url = '/ticket/whoami';
            req.method = 'get';
        });

        afterEach(function() {
            req.method = 'get';
            req.url = '';
            executeReqStub.restore();
        });

        it('success return results ', function(done) {
            executeReqStub.returns(Promise.resolve({'body': '[{"id":1234, "administrator": false}]'}));
            let promise = ticketApi.whoAmI(req, req.params.realmId);

            promise.then(
                function(response) {
                    assert.deepEqual(response, [{"id":1234, "administrator": false}]);
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return when testing whoAmI success"));
                }
            ).catch(function(errorMsg) {
                done(new Error('whoAmI: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });

        it('fail return results ', function(done) {
            let error_message = "fail unit test case execution";

            executeReqStub.returns(Promise.reject(new Error(error_message)));
            let promise = ticketApi.whoAmI(req, req.params.realmId);

            promise.then(
                function(error) {
                    done(new Error("Unexpected success promise return when testing whoami failure"));
                },
                function(error) {
                    assert.equal(error, "Error: fail unit test case execution");
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('whoami: exception processing failure test: ' + JSON.stringify(errorMsg)));
            });
        });

        it('unexpected exception return results ', function(done) {
            let error_message = "unexpected exception unit test case execution";

            executeReqStub.returns(Promise.resolve(new Error(error_message)));
            let promise = ticketApi.whoAmI(req, req.params.realmId);

            promise.then(
                function(error) {
                    done(new Error("Unexpected success promise return when testing whoAmI exception"));
                },
                function(error) {
                    assert.ok(true);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('whoAmI: exception processing exception test: ' + JSON.stringify(errorMsg)));
            });
        });
    });
});
