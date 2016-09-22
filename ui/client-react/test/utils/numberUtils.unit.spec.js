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


    it('test getNumericPropertyValue function', () => {
        let testObj = {
            numericValue: 50,
            textValue: 'yadayadayada'
        };

        expect(NumberUtils.getNumericPropertyValue(testObj, 'nonExistentProperty')).toEqual(null);
        expect(NumberUtils.getNumericPropertyValue(testObj, 'numericValue')).toEqual(50);
        expect(NumberUtils.getNumericPropertyValue(testObj, 'textValue')).toEqual(null);
    });
});
