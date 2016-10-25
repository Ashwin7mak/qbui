import ValidationMessage from '../../src/utils/validationMessage';

describe('ValidationMessage', () => {
    'use strict';

    let mockLocale = {
        getMessage() {return 'some message';}
    };

    beforeEach(() => {
        ValidationMessage.__Rewire__('Locale', mockLocale);
        spyOn(mockLocale, 'getMessage').and.callThrough();
    });

    afterEach(() => {
        mockLocale.getMessage.calls.reset();
        ValidationMessage.__ResetDependency__('Locale');
    });

    describe('error message key gets i18n message', () => {
        let cases = [{
            test: 'an error get translated call',
            params: {
                isInvalid: true,
                error: {
                    messageId: 100,
                    data: {
                        details: 'what happened exactly'
                    }
                },
            },
            expectCall: true,
        }, {
            test: 'success doesn\'t get message',
            params: {
                isInvalid: false,
            },
            expectCall: false
        }, {
            test: 'invalid but no error code gets unknown message',
            params: {
                isInvalid: true,
            },
            expectCall: true,
        }];
        cases.forEach((testCase) => {
            it(testCase.test, () => {
                let message = ValidationMessage.getMessage(testCase.params);
                if (testCase.expectCall) {
                    expect(mockLocale.getMessage).toHaveBeenCalled();
                    expect(message).not.toBeUndefined();
                } else {
                    expect(mockLocale.getMessage).not.toHaveBeenCalled();
                    expect(message).toBeUndefined();
                }
            });
        });
    });
});
