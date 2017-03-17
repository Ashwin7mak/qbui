import React from 'react';
import UrlUtils, {__RewireAPI__ as UrlUtilsRewireAPI} from '../../src/utils/urlUtils';
import QBicon from '../../src/components/qbIcon/qbIcon';
import {SUPPORT_LINK_PATH, REPORT_LINK, CHILD_REPORT_LINK, USERS_ROUTE} from '../../src/constants/urlConstants';
import StringUtils from '../../src/utils/stringUtils';

describe('UrlUtils', () => {
    const phoneIcon = 'phone-outline';
    const mailIcon = 'mail';
    const messageIcon = 'speechbubble-outline';
    const fileIcon = ''; // No file icon currently available

    const testRealmId = 'realmId';
    const testAppId = 'testAppId';
    const testDomainId = 'quickbase.com';
    const mockWindowLocationUtils =  {
        getHostname() {return testRealmId + '.' + testDomainId;}
    };

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
                UrlUtilsRewireAPI.__Rewire__('WindowLocationUtils', mockWindowLocationUtils);

                expect(UrlUtils.getQuickBaseClassicLink(testCase.selectedAppId)).toEqual(testCase.expectation);

                UrlUtilsRewireAPI.__ResetDependency__('WindowLocationUtils');
            });
        });
    });

    describe('getSupportLink', () => {
        it('returns a link to the support app that includes the current realm', () => {
            UrlUtilsRewireAPI.__Rewire__('WindowLocationUtils', mockWindowLocationUtils);

            expect(UrlUtils.getSupportLink()).toEqual(`https://${testRealmId}.${testDomainId}${SUPPORT_LINK_PATH}`);

            UrlUtilsRewireAPI.__ResetDependency__('WindowLocationUtils');
        });
    });

    describe('getReportLink', () => {
        it('returns a link to a report', () => {
            let appId = '1';
            let tblId = '2';
            let rptId = '3';
            let url = StringUtils.format(REPORT_LINK, [appId, tblId, rptId]);

            expect(UrlUtils.getReportLink(appId, tblId, rptId)).toEqual(url);
        });
    });

    describe('getRelatedChildReportLink', () => {
        it('returns a link to a child report', () => {
            let appId = '1';
            let tblId = '2';
            let rptId = '3';
            let detailKeyFid = '4';
            let detailKeyValue = '5';
            let url = StringUtils.format(CHILD_REPORT_LINK, [appId, tblId, rptId, detailKeyFid, detailKeyValue]);

            expect(UrlUtils.getRelatedChildReportLink(appId, tblId, rptId, detailKeyFid, detailKeyValue)).toEqual(url);
        });
    });

    describe('getAppUsersLink', () => {
        it('returns a link to the app users management page', () => {
            let appId = '1';
            let url = StringUtils.format(USERS_ROUTE, [appId]);

            expect(UrlUtils.getAppUsersLink(appId)).toEqual(url);
        });
    });
});
