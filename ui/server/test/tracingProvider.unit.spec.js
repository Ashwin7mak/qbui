const sinon = require('sinon');
const should = require('should');
const assert = require('assert');
const tracing = require('../src/tracingProvider');

/**
 * Unit tests for tracing provider
 */
describe('Validate that the tracing provider', () => {
    it('should return an initialized tracingProvider module by default', () => {
        should.exist(tracing);
    });

    describe('based on environment config', () => {
        const tracingOn = [
            {
                name: "returns tracing middleware when tracing is enabled by the string 'true'",
                mockConfig: {'tracingEnabled': 'true', 'tracingHost': 'xray'}
            },
            {
                name: "returns tracing middleware when tracing is enabled by the boolean true",
                mockConfig: {'tracingEnabled': true, 'tracingHost': 'xray'}
            },
        ];

        tracingOn.forEach(function(testCase) {
            it(testCase.name, () => {
                let middleware = tracing.getTracingMiddleware(testCase.mockConfig);

                assert.notEqual(middleware, undefined);
                assert.notEqual(middleware, null);
            });
        });

        it('returns a tracing client', () => {
            let tracingClient = tracing.getTracingRequestClient();

            assert.notEqual(tracingClient, undefined);
            assert.notEqual(tracingClient, null);
        });

    });
});
