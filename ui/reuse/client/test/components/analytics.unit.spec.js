import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import {Analytics, EVERGAGE_ACCOUNT_NAME, ANALYTICS_SCRIPT_ID, __RewireAPI__ as AnalyticsRewireAPI} from 'REUSE/components/analytics/analytics';

const mockDataset = 'unitTest'; // Use a non-existing dataset in case test accidentally makes a call to Everage

const mockExistingScriptElement = {
    parentNode: {
        insertBefore() {}
    }
};

class mockLogger {error() {}}

let component;

describe('Analytics', () => {
    beforeEach(() => {
        jasmineEnzyme();

        AnalyticsRewireAPI.__Rewire__('Logger', mockLogger);
    });

    afterEach(() => {
        AnalyticsRewireAPI.__ResetDependency__('Logger');
    });

    it('does not add more than one everage script to the page', () => {
        spyOn(document, 'getElementById').and.returnValue(true);
        spyOn(document, 'createElement');

        component = shallow(<Analytics dataset={mockDataset} />);
        component.instance().componentDidMount();

        expect(document.createElement).not.toHaveBeenCalled();
    });

    it('does not add the evergage script if there is no dataset specified', () => {
        spyOn(document, 'getElementById').and.returnValue(false);
        spyOn(document, 'createElement');

        component = shallow(<Analytics />);
        component.instance().componentDidMount();

        expect(document.createElement).not.toHaveBeenCalled();
    });

    it('logs an error if the evergage script could not be setup', () => {
        component = shallow(<Analytics dataset={mockDataset}/>);
        let instance = component.instance();

        spyOn(instance.logger, 'error');
        spyOn(instance, 'setupEvergage').and.throwError('test error');

        instance.componentDidMount();

        expect(instance.logger.error).toHaveBeenCalled();
    });

    it('adds the evergage script to the page if it does not exist', () => {
        let testMockElement = {};
        spyOn(document, 'getElementById').and.returnValue(false);
        spyOn(document, 'createElement').and.returnValue(testMockElement);
        spyOn(document, 'getElementsByTagName').and.returnValue([mockExistingScriptElement]);

        component = shallow(<Analytics dataset={mockDataset} />);
        component.instance().componentDidMount();

        expect(document.createElement).toHaveBeenCalledWith('script');
        expect(testMockElement.type).toEqual('text/javascript');
        expect(testMockElement.id).toEqual(ANALYTICS_SCRIPT_ID);
        expect(testMockElement.async).toEqual(true);
        expect(testMockElement.src).toEqual(`http://cdn.evergage.com/beacon/${EVERGAGE_ACCOUNT_NAME}/${mockDataset}/scripts/evergage.min.js`);
    });

    it('removes the evergage script from the page if it exists', () => {
        let testMockElement = {remove() {}};
        spyOn(testMockElement, 'remove');
        spyOn(document, 'getElementById').and.returnValue(testMockElement);

        component = shallow(<Analytics dataset={mockDataset} />);
        component.instance().componentWillUnmount();

        expect(testMockElement.remove).toHaveBeenCalled();
    });

    it('does not remove the evergage script if it does not exist', () => {
        spyOn(document, 'getElementById').and.returnValue(false);

        component = shallow(<Analytics dataset={mockDataset} />);

        expect(component.instance().componentWillUnmount).not.toThrow();
    });

    it('updates Evergage when props are changed', () => {
        spyOn(document, 'getElementById').and.returnValue(true);

        const testFirstUserId = 1;
        const testSecondUserId = 2;

        component = shallow(<Analytics dataset={mockDataset} userId={testFirstUserId} />, {lifecycleExperimental: true});
        let instance = component.instance();
        spyOn(instance, 'updateEvergage').and.callThrough();

        component.setProps({userId: testSecondUserId});

        expect(instance.updateEvergage).toHaveBeenCalled();
    });

    it('updates Evergage even when email IS passed in', () => {
        spyOn(document, 'getElementById').and.returnValue(true);
        spyOn(window._aaq, 'push');

        const testFirstUserId = 1;
        const testEmail = 'test@test.com';

        component = shallow(<Analytics dataset={mockDataset} userEmail={"test@test.com"} userId={testFirstUserId} />, {lifecycleExperimental: true});

        let instance = component.instance();
        spyOn(instance, 'updateEvergage').and.callThrough();
        component.setProps({userId: testFirstUserId});

        component.setProps({userEmail: testEmail});

        expect(instance.updateEvergage).toHaveBeenCalled();
        expect(window._aaq.push).toHaveBeenCalledWith(['setUser', testFirstUserId]);
        expect(window._aaq.push).toHaveBeenCalledWith(['gReqUID', testFirstUserId]);
        expect(window._aaq.push).toHaveBeenCalledWith(['gReqUserEmail', testEmail]);
    });

    it('updates Evergage userId even when email is not passed in', () => {
        spyOn(document, 'getElementById').and.returnValue(true);
        spyOn(window._aaq, 'push');

        const testFirstUserId = 1;

        component = shallow(<Analytics dataset={mockDataset} />, {lifecycleExperimental: true});
        let instance = component.instance();
        spyOn(instance, 'updateEvergage').and.callThrough();
        component.setProps({userId: testFirstUserId});

        expect(instance.updateEvergage).toHaveBeenCalled();

        expect(window._aaq.push).toHaveBeenCalledWith(['setUser', 1]);
        expect(window._aaq.push).toHaveBeenCalledWith(['gReqUID', 1]);
    });

    describe('functions that update evergage', () => {
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
                testFunction: 'updateEvergageUser',
                description: 'the evergage user',
                props: {userId: 1},
                expectedArguments: ['setUser', 1]
            },
            {
                testFunction: 'updateEvergageUser',
                description: 'the evergage user email',
                props: {userEmail: 'testx@test.com'},
                expectedArguments: ['gReqUserEmail', 'testx@test.com']
            },
            {
                testFunction: 'updateEvergageAdminStatus',
                description: 'the evergage admin status',
                props: {isAdmin: false},
                expectedArguments: ['setCustomField', 'has_app_admin', false, 'request']
            },
            {
                testFunction: 'updateAppManagerStatus',
                description: 'the evergage app manager status',
                props: {userId: 1, app: {ownerId: 1}},
                expectedArguments: ['setCustomField', 'is_app_mgr', true, 'request']
            },
            {
                testFunction: 'updateEvergageAccountId',
                description: 'the evergage account id',
                props: {app: {accountId: 1000}},
                expectedArguments: ['setCompany', 1000]
            },
            {
                testFunction: 'updateEverageAppId',
                description: 'the evergage app id',
                props: {app: {id: 13}},
                expectedArguments: ['setCustomField', 'appid', 13, 'request']
            },
        ];

        testCases.forEach(testCase => {
            describe(testCase.testFunction, () => {
                it(`updates ${testCase.description}`, () => {
                    spyOn(window._aaq, 'push');

                    component = shallow(<Analytics dataset={mockDataset} {...testCase.props} />);
                    component.instance()[testCase.testFunction]();

                    expect(window._aaq.push).toHaveBeenCalledWith(testCase.expectedArguments);
                });

                it(`does not update ${testCase.description} if the prop is not provided`, () => {
                    spyOn(window._aaq, 'push');

                    component = shallow(<Analytics dataset={mockDataset} />);
                    component.instance()[testCase.testFunction]();

                    expect(window._aaq.push).not.toHaveBeenCalled();
                });
            });
        });
    });
});
