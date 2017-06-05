import React from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import {AutomationViewRoute, __RewireAPI__ as AutomationViewRouteRewireAPI}  from '../../src/components/automation/settings/automationViewRoute';
import {MemoryRouter, Link} from 'react-router-dom';

const sampleApp = {id: 'app1', tables: []};
const sampleAuto1 = {id: 'auto1', name: 'Auto 1', active: true, type: "EMAIL"};
const sampleAuto2 = {id: 'auto2', name: 'Auto 2', active: false, type: "EMAIL"};
const sampleAuto3 = {id: 'auto3', name: 'Auto 3', active: false, type: "CUSTOM"};

const props = {
    app: sampleApp,
    loadAutomation: (context, appId) => {},
    automation: undefined
};

const propsWithAuto = {
    ...props,
    automation: sampleAuto1
};

describe('AutomationViewRoute', () => {
    let component;

    describe('AutomationViewRoute with different props', () => {
        beforeEach(() => {
            jasmineEnzyme();
        });

        it('test get app id from app in props', () => {
            component = shallow(<AutomationViewRoute {...propsWithAuto}/>);
            expect(component.instance().getAppId()).toEqual("app1");
            expect(component.instance().getAutomationId()).toEqual("auto1");
            expect(component.instance().getAutomationName()).toEqual("Auto 1");
        });

        it('test get app id from app id in matches', () => {
            let localProps = {...props, app: undefined, match:{params:{appId: 'app2', automationId: 'autoOther'}}};
            component = shallow(<AutomationViewRoute {...localProps}/>);
            expect(component.instance().getAppId()).toEqual("app2");
            expect(component.instance().getAutomationId()).toEqual("autoOther");
        });

        it('test get app id with no matches', () => {
            let localProps = {...props, app: undefined, match: undefined};
            component = shallow(<AutomationViewRoute {...localProps}/>);
            expect(component.instance().getAppId()).toBeUndefined();
            expect(component.instance().getAutomationId()).toBeUndefined();
        });

        it('test get app id with no params', () => {
            let localProps = {...props, app: undefined, match:{params:undefined}};
            component = shallow(<AutomationViewRoute {...localProps}/>);
            expect(component.instance().getAppId()).toBeUndefined();
            expect(component.instance().getAutomationId()).toBeUndefined();
        });
    });

    describe('AutomationViewRoute without automation', () => {
        beforeEach(() => {
            jasmineEnzyme();
            component = mount(<AutomationViewRoute {...props}/>);
        });

        afterEach(() => {
        });

        it('test render of component with no automation', () => {
            expect(component).toBeDefined();
        });
    });

    describe('AutomationViewRoute with automation', () => {
        beforeEach(() => {
            jasmineEnzyme();
            component = mount(<AutomationViewRoute {...propsWithAuto}/>);
        });

        afterEach(() => {
        });

        it('test screen is filled in', () => {
            expect(component.find(".automationViewName .value")).toHaveText("Auto 1");
            // For now these are hard coded values, so testing that they are the correct value does not make sense.
            expect(component.find(".automationViewTrigger .value")).not.toBeEmpty();
            expect(component.find(".automationViewAction .value")).not.toBeEmpty();
        });
    });
});
