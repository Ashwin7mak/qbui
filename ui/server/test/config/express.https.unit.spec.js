// test that node server will redirect to http
'use strict';

var request = require('supertest');
var should = require('should');
var assert = require('assert');
var rewire = require('rewire');

var routeGroups = require('../../src/routes/routeGroups');
var envConsts = require('../../src/config/environment/environmentConstants');

describe('Request test always use ssh', function() {

    it('test undefined config environment should throw an exception', function() {

        var exception = false;
        var mockConfig = {
            //  no environment defined
            hasSslOptions: function() {
                return false;
            }
        };

        var testExpress = rewire('../../src/config/expressConfig');
        testExpress.__set__({'config': mockConfig});

        var testapp = require('express')();

        try {
            testExpress(testapp);
        } catch (e) {
            exception = true;
        }

        assert(exception);
    });

    it('test undefined route group  and IP is set to their defaults', function() {

        var exception = false;
        var mockConfig = {
            env: envConsts.TEST,
            hasSslOptions: function() {
                return false;
            },
            root: 'testRoot',
            client: 'REACT'
            //  no route group defined
            //  no ip or DOMAIN
        };

        var testExpress = rewire('../../src/config/expressConfig');
        testExpress.__set__({'config': mockConfig});

        var testapp = require('express')();
        var newConfig = testExpress(testapp);

        assert.equal(newConfig.routeGroup, routeGroups.DEFAULT);
        assert.equal(newConfig.ip, 'localhost');
    });
});

describe('Test environments are setup correctly', function() {

    it('test production environment configuration', function() {

        var exception = false;
        var mockConfig = {
            env: envConsts.PRODUCTION,
            hasSslOptions: function() {
                return false;
            },
            root: 'testRoot',
            client: 'REACT'
            //  no route group defined
        };

        var testExpress = rewire('../../src/config/expressConfig');
        testExpress.__set__({'config': mockConfig});

        var testapp = require('express')();
        var newConfig = testExpress(testapp);

        assert(newConfig.isProduction);
    });

    it('test environment configuration', function() {

        var exception = false;
        var mockConfig = {
            env: envConsts.TEST,
            hasSslOptions: function() {
                return false;
            },
            root: 'testRoot',
            client: 'REACT'
        };

        var testExpress = rewire('../../src/config/expressConfig');
        testExpress.__set__({'config': mockConfig});

        var testapp = require('express')();
        var newConfig = testExpress(testapp);

        assert(!newConfig.isProduction);
    });

    it('PRE-PROD environment configuration', function() {

        var exception = false;
        var mockConfig = {
            env: envConsts.PRE_PROD,
            hasSslOptions: function() {
                return false;
            },
            root: 'testRoot',
            client: 'REACT'
        };

        var testExpress = rewire('../../src/config/expressConfig');
        testExpress.__set__({'config': mockConfig});

        var testapp = require('express')();
        var newConfig = testExpress(testapp);

        assert(newConfig.isProduction);
    });

    it('DEVELOPMENT environment configuration', function() {

        var exception = false;
        var mockConfig = {
            env: envConsts.DEVELOPMENT,
            hasSslOptions: function() {
                return false;
            },
            root: 'testRoot',
            client: 'REACT'
        };

        var testExpress = rewire('../../src/config/expressConfig');
        testExpress.__set__({'config': mockConfig});

        var testapp = require('express')();
        var newConfig = testExpress(testapp);

        assert(!newConfig.isProduction);
    });

    it('INTEGRATION environment configuration', function() {

        var exception = false;
        var mockConfig = {
            env: envConsts.INTEGRATION,
            hasSslOptions: function() {
                return false;
            },
            root: 'testRoot',
            client: 'REACT'
        };

        var testExpress = rewire('../../src/config/expressConfig');
        testExpress.__set__({'config': mockConfig});

        var testapp = require('express')();
        var newConfig = testExpress(testapp);

        assert(!newConfig.isProduction);
    });

    it('test domain configuration', function() {

        var exception = false;
        var mockConfig = {
            env: envConsts.TEST,
            hasSslOptions: function() {
                return false;
            },
            root: 'testRoot',
            client: 'REACT',
            DOMAIN: 'http://domain.com'
        };

        var testExpress = rewire('../../src/config/expressConfig');
        testExpress.__set__({'config': mockConfig});

        var testapp = require('express')();
        var newConfig = testExpress(testapp);

        assert.equal(newConfig.ip, 'domain.com');
    });

    it('test ip configuration', function() {

        var exception = false;
        var mockConfig = {
            env: envConsts.TEST,
            hasSslOptions: function() {
                return false;
            },
            root: 'testRoot',
            client: 'REACT',
            ip: '1.2.3.4'
        };

        var testExpress = rewire('../../src/config/expressConfig');
        testExpress.__set__({'config': mockConfig});

        var testapp = require('express')();
        var newConfig = testExpress(testapp);

        assert.equal(newConfig.ip, mockConfig.ip);
    });
});


describe('hasSslOptions method', function() {
    /* eslint no-unused-expressions:0 */

    // init the app server with dummy env and test the configs ssl function
    var testapp = require('express')();
    var testconfig = require('../../src/config/expressConfig')(testapp);

    it('should correctly check for ssl config settings', function() {
        var origEnvVal = process.env.NODE_ENV;
        process.env.NODE_ENV = 'dummy';
        should.exist(testconfig.hasSslOptions);
        process.env.NODE_ENV = origEnvVal;
    });

    it('hasSslOptions should return false ', function() {
        testconfig.SSL_KEY = null;
        testconfig.hasSslOptions().should.be.false;

        testconfig.SSL_KEY = {};
        testconfig.hasSslOptions().should.be.false;

        testconfig.SSL_KEY = {private: null};
        testconfig.hasSslOptions().should.be.false;

        testconfig.SSL_KEY = {cert: null};
        testconfig.hasSslOptions().should.be.false;

        testconfig.SSL_KEY = {private: null, cert: null};
        testconfig.hasSslOptions().should.be.false;

        testconfig.SSL_KEY = {private: '', cert: ''};
        testconfig.hasSslOptions().should.be.false;

        testconfig.SSL_KEY = {private: 'p', cert: ''};
        testconfig.hasSslOptions().should.be.false;

        testconfig.SSL_KEY = {private: '', cert: 'c'};
        testconfig.hasSslOptions().should.be.false;
    });

    it('valid sslkey object', function() {
        it('hasSslOptions should return true ', function() {
            testconfig.SSL_KEY = {private: 'thing1', cert: 'thing2'};
            testconfig.hasSslOptions().should.be.true;
        });
    });
});

