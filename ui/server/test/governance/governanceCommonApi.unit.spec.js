const sinon = require('sinon');
const assert = require('assert');
const config = {legacyBase: '.legacyBase', javaHost: 'http://javaHost', SSL_KEY: {private: 'privateKey', cert: 'cert', requireCert: true}};
const requestHelper = require('../../src/api/quickbase/requestHelper')(config);
const routeHelper = require('../../src/routes/routeHelper');

const governanceCommonApi = require('../../src/governance/common/GovernanceCommonApi')(config);
const testAccountId = '12345';

describe('GovernanceCommonApi', () => {
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
        governanceCommonApi.setRequestHelperObject(requestHelper);
        req.url = '/governance/context';
        req.method = 'get';
    });

    afterEach(function() {
        req.method = 'get';
        req.url = '';
        executeReqStub.restore();
    });

    describe('getContext', () => {
        it('gets the context of governance (Realm, Account, and User Info)', (done) => {
            executeReqStub.returns(Promise.resolve({'body': '[]'}));

            const promise = governanceCommonApi.getContext(req, testAccountId);

            promise.then(response => {
                assert.deepEqual(response, []);
                done();
            }, error => {
                done(new Error("Unexpected failure return when testing getContext success"));
            }).catch(errorMessage => {
                done(new Error('getAccountUsers: exception processing success test: ' + JSON.stringify(errorMessage)));
            });
        });
    });
});
