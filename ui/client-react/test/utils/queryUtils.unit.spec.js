import QueryUtils from '../../src/utils/queryUtils';
import StringUtils from '../../src/utils/stringUtils';
import * as Constants from '../../src/constants/query';

describe('QueryUtils - parseStringIntoContainsExpression test with invalid search expressions', () => {
    'use strict';

    var dataProvider = [
        {test:'empty input', input:''},
        {test:'null input', input:null},
        {test:'numeric input', input:3}
    ];
    dataProvider.forEach(function(data) {
        it(data.test, function() {
            expect(QueryUtils.parseStringIntoContainsExpression(data.input)).toBe('');
        });
    });
});

describe('QueryUtils - parseStringIntoContainsExpression tests with valid search expressions', () => {
    'use strict';

    var template = '{' + Constants.ALL_FIELDS_ID + Constants.OPERATOR_CONTAINS + '\'{0}\'}';

    var dataProvider = [
        {test:'pro', input:'pro', expectation:StringUtils.format(template, ['pro'])},
        {test:'pro OR con', input:'pro OR con', expectation:StringUtils.format(template, ['pro OR con'])},
        {test:' pro OR con ', input:' pro OR con ', expectation: StringUtils.format(template, ['pro OR con'])}
    ];
    dataProvider.forEach(function(data) {
        it(data.test, function() {
            expect(QueryUtils.parseStringIntoContainsExpression(data.input)).toBe(data.expectation);
        });
    });
});

describe('QueryUtils - concatQueries tests with invalid query lists', () => {
    'use strict';
    var dataProvider = [
        {test:'invalid data type input', input:'notAnArray'},
        {test:'null input', input:null},
        {test:'numeric input', input: 3}
    ];
    dataProvider.forEach(function(data) {
        it(data.test, function() {
            expect(QueryUtils.concatQueries(data.input)).toBe('');
        });
    });

});

describe('QueryUtils - concatQueries tests with invalid query list content', () => {
    'use strict';

    var dataProvider = [
        {test: 'invalid content', input: 'not an array'},
        {test: 'null/empty content', input: [null, '']},
        {test: 'non-string content', input: [3, [3], {test:'test'}]}
    ];
    dataProvider.forEach(function(data) {
        it(data.test, function() {
            expect(QueryUtils.concatQueries(data.input)).toBe('');
        });
    });
});

describe('QueryUtils - concatQueries tests concatenating with OR parameter not set/false', () => {
    'use strict';

    var dataProvider = [
        {test: 'one queryExpression', input: ['queryExpression'], expectation: '(queryExpression)'},
        {test: 'one queryExpression with trim', input: ['  queryExpression '], expectation: '(queryExpression)'},
        {test: 'multiple query expressions(test1)', input: ['exp1', 'exp2', 'exp 3'], expectation: '(exp1)AND(exp2)AND(exp 3)'},
        {test: 'multiple query expressions(test2)', input: ['exp1', '', 'exp 3'], expectation: '(exp1)AND(exp 3)'},
        {test: 'multiple query expressions(test3)', input: ['', null, 'exp1'], expectation: '(exp1)'},
        {test: 'multiple query expressions(test4)', input: ["{14.EX.'Butter'}", "({12.EX.'Oil'})AND({11.EX.'Lard'})"], expectation: "({14.EX.'Butter'})AND(({12.EX.'Oil'})AND({11.EX.'Lard'}))"}
    ];
    dataProvider.forEach(function(data) {
        it(data.test, function() {
            expect(QueryUtils.concatQueries(data.input)).toBe(data.expectation);
        });
    });
});

describe('QueryUtils - concatQueries test concatenating with OR parameter set to true', () => {
    'use strict';

    var dataProvider = [
        {test: 'one queryExpression', input: ['queryExpression'], expectation: '(queryExpression)'},
        {test: 'one queryExpression with trim', input: ['  queryExpression '], expectation: '(queryExpression)'},
        {test: 'multiple query expressions(test1)', input: ['exp1', 'exp2', 'exp 3'], expectation: '(exp1)OR(exp2)OR(exp 3)'},
        {test: 'multiple query expressions(test2)', input: ['exp1', '', 'exp 3'], expectation: '(exp1)OR(exp 3)'},
        {test: 'multiple query expressions(test3)', input: ['', null, 'exp1'], expectation: '(exp1)'},
        {test: 'multiple query expressions(test4)', input: ["{14.EX.'Butter'}", "({12.EX.'Oil'})AND({11.EX.'Lard'})"], expectation: "({14.EX.'Butter'})OR(({12.EX.'Oil'})AND({11.EX.'Lard'}))"}
    ];
    dataProvider.forEach(function(data) {
        it(data.test, function() {
            expect(QueryUtils.concatQueries(data.input, true)).toBe(data.expectation);
        });
    });
});

