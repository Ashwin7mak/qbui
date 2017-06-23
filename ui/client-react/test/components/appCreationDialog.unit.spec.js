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
    createApp() {},
    toggleAppsList() {}
};


const AppHistoryMock = {
    history: {push(_location) {}},
};

let mockThen = {
    then(_response) {
        mockActions.toggleAppsList();
        AppHistoryMock.history.push();
    }
};

describe('AppCreationDialog', () => {
    beforeEach(() => {
        AppCreationDialogRewireAPI.__Rewire__('AppCreationPanel', AppCreationPanel);
        spyOn(mockThen, 'then').and.callThrough();
        spyOn(mockActions, 'hideAppCreationDialog');
        spyOn(mockActions, 'createApp').and.returnValue(mockThen);
        spyOn(AppHistoryMock.history, 'push');
        spyOn(mockActions, 'toggleAppsList');
        jasmineEnzyme();
    });

    afterEach(() => {
        AppCreationDialogRewireAPI.__ResetDependency__('AppCreationPanel');
        mockActions.createApp.calls.reset();
        mockThen.then.calls.reset();
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

    it('will invoke createApp action when onFinished is called', (done) => {
        component = shallow(<AppCreationDialog createApp={mockActions.createApp}
                                               app={{}} />);

        instance = component.instance();
        instance.onFinished();

        expect(mockActions.createApp).toHaveBeenCalledWith({});
        expect(mockThen.then).toHaveBeenCalled();
        expect(AppHistoryMock.history.push).toHaveBeenCalled();
        expect(mockActions.toggleAppsList).toHaveBeenCalled();
        done();
    });

    it('will NOT invoke createApp action when onFinished is called if there are no new apps', () => {
        component = shallow(<AppCreationDialog createApp={mockActions.createApp}
                                               app={null} />);

        instance = component.instance();
        instance.onFinished();

        expect(mockActions.createApp).not.toHaveBeenCalled();
    });
});
