var assert = require('assert');
var commonCookieUtils = require('../src/commonCookieUtils');

/**
 * Unit tests for Common Cookie Utility Functions
 */

describe('Test Common Cookie Utils Functions', () => {

    var name = "tusk";
    var value = "walrusPunch";
    var customDelimiter = ";";
    var matchTrue = "tusk";
    var matchFalse = "spaceCow";
    var qbClassicCookieValue = "~tusk=walrusPunch~";
    var defaultCookieValue = "|tusk=walrusPunch|";
    var customCookieValue = ";tusk=walrusPunch;";

    it('test createQBClassicNameValuePair with', () => {
        var result = commonCookieUtils.createQBClassicNameValuePair(name, value);
        assert.equal(result, qbClassicCookieValue);
    });

    it('test createNameValuePair with default delimiter', () => {
        var result = commonCookieUtils.createNameValuePair(name, value);
        assert.equal(result, defaultCookieValue);
    });
    it('test createNameValuePair with custom delimiter', () => {
        var result = commonCookieUtils.createNameValuePair(name, value, customDelimiter);
        assert.equal(result, customCookieValue);
    });

    it('test addQBClassicNameValuePair', () => {
        var newName = "undying";
        var newValue = "tombstone";
        var newQBClassicCookieValue = qbClassicCookieValue + "undying=tombstone~";
        var result = commonCookieUtils.addQBClassicNameValuePair(qbClassicCookieValue, newName, newValue);
        assert.equal(result, newQBClassicCookieValue);
    });

    it('test addNameValuePair with default delimiter', () => {
        var newName = "undying";
        var newValue = "tombstone";
        var newDefaultCookieValue = defaultCookieValue + "undying=tombstone|";
        var result = commonCookieUtils.addNameValuePair(defaultCookieValue, newName, newValue);
        assert.equal(result, newDefaultCookieValue);
    });

    it('test addNameValuePair with custom delimiter', () => {
        var newName = "undying";
        var newValue = "tombstone";
        var newCustomCookieValue = customCookieValue + "undying=tombstone;";
        var result = commonCookieUtils.addNameValuePair(customCookieValue, newName, newValue, customDelimiter);
        assert.equal(result, newCustomCookieValue);
    });

    it('test searchCookieValue success', () => {
        var result = commonCookieUtils.searchCookieValue(defaultCookieValue, matchTrue);
        assert.equal(result, true);
    });

    it('test searchCookieValue failure', () => {
        var result = commonCookieUtils.searchCookieValue(defaultCookieValue, matchFalse);
        assert.equal(result, false);
    });

});

