'use strict';

describe('quickbase api service', function () {
    var qbUtility;

    beforeEach(function() {
        module('qbse.api');
    });

    beforeEach(inject(function (_qbUtility_) {
        qbUtility = _qbUtility_;
    }));

    it('Validate isInt function', function () {
        expect(qbUtility.isInt(0)).toBeTruthy();
        expect(qbUtility.isInt(3)).toBeTruthy();
        expect(qbUtility.isInt(33.7)).toBeFalsy();
        expect(qbUtility.isInt(-9)).toBeTruthy();
        expect(qbUtility.isInt(4E2)).toBeTruthy();
        expect(qbUtility.isInt('3')).toBeFalsy();
        expect(qbUtility.isInt('abc')).toBeFalsy();
        expect(qbUtility.isInt(true)).toBeFalsy();
        expect(qbUtility.isInt(false)).toBeFalsy();
        expect(qbUtility.isInt(null)).toBeFalsy();
        expect(qbUtility.isInt('')).toBeFalsy();
        expect(qbUtility.isInt()).toBeFalsy();
    });

});
