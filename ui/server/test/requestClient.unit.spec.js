'use strict';

const sinon = require('sinon');
const should = require('should');
const assert = require('assert');
const requestClient = require('../src/requestClient');
const tracing = require('../src/tracingProvider');

/**
 * Unit tests for request client provider
 */
describe('Validate that the request client provider', () => {
    it('should return an initialized requestClient module by default', () => {
        should.exist(requestClient);
    });

    it('returns a request client', () => {
        let mockConfig = {'tracingEnabled': 'false'};
        let client = requestClient.getClient(mockConfig);

        assert.notEqual(client, undefined);
        assert.notEqual(client, null);
    });

    describe('based on environment config', () => {
        let traceSpy;

        before(function() {
            traceSpy = sinon.spy(tracing, 'getTracingRequestClient');
        });

        after(function() {
            traceSpy.restore();
        });


        it('returns a standard request client', () => {
            let mockConfig = {'tracingEnabled': 'false'};

            requestClient.getClient(mockConfig);

            assert(traceSpy.notCalled);
        });

        it('returns an instrumented request client', () => {
            let mockConfig = {'tracingEnabled': 'true'};

            requestClient.getClient(mockConfig);

            assert(traceSpy.called);
        });
    });
});
