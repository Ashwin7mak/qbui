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

    it('test isNonEmptyString function', () => {
        expect(StringUtils.isNonEmptyString('abc')).toBe(true);
        expect(StringUtils.isNonEmptyString(' abc ')).toBe(true);
        expect(StringUtils.isNonEmptyString(123)).toBe(false);
        expect(StringUtils.isNonEmptyString('123')).toBe(true);
        expect(StringUtils.isNonEmptyString(' ')).toBe(false);
    });

});


describe('Token substitution tests', () => {
    'use strict';

    //  TOKEN SUBSTITUTION TESTS

    it("Token string substitution...valid tokens", function() {
        expect(StringUtils.format("The quick brown {0} jumps over the lazy {1}.", ['fox', 'dog'])).toBe("The quick brown fox jumps over the lazy dog.");
    });
    it("Token string substitution...missing token", function() {
        expect(StringUtils.format("The quick brown {0} jumps over the lazy {1}.", ['fox'])).toBe("The quick brown fox jumps over the lazy {1}.");
    });

    it("Token string substitution...no token", function() {
        expect(StringUtils.format("The quick brown {0} jumps over the lazy {1}.")).toBe("The quick brown {0} jumps over the lazy {1}.");
    });

    it("Token string substitution...no token string input", function() {
        expect(StringUtils.format("", ['fox', 'dog'])).toBe('');
        expect(StringUtils.format("", {fox: 'fox', dog: 'dog'})).toBe('');
    });

    it("Token string substitution...multi string replacement.", function() {
        expect(StringUtils.format("The quick brown {0} jumps over the lazy {1}...Gray {0} and red {0} excluded!", ['fox', 'dog'])).toBe("The quick brown fox jumps over the lazy dog...Gray fox and red fox excluded!");
        expect(StringUtils.format("The quick brown {fox} jumps over the lazy {dog}...Gray {fox} and red {fox} excluded!", {fox: 'fox', dog: 'dog'})).toBe("The quick brown fox jumps over the lazy dog...Gray fox and red fox excluded!");
    });

    it("Token string substitution... 0 tokens", function() {
        expect(StringUtils.format("The quick brown {0} jumps over the lazy {1}.", [])).toBe("The quick brown {0} jumps over the lazy {1}.");
        expect(StringUtils.format("The quick brown {0} jumps over the lazy {1}.", {})).toBe("The quick brown {0} jumps over the lazy {1}.");
    });

    it("Token string substitution...greater than 10 tokens", function() {
        expect(StringUtils.format("The {0},{1},{2},{3},{4},{5},{6},{7},{8},{9},{10},{11}", ['fox', 'dog', 'fox', 'dog', 'fox', 'dog', 'fox', 'dog', 'fox', 'dog', 'fox', 'dog'])).toBe("The fox,dog,fox,dog,fox,dog,fox,dog,fox,dog,fox,dog");
    });

    it("Token string substitution...no tokens", function() {
        expect(StringUtils.format("The quick brown fox jumps over the lazy dog.", ['fox', 'dog'])).toBe("The quick brown fox jumps over the lazy dog.");
        expect(StringUtils.format("The quick brown fox jumps over the lazy dog.", {fox: 'fox', dog: 'dog'})).toBe("The quick brown fox jumps over the lazy dog.");
    });

    it("Token string substitution...mismatched token dataTypes", function() {
        expect(StringUtils.format("{0} quick brown fox jumps over the lazy {1}.", [1, 'dog'])).toBe("1 quick brown fox jumps over the lazy dog.");
        expect(StringUtils.format("{one} quick brown fox jumps over the lazy {dog}.", {one: 1, dog:'dog'})).toBe("1 quick brown fox jumps over the lazy dog.");
    });

    it("Token string substitution...mismatched tokens", function() {
        expect(StringUtils.format("The quick brown fox jumps over the lazy {1}.", [1, 'dog'])).toBe("The quick brown fox jumps over the lazy dog.");
        expect(StringUtils.format("The quick brown fox jumps over the lazy {dog}.", {one:1, dog:'dog'})).toBe("The quick brown fox jumps over the lazy dog.");
    });

    it("Token string substitution...numeric tokens", function() {
        expect(StringUtils.format("{0} divided by {1} = {2}", [10, 5, 2])).toBe("10 divided by 5 = 2");
        expect(StringUtils.format("{one} divided by {two} = {three}", {one:10, two:5, three:2})).toBe("10 divided by 5 = 2");
    });

    it("Token string substitution...no input string", function() {
        var inputStr = null;
        expect(StringUtils.format(inputStr, ['fox', 'dog'])).toBe(inputStr);
        expect(StringUtils.format(inputStr, {fox: 'fox', dog: 'dog'})).toBe(inputStr);
    });

    it("Token string substitution...null tokens", function() {
        var inputStr = 'Some input string';
        expect(StringUtils.format(inputStr, null)).toBe(inputStr);
    });

    it("Token string substitution...invalid input string", function() {
        var callback = function() {return null;};
        expect(StringUtils.format(callback, ['fox'])).toBe(callback);
    });

    it("Token string substitution...invalid array", function() {
        var inputStr = "The quick brown {0} jumps";
        expect(StringUtils.format(inputStr, 'invalid')).toBe(inputStr);
    });

    it("Token string substitution...no parameters", function() {
        expect(StringUtils.format()).toBeUndefined();
    });

    it("Token string substitution...no array parameter", function() {
        var inputStr = 'Input';
        expect(StringUtils.format(inputStr)).toBe(inputStr);
    });

});
