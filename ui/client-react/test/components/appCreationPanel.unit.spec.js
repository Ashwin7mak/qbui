import React from 'react';
import {mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import AppCreationPanel from '../../src/components/app/appCreationPanel';

let component;

describe('AppCreationPanel', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('renders a AppCreationPanel', () => {
        component = mount(<AppCreationPanel />);

        expect(component.find('.appCreationPanel.dialogCreationPanelInfo')).toBePresent();
        expect(component.find('.appCreationPanel.dialogField').length).toEqual(2);
    });
});
