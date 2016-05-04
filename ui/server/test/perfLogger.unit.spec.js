'use strict';

var sinon = require('sinon');
var assert = require('assert');
var config = require('./../config/environment');
var perfLogger = require('./../perfLogger');

/**
 * Unit tests for User field formatting
 */
describe('Validate Logger', function() {

    describe('validate the performance logger help functions', function() {

        var logger;
        it('validate perf messages are logged without resetting timer', function(done) {
            var logConfig = {
                name  : 'qbse-local',
                level : 'debug'
            };
            logger = initLoggerWithConfig(logConfig);

            var stub = sinon.stub(logger, 'info');

            var perfTimer = logger.perf.getTimer('unitTest1');
            perfTimer.start();

            perfTimer.log(true);
            perfTimer.log();
            perfTimer.log();

            assert(stub.calledTwice);

            stub.restore();
            done();
        });

        it('validate perf messages are logged and resetting timer', function(done) {
            var logConfig = {
                name  : 'qbse-local',
                level : 'debug'
            };
            logger = initLoggerWithConfig(logConfig);

            var stub = sinon.stub(logger, 'info');

            var perfTimer = logger.perf.getTimer('unitTest1');
            perfTimer.start();

            perfTimer.log();
            perfTimer.log();

            assert(stub.calledOnce);

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

            var perfTimer = logger.perf.getTimer('unitTest1');
            perfTimer.log();

            assert(!stub.called);

            stub.restore();
            done();
        });

        it('validate perf message function with multiple instances', function(done) {
            var logConfig = {
                name  : 'qbse-local',
                level : 'debug'
            };
            logger = initLoggerWithConfig(logConfig);

            var stub = sinon.stub(logger, 'info');

            var perfTimer1 = logger.perf.getTimer('unitTest1');
            var perfTimer2 = logger.perf.getTimer('unitTest2');

            perfTimer1.start();
            perfTimer2.start();

            perfTimer1.log();
            perfTimer1.start('unitTest1A');

            perfTimer2.log();
            perfTimer1.log();
            assert(stub.calledThrice);

            stub.restore();
            done();
        });

    });

    function initLoggerWithConfig(logConfig) {
        config.LOG = logConfig;
        log.initLogger();
        return log.getLogger();
    }
});

