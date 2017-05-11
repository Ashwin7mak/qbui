import React from 'react';
import {ReportSaveOrCancelFooter} from '../../../src/components/reportBuilder/reportSaveOrCancelFooter';
import TestUtils from 'react-addons-test-utils';
import {shallow} from 'enzyme';
import SaveOrCancelFooter from '../../../src/components/saveOrCancelFooter/saveOrCancelFooter';

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
        component =  shallow(<ReportSaveOrCancelFooter {...props} />);
        component.instance().onCancel();
        expect(props.exitBuilderMode).toHaveBeenCalled();
        expect(props.closeFieldSelectMenu).toHaveBeenCalled();
    });

    it('save and cancel button are present', () => {
        let component2 = TestUtils.renderIntoDocument(<ReportSaveOrCancelFooter {...props} />);

        expect(TestUtils.isElementOfType(component2, 'saveOrCancelFooter').toBeTruthy);
        let saveOrCancelFooter = TestUtils.scryRenderedDOMComponentsWithTag(component, "saveOrCancelFooter");
    })
});
