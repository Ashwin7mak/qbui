import React from 'react';
import {mount} from 'enzyme';
import {MemoryRouter, Route} from 'react-router-dom';
import DrawerContainer, {
    __RewireAPI__ as DrawerContainerRewireAPI
} from '../../../src/components/drawer/drawerContainer';

describe('Drawer Container functions ', () => {
    'use strict';

    const mockRecordroute = (props) => <div className="mockRecordRoute"/>;

    beforeEach(() => {
        DrawerContainerRewireAPI.__Rewire__('RecordRouteWithUniqueId', mockRecordroute);
    });

    afterEach(() => {
        DrawerContainerRewireAPI.__ResetDependency__('RecordRouteWithUniqueId');
    });

    describe('Root Drawer Container', () => {
        let props = {
            rootDrawer: true,
            closeDrawer: () => {},
            match: {
                url: "/qbase/app/app1/table/tbl1/report/rpt1/record/rcd1",
                isExact: false,
            }
        };
        const matchedUrl = "/qbase/app/app1/table/tbl1/report/rpt1/record/rcd1/sr_app_app1_table_tbl1_report_rpt2_record_rcd2";

        beforeEach(() => {
            spyOn(props, 'closeDrawer');
        });

        it('renders drawer container, drawer and transition group', () => {
            let routeDiv = mount(<MemoryRouter><DrawerContainer {...props}/></MemoryRouter>);
            let drawerContainerWrapper = routeDiv.find('DrawerContainer');
            expect(drawerContainerWrapper.length).toBe(1);
            let transitionGroupContainer = drawerContainerWrapper.find('ReactCSSTransitionGroup');
            expect(transitionGroupContainer.length).toBe(1);
        });

        it('renders a backdrop when route match occurs', () => {
            let routeDiv = mount(
                <MemoryRouter initialEntries={[matchedUrl]}>
                    <DrawerContainer {...props}/>
                </MemoryRouter>);
            let backdrop = routeDiv.find('.closeHandleBackdrop');
            expect(backdrop.length).toBe(1);
        });

        it('does not render a backdrop when path does not match', () => {
            let routeDiv = mount(
                <MemoryRouter>
                    <DrawerContainer {...props}/>
                </MemoryRouter>);
            let backdrop = routeDiv.find('.closeHandleBackdrop');
            expect(backdrop.length).toBe(0);
        });

        it('renders a drawer when route match occurs', () => {
            let routeDiv = mount(<MemoryRouter initialEntries={[matchedUrl]}>
                <DrawerContainer {...props}/>
            </MemoryRouter>);
            let drawerContainerWrapper = routeDiv.find('DrawerContainer');
            expect(drawerContainerWrapper.length).toBe(1);
            let drawerWrapper = drawerContainerWrapper.find('Drawer');
            expect(drawerWrapper.length).toBe(1);
        });

        it('does not render a drawer when path does not match', () => {
            let routeDiv = mount(<MemoryRouter initialEntries={["/qbase/app/app1/table/tbl1/report/rpt1/records"]}>
                <DrawerContainer {...props}/>
            </MemoryRouter>);
            let drawerContainerWrapper = routeDiv.find('DrawerContainer');
            expect(drawerContainerWrapper.length).toBe(1);
            let drawerWrapper = drawerContainerWrapper.find('Drawer');
            expect(drawerWrapper.length).toBe(0);
        });

        it('renders results in showDrawerContainer function being invoked', () => {
            let routeDiv = mount(<MemoryRouter initialEntries={[matchedUrl]}>
                <DrawerContainer {...props}/>
            </MemoryRouter>);
            let drawerContainerWrapper = routeDiv.find('DrawerContainer');
            expect(drawerContainerWrapper.length).toBe(1);
            expect(drawerContainerWrapper.node.state.visible).toBeTruthy();
        });
    });

    describe('Non-root Drawer Container', () => {
        let childProps = {
            rootDrawer: false,
            closeDrawer: () => {
            },
            match: {
                url: "/qbase/app/app1/table/tbl1/report/rpt2/record/rcd2",
            }
        };

        const matchedUrl = "/qbase/app/app1/table/tbl1/report/rpt2/record/rcd2/sr_app_app2_table_tbl2_report_rpt2_record_rcd2";
        it('renders Route, DrawerContainer and TransitionGroup', () => {
            let childRoute = mount(<MemoryRouter><DrawerContainer {...childProps}/></MemoryRouter>);
            let childRouteContainer = childRoute.find('Route');
            expect(childRouteContainer.length).toBe(1);
            let childDrawerContainer = childRoute.find('.drawerContainer');
            expect(childDrawerContainer.length).toBe(1);
            let childTransitionGroupContainer = childRoute.find('ReactCSSTransitionGroup');
            expect(childTransitionGroupContainer.length).toBe(1);
        });

        it('does not render backdrop', () => {
            // only the root drawer should render a backdrop
            let childRoute = mount(<MemoryRouter><DrawerContainer {...childProps}/></MemoryRouter>);
            let backdrop = childRoute.find('.closeHandleBackdrop');
            expect(backdrop.length).toBe(0);
        });

        it('renders when a url match occurs', () => {
            let childRoute = mount(
                <MemoryRouter initialEntries={[matchedUrl]}>
                    <DrawerContainer {...childProps}/>
                </MemoryRouter>);
            let drawer = childRoute.find('.drawer');
            expect(drawer.length).toBe(1);
        });

        it('does not render when a url match does not occur', () => {
            let childRoute = mount(
                <MemoryRouter>
                    <DrawerContainer {...childProps}/>
                </MemoryRouter>);
            let drawer = childRoute.find('.drawer');
            expect(drawer.length).toBe(0);
        });
    });
});
