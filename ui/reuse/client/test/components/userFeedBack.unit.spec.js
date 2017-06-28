import React from 'react';
import {mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import  UserFeedBack, {__RewireAPI__ as UserFeedBackRewireAPI}  from '../../src/components/topNav/supportingComponents/userFeedBack';

let component;
const mockI18nMessage = ({message}) => <div className="i18nMessage">{message}</div>;
const props = {startTabIndex: 4, shouldOpenMenusUp: false};

describe('UserFeedBack', () => {
    beforeEach(() => {
        jasmineEnzyme();
        UserFeedBackRewireAPI.__Rewire__('I18nMessage', mockI18nMessage);
        component = mount(<UserFeedBack {...props} />);
    });

    afterEach(() => {
        UserFeedBackRewireAPI.__ResetDependency__('I18nMessage');
    });

    it('Should have all the necessary mock up', () => {
        expect(component.find('.userFeedBack')).toBePresent();
        expect(component.find('.dropdownToggle')).toBePresent();
        expect(component.find('.iconUISturdy-feedback')).toBePresent();
        expect(component.find('.navLabel')).toBePresent();
        expect(component.find('.dropdown-menu')).toBePresent();
        expect(component.find('.dropdown-menu').children().length).toEqual(2);
    });
    it('Dropdown should open when dropdownToggle is clicked', () => {
        const userfeedBackDom =  component.find('.dropdownToggle');
        userfeedBackDom.simulate('click');
        expect(component.find('.userFeedBack').hasClass('open')).toEqual(true);
    });
    it('Dropdown should close when dropdownToggle is clicked', () => {
        const userfeedBackDom =  component.find('.dropdownToggle');
        userfeedBackDom.simulate('click');
        userfeedBackDom.simulate('click');
        expect(component.find('.userFeedBack').hasClass('open')).toEqual(false);
    });
});
