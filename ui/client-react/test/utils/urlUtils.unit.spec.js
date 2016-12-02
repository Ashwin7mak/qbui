import React from 'react';
import UrlUtils from '../../src/utils/urlUtils';
import QBicon from '../../src/components/qbIcon/qbIcon';

describe('UrlUtils', () => {
    let phoneIcon = 'phone-outline';
    let mailIcon = 'mail';
    let messageIcon = 'speechbubble-outline';
    let fileIcon = ''; // No file icon currently available

    describe('getIconForProtocol', () => {
        let testCases = [
            {
                name: 'Returns phone icon for tel',
                protocol: 'tel',
                expectation: phoneIcon
            },
            {
                name: 'Returns phone icon for callto',
                protocol: 'callto',
                expectation: phoneIcon
            },
            {
                name: 'Returns the phone icon for skype',
                protocol: 'skype',
                expectation: phoneIcon
            },
            {
                name: 'Returns the mail icon for mailto',
                protocol: 'mailto',
                expectation: mailIcon
            },
            {
                name: 'Returns the message icon for sms',
                protocol: 'sms',
                expectation: messageIcon
            },
            {
                name: 'Returns the message icon for imessage',
                protocol: 'imessage',
                expectation: messageIcon
            },
            {
                name: 'Returns the file icon (if available) for file links',
                protocol: 'file',
                expectation: fileIcon
            },
            {
                name: 'Returns no icon for http',
                protocol: 'http',
                expectation: ''
            },
            {
                name: 'Returns no icon for anything else',
                protocol: '',
                expectation: ''
            }
        ];

        testCases.forEach(testCase => {
            it(testCase.name, () => {
                expect(UrlUtils.getIconForProtocol(testCase.protocol)).toEqual(testCase.expectation);
            });
        });
    });

    describe('renderIconForUrl', () => {
        it('returns a QBicon if the provided url has a protocol', () => {
            expect(UrlUtils.renderIconForUrl('mailto:test@quickbase.com')).toEqual(<QBicon icon={mailIcon} />);
        });

        it('returns an empty span if the provided url does not have a protocl', () => {
            expect(UrlUtils.renderIconForUrl('www.quickbase.com')).toEqual(<span />);
        });
    });

    describe('getQuickBaseClassicLink', () => {
        let testRealmId = 'realmId';
        let testAppId = 'testAppId';
        let testDomainId = 'quickbase.com';

        let testCases = [
            {
                description: 'returns the main quickbase classic link if selectedAppId is provided',
                selectedAppId: null,
                expectation: `https://${testRealmId}.${testDomainId}/db/main`
            },
            {
                description: 'returns the quickbase classic link for the app',
                selectedAppId: testAppId,
                expectation: `https://${testRealmId}.${testDomainId}/db/${testAppId}`
            }
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                let windowLocationUtils =  {
                    getHostname() {return testRealmId + '.' + testDomainId;}
                };

                UrlUtils.__Rewire__('WindowLocationUtils', windowLocationUtils);

                expect(UrlUtils.getQuickBaseClassicLink(testCase.selectedAppId)).toEqual(testCase.expectation);

                UrlUtils.__ResetDependency__('WindowLocationUtils');
            });
        });
    });
});
