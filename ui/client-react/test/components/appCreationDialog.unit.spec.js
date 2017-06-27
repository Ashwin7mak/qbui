import React from 'react';
import jasmineEnzyme from 'jasmine-enzyme';
import {shallow} from 'enzyme';
import {AppCreationDialog, __RewireAPI__ as AppCreationDialogRewireAPI} from '../../src/components/app/appCreationDialog';
import {AppCreationPanel} from '../../src/components/app/appCreationPanel';
import MultiStepDialog from '../../../reuse/client/src/components/multiStepDialog/multiStepDialog';

let component;
let instance;

const mockNotificationManager = {
    error() {}
};

const AppHistoryMock = {
    history: {push(_location) {}},
};


let mockProps = {
    createApp:  () => ({then: callback => callback({data: {id: 'mockAppId'}})}),
    createAppFailed:  () => ({then: (callbackSuccess, callBackFailed) => callBackFailed()}),
    hideAppCreationDialog() {},
    toggleAppsList() {}
};

describe('AppCreationDialog', () => {
    beforeEach(() => {
        jasmineEnzyme();

        AppCreationDialogRewireAPI.__Rewire__('AppCreationPanel', AppCreationPanel);
        AppCreationDialogRewireAPI.__Rewire__('NotificationManager', mockNotificationManager);
        AppCreationDialogRewireAPI.__Rewire__('AppHistory', AppHistoryMock);

        spyOn(mockProps, 'hideAppCreationDialog');
        spyOn(mockProps, 'createApp').and.callThrough();
        spyOn(mockProps, 'createAppFailed').and.callThrough();
        spyOn(mockProps, 'toggleAppsList');
        spyOn(AppHistoryMock.history, 'push');
        spyOn(mockNotificationManager, 'error');
    });

    afterEach(() => {
        AppCreationDialogRewireAPI.__ResetDependency__('AppCreationPanel');
        AppCreationDialogRewireAPI.__ResetDependency__('Promise');
        AppCreationDialogRewireAPI.__ResetDependency__('NotificationManager');
        AppCreationDialogRewireAPI.__ResetDependency__('AppHistory');

        mockProps.createAppFailed.calls.reset();
        mockProps.toggleAppsList.calls.reset();
    });

    it('renders an AppCreationDialog', () => {
        component = shallow(<AppCreationDialog />);

        expect(component).toBePresent();
        expect(component.find(MultiStepDialog).length).toEqual(1);
    });

    it('will invoke hideAppCreationDialog action when onCancel is called', () => {
        component = shallow(<AppCreationDialog hideAppCreationDialog={mockProps.hideAppCreationDialog} />);

        instance = component.instance();
        instance.onCancel();

        expect(mockProps.hideAppCreationDialog).toHaveBeenCalled();
    });

    it('will call an action to create an app when onFinished is called', () => {
        component = shallow(<AppCreationDialog createApp={mockProps.createApp}
                                               toggleAppsList={mockProps.toggleAppsList}
                                               app={{}} />);

        instance = component.instance();
        instance.onFinished();

        expect(mockProps.createApp).toHaveBeenCalledWith({});
        expect(mockProps.toggleAppsList).toHaveBeenCalledWith(false);
        expect(AppHistoryMock.history.push).toHaveBeenCalledWith(jasmine.any(String));
    });

    it('will invoke NotificationManager if createApp action fails', () => {
        component = shallow(<AppCreationDialog createApp={mockProps.createAppFailed}
                                               toggleAppsList={mockProps.toggleAppsList}
                                               app={{}} />);

        instance = component.instance();
        instance.onFinished();

        expect(mockProps.createApp).not.toHaveBeenCalled();
        expect(mockProps.toggleAppsList).not.toHaveBeenCalled();
        expect(AppHistoryMock.history.push).not.toHaveBeenCalled();
        expect(mockNotificationManager.error).toHaveBeenCalled();
    });

    it('will NOT invoke createApp action when onFinished is called if there are no new app', () => {
        component = shallow(<AppCreationDialog createApp={mockProps.createApp}
                                               app={null} />);

        instance = component.instance();
        instance.onFinished();

        expect(mockProps.createApp).not.toHaveBeenCalled();
    });
});
