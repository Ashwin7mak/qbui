var urlFileAttachmentReportLinkFormatter = require('../src/formatter/urlFileAttachmentReportLinkFormatter');

describe('urlFileAttachmentReportLinkFormatter', () => {
    describe('stripProtocol', () => {
        let expectedUrl = 'quickbase.com';

        let testCases = [
            {
                name: 'removes http',
                data: 'http://' + expectedUrl,
                expectation: expectedUrl
            },
            {
                name: 'does not remove www',
                data: 'http://www.quickbase.com',
                expectation: 'www.quickbase.com'
            },
            {
                name: 'removes https',
                data: 'https://' + expectedUrl,
                expectation: expectedUrl
            },
            {
                name: 'removes ftp',
                data: 'ftp://' + expectedUrl,
                expectation: expectedUrl
            },
            {
                name: 'removes ssh',
                data: 'ssh://' + expectedUrl,
                expectation: expectedUrl
            },
            {
                name: 'removes mailto',
                data: 'https://' + expectedUrl,
                expectation: expectedUrl
            },
            {
                name: 'removes callto',
                data: 'callto' + expectedUrl,
                expectation: expectedUrl
            },
            {
                name: 'removes file',
                data: 'file://' + expectedUrl,
                expectation: expectedUrl
            },
            {
                name: 'removes imessage',
                data: 'imessage:' + expectedUrl,
                expectation: expectedUrl
            },
            {
                name: 'removes sms',
                data: 'sms:' + expectedUrl,
                expectation: expectedUrl
            },
            {
                name: 'removes skype',
                data: 'skype:' + expectedUrl,
                expectation: expectedUrl
            },
            {
                name: 'removes tel',
                data: 'tel:' + expectedUrl,
                expectation: expectedUrl
            },
            {
                name: 'does not remove other text separated by colons',
                data: 'imessage:' + expectedUrl + ':test',
                expectation: expectedUrl + ':test'
            }
        ]

        testCases.forEach(function(testCase) {
            it(testCase.name, () => {
                let formattedUrl = urlFileAttachmentReportLinkFormatter.stripProtocol(testCase.data);
                expect(formattedUrl).toBe(testCase.expectation);
            });
        });
    });

    fdescribe('format', () => {
        let testUrl = 'http://google.com';

        let testCases = [
            {
                name: 'returns a blank string if fieldvalue is null',
                fieldValue: null,
                fieldInfo: {},
                expectation: ''
            },
            {
                name: 'returns a blank string if fieldvalue.value is null',
                fieldValue: {value: null},
                fieldInfo: {},
                expectation: ''
            },
            {
                name: 'returns link text if it exists',
                fieldValue: {value: testUrl},
                fieldInfo: {linkText: 'Click Me'},
                expectation: 'Click Me'
            },
            {
                name: 'returns the raw url if displayProtocol is true or is not set',
                fieldValue: {value: testUrl},
                fieldInfo: {},
                expectation: testUrl
            },
            {
                name: 'strips the protocol if displayProtocol is set to false',
                fieldValue: {value: testUrl},
                fieldInfo: {displayProtocol: false},
                expectation: 'google.com'
            }
        ];

        testCases.forEach(function(testCase) {
            it(testCase.name, () => {
                let formattedUrl = urlFileAttachmentReportLinkFormatter.format(testCase.fieldValue, testCase.fieldInfo);
                expect(formattedUrl).toBe(testCase.expectation);
            });
        });
    });
});
