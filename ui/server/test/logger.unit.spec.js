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

    });

    describe('validate the performance logger help functions', function() {

        var logger;
        it('validate perf messages are logged', function(done) {
            var logConfig = {
                name  : 'qbse-local',
                level : 'debug'
            };
            logger = initLoggerWithConfig(logConfig);

            var stub = sinon.stub(logger, 'info');

            logger.perf.start();
            logger.perf.stop('some message and skip init', true);
            logger.perf.stop('some message');
            logger.perf.stop('some message not logged');

            assert(stub.calledWith(sinon.match.any, 'PERF:'));
            assert(stub.calledTwice);

            stub.restore();
            done();
        });

        it('validate perf message function without setting start timer', function(done) {
            var logConfig = {
                name  : 'qbse-local',
                level : 'debug'
            };
            logger = initLoggerWithConfig(logConfig);

            var stub = sinon.stub(logger, 'info');
            logger.perf.stop('some message');

            assert(!stub.called);

            stub.restore();
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

    describe('validate the log message serializers are called', function() {

        it('validate a log request serializer is defined and will not error out if no request information is supplied', function(done) {
            //  clear out any logger configuration
            var logConfig = {};
            var logger = initLoggerWithConfig(logConfig);

            var req = generateRequestWithForward();
            var reqSerializer = logger.serializers.req({});

            assert.equal(undefined, reqSerializer.method);
            assert.equal(undefined, reqSerializer.url);
            assert.equal(undefined, reqSerializer.host);
            assert.equal(undefined, reqSerializer.tid);
            assert.equal(undefined, reqSerializer.sid);
            assert.equal(undefined, reqSerializer.browser);
            assert.equal(undefined, reqSerializer.platform);
            assert.equal(undefined, reqSerializer.ip);
            assert.equal(undefined, reqSerializer.referer);
            assert.deepEqual({}, reqSerializer.body);

            done();
        });

        it('validate a log request serializer is defined with forwarded-for', function(done) {
            //  clear out any logger configuration
            var logConfig = {};
            var logger = initLoggerWithConfig(logConfig);

            var req = generateRequestWithForward();
            var reqSerializer = logger.serializers.req(req);

            assert.equal(req.method, reqSerializer.method);
            assert.equal(req.url, reqSerializer.url);
            assert.equal(req.headers.host, reqSerializer.host);
            assert.equal(req.headers.tid, reqSerializer.tid);
            assert.equal(req.headers.sid, reqSerializer.sid);
            assert.equal(req.useragent.source, reqSerializer.browser);
            assert.equal(req.useragent.platform, reqSerializer.platform);
            assert.equal(req.headers['x-forwarded-for'], reqSerializer.ip);
            assert.equal(req.headers.referer, reqSerializer.referer);
            assert.deepEqual(req.body, reqSerializer.body);

            done();
        });

        it('validate a log request serializer is defined with connection', function(done) {
            //  clear out any logger configuration
            var logConfig = {};
            var logger = initLoggerWithConfig(logConfig);

            var req = generateRequestWithConnection();
            var reqSerializer = logger.serializers.req(req);

            assert.equal(req.method, reqSerializer.method);
            assert.equal(req.url, reqSerializer.url);
            assert.equal(req.headers.host, reqSerializer.host);
            assert.equal(req.headers.tid, reqSerializer.tid);
            assert.equal(req.headers.sid, reqSerializer.sid);
            assert.equal(req.useragent.source, reqSerializer.browser);
            assert.equal(req.useragent.platform, reqSerializer.platform);
            assert.equal(req.connection.remoteAddress, reqSerializer.ip);
            assert.equal(req.headers.referer, reqSerializer.referer);
            assert.deepEqual(req.body, reqSerializer.body);

            done();
        });

        it('validate a log request serializer is defined with socket', function(done) {
            //  clear out any logger configuration
            var logConfig = {};
            var logger = initLoggerWithConfig(logConfig);

            var req = generateRequestWithSocket();
            var reqSerializer = logger.serializers.req(req);

            assert.equal(req.method, reqSerializer.method);
            assert.equal(req.url, reqSerializer.url);
            assert.equal(req.headers.host, reqSerializer.host);
            assert.equal(req.headers.tid, reqSerializer.tid);
            assert.equal(req.headers.sid, reqSerializer.sid);
            assert.equal(req.useragent.source, reqSerializer.browser);
            assert.equal(req.useragent.platform, reqSerializer.platform);
            assert.equal(req.socket.remoteAddress, reqSerializer.ip);
            assert.equal(req.headers.referer, reqSerializer.referer);
            assert.deepEqual(req.body, reqSerializer.body);

            done();
        });

        it('validate a log request serializer is defined with socket connection', function(done) {
            //  clear out any logger configuration
            var logConfig = {};
            var logger = initLoggerWithConfig(logConfig);

            var req = generateRequestWithSocketConnection();
            var reqSerializer = logger.serializers.req(req);

            assert.equal(req.method, reqSerializer.method);
            assert.equal(req.url, reqSerializer.url);
            assert.equal(req.headers.host, reqSerializer.host);
            assert.equal(req.headers.tid, reqSerializer.tid);
            assert.equal(req.headers.sid, reqSerializer.sid);
            assert.equal(req.useragent.source, reqSerializer.browser);
            assert.equal(req.useragent.platform, reqSerializer.platform);
            assert.equal(req.connection.socket.remoteAddress, reqSerializer.ip);
            assert.equal(req.headers.referer, reqSerializer.referer);
            assert.deepEqual(req.body, reqSerializer.body);

            done();
        });

        it('validate a log response serializer at info level', function(done) {
            var logConfig = {};
            var logger = initLoggerWithConfig(logConfig);

            var res = generateResponse();
            var resSerializer = logger.serializers.res(res);

            assert.equal(res.statusCode, resSerializer.statusCode);
            assert.equal(res.statusMessage, resSerializer.statusMessage);

            done();
        });

    });

    function generateResponse() {
        var res = {
            statusCode: 200,
            statusMessage: 'message'
        };
        return res;
    }

    function baseRequest() {
        var req = {
            path     : 'some/path',
            url      : 'somedomain.com/some/path?param1=value1',
            method   : 'GET',
            headers  : {
                host: 'testhost.test.com',
                tid: 'tid',
                sid: 'sid',
                referer: 'refer'
            },
            useragent: {
                source: 'chrome',
                platform: 'OS/X 11.0.2'
            },
            body: {fld1:'fld1', fld2:'fld2'}
        };
        return req;
    }

    function generateRequestWithForward() {
        var req = baseRequest();
        req.headers['x-forwarded-for'] = '1.2.3.4';
        return req;
    }

    function generateRequestWithConnection() {
        var req = baseRequest();
        req.connection = {
            remoteAddress: '1.2.3.4'
        };
        return req;
    }

    function generateRequestWithSocketConnection() {
        var req = baseRequest();
        req.connection = {
            socket: {
                remoteAddress: '1.2.3.4'
            }
        };
        return req;
    }

    function generateRequestWithSocket() {
        var req = baseRequest();
        req.socket = {
            remoteAddress: '1.2.3.4'
        };
        return req;
    }

    function initLoggerWithConfig(logConfig) {
        config.LOG = logConfig;
        log.initLogger();
        return log.getLogger();
    }
});
