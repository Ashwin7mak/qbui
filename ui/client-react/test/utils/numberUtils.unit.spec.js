import NumberUtils from '../../src/utils/numberUtils';

describe('NumberUtils', () => {
    'use strict';

    it('test isInt function', () => {
        let obj = new Date();
        expect(NumberUtils.isInt(20)).toBeTruthy();
        expect(NumberUtils.isInt(-20)).toBeTruthy();
        expect(NumberUtils.isInt('20')).toBeFalsy();
        expect(NumberUtils.isInt(true)).toBeFalsy();
        expect(NumberUtils.isInt(1.23)).toBeFalsy();
        expect(NumberUtils.isInt('string')).toBeFalsy();
        expect(NumberUtils.isInt(obj)).toBeFalsy();
    });

});
