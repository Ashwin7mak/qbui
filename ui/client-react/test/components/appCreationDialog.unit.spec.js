import React from 'react';
import jasmineEnzyme from 'jasmine-enzyme';
import {shallow} from 'enzyme';
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

    it('will invoke createApp action and hideAppCreationDialog when onFinished is called', () => {
        component = shallow(<AppCreationDialog createApp={mockActions.createApp}
                                               newApp={{}} />);

        instance = component.instance();
        instance.onFinished();

        expect(mockActions.createApp).toHaveBeenCalledWith({});
    });

    it('will NOT invoke createApp action or hideAppCreationDialog action when onFinished is called if there are no new apps', () => {
        component = shallow(<AppCreationDialog createApp={mockActions.createApp}
                                               newApp={null} />);

        instance = component.instance();
        instance.onFinished();

        expect(mockActions.createApp).not.toHaveBeenCalled();
    });
});
