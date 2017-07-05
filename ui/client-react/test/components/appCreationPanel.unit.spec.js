import React from 'react';
import {mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import {AppCreationPanel} from '../../src/components/app/appCreationPanel';
import DialogFieldInput from '../../../reuse/client/src/components/multiStepDialog/dialogFieldInput';

let component;
let instance;

let mockFuncs = {
    setAppProperty() {}
};

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
        component = mount(<AppCreationPanel setAppProperty={mockFuncs.setAppProperty}/>);

        component.find('input').at(0).simulate('change', {target: {value: 'Mock App Name'}});

        expect(mockFuncs.setAppProperty).toHaveBeenCalledWith('name', 'Mock App Name');
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
});
