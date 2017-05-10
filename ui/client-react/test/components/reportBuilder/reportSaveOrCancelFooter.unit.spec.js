import React from 'react';
import {ReportSaveOrCancelFooter} from '../../../src/components/reportBuilder/reportSaveOrCancelFooter';
import {shallow} from 'enzyme';

describe('Report Builder Save and Cancel Footer', () => {
    let component
    const props = {
        exitBuilderMode: (context) => {},
        closeFieldSelectMenu: (context) => {}
    };

    beforeEach(() => {
        spyOn(props, 'exitBuilderMode').and.callThrough();
        spyOn(props, 'closeFieldSelectMenu').and.callThrough();
    });

    afterEach(() => {
        props.exitBuilderMode.calls.reset();
        props.closeFieldSelectMenu.calls.reset();
    });

    it('exits report builder onCancel', () => {
        component = shallow(<ReportSaveOrCancelFooter {...props} />);
        component.instance().onCancel();
        expect(props.exitBuilderMode).toHaveBeenCalled();
        expect(props.closeFieldSelectMenu).toHaveBeenCalled();
    });

    it('save report builder onClickSave', () => {

    })
});
