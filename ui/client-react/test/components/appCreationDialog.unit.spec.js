import React from 'react';
import jasmineEnzyme from 'jasmine-enzyme';
import {shallow} from 'enzyme';
import {AppCreationDialog} from '../../src/components/app/appCreationDialog';
import MultiStepDialog from '../../../reuse/client/src/components/multiStepDialog/multiStepDialog';

let component;
let instance;

let mockActions = {
    hideAppCreationDialog() {}
};

describe('AppCreationDialog', () => {
    beforeEach(() => {
        spyOn(mockActions, 'hideAppCreationDialog');
        jasmineEnzyme();
    });

    it('renders an AppCreationDialog', () => {
        component = shallow(<AppCreationDialog />);

        expect(component).toBePresent();
        expect(component.find(MultiStepDialog).length).toEqual(1);
    });

    it('will invoke hideAppCreationDialog action when onCancel is called', () => {
        component = shallow(<AppCreationDialog hideAppCreationDialog={mockActions.hideAppCreationDialog} />);

        instance = component.instance();
        instance.onCancel();

        expect(mockActions.hideAppCreationDialog).toHaveBeenCalled();
    });
});
