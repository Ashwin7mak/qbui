import React from 'react';
import {ReportSaveOrCancelFooter} from '../../../src/components/reportBuilder/reportSaveOrCancelFooter';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import SaveOrCancelFooter from '../../../src/components/saveOrCancelFooter/saveOrCancelFooter';
import {}

let component;

describe('Report Builder Save and Cancel Footer', () => {
    const props = {
        exitBuilderMode: (context) => {},
        closeFieldSelectMenu: (context) => {}
        saveReport: (appId, tblId, rptId, rptDef) => {}
    };

    beforeEach(() => {
        jasmineEnzyme();
        spyOn(props, 'exitBuilderMode').and.callThrough();
        spyOn(props, 'closeFieldSelectMenu').and.callThrough();
        spyOn(props, 'saveReport');
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
        expect(props.saveReport).toHaveBeenCalled();
        expect(props.exitBuilderMode).toHaveBeenCalled();
        expect(props.closeFieldSelectMenu).toHaveBeenCalled();
    });
});
