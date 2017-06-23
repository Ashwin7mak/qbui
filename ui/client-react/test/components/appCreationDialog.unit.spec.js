import React from 'react';
import jasmineEnzyme from 'jasmine-enzyme';
import {shallow} from 'enzyme';
import {AppCreationDialog, __RewireAPI__ as AppCreationDialogRewireAPI} from '../../src/components/app/appCreationDialog';
import {AppCreationPanel} from '../../src/components/app/appCreationPanel';
import MultiStepDialog from '../../../reuse/client/src/components/multiStepDialog/multiStepDialog';

let component;
let instance;

const mockPromiseAll = {
    all: () => ({then: callback => callback()})
};

const mockNotificationManager = {
    error() {}
};

const AppHistoryMock = {
    history: {push(_location) {}},
};


let createProps = () => ({
    createApp:  () => ({then: callback => callback({data: {id: 'mockAppId'}})}),
    createAppFailed:  () => ({then: (callbackSuccess, callBackFailed) => callBackFailed()}),
    hideAppCreationDialog() {},
    toggleAppsList() {}
});

let props;

describe('AppCreationDialog', () => {
    beforeEach(() => {
        jasmineEnzyme();

        props = createProps();

        AppCreationDialogRewireAPI.__Rewire__('AppCreationPanel', AppCreationPanel);
        AppCreationDialogRewireAPI.__Rewire__('Promise', mockPromiseAll);
        AppCreationDialogRewireAPI.__Rewire__('NotificationManager', mockNotificationManager);
        AppCreationDialogRewireAPI.__Rewire__('AppHistory', AppHistoryMock);

        spyOn(props, 'hideAppCreationDialog');
        spyOn(props, 'createApp').and.callThrough();
        spyOn(props, 'createAppFailed').and.callThrough();
        spyOn(props, 'toggleAppsList');
        spyOn(AppHistoryMock.history, 'push');
    });

    afterEach(() => {
        AppCreationDialogRewireAPI.__ResetDependency__('AppCreationPanel');
        AppCreationDialogRewireAPI.__ResetDependency__('Promise');
        AppCreationDialogRewireAPI.__ResetDependency__('NotificationManager');
    });

    it('renders an AppCreationDialog', () => {
        component = shallow(<AppCreationDialog />);

        expect(component).toBePresent();
        expect(component.find(MultiStepDialog).length).toEqual(1);
    });

    it('will invoke hideAppCreationDialog action when onCancel is called', () => {
        component = shallow(<AppCreationDialog hideAppCreationDialog={props.hideAppCreationDialog} />);

        instance = component.instance();
        instance.onCancel();

        expect(props.hideAppCreationDialog).toHaveBeenCalled();
    });

    it('will invoke createApp action when onFinished is called', () => {
        component = shallow(<AppCreationDialog createApp={props.createApp}
                                               toggleAppsList={props.toggleAppsList}
                                               app={{}} />);

        instance = component.instance();
        instance.onFinished();

        expect(props.createApp).toHaveBeenCalledWith({});
        expect(props.toggleAppsList).toHaveBeenCalledWith(false);
        expect(AppHistoryMock.history.push).toHaveBeenCalledWith(jasmine.any(String));
    });

    it('will invoke createApp action when onFinished is called', () => {
        component = shallow(<AppCreationDialog createApp={props.createAppFailed}
                                               toggleAppsList={props.toggleAppsList}
                                               app={{}} />);

        instance = component.instance();
        instance.onFinished();

        expect(props.createApp).not.toHaveBeenCalled();
        expect(props.toggleAppsList).not.toHaveBeenCalled();
        expect(AppHistoryMock.history.push).not.toHaveBeenCalled();
    });

    it('will NOT invoke createApp action when onFinished is called if there are no new apps', () => {
        component = shallow(<AppCreationDialog createApp={props.createApp}
                                               app={null} />);

        instance = component.instance();
        instance.onFinished();

        expect(props.createApp).not.toHaveBeenCalled();
    });
});
