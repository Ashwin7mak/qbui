'use strict';

var sinon = require('sinon');
var assert = require('assert');
var config = require('./../config/environment');
var perfLogger = require('./../perfLogger');
var log = require('./../logger').getLogger();

/**
 * Unit tests for User field formatting
 */
describe('Validate Performance Logger', function() {

    var stubLog;

    beforeEach(function() {
        stubLog = sinon.stub(log, 'info').returns(true);
    });
    afterEach(function() {
        stubLog.restore();
    });

    function getPerfLoggerInstance(logMsg) {
        var perfLog = perfLogger.getInstance();
        if (logMsg) {
            perfLog.init(logMsg);
        }
        return perfLog;
    }

    function assertLoggerTrue(perfLog, logMsg) {
        perfLog.log();
        assert(stubLog.calledWith(sinon.match.any, logMsg), 'Error logging PerfLog message.  Test message: ' + logMsg);
        stubLog.reset();
    }

    function assertLoggerFalse(perfLog, logMsg) {
        perfLog.log();
        assert(!stubLog.called, 'PerfLog unexpectedly logging message.  Test message: ' + logMsg);
        stubLog.reset();
    }

    describe('validate perf instance message', function() {

        describe('validate single perf logger instantiation', function() {
            var logMsg = 'SINGLE_INSTANCE';
            var perfLog = getPerfLoggerInstance(logMsg);

            var testCases = [
                {test: 'Log message after init is called', perfLog: getPerfLoggerInstance(logMsg), logMsg: logMsg, expectation: true},
                {test: 'Log message w/o init called', perfLog: getPerfLoggerInstance(), logMsg: logMsg, expectation: false}
            ];

            testCases.forEach(function(testCase) {
                it('Test case: ' + testCase.test, function(done) {
                    if (testCase.expectation === true) {
                        assertLoggerTrue(testCase.perfLog, testCase.logMsg);
                    } else {
                        assertLoggerFalse(testCase.perfLog, testCase.logMsg);
                    }
                    done();
                });
            });

        });

        describe('validate multiple perf instance message is logged', function() {

            var logMsg1 = 'MULTI_INSTANCE_1';
            var logMsg2 = 'MULTI_INSTANCE_2';

            var testCases = [
                {test: 'Perf instance ' + logMsg1, perfLog: getPerfLoggerInstance(logMsg1), logMsg: logMsg1},
                {test: 'Perf instance ' + logMsg2, perfLog: getPerfLoggerInstance(logMsg2), logMsg: logMsg2}
            ];

            testCases.forEach(function(testCase) {
                it('Test case: ' + testCase.test, function(done) {
                    assertLoggerTrue(testCase.perfLog, testCase.logMsg);
                    done();
                });
            });
        });

        describe('validate perf instance message is logged with various messages', function() {

            var testCases = [
                {test: 'Log with setMessage called in init', msg:'TEST1', setPerfMsg: false, logMsg:'TEST1'},
                {test: 'Log with setMessage called explicitly', msg:'TEST2', setPerfMsg: true, logMsg:'TEST2'},
                {test: 'Log with setMessage called with null input', msg:null, setPerfMsg: true, logMsg:''},
                {test: 'Log with setMessage called with empty input', msg:'', setPerfMsg: true, logMsg:''},
                {test: 'Log with setMessage called with invalid input', msg:new Date(), setPerfMsg: true, logMsg:''}
            ];

            testCases.forEach(function(testCase) {
                it('Test case: ' + testCase.test, function(done) {
                    var perfLog = getPerfLoggerInstance();

                    if (testCase.setPerfMsg === true) {
                        perfLog.init();
                        perfLog.setMessage(testCase.msg);
                    } else {
                        perfLog.init(testCase.msg);
                    }

                    assertLoggerTrue(perfLog, testCase.logMsg);

                    done();
                });
            });
        });
    });

});

