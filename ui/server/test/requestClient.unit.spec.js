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

    describe('based on environment config', () => {
        let traceSpy;

        before(function() {
            traceSpy = sinon.spy(tracing, 'getTracingRequestClient');
        });

        after(function() {
            traceSpy.restore();
        });

        const tracingOff = [
            {
                name: "returns a standard request client when tracing is disabled by the string 'false'",
                mockConfig: {'tracingEnabled': 'false', 'tracingHost': 'xray'}
            },
            {
                name: "returns a standard request client when tracing is disabled by the boolean false",
                mockConfig: {'tracingEnabled': false, 'tracingHost': 'xray'}
            },
        ];

        const tracingOn = [
            {
                name: "returns an instrumented request client when tracing is enabled by the string 'true'",
                mockConfig: {'tracingEnabled': 'true', 'tracingHost': 'xray'}
            },
            {
                name: "returns an instrumented request client when tracing is enabled by the boolean true",
                mockConfig: {'tracingEnabled': true, 'tracingHost': 'xray'}
            },
        ];

        tracingOff.forEach(function(testCase) {
            it(testCase.name, () => {
                requestClient.getClient(testCase.mockConfig);

                assert(traceSpy.notCalled);
            });
        });

        tracingOn.forEach(function(testCase) {
            it(testCase.name, () => {
                requestClient.getClient(testCase.mockConfig);

                assert(traceSpy.called);
            });
        });
    });
});
