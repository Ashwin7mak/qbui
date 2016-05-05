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

    function getPerfLoggerInstance(msg) {
        var perfLog = perfLogger.getInstance();
        if (msg) {
            perfLog.start(msg);
        }
        return perfLog;
    }

    function assertLoggerTrue(perfLog, msg, init) {
        perfLog.log(init);
        assert(stubLog.calledWith(sinon.match.any, msg), 'Error logging PerfLog message.  Test Event: ' + msg);
        stubLog.reset();
    }

    function assertLoggerFalse(perfLog, msg, init) {
        perfLog.log(init);
        assert(!stubLog.called, 'PerfLog unexpectedly logging message.  Test Event: ' + msg);
        stubLog.reset();
    }

    describe('validate perf instance message', function() {

        describe('validate single perf logger instantiation', function() {
            var msg = 'SINGLE_INSTANCE';
            var perfLog = getPerfLoggerInstance(msg);

            var testCases = [
                {test: 'Log message after start is called', perfLog: getPerfLoggerInstance(msg), msg: msg, expectation: true},
                {test: 'Log message w/o start called', perfLog: getPerfLoggerInstance(), msg: msg, expectation: false}
            ];

            testCases.forEach(function(testCase) {
                it('Test case: ' + testCase.test, function(done) {
                    if (testCase.expectation === true) {
                        assertLoggerTrue(testCase.perfLog, testCase.msg);
                    } else {
                        assertLoggerFalse(testCase.perfLog, testCase.msg);
                    }
                    done();
                });
            });

        });

        describe('validate multiple perf instance message is logged', function() {

            var msg1 = 'MULTI_INSTANCE_1';
            var msg2 = 'MULTI_INSTANCE_2';

            var testCases = [
                {test: 'Perf instance ' + msg1, perfLog: getPerfLoggerInstance(msg1), msg: msg1},
                {test: 'Perf instance ' + msg2, perfLog: getPerfLoggerInstance(msg2), msg: msg2}
            ];

            testCases.forEach(function(testCase) {
                it('Test case: ' + testCase.test, function(done) {
                    assertLoggerTrue(testCase.perfLog, testCase.msg);
                    done();
                });
            });
        });

        describe('validate skipInit flag', function() {
            var testCases = [
                {test: 'Log message1 with init flag true', init: true, expectation: true},
                {test: 'Log message2 with init flag false', init: false, expectation: true},
                {test: 'Log message3 with init flag false', init: false, expectation: false}
            ];

            var msg = 'SINGLE_INSTANCE_SKIPINIT';
            var perfLog = getPerfLoggerInstance(msg);

            testCases.forEach(function(testCase) {
                it('Test case: ' + testCase.test, function(done) {
                    if (testCase.expectation === true) {
                        assertLoggerTrue(perfLog, msg, testCase.init);
                    } else {
                        assertLoggerFalse(perfLog, msg, testCase.init);
                    }
                    done();
                });
            });
        });



        describe('validate perf instance message is logged with various event messages', function() {

            var testCases = [
                {test: 'Log message1 with event set in start method', msg:'TEST1', setPerfMsg: false, init: false, logMsg:'TEST1'},
                {test: 'Log message1 with event set called', msg:'TEST2', setPerfMsg: true, init: false, logMsg:'TEST2'},
                {test: 'Log message1 without set event called', msg:'TEST3', setPerfMsg: true, init: false, logMsg:'TEST3'},
                {test: 'Log message1 with set event called with null input', msg:null, setPerfMsg: true, init: false, logMsg:''},
                {test: 'Log message1 with set event called with empty input', msg:'', setPerfMsg: true, init: false, logMsg:''},
                {test: 'Log message1 with set event called with invalid input', msg:new Date(), setPerfMsg: true, init: false, logMsg:''}
            ];

            testCases.forEach(function(testCase) {
                it('Test case: ' + testCase.test, function(done) {
                    var perfLog = getPerfLoggerInstance();
                    perfLog.start(testCase.msg);

                    if (testCase.setPerfMsg === true) {
                        perfLog.setEvent(testCase.msg);
                    }

                    assertLoggerTrue(perfLog, testCase.logMsg, testCase.init);

                    done();
                });
            });
        });
    });

});

