import React from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import SideMenuBase, {__RewireAPI__ as SideMenuBaseRewireAPI} from '../../src/components/sideMenuBase/sideMenuBase';

const mockStoreActions = {onUpdateOpenState(isOpen) {return isOpen;}};
const testSideMenuContent = <div className="testSideMenuContent">Test SideMenu Content</div>;
const testMainContent = <div className="testMainContent">Test Main Content</div>;
const requiredProps = {sideMenuContent: testSideMenuContent, onUpdateOpenState: mockStoreActions.onUpdateOpenState};

let component;

describe('SideMenuBase', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('can be moved the right side of the screen', () => {
        component = shallow(<SideMenuBase {...requiredProps} isOpen={true} isCollapsed={true} pullRight={true}/>);

        expect(component.find('.sideMenuContent.sideMenuPullRight'));
        expect(component.find('.sideMenuMain.sideMenuPullRight'));
    });

    it('can be collapsed (still visible but a smaller width)', () => {
        component = shallow(<SideMenuBase {...requiredProps} isOpen={true} isCollapsed={true}/>);

        expect(component.find('.sideMenuBase.sideMenuDocked')).toBePresent();
        expect(component.find('.sideMenuBase.sideMenuCollapsed')).toBePresent();
        expect(component.find('.sideMenuContent.sideMenuCollapsed')).toBePresent();
        expect(component.find('.sideMenuMain.sideMenuCollapsed')).toBePresent();
    });

    it('displays the sideMenuContent', () => {
        component = mount(<SideMenuBase {...requiredProps} isOpen={true} />);

        expect(component.find('.sideMenuContent .testSideMenuContent')).toBePresent();
        expect(component.find('.sideMenuContent .testMainContent')).not.toBePresent();
    });

    it('displays child elements in the main body of the page', () => {
        component = mount(<SideMenuBase {...requiredProps}>{testMainContent}</SideMenuBase>);

        expect(component.find('.sideMenuMain .testMainContent')).toBePresent();
        expect(component.find('.sideMenuMain .testSideMenuContent')).not.toBePresent();
    });

    describe('General, Medium, and Large Breakpoint', () => {
        beforeEach(() => {
            SideMenuBaseRewireAPI.__Rewire__('Breakpoints', {isSmallBreakpoint() {return false;}});
        });

        afterEach(() => {
            SideMenuBaseRewireAPI.__ResetDependency__('Breakpoints');
        });

        it('has a default state of docked', () => {
            component = mount(<SideMenuBase {...requiredProps} />);

            expect(component.find('.sideMenuBase.sideMenuDocked')).toBePresent();
            expect(component.find('.sideMenuBase.sideMenuCollapsed')).not.toBePresent();
        });

        it('can be forced to hide on larger breakpoints', () => {
            component = mount(<SideMenuBase {...requiredProps} isOpen={false} willDock={false} />);

            expect(component.find('.sideMenuBase.sideMenuDocked')).not.toBePresent();
            expect(component.find('.sideMenuMain.sideMenuOpen')).not.toBePresent();
        });
    });

    describe('Small Breakpoint', () => {
        beforeEach(() => {
            SideMenuBaseRewireAPI.__Rewire__('Breakpoints', {isSmallBreakpoint() {return true;}});
        });

        afterEach(() => {
            SideMenuBaseRewireAPI.__ResetDependency__('Breakpoints');
        });

        it('is not docked on small screens', () => {
            component = mount(<SideMenuBase {...requiredProps} isOpen={true} />);

            expect(component.find('.sideMenuBase.sideMenuDocked')).not.toBePresent();
            expect(component.find('.sideMenuMain.sideMenuOpen')).toBePresent();
        });

        it('can be hidden on small screens', () => {
            component = mount(<SideMenuBase {...requiredProps} isOpen={false} />);

            expect(component.find('.sideMenuMain.sideMenuOpen')).not.toBePresent();
        });
    });
});
