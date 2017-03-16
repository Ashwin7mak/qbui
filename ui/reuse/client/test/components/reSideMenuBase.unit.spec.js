import React from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import ReSideMenuBase, {__RewireAPI__ as ReSideMenuBaseRewireAPI} from '../../src/components/reSideMenu/reSideMenuBase';

const mockStoreActions = {onUpdateOpenState(isOpen) {return isOpen}};
const testSideMenuContent = <div className="testSideMenuContent">Test SideMenu Content</div>;
const testMainContent = <div className="testMainContent">Test Main Content</div>;
const requiredProps = {sideMenuContent: testSideMenuContent, onUpdateOpenState: mockStoreActions.onUpdateOpenState};

let component;

describe('ReSideMenuBase', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('can be moved the right side of the screen', () => {
        component = shallow(<ReSideMenuBase {...requiredProps} isOpen={true} isCollapsed={true} pullRight={true}/>);

        expect(component.find('.reSideMenuContent.sideMenuPullRight'));
        expect(component.find('.reSideMenuMain.sideMenuPullRight'));
    });

    it('can be collapsed (still visible but a smaller width)', () => {
        component = shallow(<ReSideMenuBase {...requiredProps} isOpen={true} isCollapsed={true}/>);

        expect(component.find('.reSideMenuBase.reSideMenuDocked')).toBePresent();
        expect(component.find('.reSideMenuBase.reSideMenuCollapsed')).toBePresent();
        expect(component.find('.reSideMenuContent.reSideMenuCollapsed')).toBePresent();
        expect(component.find('.reSideMenuMain.reSideMenuCollapsed')).toBePresent();
    });

    it('displays the sideMenuContent', () => {
        component = mount(<ReSideMenuBase {...requiredProps} isOpen={true} />);

        expect(component.find('.reSideMenuContent .testSideMenuContent')).toBePresent();
        expect(component.find('.reSideMenuContent .testMainContent')).not.toBePresent();
    });

    it('displays child elements in the main body of the page', () => {
        component = mount(<ReSideMenuBase {...requiredProps}>{testMainContent}</ReSideMenuBase>);

        expect(component.find('.reSideMenuMain .testMainContent')).toBePresent();
        expect(component.find('.reSideMenuMain .testSideMenuContent')).not.toBePresent();
    });

    describe('General, Medium, and Large Breakpoint', () => {
        beforeEach(() => {
            ReSideMenuBaseRewireAPI.__Rewire__('Breakpoints', {isSmallBreakpoint() {return false;}});
        });

        afterEach(() => {
            ReSideMenuBaseRewireAPI.__ResetDependency__('Breakpoints');
        });

        it('has a default state of docked', () => {
            component = mount(<ReSideMenuBase {...requiredProps} />);

            expect(component.find('.reSideMenuBase.reSideMenuDocked')).toBePresent();
            expect(component.find('.reSideMenuBase.reSideMenuCollapsed')).not.toBePresent();
        });

        it('can be forced to hide on larger breakpoints', () => {
            component = mount(<ReSideMenuBase {...requiredProps} isOpen={false} willDock={false} />);

            expect(component.find('.reSideMenuBase.reSideMenuDocked')).not.toBePresent();
            expect(component.find('.reSideMenuMain.reSideMenuOpen')).not.toBePresent();
        });
    });

    describe('Small Breakpoint', () => {
        beforeEach(() => {
            ReSideMenuBaseRewireAPI.__Rewire__('Breakpoints', {isSmallBreakpoint() {return true;}});
        });

        afterEach(() => {
            ReSideMenuBaseRewireAPI.__ResetDependency__('Breakpoints');
        });

        it('is not docked on small screens', () => {
            component = mount(<ReSideMenuBase {...requiredProps} isOpen={true} />);

            expect(component.find('.reSideMenuBase.reSideMenuDocked')).not.toBePresent();
            expect(component.find('.reSideMenuMain.reSideMenuOpen')).toBePresent();
        });

        it('can be hidden on small screens', () => {
            component = mount(<ReSideMenuBase {...requiredProps} isOpen={false} />);

            expect(component.find('.reSideMenuMain.reSideMenuOpen')).not.toBePresent();
        });
    });
});
