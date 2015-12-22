import StringUtils from '../../src/utils/stringUtils';

describe('StringUtils', () => {
    'use strict';

    it('test trim function', () => {
        expect(StringUtils.trim('abc')).toBe('abc');
        expect(StringUtils.trim(' abc ')).toBe('abc');
        expect(StringUtils.trim(' This is IT! ')).toBe('This is IT!');
        expect(StringUtils.trim(' ab c')).toBe('ab c');
        expect(StringUtils.trim('a bc ')).toBe('a bc');
        expect(StringUtils.trim('')).toBe('');
    });

    it('test trim function with invalid input', () => {
        // non-string input returns the same value unchanged..
        var a;
        var date = new Date();

        a = ['1', ' 2 '];
        expect(StringUtils.trim(a)).toBe(a);
        expect(StringUtils.trim(date)).toBe(date);

        expect(StringUtils.trim(20)).toBe(20);
        expect(StringUtils.trim(true)).toBe(true);
    });

    it('test isString function', () => {
        expect(StringUtils.isString('abc')).toBe(true);
        expect(StringUtils.isString(' abc ')).toBe(true);
        expect(StringUtils.isString(123)).toBe(false);
        expect(StringUtils.isString('123')).toBe(true);
        expect(StringUtils.isString(' ')).toBe(false);
    });
});
