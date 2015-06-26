'use strict';

var should = require('should');
var assert = require('assert');
var config = require('./../config/environment');

/**
 * Unit tests for User field formatting
 */
describe('Validate Logger', function () {

    describe('validate the default configuration of the logger',function() {
        //  clear out any logger configuration
        config.LOG = {};
        var logger = require('./../logger').getLogger('not/a/valid/calling/function/path');

        it('validate a default logger is configured', function (done) {
            should.exist(logger);
            should(logger.fields.name).be.exactly('qbse-node');
            should(logger.src).be.exactly(false);
            should(logger._level).be.exactly(30);
            should(logger.fields.callingFunc).be.exactly('');
            done();
        });
    });

    describe('validate the default configuration of the logger with a client call function defined',function() {
        //  clear out any logger configuration
        config.LOG = {};
        var logger = require('./../logger').getLogger('dir1/dir2/client/show/me/a/valid/callFunction');

        it('validate a default logger is configured', function (done) {
            should.exist(logger);
            should(logger.fields.callingFunc).be.exactly('/client/show/me/a/valid/callFunction');
            done();
        });
    });

    describe('validate the default configuration of the logger with a public call function defined',function() {
        //  clear out any logger configuration
        config.LOG = {};
        var logger = require('./../logger').getLogger('dir1/dir2/public/show/me/a/valid/callFunction');

        it('validate a default logger is configured', function (done) {
            should.exist(logger);
            should(logger.fields.callingFunc).be.exactly('/public/show/me/a/valid/callFunction');
            done();
        });
    });

    describe('validate the default configuration of the logger with a server call function defined',function() {
        //  clear out any logger configuration
        config.LOG = {};
        var logger = require('./../logger').getLogger('dir1/dir2/server/show/me/a/valid/callFunction');

        it('validate a default logger is configured', function (done) {
            should.exist(logger);
            should(logger.fields.callingFunc).be.exactly('/server/show/me/a/valid/callFunction');
            done();
        });
    });

    describe('validate an explicit console configuration of the logger',function() {
        //  clear out any logger configuration with explicit setting
        config.LOG = {
            name: 'qbse-local',
            level: 'debug',
            stream: {
                type: 'console',
                file: {
                    dir: './logs',
                    name: 'qbse-local-test.log',
                    rotating: {
                        period: '1d',
                        count: 7
                    }
                }
            },
            src: true               // this is slow...do not use in prod
        };
        var logger = require('./../logger').getLogger();

        it('validate a default logger is configured', function (done) {
            var emptyFunc = function () { };

            should.exist(logger);
            should(logger.fields.name).be.exactly('qbse-local');
            should(logger.src).be.exactly(true);
            should(logger._level).be.exactly(20);
            should(logger.streams[0].type).be.exactly('stream');
            assert.notDeepEqual(console.log.prototype,emptyFunc.prototype,'suppress console logging configuration error');
            done();
        });
    });

    describe('validate an explicit file configuration of the logger',function() {
        //  clear out any logger configuration with explicit setting
        config.LOG = {
            name: 'qbse-local',
            level: 'debug',
            stream: {
                type: 'file',
                file: {
                    dir: '',
                    name: 'qbse-local-test.log'
                }
            },
            src: true               // this is slow...do not use in prod
        };
        var logger = require('./../logger').getLogger();

        it('validate a default logger with file streaming is configured', function (done) {
            should.exist(logger);
            should(logger.fields.name).be.exactly('qbse-local');
            should(logger.src).be.exactly(true);
            should(logger._level).be.exactly(20);
            should(logger.streams[0].type).be.exactly('file');
            should(logger.streams[0].path).be.exactly('qbse-local-test.log');
            done();
        });
    });

    describe('validate an explicit rotating file configuration of the logger',function() {
        //  clear out any logger configuration with explicit setting
        config.LOG = {
            name: 'qbse-local',
            level: 'debug',
            stream: {
                type: 'file',
                file: {
                    dir: '',
                    name: 'qbse-local-test.log',
                    rotating: {
                        period: '1d',
                        count: 7
                    }
                }
            },
            src: true               // this is slow...do not use in prod
        };
        var logger = require('./../logger').getLogger();

        it('validate a default logger with file streaming is configured', function (done) {
            should.exist(logger);
            should(logger.fields.name).be.exactly('qbse-local');
            should(logger.src).be.exactly(true);
            should(logger._level).be.exactly(20);
            should(logger.streams[0].type).be.exactly('rotating-file');
            should(logger.streams[0].path).be.exactly('qbse-local-test.log');
            done();
        });
    });

    describe('validate the logRequest add-on function',function() {
        //  clear out any logger configuration
        config.LOG = {};
        var logger = require('./../logger').getLogger();

        it('validate a log request message', function (done) {
            should.exist(logger);

            var req = generateRequest();

            logger.logRequest(req);

            //  todo: need a spy on logger.info

            done();
        });
    });

    describe('validate the logResponse add-on function',function() {
        //  clear out any logger configuration
        config.LOG = {};
        var logger = require('./../logger').getLogger();

        it('validate a log response message', function (done) {
            should.exist(logger);

            var req = {
               path: 'some/path',
               url: 'somedomain.com/some/path',
               method: 'GET',
               headers: {}
            };
            var res = {
                status: 200
            };
            logger.logResponse(req, res);

            //  todo: need a spy on logger.info

            done();
        });
    });

    function generateRequest() {
        var req = {
           path: 'some/path',
           url: 'somedomain.com/some/path?param1=value1',
           method: 'GET',
           headers: {
               tid:'tid',
               cid:'cid'
           },
           useragent: {
               browser: 'chrome',
               version: '11.0.2',
               os: 'OS/X'
           }
        };
        return req;
    }
});
