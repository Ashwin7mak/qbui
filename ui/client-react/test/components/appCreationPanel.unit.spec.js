import React from 'react';
import {mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import AppCreationPanel from '../../src/components/app/appCreationPanel';
import {Simulate} from 'react-addons-test-utils';

let component;

describe('TableCreationPanel', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('renders a TableCreationPanel', () => {
        component = mount(<AppCreationPanel />);

        expect(component.find('.appCreationPanel.dialogCreationPanelInfo')).toBePresent();
        expect(component.find('.appCreationPanel.dialogField').length).toEqual(2);
    });
});
