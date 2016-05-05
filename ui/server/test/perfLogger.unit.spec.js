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

    function getPerfLoggerInstance(event) {
        var perfLog = perfLogger.getInstance();
        if (event) {
            perfLog.start(event);
        }
        return perfLog;
    }

    function assertLoggerTrue(perfLog, event, init) {
        perfLog.log(init);
        assert(stubLog.calledWith(sinon.match.any, event), 'Error logging PerfLog message.  Test Event: ' + event);
        stubLog.reset();
    }

    function assertLoggerFalse(perfLog, event, init) {
        perfLog.log(init);
        assert(!stubLog.called, 'PerfLog unexpectedly logging message.  Test Event: ' + event);
        stubLog.reset();
    }

    describe('validate perf instance message', function() {

        describe('validate single perf logger instantiation', function() {
            var event = 'SINGLE_INSTANCE';
            var perfLog = getPerfLoggerInstance(event);

            var testCases = [
                {test: 'Log event after start is called', perfLog: getPerfLoggerInstance(event), event: event, expectation: true},
                {test: 'Log event w/o start called', perfLog: getPerfLoggerInstance(), event: event, expectation: false}
            ];

            testCases.forEach(function(testCase) {
                it('Test case: ' + testCase.test, function(done) {
                    if (testCase.expectation === true) {
                        assertLoggerTrue(testCase.perfLog, testCase.event);
                    } else {
                        assertLoggerFalse(testCase.perfLog, testCase.event);
                    }
                    done();
                });
            });

        });

        describe('validate multiple perf instance message is logged', function() {

            var event1 = 'MULTI_INSTANCE_1';
            var event2 = 'MULTI_INSTANCE_2';

            var testCases = [
                {test: 'Perf instance ' + event1, perfLog: getPerfLoggerInstance(event1), event: event1},
                {test: 'Perf instance ' + event2, perfLog: getPerfLoggerInstance(event2), event: event2}
            ];

            testCases.forEach(function(testCase) {
                it('Test case: ' + testCase.test, function(done) {
                    assertLoggerTrue(testCase.perfLog, testCase.event);
                    done();
                });
            });
        });

        describe('validate skipInit flag', function() {
            var testCases = [
                {test: 'Log event1 with init flag true', init: true, expectation: true},
                {test: 'Log event2 with init flag false', init: false, expectation: true},
                {test: 'Log event3 with init flag false', init: false, expectation: false}
            ];

            var event = 'SINGLE_INSTANCE_SKIPINIT';
            var perfLog = getPerfLoggerInstance(event);

            testCases.forEach(function(testCase) {
                it('Test case: ' + testCase.test, function(done) {
                    if (testCase.expectation === true) {
                        assertLoggerTrue(perfLog, event, testCase.init);
                    } else {
                        assertLoggerFalse(perfLog, event, testCase.init);
                    }
                    done();
                });
            });
        });



        describe('validate perf instance message is logged with various event messages', function() {

            var testCases = [
                {test: 'Log event with setEvent called in start', event:'TEST1', setPerfEvent: false, init: false, logEvent:'TEST1'},
                {test: 'Log event with setEvent called explicitly', event:'TEST2', setPerfEvent: true, init: false, logEvent:'TEST2'},
                {test: 'Log event with setEvent called with null input', event:null, setPerfEvent: true, init: false, logEvent:''},
                {test: 'Log event with setEvent called with empty input', event:'', setPerfEvent: true, init: false, logEvent:''},
                {test: 'Log event with setEvent called with invalid input', event:new Date(), setPerfEvent: true, init: false, logEvent:''}
            ];

            testCases.forEach(function(testCase) {
                it('Test case: ' + testCase.test, function(done) {
                    var perfLog = getPerfLoggerInstance();

                    if (testCase.setPerfEvent === true) {
                        perfLog.start();
                        perfLog.setEvent(testCase.event);
                    } else {
                        perfLog.start(testCase.event);
                    }

                    assertLoggerTrue(perfLog, testCase.logEvent, testCase.init);

                    done();
                });
            });
        });
    });

});

