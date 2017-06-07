import React from 'react';
import TestUtils, {Simulate} from 'react-addons-test-utils';
import {AutomationListRoute, __RewireAPI__ as AutomationListRouteRewireAPI}  from '../../src/components/automation/settings/automationListRoute';
import thunk from 'redux-thunk';
import Promise from 'bluebird';
import _ from 'lodash';

const sampleApp = {id: 'app1', tables: []};
const sampleAuto1 = {id: 'auto1', name: 'Auto 1', active: true, type: "EMAIL"};
const sampleAuto2 = {id: 'auto2', name: 'Auto 2', active: false, type: "EMAIL"};
const sampleAuto3 = {id: 'auto3', name: 'Auto 3', active: false, type: "CUSTOM"};

const props = {
    app: sampleApp,
    loadAutomations: (context, appId) => {},
    automations: []
};

const propsWithAutos = {
    ...props,
    automations: [sampleAuto1, sampleAuto2, sampleAuto3]
};

describe('AutomationListRoute', () => {
    let component;

    describe('AutomationListRoute with different props', () => {
        it('test get app id from app in props', () => {
            component = TestUtils.renderIntoDocument(<AutomationListRoute {...props}/>);
            expect(component.getAppId()).toEqual("app1");
        });

        it('test get app id from app id in matches', () => {
            let localProps = {...props, app: undefined, match:{params:{appId: 'app2'}}};
            component = TestUtils.renderIntoDocument(<AutomationListRoute {...localProps}/>);
            expect(component.getAppId()).toEqual("app2");
        });

        it('test get app id with no matches', () => {
            let localProps = {...props, app: undefined, match: undefined};
            component = TestUtils.renderIntoDocument(<AutomationListRoute {...localProps}/>);
            expect(component.getAppId()).toBeUndefined();
        });

        it('test get app id with no params', () => {
            let localProps = {...props, app: undefined, match:{params:undefined}};
            component = TestUtils.renderIntoDocument(<AutomationListRoute {...localProps}/>);
            expect(component.getAppId()).toBeUndefined();
        });
    });

    describe('AutomationListRoute without automations', () => {
        beforeEach(() => {
            component = TestUtils.renderIntoDocument(<AutomationListRoute {...props}/>);
        });

        afterEach(() => {
        });

        it('test render of component with no automations', () => {
            expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        });

        it('test list of automation names is blank', () => {
            let autoTDs = TestUtils.scryRenderedDOMComponentsWithTag(component, "td");
            expect(autoTDs.length).toEqual(0);
        });

    });

    describe('AutomationListRoute with automations', () => {
        beforeEach(() => {
            component = TestUtils.renderIntoDocument(<AutomationListRoute {...propsWithAutos }/>);
        });

        afterEach(() => {
        });

        it('test list of automation names contains automations', () => {
            let autoTDs = TestUtils.scryRenderedDOMComponentsWithTag(component, "td");
            expect(autoTDs.length).toEqual(6);
        });

        it('test list of automation names has the correct name first', () => {
            let autoTDs = TestUtils.scryRenderedDOMComponentsWithTag(component, "td");

            let i = 0;
            expect(autoTDs[i++].innerText).toEqual("Auto 1");
            expect(autoTDs[i++].innerText).toEqual("Yes");
            expect(autoTDs[i++].innerText).toEqual("Test");
            expect(autoTDs[i++].innerText).toEqual("Auto 2");
            expect(autoTDs[i++].innerText).toEqual("No");
            expect(autoTDs[i++].innerText).toEqual("Test");
        });

    });
});
