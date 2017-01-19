import QbResponseError from '../../src/services/QbResponseError';
import _ from 'lodash';

describe('QbResponseError', () => {
    let QbResponseErrorEquality = function(actual, expected) {
        if (_.isString(expected)) {
            return (actual.response === expected);
        }

        let outcome = true;
        Object.keys(expected).forEach(key => {
            let type = null;
            if (_.isArray(expected[key])) {type = 'Array';}
            if (_.isObject(expected[key])) {type = 'Object';}

            switch (type) {
            case 'Array' :
                if (_.difference(expected[key], actual[key]).length > 0) {
                    outcome = false;
                }
                break;
            case 'Object' :
                if (!_.isEqual(expected[key], actual[key])) {
                    outcome = false;
                }
                break;
            default:
                if (expected[key] !== actual[key]) {
                    outcome = false;
                }
            }
        });

        return outcome;
    };

    beforeEach(() => {
        jasmine.addCustomEqualityTester(QbResponseErrorEquality);
    });

    it('returns the error message as the response if error is not an object', () => {
        expect(new QbResponseError('Greetings!')).toEqual('Greetings!');
    });

    let testCases = [
        {
            description: 'has null defaults',
            errorObject: {},
            expectedResult: {
                statusCode: null,
                response: null,
                data: null,
                config: null,
                request: null,
                sid: null,
                tid: null,
                errorMessages: []
            }
        },
        {
            description: 'sets the response if it exists',
            errorObject: {response: 'test'},
            expectedResult: {response: 'test'}
        },
        {
            description: 'sets the data if it exists',
            errorObject: {response: {data: 'test'}},
            expectedResult: {response: {data: 'test'}, data: 'test'}
        },
        {
            description: 'sets the status code if it exists',
            errorObject: {response: {data: {response: {status: 500}}}},
            expectedResult: {statusCode: 500}
        },
        {
            description: 'sets the config if it exists',
            errorObject: {config: 'test'},
            expectedResult: {config: 'test'}
        },
        {
            description: 'sets the request if it exists',
            errorObject: {request: 'test'},
            expectedResult: {request: 'test'}
        },
        {
            description: 'sets the request if it exists as part of the response object',
            errorObject: {response: {request: 'test'}},
            expectedResult: {request: 'test'}
        },
        {
            description: 'sets the tid and sid if they exist',
            errorObject: {response: {data: {request: {headers: {sid: 1, tid: 2}}}}},
            expectedResult: {sid: 1, tid: 2}
        },
        {
            description: 'formats error messages in the response body for use in the UI',
            errorObject: {response: {data: {body: JSON.stringify([{error: 1}])}}},
            expectedResult: {errorMessages: [{error: 1}]}
        },
        {
            description: 'returns an empty array of error messages if errors in the response body are not properly formatted as a JSON string',
            errorObject: {response: {data: {body: 'bad{json{]'}}},
            expectedResult: {errorMessages: []}
        },
        {
            description: 'formats error messages in the response errors for use in the UI',
            errorObject: {response: {data: {response: {errors: [{error: 1}]}}}},
            expectedResult: {errorMessages: [{error: 1}]}
        },
        {
            description: 'combines errors in the response body and in the response errors and formats them for use in the UI',
            errorObject: {response: {data: {body: JSON.stringify([{error: 1}]), response: {errors: [{error: 2}]}}}},
            expectedResult: {errorMessages: [{error: 1}, {error: 2}]}
        }
    ];

    testCases.forEach(testCase => {
        it(testCase.description, () => {
            expect(new QbResponseError(testCase.errorObject)).toEqual(testCase.expectedResult);
        });
    });
});
