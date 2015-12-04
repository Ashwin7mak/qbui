// test that node server will redirect to http
'use strict';

var assert = require('assert');
var sinon = require('sinon');
var rewire = require('rewire');

/*eslint-disable no-invalid-this */

describe('Test node app main entry file', function() {

    it('test config with NODE_ENV not defined', function() {
        var exception = false;
        var origVal = process.env.NODE_ENV;

        delete process.env.NODE_ENV;

        try {
            require('../app');
        } catch (e) {
            exception = true;
        }

        assert(exception);
        process.env.NODE_ENV = origVal;

    });
});

describe('Test node app main entry file', function() {

    var http;
    var https;
    var httpSpy;
    var httpsSpy;

    var saveHttpCreateServer;
    var saveHttpsCreateServer;

    beforeEach(function() {
        http = require('http');

        saveHttpCreateServer = http.createServer;
        http.createServer = function() {
            return {
                listen: function(port, host, callback) {
                    return true;
                }
            };
        };

        https = require('https');
        saveHttpsCreateServer = https.createServer;

        https.createServer = function() {
            return {
                listen: function(port, host, callback) {
                    return true;
                }
            };
        };

        httpSpy = sinon.spy(http, 'createServer');
        httpsSpy = sinon.spy(https, 'createServer');
    });

    afterEach(function() {
        http.createServer = saveHttpCreateServer;
        https.createServer = saveHttpsCreateServer;

        httpSpy.reset();
        httpsSpy.reset();
    });

    it('test http listen method', function(done) {
        var app = require('../app');
        assert(httpSpy.called);
        done();
    });

    it('test express middleware function for http request is redirected to https when required secure connection', function(done) {

        var app = require('../app');
        var mockReq = {
            secure: false,
            get: function() {
                return '1.2.3.4';
            },
            url: '/url'
        };
        var mockRes = {
            redirect: function(url) {
                return url;
            }
        };
        var next = function() {
            return true;
        };

        var spyRedirect = sinon.spy(mockRes, 'redirect');

        var redirect = app.requireHTTPS(mockReq, mockRes, next);

        assert(redirect === 'https://' + mockReq.get() + ':9443' + mockReq.url);
        assert(spyRedirect.called);

        spyRedirect.reset();
        done();

    });

    it('test express middleware function for https request is NOT redirected when required secure connection', function(done) {

        var app = require('../app');
        var mockReq = {
            secure: true,
            get: function() {
                return '1.2.3.4';
            },
            url: '/url'
        };
        var mockRes = {
            redirect: function(url) {
                return url;
            }
        };
        var mockNext = function() {
            return true;
        };

        var spyRedirect = sinon.spy(mockRes, 'redirect');

        var redirect = app.requireHTTPS(mockReq, mockRes, mockNext);

        assert(spyRedirect.called === false);
        assert.equal(redirect, undefined);

        spyRedirect.reset();
        done();

    });

});

