var assert = require('assert');
var Promise = require('bluebird');
var ApiResponseFormatter = require('../../../../src/api/quickbase/formatter/apiResponseFormatter');
var ApiResponseErrors = require('../../../../src/constants/apiResponseErrors');
var ErrorCodes = require('../../../../../common/src/dataEntryErrorCodes');
var HttpStatusCodes = require('../../../../src/constants/httpStatusCodes');

const i18NUniqueValidationErrorKey = 'invalidMsg.api.notUniqueSingleField';
const i18NUniqueValidationErrorKeyMulitChoice = 'invalidMsg.api.notUniqueMultiChoice';

describe('ApiResponseFormatter', () => {
    describe('formatResponseError', () => {
        var testCases = [
            {
                description: 'returns the payload if there are no unique validation errors',
                payload: {message: 'ok response', statusCode: HttpStatusCodes.OK},
                reject: false,
                expectedResult: {message: 'ok response', statusCode: HttpStatusCodes.OK}
            },
            {
                description: 'returns and rejects the payload if the statusCode is 300 or above and there are no unique validation errors',
                payload: {error: 'some error', statusCode: HttpStatusCodes.INTERNAL_SERVER_ERROR},
                reject: true,
                expectedResult: {error: 'some error', statusCode: HttpStatusCodes.INTERNAL_SERVER_ERROR}
            },
            {
                description: 'returns the payload and resolves it if there is no status code and there are no unique validation errors',
                payload: {message: 'missing status code'},
                reject: false,
                expectedResult: {message: 'missing status code'}
            },
            {
                description: 'catches a NotUniqueKeyFieldValue but will not return any validation errors if there are no fields in the payload (passes through the payload)',
                payload: {body: [{code: ApiResponseErrors.NOT_UNIQUE_VALUE}], statusCode: HttpStatusCodes.UNPROCESSABLE_ENTITY},
                reject: true,
                expectedResult: {body: [{code: ApiResponseErrors.NOT_UNIQUE_VALUE}], statusCode: HttpStatusCodes.UNPROCESSABLE_ENTITY}
            },
            {
                description: 'catches a NotUniqueKeyFieldValue but will not return any validation errors if there are no unique fields in the payload',
                payload: {
                    body: [{code: ApiResponseErrors.NOT_UNIQUE_VALUE}],
                    statusCode: HttpStatusCodes.INTERNAL_SERVER_ERROR,
                    request: {body: [{id: 1, fieldName: 'not unique'}]}
                },
                reject: true,
                expectedResult: {
                    body: [{code: ApiResponseErrors.NOT_UNIQUE_VALUE}],
                    statusCode: HttpStatusCodes.INTERNAL_SERVER_ERROR,
                    request: {body: [{id: 1, fieldName: 'not unique'}]}
                }
            },
            {
                description: 'catches a NotUniqueKeyFieldValue (saving new record error) and returns validation errors for each unique field in the payload',
                payload: {
                    body: [{code: ApiResponseErrors.NOT_UNIQUE_VALUE}],
                    statusCode: HttpStatusCodes.UNPROCESSABLE_ENTITY,
                    request: {body: [
                        {id: 1, fieldName: 'required but not unique', value: '1', fieldDef: {required: true}},
                        {id: 2, fieldName: 'not unique', value: '2', fieldDef: {unique: false}},
                        {id: 3, fieldName: 'unique', value: '3', fieldDef: {unique: true}},
                        {id: 4, fieldName: 'another unique field', value: '4', fieldDef: {unique: true}}
                    ]}
                },
                reject: true,
                expectedResult: {
                    response: {
                        errors: [
                            {
                                id: 3, value: '3',
                                def: {fieldDef: {unique: true}, id: 3, fieldName: 'unique', value: '3'},
                                error: {code: ErrorCodes.INVALID_ENTRY, data: {fieldName: 'unique', recordName: 'record'}, messageId: i18NUniqueValidationErrorKey},
                                isInvalid: true
                            },
                            {
                                id: 4, value: '4',
                                def: {fieldDef: {unique: true}, id: 4, fieldName: 'another unique field', value: '4'},
                                error: {code: ErrorCodes.INVALID_ENTRY, data: {fieldName: 'another unique field', recordName: 'record'}, messageId: i18NUniqueValidationErrorKey},
                                isInvalid: true
                            },
                        ],
                        message: 'validation error',
                        status: HttpStatusCodes.UNPROCESSABLE_ENTITY
                    }
                }
            },
            {
                description: 'catches a unique validation message (editing an existing record) and returns validation errors for each unique field in the payload',
                payload: {
                    body: [{message: ApiResponseErrors.NOT_UNIQUE_VALUE_MESSAGE}],
                    statusCode: HttpStatusCodes.NOT_FOUND,
                    request: {body: [
                        {id: 1, fieldName: 'required but not unique', value: '1', fieldDef: {required: true}},
                        {id: 2, fieldName: 'not unique', value: '2', fieldDef: {unique: false}},
                        {id: 3, fieldName: 'unique', value: '3', fieldDef: {unique: true}},
                        {id: 4, fieldName: 'another unique field', value: '4', fieldDef: {unique: true}}
                    ]}
                },
                reject: true,
                expectedResult: {
                    response: {
                        errors: [
                            {
                                id: 3, value: '3',
                                def: {fieldDef: {unique: true}, id: 3, fieldName: 'unique', value: '3'},
                                error: {code: ErrorCodes.INVALID_ENTRY, data: {fieldName: 'unique', recordName: 'record'}, messageId: i18NUniqueValidationErrorKey},
                                isInvalid: true
                            },
                            {
                                id: 4, value: '4',
                                def: {fieldDef: {unique: true}, id: 4, fieldName: 'another unique field', value: '4'},
                                error: {code: ErrorCodes.INVALID_ENTRY, data: {fieldName: 'another unique field', recordName: 'record'}, messageId: i18NUniqueValidationErrorKey},
                                isInvalid: true
                            },
                        ],
                        message: 'validation error',
                        status: HttpStatusCodes.UNPROCESSABLE_ENTITY
                    }
                }
            },
            {
                description: 'has a different error message for multichoice fields that fail unique validation',
                payload: {
                    body: [{message: ApiResponseErrors.NOT_UNIQUE_VALUE_MESSAGE}],
                    statusCode: HttpStatusCodes.NOT_FOUND,
                    request: {body: [
                        {id: 4, fieldName: 'multichoice field', value: '4', fieldDef: {unique: true, multipleChoice: {choices: ['a', 'b']}}}
                    ]}
                },
                reject: true,
                expectedResult: {
                    response: {
                        errors: [
                            {
                                id: 4, value: '4',
                                def: {fieldDef: {unique: true, multipleChoice: {choices: ['a', 'b']}}, id: 4, fieldName: 'multichoice field', value: '4'},
                                error: {code: ErrorCodes.INVALID_ENTRY, data: {fieldName: 'multichoice field', recordName: 'record'}, messageId: i18NUniqueValidationErrorKeyMulitChoice},
                                isInvalid: true
                            },
                        ],
                        message: 'validation error',
                        status: HttpStatusCodes.UNPROCESSABLE_ENTITY
                    }
                }
            },
            {
                description: 'works if the body of the request and response are still strings (i.e., not JSON parsed)',
                payload: {
                    body: JSON.stringify([{code: ApiResponseErrors.NOT_UNIQUE_VALUE}]),
                    statusCode: HttpStatusCodes.UNPROCESSABLE_ENTITY,
                    request: {body: JSON.stringify([
                        {id: 2, fieldName: 'not unique', value: '2', fieldDef: {unique: false}},
                        {id: 3, fieldName: 'unique', value: '3', fieldDef: {unique: true}},
                    ])}
                },
                reject: true,
                expectedResult: {
                    response: {
                        errors: [
                            {
                                id: 3, value: '3',
                                def: {fieldDef: {unique: true}, id: 3, fieldName: 'unique', value: '3'},
                                error: {code: ErrorCodes.INVALID_ENTRY, data: {fieldName: 'unique', recordName: 'record'}, messageId: i18NUniqueValidationErrorKey},
                                isInvalid: true
                            }
                        ],
                        message: 'validation error',
                        status: HttpStatusCodes.UNPROCESSABLE_ENTITY
                    }
                }
            },
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                // Create a new promise to mock an API call
                return new Promise((resolve, reject) => {
                    reject(testCase.payload);
                })
                    // This is the line that runs the formatter
                    .catch(ApiResponseFormatter.formatResponseError)

                    // The lines below test the output of the formatter
                    .then(payload => {
                        if (testCase.reject) {
                            assert(false, 'Promise was resolved but it should have been rejected');
                        } else {
                            assert.deepEqual(payload, testCase.expectedResult);
                        }
                    })
                    .catch(payload => {
                        if (testCase.reject) {
                            assert.deepEqual(payload, testCase.expectedResult);
                        } else {
                            assert(false, 'Promise was rejected but it should have been resolved');
                        }
                    });
            });
        });
    });
});
