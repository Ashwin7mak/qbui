import React from 'react';
import {ReportSaveOrCancelFooter} from '../../../src/components/reportBuilder/reportSaveOrCancelFooter';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import SaveOrCancelFooter from '../../../src/components/saveOrCancelFooter/saveOrCancelFooter';

let component;

describe('Report Builder Save and Cancel Footer', () => {
    const props = {
        exitBuilderMode: (context) => {},
        closeFieldSelectMenu: (context) => {}
    };

    beforeEach(() => {
        jasmineEnzyme();
        spyOn(props, 'exitBuilderMode').and.callThrough();
        spyOn(props, 'closeFieldSelectMenu').and.callThrough();
    });

    afterEach(() => {
        props.exitBuilderMode.calls.reset();
        props.closeFieldSelectMenu.calls.reset();
    });

    it('exits report builder onCancel', () => {
        component =  shallow(<ReportSaveOrCancelFooter {...props} />);
        component.instance().onCancel();
        expect(props.exitBuilderMode).toHaveBeenCalled();
        expect(props.closeFieldSelectMenu).toHaveBeenCalled();
    });

    it('save and cancel button are present', () => {
        let saveOrCancelFooter = component.find(SaveOrCancelFooter);
        expect(saveOrCancelFooter).toBePresent();
    });
});
