var urlFileAttachmentReportLinkFormatter = require('../src/formatter/urlFileAttachmentReportLinkFormatter');

describe('urlFileAttachmentReportLinkFormatter', () => {
    describe('getProtocol', () => {
        let testCases = [
            {
                name: 'Returns the protocol if it is http',
                url: 'http://quickbase.com',
                expectation: 'http'
            },
            {
                name: 'Returns the protocol if it is https',
                url: 'https://www.quickbase.com',
                expectation: 'https'
            },
            {
                name: 'Returns special prococols (tel)',
                url: 'tel:555-555-5555',
                expectation: 'tel'
            },
            {
                name: 'Returns special protocols (sms)',
                url: 'sms:555-555-5555',
                expectation: 'sms'
            },
            {
                name: 'Returns special protocols (mailto)',
                url: 'mailto:test@quickbase.com',
                expectation: 'mailto'
            }
        ];

        testCases.forEach(function(testCase) {
            it(testCase.name, () => {
                let protocol = urlFileAttachmentReportLinkFormatter.getProtocolFromUrl(testCase.url);
                expect(protocol).toBe(testCase.expectation);
            });
        });
    });

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
        ];

        testCases.forEach(function(testCase) {
            it(testCase.name, () => {
                let formattedUrl = urlFileAttachmentReportLinkFormatter.stripProtocol(testCase.data);
                expect(formattedUrl).toBe(testCase.expectation);
            });
        });
    });

    describe('format', () => {
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

    describe('protocolIsMissingFrom', () => {
        let testCases = [
            {
                name: 'it returns false if there is a protocol on the url',
                url: 'https://google.com',
                expectation: false
            },
            {
                name: 'it returns false if the url has a special protocl (e.g., mailto:)',
                url: 'mailto:test@quickbase.com',
                expectation: false
            },
            {
                name: 'it returns true if there is no protocol on the url',
                url: 'www.google.com',
                expectation: true
            }
        ];

        testCases.forEach(function(testCase) {
            it(testCase.name, () => {
                expect(urlFileAttachmentReportLinkFormatter.protocolIsMissingFrom(testCase.url)).toBe(testCase.expectation);
            });
        });
    });
});
