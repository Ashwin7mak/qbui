'use strict';

var assert = require('assert');
var cookieUtils = require('../../src/utility/cookieUtils.js');

/**
 * Unit tests for Cookie Utility Functions
 */
describe('Validate Cookie Utility Functions', function() {

    describe('verify each section is returned from a ticket', function() {
        var testCases = [
            {name: 'null ticket)', ticket: null,
                section:'0', expectation: null},
            {name: 'return section 0 (current ticket version)', ticket: '8_bky5c33ch_j2s_rfwbk_a_p8uvqkh8pgr4dxfawibbir7p79csc7c6yc4mpy8pdqrdrgsqarg7c',
                section:'0', expectation: '8'},
            {name: 'return section 1 (ob32 encoded time)', ticket: '8_bky5c33ch_j2s_rfwbk_a_p8uvqkh8pgr4dxfawibbir7p79csc7c6yc4mpy8pdqrdrgsqarg7c',
                section:'1', expectation: 'bky5c33ch'},
            {name: 'return section 2 (ob32 encoded user id)', ticket: '8_bky5c33ch_j2s_rfwbk_a_p8uvqkh8pgr4dxfawibbir7p79csc7c6yc4mpy8pdqrdrgsqarg7c',
                section:'2', expectation: 'j2s'},
            {name: 'return section 2 (non encoded user id)', ticket: '8_bky5c33ch_RCT8WEN_UF_rfwbk_a_p8uvqkh8pgr4dxfawibbir7p79csc7c6yc4mpy8pdqrdrgsqarg7c',
                section:'2', expectation: 'RCT8WEN_UF'},
            {name: 'return section 3 (ob32 encoded realm id)', ticket: '8_bky5c33ch_j2s_rfwbk_a_p8uvqkh8pgr4dxfawibbir7p79csc7c6yc4mpy8pdqrdrgsqarg7c',
                section:'3', expectation: 'rfwbk'},
            {name: 'return section 3 (non encoded user id)', ticket: '8_bky5c33ch_RCT8WEN_UF_rfwbk_a_p8uvqkh8pgr4dxfawibbir7p79csc7c6yc4mpy8pdqrdrgsqarg7c',
                section:'3', expectation: 'rfwbk'},
            {name: 'return section 4 (ob32 encoded user ticket version)', ticket: '8_bky5c33ch_j2s_rfwbk_a_p8uvqkh8pgr4dxfawibbir7p79csc7c6yc4mpy8pdqrdrgsqarg7c',
                section:'4', expectation: 'a'},
            {name: 'return section 5 (sha256 digest)', ticket: '8_bky5c33ch_j2s_rfwbk_a_p8uvqkh8pgr4dxfawibbir7p79csc7c6yc4mpy8pdqrdrgsqarg7c',
                section:'5', expectation: 'p8uvqkh8pgr4dxfawibbir7p79csc7c6yc4mpy8pdqrdrgsqarg7c'}
        ];
        testCases.forEach(function(testCase) {
            it(testCase.name, function() {
                assert.equal(cookieUtils.breakTicketDown(testCase.ticket, testCase.section), testCase.expectation);
            });
        });
    });

    describe('verify userId is returned from a ticket', function() {
        var testCases = [
            {name: 'return userId in old stack format', ticket: '8_bky5c33ch_j2s_rfwbk_a_p8uvqkh8pgr4dxfawibbir7p79csc7c6yc4mpy8pdqrdrgsqarg7c',
                expectation: '10000'},
            {name: 'return userId in new stack format', ticket: '8_bky5c33ch_RCT8WEN_UF_rfwbk_a_p8uvqkh8pgr4dxfawibbir7p79csc7c6yc4mpy8pdqrdrgsqarg7c',
                expectation: 'RCT8WEN_UF'},
            {name: 'return null for invalid ticket', ticket: null, expectation: null},
        ];
        testCases.forEach(function(testCase) {
            it(testCase.name, function() {
                assert.equal(cookieUtils.getUserId(testCase.ticket), testCase.expectation);
            });
        });
    });

});
