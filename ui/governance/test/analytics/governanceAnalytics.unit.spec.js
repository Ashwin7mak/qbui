import React from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import {GovernanceAnalytics} from '../../src/analytics/governanceAnalytics';
import {Analytics} from '../../../reuse/client/src/components/analytics/analytics';

let component;

describe('GovernanceAnalytics', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('should contain the main Analytics component', () => {
        let govComponent = shallow(<GovernanceAnalytics />);
        expect(govComponent.find(Analytics)).toBeDefined();
    });

    describe('functions that update evergage for governance analytics', () => {
        beforeEach(() => {
            // Don't add the script to the page during these tests
            spyOn(document, 'getElementById').and.returnValue(true);

            window._aaq = {push() {}};
        });

        afterEach(() => {
            window._aaq = [];
        });

        let testCases = [
            {
                testFunction: 'updateEvergageAccountID',
                description: 'the evergage account id',
                props: {accountId: 123},
                expectedArguments: ['setCustomField', 'accountId', 123, 'request']
            },
            {
                testFunction: 'updateEvergageAccountAdminStatus',
                description: 'the evergage account admin status',
                props: {currentUserId: 22, isAccountAdmin: true},
                expectedArguments: ['setCustomField', 'has_app_admin', true, 'request']
            },
            {
                testFunction: 'updateEvergageRealmAdminStatus',
                description: 'the evergage realm admin status',
                props: {currentUserId: 22, isRealmAdmin: true},
                expectedArguments: ['setCustomField', 'is_realm_admin', true, 'request']
            },
            {
                testFunction: 'updateEvergageSubdomainName',
                description: 'the evergage subdomain name',
                props: {subdomainName: "test_subdomain_name"},
                expectedArguments: ['setCustomField', 'subdomainName', "test_subdomain_name", 'request']
            },
            {
                testFunction: 'updateEvergageTotalItems',
                description: 'the evergage total number of items in the grid',
                props: {totalItems: 20},
                expectedArguments: ['setCustomField', 'totalItems', 20, 'request']
            },
            {
                testFunction: 'updateEvergagePaidUsers',
                description: 'the evergage number of paid users',
                props: {paidUsers: 11},
                expectedArguments: ['setCustomField', 'paidUsers', 11, 'request']
            },
            {
                testFunction: 'updateEvergageDeniedUsers',
                description: 'the evergage number of denied users',
                props: {deniedUsers: 2},
                expectedArguments: ['setCustomField', 'deniedUsers', 2, 'request']
            },
            {
                testFunction: 'updateEvergageTotalRealmUsers',
                description: 'the evergage number of realm users',
                props: {totalRealmUsers: 41},
                expectedArguments: ['setCustomField', 'totalRealmUsers', 41, 'request']
            },
            {
                testFunction: 'updateEvergagePageLoadTime',
                description: 'the evergage total pageload time (until users loaded)',
                props: {pageLoadTime: 3.12},
                expectedArguments: ['setCustomField', 'pageLoadTime', 3.12, 'request']
            },
            {
                testFunction: 'updateEvergageTotalGridTimeTaken',
                description: 'the evergage time to load the grid',
                props: {gridLoadTime: 3.12},
                expectedArguments: ['setCustomField', 'totalGridLoadTime', 3.12, 'request']
            }
        ];

        testCases.forEach(testCase => {
            describe(testCase.testFunction, () => {
                it(`updates ${testCase.description}`, () => {
                    spyOn(window._aaq, 'push');

                    component = shallow(<GovernanceAnalytics {...testCase.props} />);
                    component.instance()[testCase.testFunction]();

                    expect(window._aaq.push).toHaveBeenCalledWith(testCase.expectedArguments);
                });

                it(`does not update ${testCase.description} if the prop is not provided`, () => {
                    spyOn(window._aaq, 'push');

                    component = shallow(<GovernanceAnalytics />);
                    component.instance()[testCase.testFunction]();

                    expect(window._aaq.push).not.toHaveBeenCalled();
                });
            });
        });
    });
});
