import StringUtils from '../../src/utils/stringUtils';

describe('StringUtils', () => {
    'use strict';

    it('test trim function', () => {
        var a;
        var date = new Date();
        expect(StringUtils.trim(20)).toBe(20);
        expect(StringUtils.trim('abc')).toBe('abc');
        expect(StringUtils.trim(' abc ')).toBe('abc');
        expect(StringUtils.trim(' This is IT! ')).toBe('This is IT!');
        expect(StringUtils.trim(' ab c')).toBe('ab c');
        expect(StringUtils.trim('a bc ')).toBe('a bc');
        expect(StringUtils.trim('')).toBe('');
        expect(StringUtils.trim(a)).toBe(a);
        expect(StringUtils.trim(date)).toBe(date);
    });

});