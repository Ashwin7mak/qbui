const rewire = require('rewire');
const config = {legacyBase: '.legacyBase', javaHost: 'http://javaHost', SSL_KEY: {private: 'privateKey', cert: 'cert', requireCert: true}};
const sinon = require('sinon');
const assert = require('assert');
const healthApiCreator = rewire('../../../src/api/quickbase/healthApi');
let healthApi;

const mockRequestHelper = {};

describe('HealthApi', () => {
    beforeEach(() => {
        healthApiCreator.__set__('requestHelper', mockRequestHelper);
        healthApi = healthApiCreator(config);
    });

    describe('getShallowHealthCheck', () => {
        it('returns a response with a message to make sure Node/Express is taking connections', () => {
            return healthApi.getShallowHealthCheck().then(
                response => {
                    // Only checking that it has a message. It doesn't matter what that message is for this particular api.
                    assert.deepEqual(Object.keys(response), ['systemDate', 'message']);
                    return response;
                },
                error => {
                    assert.equal(false, true, `The shallow health check failed and it should have succeeded. ${JSON.stringify(error)}`);
                    return Promise.reject(error);
                }
            );
        });
    });
});
