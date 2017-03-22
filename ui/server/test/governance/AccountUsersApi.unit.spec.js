'use strict';

let sinon = require('sinon');
let assert = require('assert');
let config = {legacyBase: '.legacyBase', javaHost: 'http://javaHost', SSL_KEY: {private: 'privateKey', cert: 'cert', requireCert: true}};
let requestHelper = require('../../src/api/quickbase/requestHelper')(config);
let routeHelper = require('../../src/routes/routeHelper');
let accountUsersApi = require('../../src/governance/account/users/AccountUsersApi')(config);

/**
 * Unit tests for Governance Account Users API
 */
describe('AccountUsers API', function() {

    let req = {
        headers: {
            'Content-Type': 'content-type',
        },
        'url': '',
        'method': '',
        params: {
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
        accountUsersApi.setRequestHelperObject(requestHelper);
        req.url = '/governance';
        req.method = 'get';
    });

    afterEach(function() {
        req.method = 'get';
        req.url = '';
        executeReqStub.restore();
    });

    describe("getAccountUsers", ()  => {

        it('gets a list of users for the specified account', (done)  => {

            executeReqStub.returns(Promise.resolve({'body': '[]'}));

            let promise = accountUsersApi.getAccountUsers(req, false);

            promise.then(
                function(response) {
                    assert.deepEqual(response, []);
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return when testing getAccountUsers success"));
                }
            ).catch(function(errorMsg) {
                done(new Error('getAccountUsers: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });
    });
});
