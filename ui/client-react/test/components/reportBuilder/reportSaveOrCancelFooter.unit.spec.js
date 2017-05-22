import React from 'react';
import {ReportSaveOrCancelFooter} from '../../../src/components/reportBuilder/reportSaveOrCancelFooter';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import SaveOrCancelFooter from '../../../src/components/saveOrCancelFooter/saveOrCancelFooter';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

let component;

describe('Report Builder Save and Cancel Footer', () => {
    const props = {
        exitBuilderMode: (context) => {},
        closeFieldSelectMenu: (context) => {},
        saveReport: (appId, tblId, rptId, rptDef) => {},
        appId: '1',
        tblId: '2',
        rptId: '3',
        rptData: {
            data: {
                name: 'test report',
                fids: [1, 2, 3]
            }
        }
    };

    // we mock the Redux store when testing async action creators
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);


    beforeEach(() => {
        jasmineEnzyme();
        spyOn(props, 'exitBuilderMode').and.callThrough();
        spyOn(props, 'closeFieldSelectMenu').and.callThrough();
        spyOn(props, 'saveReport').and.callThrough();
    });

    afterEach(() => {
        props.exitBuilderMode.calls.reset();
        props.closeFieldSelectMenu.calls.reset();
    });

    it('exits report builder onCancel', () => {
        component = mount(<ReportSaveOrCancelFooter {...props} />);

        let cancelButton = component.find('.alternativeTrowserFooterButton');
        cancelButton.simulate('click');
        expect(props.exitBuilderMode).toHaveBeenCalled();
        expect(props.closeFieldSelectMenu).toHaveBeenCalled();
    });

    it('save and cancel button are present', () => {
        component = shallow(<ReportSaveOrCancelFooter {...props} />);
        let saveOrCancelFooter = component.find(SaveOrCancelFooter);
        expect(saveOrCancelFooter).toBePresent();
    });

    it('save button functionality', () => {
        component = mount(<ReportSaveOrCancelFooter {...props} />);

        let saveButton = component.find('.mainTrowserFooterButton');
        saveButton.simulate('click');

        // TypeError: 'undefined' is not an object (evaluating '_this.props.rptData.data')
        // How to evaluate an object in my test
        // Not passing in object, just confirming that action has been called
        // Do I need to create example object

        expect(props.saveReport).toHaveBeenCalled();
        expect(props.exitBuilderMode).toHaveBeenCalled();
        expect(props.closeFieldSelectMenu).toHaveBeenCalled();
    });
});
