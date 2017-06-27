import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import NavHeader, {__RewireAPI__ as NavHeaderRewireAPI} from '../../src/components/navHeader/navHeader';
import Icon, {AVAILABLE_ICON_FONTS} from 'REUSE/components/icon/icon';
import Tooltip from 'REUSE/components/tooltip/tooltip';

let component;

const testTitle = "Everybody's working for the weekend";
const testIcon = "musicNote";

const BreakpointsMock = {isSmallBreakpoint() {}};
const MotionMock = ({defaultStyle, style, children}) => {
    console.log('CURRENT STYLE: ', style);
    return children(style);
};
const SpringMock = value => value;

describe('NavHeader', () => {
    beforeEach(() => {
        jasmineEnzyme();

        NavHeaderRewireAPI.__Rewire__('Breakpoints', BreakpointsMock);
        NavHeaderRewireAPI.__Rewire__('Motion', MotionMock);
        NavHeaderRewireAPI.__Rewire__('spring', SpringMock);
    });

    afterEach(() => {
        NavHeaderRewireAPI.__ResetDependency__('Breakpoints');
        NavHeaderRewireAPI.__ResetDependency__(MotionMock);
        NavHeaderRewireAPI.__ResetDependency__('spring');
    });

    it('displays a short bar with no content by default', () => {
        component = shallow(<NavHeader />);
        component = component.find(MotionMock).dive(); // Render the motion component so we can access the rendered subcomponents

        expect(component.find('.navHeaderTitle')).toHaveText('');
        expect(component.find('.navHeaderIcon')).not.toBePresent();
        expect(component.find('.navHeaderToggle')).not.toBePresent();
        expect(component.find('.navHeader')).toHaveProp('style', {height: 40});
    });

    it('shows a title', () => {
        component = shallow(<NavHeader title={testTitle} />);
        component = component.find(MotionMock).dive();

        expect(component.find('.navHeaderTitle')).toHaveText(testTitle);
        expect(component.find('.navHeaderHidden')).not.toBePresent();
        expect(component.find('.navHeaderCollapsed')).not.toBePresent();
    });

    it('shows the content of a long title in a tooltip', () => {
        const reallyLongTitle = "Everybody's working for the weekend Everybody's goin' off the deep end Everybody needs a second chance, oh";
        component = shallow(<NavHeader title={reallyLongTitle} />);
        component = component.find(MotionMock).dive();

        // The truncation in the visible title happens in CSS
        const tooltip = component.find(Tooltip);
        expect(tooltip).toBePresent();
        expect(tooltip.find('.navHeaderTitle')).toHaveText(reallyLongTitle);
    });

    it('shows the content of a long title in a tooltip on the small breakpoint', () => {
        // Switch to small breakpoint
        spyOn(BreakpointsMock, 'isSmallBreakpoint').and.returnValue(true);

        const reallyLongTitle = "Everybody's working for the weekend Everybody's goin' off the deep end Everybody needs a second chance, oh";
        component = shallow(<NavHeader title={reallyLongTitle} />);
        component = component.find(MotionMock).dive();

        // The truncation in the visible title happens in CSS
        const tooltip = component.find(Tooltip);
        expect(tooltip).toBePresent();
        expect(tooltip.find('.navHeaderTitle')).toHaveText(reallyLongTitle);
    });

    it('shows an icon', () => {
        component = shallow(<NavHeader title={testTitle} icon={testIcon} />);
        component = component.find(MotionMock).dive();

        expect(component.find('.navHeaderIcon').find(Icon)).toHaveProp('icon', testIcon);
    });

    it('shows icon from a different icon font', () => {
        const alternateFont = AVAILABLE_ICON_FONTS.TABLE_STURDY;
        component = shallow(<NavHeader title={testTitle} icon={testIcon} iconFont={alternateFont} />);
        component = component.find(MotionMock).dive();

        expect(component.find('.navHeaderIcon').find(Icon)).toHaveProp('iconFont', alternateFont);
    });

    it('hides the content of the menu header', () => {
        component = shallow(<NavHeader title={testTitle} icon={testIcon} isVisible={false} />);
        component = component.find(MotionMock).dive();

        expect(component.find('.navHeaderHidden')).toBePresent();
    });

    describe('optionally displays a toggle (in down position by default)', () => {
        it('shows a toggle icon', () => {
            component = shallow(<NavHeader title={testTitle} isToggleVisible={true} />);
            component = component.find(MotionMock).dive();

            expect(component.find('.navHeaderToggle')).toBePresent();
            expect(component.find('.menuToggleDown')).toBePresent();
        });

        it('displays the toggle in the up position', () => {
            component = shallow(<NavHeader title={testTitle} isToggleVisible={true} isToggleDown={false} />);
            component = component.find(MotionMock).dive();

            expect(component.find('.navHeaderToggle')).toBePresent();
            expect(component.find('.menuToggleDown')).not.toBePresent();
        });

        it('does not display the toggle when the menu header is collapsed', () => {
            component = shallow(<NavHeader title={testTitle} isToggleVisible={true} isCollapsed={true} />);
            component = component.find(MotionMock).dive();

            expect(component.find('.navHeaderToggle')).not.toBePresent();
        });
    });

    it('calls an action when clicked', () => {
        const onClickHeader = jasmine.createSpy('onClickHeader');
        component = shallow(<NavHeader title={testTitle} onClickHeader={onClickHeader} />);
        component = component.find(MotionMock).dive();

        component.find('.navHeaderButton').simulate('click');

        expect(onClickHeader).toHaveBeenCalled();
    });

    it('displays in a collapsed state', () => {
        component = shallow(<NavHeader title={testTitle} isCollapsed={true} />);
        component = component.find(MotionMock).dive();


        // Title is hidden via CSS
        expect(component.find('.navHeader')).toHaveProp('style', {height: 40});
    });

    it('displays as a large header', () => {
        component = shallow(<NavHeader title={testTitle} isSmall={false} />);
        component = component.find(MotionMock).dive();

        console.log(component.find('.navHeader').props().style);
        expect(component.find('.navHeader')).toHaveProp('style', {height: 90});
        expect(component.find('.navHeaderSmall')).not.toBePresent();
        expect(component.find('.navHeaderCollapsed')).not.toBePresent();
    });
});
