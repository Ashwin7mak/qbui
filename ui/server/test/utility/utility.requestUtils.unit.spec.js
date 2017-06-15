const assert = require('assert');
const requestUtils = require('../../src/utility/requestUtils');

describe('RequestUtils', () => {
    let testCases = [
        {
            description: 'returns true for 200 status code',
            statusCode: 200,
            expected: true
        },
        {
            description: 'returns true for 201 status code',
            statusCode: 201,
            expected: true
        },
        {
            description: 'returns true for other status codes in the 200 range',
            statusCode: 299,
            expected: true
        },
        {
            description: 'returns false status codes in the 100 range',
            statusCode: 100,
            expected: false
        },
        {
            description: 'returns false status codes in the 300 range',
            statusCode: 300,
            expected: false
        },
        {
            description: 'returns false status codes in the 400 range',
            statusCode: 400,
            expected: false
        },
        {
            description: 'returns false status codes in the 500 range',
            statusCode: 500,
            expected: false
        },
    ];

    testCases.forEach(testCase => {
        it(testCase.description, () => {
            assert.equal(requestUtils.wasRequestSuccessful(testCase.statusCode), testCase.expected);
        });
    });
});
