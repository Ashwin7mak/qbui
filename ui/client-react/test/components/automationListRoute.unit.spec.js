import React from 'react';
import TestUtils, {Simulate} from 'react-addons-test-utils';
import {AutomationListRoute, __RewireAPI__ as AutomationListRouteRewireAPI}  from '../../src/components/automation/settings/automationListRoute';
import thunk from 'redux-thunk';
import Promise from 'bluebird';
import _ from 'lodash';

const sampleApp = {id: 'app1', tables: []};
const sampleAuto1 = {id: 'auto1', name: 'Auto 1', active: true};
const sampleAuto2 = {id: 'auto2', name: 'Auto 2', active: false};

const props = {
    app: sampleApp,
    loadAutomations: (context, appId) => {},
    automations: []
};

const propsWithAutos = {
    ...props,
    automations: [sampleAuto1, sampleAuto2]
};

describe('AutomationListRoute', () => {
    let component;

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
            expect(autoTDs.length).toEqual(4);
        });

        it('test list of automation names has the correct name first', () => {
            let autoTDs = TestUtils.scryRenderedDOMComponentsWithTag(component, "td");

            let i = 0;
            expect(autoTDs[i++].innerText).toEqual("Auto 1");
            expect(autoTDs[i++].innerText).toEqual("Yes");
            expect(autoTDs[i++].innerText).toEqual("Auto 2");
            expect(autoTDs[i++].innerText).toEqual("No");
        });

    });
});
