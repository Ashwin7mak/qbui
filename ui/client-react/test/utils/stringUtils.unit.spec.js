import StringUtils from '../../src/utils/stringUtils';

describe('StringUtils - test trim input', () => {
    'use strict';

    var dataProvider = [
        {test: 'string="abc"', input: 'abc', expectation: 'abc'},
        {test: 'string=" abc"', input: ' abc ', expectation: 'abc'},
        {test: 'string=" This is IT! "', input: ' This is IT! ', expectation: 'This is IT!'},
        {test: 'string=" ab c"', input: ' ab c', expectation: 'ab c'},
        {test: 'string="a bc "', input: 'a bc ', expectation: 'a bc'},
        {test: 'string=""', input: '', expectation: ''},
        {test: 'null input', input: null, expectation: null}
    ];
    dataProvider.forEach(function(data) {
        it(data.test, function() {
            expect(StringUtils.trim(data.input)).toBe(data.expectation);
        });
    });
});

describe('StringUtils - test trim function with invalid data types', () => {
    'use strict';

    var arr = ['1', ' 2 '];
    var date = new Date();
    var num = 230;
    var bool = true;
    var func = new function() {
        return true;
    };

    var dataProvider = [
        {test:'array', type:arr},
        {test:'date', type:date},
        {test:'numeric', type:num},
        {test:'boolean', type:bool},
        {test:'function', type:func}
    ];

    dataProvider.forEach(function(data) {
        it(data.test, function() {
            expect(StringUtils.trim(data.type)).toBe(data.type);
        });
    });

});

describe('StringUtils - test isNonEmptyString function', () => {
    'use strict';

    var dataProvider = [
        {test:'input="abc"', input:'abc', expectation: true},
        {test:'input=" abc  "', input:' abc  ', expectation: true},
        {test:'input=123', input: 123, expectation: false},
        {test:'input="123"', input: '123', expectation: true},
        {test:'input=" "', input: ' ', expectation: false}
    ];

    dataProvider.forEach(function(data) {
        it(data.test, function() {
            expect(StringUtils.isNonEmptyString(data.input)).toBe(data.expectation);
        });
    });
});

describe('StringUtils - format function tests', () => {
    'use strict';

    var callback = function() {return null;};
    var dataProvider = [
        {test: 'Valid tokens', input:'The quick brown {0} jumps over the lazy {1}.', tokens:['fox', 'dog'], expectation: 'The quick brown fox jumps over the lazy dog.'},
        {test: 'Missing token', input:'The quick brown {0} jumps over the lazy {1}.', tokens:['fox'], expectation: 'The quick brown fox jumps over the lazy {1}.'},
        {test: 'No token', input:'The quick brown {0} jumps over the lazy {1}.', tokens:null, expectation: 'The quick brown {0} jumps over the lazy {1}.'},
        {test: 'No token in input string', input:'The quick brown fox jumps over the lazy dog.', tokens:['fox', 'dog'], expectation: 'The quick brown fox jumps over the lazy dog.'},
        {test: 'Empty String input', input:'', tokens:['fox', 'dog'], expectation: ''},
        {test: 'Null String input', input:null, tokens:['fox', 'dog'], expectation: null},
        {test: 'Multi string replacement', input:'The quick brown {0} jumps over the lazy {1}...Gray {0} and red {0} excluded!', tokens:['fox', 'dog'], expectation: 'The quick brown fox jumps over the lazy dog...Gray fox and red fox excluded!'},
        {test: 'Greater than 10 tokens', input:'The {0},{1},{2},{3},{4},{5},{6},{7},{8},{9},{10},{11}', tokens:['fox', 'dog', 'fox', 'dog', 'fox', 'dog', 'fox', 'dog', 'fox', 'dog', 'fox', 'dog'], expectation: 'The fox,dog,fox,dog,fox,dog,fox,dog,fox,dog,fox,dog'},
        {test: 'Mismatched token dataTypes', input:'{0} quick brown fox jumps over the lazy {1}.', tokens:[1, 'dog'], expectation: '1 quick brown fox jumps over the lazy dog.'},
        {test: 'Mismatched tokens', input:'The quick brown fox jumps over the lazy {1}.', tokens:[1, 'dog'], expectation: 'The quick brown fox jumps over the lazy dog.'},
        {test: 'Numeric tokens', input:'{0} divided by {1} = {2}', tokens:[10, 5, 2], expectation: '10 divided by 5 = 2'},
        {test: 'Invalid input string data type', input:callback, tokens:['fox'], expectation: callback},
        {test: 'Invalid token array data type', input:'The quick brown {0} jumps', tokens:'invalidStr', expectation: 'The quick brown {0} jumps'},
        {test: 'Query search parameter', input:'{0.CT.\'{0}\'}', tokens:['pro'], expectation: "{0.CT.'pro'}"},
        {test: 'Null token 1', input:'The quick brown {0} and {1}.', tokens:[null, 'dog'], expectation: 'The quick brown null and dog.'},
        {test: 'Null token 2', input:'The quick brown {0} and {1}.', tokens:['cat', null], expectation: 'The quick brown cat and null.'},

        {test: 'Valid tokens', input:'The quick brown {fox} jumps over the lazy {dog}.', tokens:{fox: "fox", dog: "dog"}, expectation: 'The quick brown fox jumps over the lazy dog.'},
        {test: 'Missing token', input:'The quick brown {fox} jumps over the lazy {dog}.', tokens:{fox: "fox"}, expectation: 'The quick brown fox jumps over the lazy {dog}.'},
        {test: 'No token', input:'The quick brown {fox} jumps over the lazy {dog}.', tokens:null, expectation: 'The quick brown {fox} jumps over the lazy {dog}.'},
        {test: 'No token in input string', input:'The quick brown fox jumps over the lazy dog.', tokens:{fox: "fox", dog: "dog"}, expectation: 'The quick brown fox jumps over the lazy dog.'},
        {test: 'Empty String input', input:'', tokens:{fox: "fox", dog: "dog"}, expectation: ''},
        {test: 'Null String input', input:null, tokens:{fox: "fox", dog: "dog"}, expectation: null},
        {test: 'Multi string replacement', input:'The quick brown {fox} jumps over the lazy {dog}...Gray {fox} and red {fox} excluded!', tokens:{fox: "fox", dog: "dog"}, expectation: 'The quick brown fox jumps over the lazy dog...Gray fox and red fox excluded!'},
        {test: 'Numeric tokens', input:'{ten} divided by {five} = {two}', tokens:{ten: 10, five: 5, two: 2}, expectation: '10 divided by 5 = 2'},
        {test: 'Null token', input:'The quick brown {fox} and {dog}.', tokens:{fox: 'fox', dog:null}, expectation: 'The quick brown fox and null.'}

    ];

    dataProvider.forEach(function(data) {
        it(data.test, function() {
            expect(StringUtils.format(data.input, data.tokens)).toBe(data.expectation);
        });
    });
});

describe('StringUtils - test format with missing parameters', () => {
    'use strict';

    it("Token string substitution...no parameters", function() {
        expect(StringUtils.format()).toBeUndefined();
    });

    it("Token string substitution...no array parameter", function() {
        var inputStr = 'Input';
        expect(StringUtils.format(inputStr)).toBe(inputStr);
    });

});
