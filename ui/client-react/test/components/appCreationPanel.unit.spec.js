import React from 'react';
import {mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import {AppCreationPanel} from '../../src/components/app/appCreationPanel';
import Locale from '../../src/locales/locales';

let component;
let instance;

let mockAppName = 'Mock App Name';
let mockFuncs = {
    setAppProperty() {}
};

let mockApps = [
    {name: mockAppName}
];

describe('AppCreationPanel', () => {
    beforeEach(() => {
        spyOn(mockFuncs, 'setAppProperty');
        jasmineEnzyme();
    });

    it('renders an AppCreationPanel', () => {
        component = mount(<AppCreationPanel />);

        expect(component.find('.appCreationPanel.dialogCreationPanelInfo')).toBePresent();
    });

    it('will invoke setAppProperty when app name input box is typed into', () => {
        component = mount(<AppCreationPanel setAppProperty={mockFuncs.setAppProperty}
                                            apps={[]}/>);

        component.find('input').at(0).simulate('change', {target: {value: 'Mock App Name'}});

        expect(mockFuncs.setAppProperty).toHaveBeenCalledWith('name', 'Mock App Name', null, null, true);
    });

    it('will invoke setAppProperty when app description input box is typed into', () => {
        component = mount(<AppCreationPanel setAppProperty={mockFuncs.setAppProperty}/>);

        component.find('textarea').simulate('change', {target: {value: 'Mock App Description'}});

        expect(mockFuncs.setAppProperty).toHaveBeenCalledWith('description', 'Mock App Description');
    });

    it('will invoke setAppProperty when setAppIcon is invoked', () => {
        component = mount(<AppCreationPanel setAppProperty={mockFuncs.setAppProperty}/>);

        instance = component.instance();
        instance.setAppIcon('dragon icon');

        expect(mockFuncs.setAppProperty).toHaveBeenCalledWith('icon', 'dragon icon');
    });

    it('validateAppName will be called with the app property and app name when a user types in the app name input box', () => {
        component = mount(<AppCreationPanel setAppProperty={mockFuncs.setAppProperty}
                                            apps={mockApps}/>);

        instance = component.instance();

        spyOn(instance, 'setAppProperty').and.callThrough();
        spyOn(instance, 'validateAppName');

        component.find('input').at(0).simulate('change', {target: {property: 'name', value: 'Mock App Name'}});

        expect(instance.validateAppName).toHaveBeenCalledWith('name', 'Mock App Name');
    });

    it('validateAppName will return an empty pendingValidationError message if the app name is an empty string', () => {
        component = mount(<AppCreationPanel setAppProperty={mockFuncs.setAppProperty}
                                            apps={mockApps}/>);

        instance = component.instance();

        let result = instance.validateAppName('name', '');

        expect(result).toEqual(Locale.getMessage('appCreation.validateAppNameEmpty'));
    });

    it('validateAppName will return an app name exists pendingValidationError message if the app name exists', () => {
        component = mount(<AppCreationPanel setAppProperty={mockFuncs.setAppProperty}
                                            apps={mockApps}/>);

        instance = component.instance();

        let result = instance.validateAppName('name', mockAppName);

        expect(result).toEqual(Locale.getMessage('appCreation.validateAppNameExists'));
    });

    it('appNameExists will be called with the app name when a user types in app name input box ', () => {
        component = mount(<AppCreationPanel setAppProperty={mockFuncs.setAppProperty}
                                            apps={mockApps}/>);

        instance = component.instance();

        spyOn(instance, 'setAppProperty').and.callThrough();
        spyOn(instance, 'validateAppName').and.callThrough();
        spyOn(instance, 'appNameExists');

        component.find('input').at(0).simulate('change', {target: {property: 'name', value: mockAppName}});

        expect(instance.appNameExists).toHaveBeenCalledWith(mockAppName);
    });

    it('appNameExists will return true if the app name exists', () => {
        component = mount(<AppCreationPanel setAppProperty={mockFuncs.setAppProperty}
                                            apps={mockApps}/>);

        instance = component.instance();

        let result = instance.appNameExists(mockAppName);

        expect(result).toEqual(true);
    });

    it('appNameExists will return false if the app name does not exists', () => {
        component = mount(<AppCreationPanel setAppProperty={mockFuncs.setAppProperty}
                                            apps={mockApps}/>);

        instance = component.instance();

        let result = instance.appNameExists('nonExistingAppName');

        expect(result).toEqual(false);
    });

    it('onBlurInput will invoke prop setAppProperty if isEdited is true and property === name', () => {
        component = mount(<AppCreationPanel setAppProperty={mockFuncs.setAppProperty}
                                            apps={mockApps}
                                            isEdited={true}/>);
        instance = component.instance();
        spyOn(instance, 'onBlurInput').and.callThrough();

        component.find('input').at(0).simulate('change', {target: {property: 'name', value: mockAppName}});
        component.find('input').at(0).simulate('blur');

        expect(mockFuncs.setAppProperty).toHaveBeenCalled();
    });

    it('onBlurInput will NOT invoke prop setAppProperty if isEdited is false', () => {
        component = mount(<AppCreationPanel setAppProperty={mockFuncs.setAppProperty}
                                            apps={mockApps}
                                            isEdited={false}/>);
        instance = component.instance();
        spyOn(instance, 'onBlurInput').and.callThrough();

        component.find('input').at(0).simulate('blur');

        expect(mockFuncs.setAppProperty).not.toHaveBeenCalled();
    });

    it('onBlurInput will NOT invoke prop setAppProperty if isEdited is undefined', () => {
        component = mount(<AppCreationPanel setAppProperty={mockFuncs.setAppProperty}
                                            apps={mockApps} />);
        instance = component.instance();
        spyOn(instance, 'onBlurInput').and.callThrough();

        component.find('input').at(0).simulate('blur');

        expect(mockFuncs.setAppProperty).not.toHaveBeenCalled();
    });
});
