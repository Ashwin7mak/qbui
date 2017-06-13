import React from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import {AutomationBuilderContainer, __RewireAPI__ as AutomationBuilderContainerRewireAPI}  from '../../src/components/automation/builder/AutomationBuilderContainer';
import {MemoryRouter, Link} from 'react-router-dom';
import NavigationUtils from '../../src/utils/navigationUtils';
import FieldValueEditor from "../../src/components/fields/fieldValueEditor";
import MultiLineTextFieldValueEditor from "../../src/components/fields/multiLineTextFieldValueEditor";
import EmailFieldValueEditor from "../../src/components/fields/emailFieldValueEditor";

const sampleApp = {id: 'app1', tables: []};
const sampleAuto1 = {id: 'auto1', name: 'Auto 1', active: true, type: "EMAIL", inputs: [
    {name: "toAddress", type: "TEXT", defaultValue: "test@test.com"},
    {name: "fromAddress", type: "TEXT",  defaultValue: "testing@quickbaserocks.com"},
    {name: "ccAddress", type: "TEXT",  defaultValue: null},
    {name: "subject", type: "TEXT", defaultValue: "Test subject"},
    {name: "body", type: "TEXT",  defaultValue: "Test body"}
]};

const props = {
    app: sampleApp,
    loadAutomation: (context, appId) => {},
    saveAutomation: (appId, automationId, automation) => {},
    changeAutomationEmailTo: (value) => {},
    changeAutomationEmailSubject: (value) => {},
    changeAutomationEmailBody: (value) => {},
    automation: undefined
};

const propsWithAuto = {
    ...props,
    automation: sampleAuto1
};

describe('AutomationBuilderContainer', () => {
    let component;

    describe('AutomationBuilderContainer with different props', () => {
        beforeEach(() => {
            jasmineEnzyme();
        });

        it('test get app id from app in props', () => {
            component = shallow(<AutomationBuilderContainer {...propsWithAuto}/>);
            expect(component.instance().getAppId()).toEqual("app1");
            expect(component.instance().getAutomationId()).toEqual("auto1");
            expect(component.instance().getAutomationName()).toEqual("Auto 1");
        });

        it('test get app id from app id in matches', () => {
            let localProps = {...props, app: undefined, match:{params:{appId: 'app2', automationId: 'autoOther'}}};
            component = shallow(<AutomationBuilderContainer {...localProps}/>);
            expect(component.instance().getAppId()).toEqual("app2");
            expect(component.instance().getAutomationId()).toEqual("autoOther");
        });

        it('test get app id with no matches', () => {
            let localProps = {...props, app: undefined, match: undefined};
            component = shallow(<AutomationBuilderContainer {...localProps}/>);
            expect(component.instance().getAppId()).toBeUndefined();
            expect(component.instance().getAutomationId()).toBeUndefined();
        });

        it('test get app id with no params', () => {
            let localProps = {...props, app: undefined, match:{params:undefined}};
            component = shallow(<AutomationBuilderContainer {...localProps}/>);
            expect(component.instance().getAppId()).toBeUndefined();
            expect(component.instance().getAutomationId()).toBeUndefined();
        });
    });

    describe('AutomationBuilderContainer without automation', () => {
        beforeEach(() => {
            jasmineEnzyme();
            component = mount(<AutomationBuilderContainer {...props}/>);
        });

        afterEach(() => {
        });

        it('test render of component with no automation', () => {
            expect(component).toBeDefined();
        });
    });

    describe('AutomationBuilderContainer with automation', () => {
        beforeEach(() => {
            jasmineEnzyme();
            component = mount(<AutomationBuilderContainer {...propsWithAuto}/>);
        });

        afterEach(() => {
        });

        it('test screen is filled in', () => {
            expect(component.find(EmailFieldValueEditor)).toHaveValue("test@test.com");
            expect(component.find(FieldValueEditor)).toHaveValue("Test subject");
            expect(component.find(MultiLineTextFieldValueEditor)).toHaveValue("Test body");
        });
    });

    describe('AutomationBuilderContainer editing automation', () => {
        beforeEach(() => {
            jasmineEnzyme();
            spyOn(propsWithAuto, 'changeAutomationEmailTo').and.callThrough();
            spyOn(propsWithAuto, 'changeAutomationEmailSubject').and.callThrough();
            spyOn(propsWithAuto, 'changeAutomationEmailBody').and.callThrough();

            component = mount(<AutomationBuilderContainer {...propsWithAuto}/>);
        });

        afterEach(() => {
        });

        it('test edit to', () => {
            let field = component.find(EmailFieldValueEditor);
            field.simulate('change', {target: {value: 'test2@test2.com'}});

            expect(propsWithAuto.changeAutomationEmailTo).toHaveBeenCalled();
        });

        // TODO: I can't figure out how to test changing the text on subject and body.
    });

    describe('AutomationBuilderContainer save and cancel buttons with automation', () => {
        beforeEach(() => {
            jasmineEnzyme();
            spyOn(propsWithAuto, 'saveAutomation').and.callThrough();
            spyOn(NavigationUtils, 'goBackToPreviousLocation');

            component = mount(<AutomationBuilderContainer {...propsWithAuto}/>);
        });

        afterEach(() => {
        });

        it('test save button click', () => {
            let saveButton = component.find('.mainTrowserFooterButton');
            saveButton.simulate('click');

            expect(propsWithAuto.saveAutomation).toHaveBeenCalled();
            expect(NavigationUtils.goBackToPreviousLocation).toHaveBeenCalled();
        });

        it('test cancel button click', () => {
            let saveButton = component.find('.alternativeTrowserFooterButton');
            saveButton.simulate('click');

            expect(propsWithAuto.saveAutomation).not.toHaveBeenCalled();
            expect(NavigationUtils.goBackToPreviousLocation).toHaveBeenCalled();
        });
    });
});
