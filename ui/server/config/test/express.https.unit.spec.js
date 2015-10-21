// test that node server will redirect to http
'use strict';

var request = require('supertest');
var should = require('should');
describe('Request test always use ssh', function() {

    var server = require('express');
    var app = server();

    var config = require('../expressConfig')(app);

    // ensure ssl values are set be able to run secure http test
    it('config should have sslPort ', function() {
        should.exist(config.sslPort);
    });

    it('sslPort should be numeric', function() {
        config.sslPort.should.be.an.instanceOf(Number);
    });

    it('should have NODE_TLS_REJECT_UNAUTHORIZED defined', function() {
        //environment var to allow self signed cert
        should.exist(process.env.NODE_TLS_REJECT_UNAUTHORIZED);
    });


    it('NODE_TLS_REJECT_UNAUTHORIZED should =0 to support selfsigned cert', function() {
        //environment var to allow self signed cert
        process.env.NODE_TLS_REJECT_UNAUTHORIZED.should.equal('0');
    });


    describe('hasSslOptions method', function() {
        //jshint expr:true
        it('should correctly check for ssl config settings', function(done) {
            var origEnvVal = process.env.NODE_ENV;
            process.env.NODE_ENV = 'dummy';

            // init the app server with dummy env and test the configs ssl function
            var testapp = require('express')();
            var testconfig = require('../expressConfig')(testapp);

            should.exist(testconfig.hasSslOptions);

            describe('incomplete sslkey object', function() {
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
            });

            describe('valid sslkey object', function() {
                it('hasSslOptions should return true ', function() {
                    testconfig.SSL_KEY = {private: 'thing1', cert: 'thing2'};
                    testconfig.hasSslOptions().should.be.true;
                });
            });

            process.env.NODE_ENV = origEnvVal;
            done();
        });
    });

    // ensure request use secure http
    it('server http request should return redirect to https with sslPort', function(done) {
        if (config.hasSslOptions()) {
            request('http://' + config.ip + ':' + config.port)
                    .get('/')
                    .expect(302)
                    .expect(function(res) {
                                var foundSslPort = (res.headers.location.indexOf(config.sslPort + '/') > -1);
                                //expect returns true on fail (foundSslPort is expected)
                                return !foundSslPort;
                            })
                    .end(function(err) {
                             done(err);
                         });
        } else {
            done();
        }
    });

    // ensure request use secure http if specified
    it('server should support https', function(done) {
        //test ssl cert if available
        if (config.hasSslOptions()) {
            should.exist(process.env.NODE_TLS_REJECT_UNAUTHORIZED);
            request('https://' + config.ip + ':' + config.sslPort)
                    .get('/')
                    .expect(200)
                    .expect(function(res) {
                                //expect returns true on fail (no redirect is expected)
                                return true === res.redirect;
                            })
                    .end(function(err) {
                             done(err);
                         });
        } else {
            done();
        }

    });
});

