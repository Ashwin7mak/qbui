'use strict';

var assert = require('assert');
var app = require('../../src/app');
var request = require('request');
var config = require('../../src/config/environment');
var apiBase = require('./api.base.js')(config);
var testConsts = require('./api.test.constants');

describe('GET /api/health', function() {
    it('should respond with JSON object with sqlDate', function(done) {
        this.timeout(testConsts.INTEGRATION_TIMEOUT);
        var opts = {
            url   : config.DOMAIN + apiBase.resolveHealthEndpoint(),
            method: 'GET'
        };
        request(opts, function(error, response) {
            assert.equal(response.statusCode, 200, 'Unexpected status code.');
            done();
        });
    });
});
