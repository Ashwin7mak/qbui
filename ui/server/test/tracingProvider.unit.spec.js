'use strict';

var sinon = require('sinon');
var should = require('should');
var assert = require('assert');
var tracing = require('../src/tracingProvider');

/**
 * Unit tests for tracing provider
 */
describe('Validate that the tracing provider', () => {
    it('should return an initialized tracingProvider module by default', () => {
        should.exist(tracing);
    });

    describe('based on environment config', () => {
        it('returns a tracing client', () => {
            let tracingClient = tracing.getTracingRequestClient();

            assert.notEqual(tracingClient, undefined);
            assert.notEqual(tracingClient, null);
        });

        it('returns tracing middleware', () => {
            let mockConfig = {'tracingEnabled': 'true', 'tracingHost': 'xray'};
            let middleware = tracing.getTracingMiddleware(mockConfig);

            assert.notEqual(middleware, undefined);
            assert.notEqual(middleware, null);
        });
    });
});
