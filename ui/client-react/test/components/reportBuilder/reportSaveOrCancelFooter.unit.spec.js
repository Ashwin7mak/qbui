import React from 'react';
import {ReportSaveOrCancelFooter} from '../../../src/components/reportBuilder/reportSaveOrCancelFooter';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import SaveOrCancelFooter from '../../../src/components/saveOrCancelFooter/saveOrCancelFooter';
import NavigationUtils from '../../../src/utils/navigationUtils';

let component;
const appId = 1;
const tblId = 2;
const previousLocation = '/somewhere/over/the/rainbow';

describe('Report Builder Save and Cancel Footer', () => {
    const props = {
        appId: appId,
        tblId: tblId,
        redirectRoute: previousLocation,
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
        spyOn(NavigationUtils, 'goBackToLocationOrTable');

        component = mount(<ReportSaveOrCancelFooter {...props} />);

        let cancelButton = component.find('.alternativeTrowserFooterButton');
        cancelButton.simulate('click');
        expect(props.exitBuilderMode).toHaveBeenCalled();
        expect(NavigationUtils.goBackToLocationOrTable).toHaveBeenCalledWith(appId, tblId, previousLocation);
    });

    it('save and cancel button are present', () => {
        component = shallow(<ReportSaveOrCancelFooter {...props} />);
        let saveOrCancelFooter = component.find(SaveOrCancelFooter);
        expect(saveOrCancelFooter).toBePresent();
    });
});
