'use strict';
var should = require('should');
var assert = require('assert');
var app = require('../../app');
var request = require('request');
var config = require('../../config/environment');
var apiBase = require('./api.base.js')(config);

/**
 * Negative integration test for  realm and ticket creation, which are not proxied to the javahost
 * by a running node server
 */
describe('API - Negative /realms & /ticket test cases', function () {

    it('Should fail to create a realm with a 404', function (done) {
        var opts = {
            url: config.DOMAIN + apiBase.resolveRealmsEndpoint(117000),
            method: 'GET'
        };
        request(opts, function (error, response, body) {
            assert.notEqual(response, undefined, 'Unexpected  response. undefined');
            assert.notEqual(response.statusCode, undefined , 'Unexpected  response.statusCode undefined');
            assert.equal(response.statusCode, 403, 'Unexpected status code.');
            done();
        });
    });

    it('Should fail to create a ticket with a 404', function (done) {
        var opts = {
            url: config.DOMAIN + apiBase.resolveTicketEndpoint(),
            method: 'GET'
        };
        request(opts, function (error, response, body) {
            assert.equal(response.statusCode, 500, 'Unexpected status code.');
            done();
        });
    });
});
