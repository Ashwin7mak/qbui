'use strict';

var sinon = require('sinon');
var should = require('should');
var assert = require('assert');
var bunyan = require('bunyan');
var fs = require('fs');
var config = require('./../config/environment');
var log = require('./../logger');

/**
 * Unit tests for User field formatting
 */
describe('Validate Logger', function() {

    describe('validate a new logger is created', function() {

        var logger;
        it('validate a new logger is created if one does not exist', function(done) {
            var spy = sinon.spy(bunyan, 'createLogger');

            var logConfig = {};
            logger = initLoggerWithConfig(logConfig);

            should.exist(logger);
            assert(spy.called);

            spy.restore();
            done();
        });

        it('validate a new logger is not created if one already exists', function(done) {
            var spy = sinon.spy(bunyan, 'createLogger');

            var sameInstanceLogger = log.getLogger();
            should.exist(sameInstanceLogger);
            assert.deepEqual(sameInstanceLogger, logger);
            assert(!spy.called);

            spy.restore();
            done();
        });

        it('validate a new logger is created if one already exists and initialize is called', function(done) {
            var spy = sinon.spy(bunyan, 'createLogger');

            var logConfig = {};
            var newInstanceLogger = initLoggerWithConfig(logConfig);

            should.exist(newInstanceLogger);
            assert.notDeepEqual(newInstanceLogger, logger);
            assert(spy.called);

            spy.restore();
            done();
        });

    });

    describe('validate the default configuration of the logger', function() {

        it('validate a default logger is configured', function(done) {
            //  clear out any logger configuration
            var logConfig = {};
            var logger = initLoggerWithConfig(logConfig);

            should.exist(log);
            should(logger.fields.name).be.exactly('qbse-node');
            should(logger.src).be.exactly(false);
            should(logger._level).be.exactly(30);

            done();
        });
    });

    describe('validate an explicit console configuration of the logger', function() {

        it('validate a default logger is configured', function(done) {

            var logConfig = {
                name  : 'qbse-local',
                level : 'debug',
                stream: {
                    type: 'console',
                    file: {
                        dir     : './logs',
                        name    : 'qbse-local-test.log',
                        rotating: {
                            period: '1d',
                            count : 7
                        }
                    }
                },
                src   : true               // this is slow...do not use in prod
            };
            var logger = initLoggerWithConfig(logConfig);

            should.exist(logger);
            should(logger.fields.name).be.exactly('qbse-local');
            should(logger.src).be.exactly(true);
            should(logger._level).be.exactly(20);
            should(logger.streams[0].type).be.exactly('stream');

            done();
        });
    });

    describe('validate an explicit rotating file configuration of the logger', function() {

        it('validate a default logger with file streaming is configured and not log directory specified', function(done) {

            var stub = sinon.stub(fs, 'existsSync');
            //  stub the logger so that we do not create a file when creating the logger
            var stub1 = sinon.stub(bunyan, 'createLogger', function() {
                return {child: function() {return {};}};
            });

            //  clear out any logger configuration with explicit setting
            var logConfig = {
                name  : 'qbse-local',
                level : 'debug',
                stream: {
                    type: 'file',
                    file: {
                        dir     : '',
                        name    : 'qbse-some-unit-test.log',
                        rotating: {
                            period: '1d',
                            count : 7
                        }
                    }
                },
                src   : true               // this is slow...do not use in prod
            };

            var logger = initLoggerWithConfig(logConfig);

            should.exist(logger);
            assert(!stub.called);
            assert(stub1.called);

            stub.restore();
            stub1.restore();
            done();
        });

        it('validate a default logger with file streaming and a file directory is configured', function(done) {

            var stub = sinon.stub(fs, 'existsSync');
            var stub1 = sinon.stub(fs, 'mkdirSync');

            //  stub the logger so that we do not create a file when creating the logger
            var stub2 = sinon.stub(bunyan, 'createLogger', function() {
                return {child: function() {return {};}};
            });

            //  clear out any logger configuration with explicit setting
            var logConfig = {
                name  : 'qbse-local',
                level : 'debug',
                stream: {
                    type: 'file',
                    file: {
                        dir : './logs',
                        name: 'qbse-some-unit-test.log'
                    }
                },
                src   : true               // this is slow...do not use in prod
            };

            var logger = initLoggerWithConfig(logConfig);

            should.exist(logger);

            assert(stub.called);
            assert(stub1.called);

            stub.restore();
            stub1.restore();
            stub2.restore();
            done();
        });

    });

    describe('validate the logRequest add-on function', function() {

        it('validate a log request message at info level without calling function', function(done) {
            //  clear out any logger configuration
            var logConfig = {};
            var logger = initLoggerWithConfig(logConfig);

            var stub = sinon.stub(logger, 'info');

            var req = generateRequest();
            logger.logRequest(req);

            assert(stub.called);
            assert(stub.calledWith({Request: sinon.match.any}));

            stub.restore();
            done();
        });

        it('validate a log request message at info level', function(done) {
            var logConfig = {};
            var logger = initLoggerWithConfig(logConfig);

            var stub = sinon.stub(logger, 'info');

            var req = generateRequest();

            logger.logRequest(req, '/server/callFunction');
            assert(stub.calledWith({Request: sinon.match.any, CallFunc: '/server/callFunction'}));

            logger.logRequest(req, '/client/callFunction');
            assert(stub.calledWith({Request: sinon.match.any, CallFunc: '/client/callFunction'}));

            logger.logRequest(req, '/public/callFunction');
            assert(stub.calledWith({Request: sinon.match.any, CallFunc: '/public/callFunction'}));

            logger.logRequest(req, 'callFunction');
            assert(stub.calledWith({Request: sinon.match.any, CallFunc: ''}));

            stub.restore();
            done();
        });

    });

    describe('validate the logResponse add-on function', function() {

        it('validate a log response message at info level', function(done) {
            var logConfig = {};
            var logger = initLoggerWithConfig(logConfig);

            should.exist(logger);
            var stub = sinon.stub(logger, 'info');

            var req = {
                path   : 'some/path',
                url    : 'somedomain.com/some/path',
                method : 'GET',
                headers: {}
            };
            var res = {
                status: 200
            };
            logger.logResponse(req, res);

            assert(stub.calledWith({Request: sinon.match.any, Response: sinon.match.any}));

            logger.logResponse(req, res, '/server/callFunction');
            assert(stub.calledWith({Request: sinon.match.any, Response: sinon.match.any, CallFunc: '/server/callFunction'}));

            logger.logResponse(null, null);
            assert(stub.calledWith({Request: {}, Response: {}}));

            stub.restore();
            done();
        });

    });

    function generateRequest() {
        var req = {
            path     : 'some/path',
            url      : 'somedomain.com/some/path?param1=value1',
            method   : 'GET',
            headers  : {
                tid: 'tid',
                cid: 'cid'
            },
            useragent: {
                browser: 'chrome',
                version: '11.0.2',
                os     : 'OS/X'
            }
        };
        return req;
    }

    function initLoggerWithConfig(logConfig) {
        config.LOG = logConfig;
        log.initLogger();
        return log.getLogger();
    }
});
