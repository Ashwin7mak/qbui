import React from 'react';
import jasmineEnzyme from 'jasmine-enzyme';
import {shallow, mount} from 'enzyme';
import {AppCreationDialog, __RewireAPI__ as AppCreationDialogRewireAPI} from '../../src/components/app/appCreationDialog';
import {AppCreationPanel} from '../../src/components/app/appCreationPanel';
import MultiStepDialog from '../../../reuse/client/src/components/multiStepDialog/multiStepDialog';

let component;
let instance;
let mockRoute = 'mockRoute';
let appId = 'mockAppId';
let qbModalClass = '.multiStepModal';

const mockNotificationManager = {
    error() {}
};

const AppHistoryMock = {
    history: {push(_location) {}},
};

const mockUrlUtils = {
    getAppHomePageLink() {}
};

let mockProps = {
    createApp:  () => ({then: callback => callback({data: {id: appId}})}),
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
        AppCreationDialogRewireAPI.__Rewire__('UrlUtils', mockUrlUtils);

        spyOn(mockProps, 'hideAppCreationDialog');
        spyOn(mockProps, 'createApp').and.callThrough();
        spyOn(mockProps, 'createAppFailed').and.callThrough();
        spyOn(mockProps, 'toggleAppsList');
        spyOn(AppHistoryMock.history, 'push');
        spyOn(mockUrlUtils, 'getAppHomePageLink').and.returnValue(mockRoute);
        spyOn(mockNotificationManager, 'error');
    });

    afterEach(() => {
        AppCreationDialogRewireAPI.__ResetDependency__('AppCreationPanel');
        AppCreationDialogRewireAPI.__ResetDependency__('Promise');
        AppCreationDialogRewireAPI.__ResetDependency__('NotificationManager');
        AppCreationDialogRewireAPI.__ResetDependency__('AppHistory');
        AppCreationDialogRewireAPI.__ResetDependency__('mockUrlUtils');

        mockProps.createAppFailed.calls.reset();
        mockProps.toggleAppsList.calls.reset();

        // Remove modal from the dom after every test to reset
        let modalInDom = document.querySelector(qbModalClass);

        if (modalInDom) {
            modalInDom.parentNode.removeChild(modalInDom);
        }
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

    it('will create an app and reroute to app home page when onFinished is called', () => {
        component = shallow(<AppCreationDialog createApp={mockProps.createApp}
                                               toggleAppsList={mockProps.toggleAppsList}
                                               app={{}} />);

        instance = component.instance();
        instance.onFinished();

        expect(mockProps.createApp).toHaveBeenCalledWith({});
        expect(mockProps.toggleAppsList).toHaveBeenCalledWith(false);
        expect(mockUrlUtils.getAppHomePageLink).toHaveBeenCalledWith(appId);
        expect(AppHistoryMock.history.push).toHaveBeenCalledWith(mockRoute);
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

    it('will pass a false boolean to MultistepDialog if isValid returns true', () => {
        component = mount(<AppCreationDialog createApp={mockProps.createApp}
                                             app={null}
                                             pendingValidationError={'mockPendingValidationError'}
                                             appDialogOpen={true} />);

        let multiStepDialog = component.find("MultiStepDialog");

        expect(multiStepDialog).toHaveProp('canProceed', false);
    });

    it('will pass a true boolean to MultistepDialog if isValid returns false', () => {
        component = mount(<AppCreationDialog createApp={mockProps.createApp}
                                             app={null}
                                             pendingValidationError={null}
                                             appDialogOpen={true} />);

        let multiStepDialog = component.find("MultiStepDialog");

        expect(multiStepDialog).toHaveProp('canProceed', true);
    });
});
