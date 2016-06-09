'use strict';

var assert = require('assert');
var _ = require('lodash');
var lodashMixins = require('./../src/lodashMixins');

/**
 * Unit tests for lodashMixin
 */
describe('Validate lodashMixin Functionality', () => {

    it ('objects are ordered', () => {
        var obj = { Contact: 'Gavin Belson', Company: 'Hooli', Type: 1};

        var answer = _.sortKeysBy(obj);
        var expected = {Company: 'Hooli', Contact: 'Gavin Belson', Type: 1};
        assert.deepEqual(answer, expected);
    });

    it ('objects are ordered with comparator', () => {
        var obj = { Contact: 'Richard Hendricks', Company: 'Pied Piper', Type: 1};
        function compareByValStringSize(val, key) {
            return val.toString().length;
        }
        var answer = _.sortKeysBy(obj, compareByValStringSize);
        var expected = {Company: 'Pied Piper', Contact: 'Richard Hendricks', Type: 1};
        assert.deepEqual(answer, expected);
    });

    it ('objects are ordered by name', () => {
        var obj = {
            "navigationStart":1465435467526,
            "unloadEventStart":1465435467664,
            "unloadEventEnd":1465435467664,
            "redirectStart":0,
            "redirectEnd":0,
            "fetchStart":1465435467532,
            "domainLookupStart":1465435467532,
            "domainLookupEnd":1465435467532,
            "connectStart":1465435467532,
            "connectEnd":1465435467532,
            "secureConnectionStart":0,
            "requestStart":1465435467540,
            "responseStart":1465435467658,
            "responseEnd":1465435467664,
            "domLoading":1465435467686,
            "domInteractive":1465435469178,
            "domContentLoadedEventStart":1465435469178,
            "domContentLoadedEventEnd":1465435469183,
            "domComplete":1465435471693,
            "loadEventStart":1465435471693,
            "loadEventEnd":1465435471693
        };

        var expected = {
            "connectEnd":1465435467532,
            "connectStart":1465435467532,
            "domainLookupEnd":1465435467532,
            "domainLookupStart":1465435467532,
            "domComplete":1465435471693,
            "domContentLoadedEventEnd":1465435469183,
            "domContentLoadedEventStart":1465435469178,
            "domInteractive":1465435469178,
            "domLoading":1465435467686,
            "fetchStart":1465435467532,
            "loadEventEnd":1465435471693,
            "loadEventStart":1465435471693,
            "navigationStart":1465435467526,
            "redirectEnd":0,
            "redirectStart":0,
            "requestStart":1465435467540,
            "responseEnd":1465435467664,
            "responseStart":1465435467658,
            "secureConnectionStart":0,
            "unloadEventEnd":1465435467664,
            "unloadEventStart":1465435467664
        };
        function compareByKeyName(val, key) {
            return key.toLowerCase();
        }
        var answer = _.sortKeysBy(obj, compareByKeyName);
        assert.deepEqual(answer, expected);
    });


    it ('objects are ordered by name', () => {
        var obj = {
            "navigationStart":1465435467526,
            "unloadEventStart":1465435467664,
            "unloadEventEnd":1465435467664,
            "redirectStart":0,
            "redirectEnd":0,
            "fetchStart":1465435467532,
            "domainLookupStart":1465435467532,
            "domainLookupEnd":1465435467532,
            "connectStart":1465435467532,
            "connectEnd":1465435467532,
            "secureConnectionStart":0,
            "requestStart":1465435467540,
            "responseStart":1465435467658,
            "responseEnd":1465435467664,
            "domLoading":1465435467686,
            "domInteractive":1465435469178,
            "domContentLoadedEventStart":1465435469178,
            "domContentLoadedEventEnd":1465435469183,
            "domComplete":1465435471693,
            "loadEventStart":1465435471693,
            "loadEventEnd":1465435471693
        };

        var expected = {
            "redirectEnd": 0,
            "redirectStart": 0,
            "secureConnectionStart": 0,
            "navigationStart": 1465435467526,
            "connectEnd": 1465435467532,
            "connectStart": 1465435467532,
            "domainLookupEnd": 1465435467532,
            "domainLookupStart": 1465435467532,
            "fetchStart": 1465435467532,
            "requestStart": 1465435467540,
            "responseStart": 1465435467658,
            "responseEnd": 1465435467664,
            "unloadEventEnd": 1465435467664,
            "unloadEventStart": 1465435467664,
            "domLoading": 1465435467686,
            "domContentLoadedEventStart": 1465435469178,
            "domInteractive": 1465435469178,
            "domContentLoadedEventEnd": 1465435469183,
            "domComplete": 1465435471693,
            "loadEventEnd": 1465435471693,
            "loadEventStart": 1465435471693
        };
        function compareByKeyVal(val, key) {
            return val;
        }
        var answer = _.sortKeysBy(obj, compareByKeyVal);
        assert.deepEqual(answer, expected);
    });

});

