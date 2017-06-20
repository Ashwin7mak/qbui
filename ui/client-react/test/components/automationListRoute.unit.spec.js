import React from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import {AutomationListRoute, __RewireAPI__ as AutomationListRouteRewireAPI}  from '../../src/components/automation/settings/automationListRoute';
import {MemoryRouter, Link} from 'react-router-dom';
import TestUtils from 'react-addons-test-utils';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {Provider} from "react-redux";
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);


const sampleApp = {id: 'app1', tables: []};
const sampleAuto1 = {id: 'auto1', name: 'Auto 1', active: true, type: "EMAIL"};
const sampleAuto2 = {id: 'auto2', name: 'Auto 2', active: false, type: "EMAIL"};
const sampleAuto3 = {id: 'auto3', name: 'Auto 3', active: false, type: "CUSTOM"};

const props = {
    app: sampleApp,
    loadAutomations: (context, appId) => {},
    testAutomation: (automationId) => {},
    automations: []
};

const propsWithAutos = {
    ...props,
    automations: [sampleAuto1, sampleAuto2, sampleAuto3]
};

describe('AutomationListRoute', () => {
    let component;

    describe('AutomationListRoute with different props', () => {
        beforeEach(() => {
            jasmineEnzyme();
        });

        it('test get app id from app in props', () => {
            component = shallow(<AutomationListRoute {...props}/>);
            expect(component.instance().getAppId()).toEqual("app1");
        });

        it('test get app id from app id in matches', () => {
            let localProps = {...props, app: undefined, match:{params:{appId: 'app2'}}};
            component = shallow(<AutomationListRoute {...localProps}/>);
            expect(component.instance().getAppId()).toEqual("app2");
        });

        it('test get app id with no matches', () => {
            let localProps = {...props, app: undefined, match: undefined};
            component = shallow(<AutomationListRoute {...localProps}/>);
            expect(component.instance().getAppId()).toBeUndefined();
        });

        it('test get app id with no params', () => {
            let localProps = {...props, app: undefined, match:{params:undefined}};
            component = shallow(<AutomationListRoute {...localProps}/>);
            expect(component.instance().getAppId()).toBeUndefined();
        });
    });

    describe('AutomationListRoute without automations', () => {
        beforeEach(() => {
            jasmineEnzyme();
            component = shallow(<AutomationListRoute {...props}/>);
        });

        afterEach(() => {
        });

        it('test render of component with no automations', () => {
            expect(component).toBeDefined();
        });

        it('test list of automation names is blank', () => {
            let autoTDs = component.find("td");
            expect(autoTDs.length).toEqual(0);
        });

    });

    describe('AutomationListRoute with automations', () => {
        it('test render of automations grid', () => {
            jasmineEnzyme();
            const initialState = {};
            const store = mockStore(initialState);
            component = shallow(
                <Provider store={store}>
                    <AutomationListRoute
                        {...propsWithAutos}
                    />
                </Provider>
            );
            expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        });
    });
});
