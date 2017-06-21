import React from 'react';
import jasmineEnzyme from 'jasmine-enzyme';
import {shallow, mount} from 'enzyme';
import {AppCreationDialog, __RewireAPI__ as AppCreationDialogRewireAPI} from '../../src/components/app/appCreationDialog';
import {AppCreationPanel} from '../../src/components/app/appCreationPanel';
import MultiStepDialog from '../../../reuse/client/src/components/multiStepDialog/multiStepDialog';

let component;
let instance;

let mockActions = {
    hideAppCreationDialog() {},
    createApp() {}
};

describe('AppCreationDialog', () => {
    beforeEach(() => {
        AppCreationDialogRewireAPI.__Rewire__('AppCreationPanel', AppCreationPanel);
        spyOn(mockActions, 'hideAppCreationDialog');
        spyOn(mockActions, 'createApp');
        jasmineEnzyme();
    });

    afterEach(() => {
        AppCreationDialogRewireAPI.__ResetDependency__('AppCreationPanel');
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

    fit('will invoke createApp action when onFinished is called', () => {
        component = shallow(<AppCreationDialog createApp={mockActions.createApp} newApp={{}}/>);

        instance = component.instance();
        instance.onFinished();

        expect(mockActions.createApp).toHaveBeenCalledWith({});
    });
});
