var assert = require('assert');
var commonCookieUtils = require('../src/commonCookieUtils');

/**
 * Unit tests for Common Cookie Utility Functions
 */

describe('Test Common Cookie Utils Functions', () => {

    var name = "tusk";
    var value = "walrusPunch";
    var qbClassicCookieValue = "~tusk=walrusPunch~";
    var defaultCookieValue = "|tusk=walrusPunch|";

    it('test createQBClassicNameValuePair with', () => {
        var result = commonCookieUtils.createQBClassicNameValuePair(name, value);
        assert.equal(result, qbClassicCookieValue);
    });

    it('test createNameValuePair with default delimiter', () => {
        var result = commonCookieUtils.createNameValuePair(name, value);
        assert.equal(result, defaultCookieValue);
    });

    it('test addQBClassicNameValuePair', () => {
        var newName = "undying";
        var newValue = "tombstone";
        var newQBClassicCookieValue = qbClassicCookieValue + "undying=tombstone~";
        var result = commonCookieUtils.addQBClassicNameValuePair(qbClassicCookieValue, newName, newValue);
        assert.equal(result, newQBClassicCookieValue);
    });

    it('test addNameValuePair', () => {
        var newName = "undying";
        var newValue = "tombstone";
        var newDefaultCookieValue = defaultCookieValue + "undying=tombstone|";
        var result = commonCookieUtils.addNameValuePair(defaultCookieValue, newName, newValue);
        assert.equal(result, newDefaultCookieValue);
    });

});

