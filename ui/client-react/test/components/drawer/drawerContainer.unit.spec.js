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

    describe('Root drawer', () => {
        let props = {
            rootDrawer: true,
            closeDrawer: () => {},
            match: {
                url: "/qbase/app/app1/table/tbl1/report/rpt1/record/rcd1",
                isExact: false,
            }
        };

        beforeEach(() => {
            spyOn(props, 'closeDrawer');
        });

        it('test render of drawer container, drawer and transition group', () => {
            let routeDiv = mount(<MemoryRouter><DrawerContainer {...props}/></MemoryRouter>);
            let drawerContainerWrapper = routeDiv.find('DrawerContainer');
            expect(drawerContainerWrapper.length).toBe(1);
            let transitionGroupContainer = drawerContainerWrapper.find('ReactCSSTransitionGroup');
            expect(transitionGroupContainer.length).toBe(1);
        });

        it('test that container renders a drawer when route match occurs', () => {
            let routeDiv = mount(<MemoryRouter initialEntries={["/qbase/app/app1/table/tbl1/report/rpt1/record/rcd1/sr_app_app1_table_tbl1_report_rpt2_record_rcd2"]}>
                                        <DrawerContainer {...props}/>
                                    </MemoryRouter>);
            let drawerContainerWrapper = routeDiv.find('DrawerContainer');
            expect(drawerContainerWrapper.length).toBe(1);
            let drawerWrapper = drawerContainerWrapper.find('Drawer');
            expect(drawerWrapper.length).toBe(1);
        });

        it('test that container does not render a drawer when path does not match', () => {
            let routeDiv = mount(<MemoryRouter initialEntries={["/qbase/app/app1/table/tbl1/report/rpt1/records"]}>
                <DrawerContainer {...props}/>
            </MemoryRouter>);
            let drawerContainerWrapper = routeDiv.find('DrawerContainer');
            expect(drawerContainerWrapper.length).toBe(1);
            let drawerWrapper = drawerContainerWrapper.find('Drawer');
            expect(drawerWrapper.length).toBe(0);
        });

        it('test that container render results in showDrawerContainer function being invoked', () => {
            let routeDiv = mount(<MemoryRouter initialEntries={["/qbase/app/app1/table/tbl1/report/rpt1/record/rcd1/sr_app_app1_table_tbl1_report_rpt2_record_rcd2"]}>
                <DrawerContainer {...props}/>
            </MemoryRouter>);
            let drawerContainerWrapper = routeDiv.find('DrawerContainer');
            expect(drawerContainerWrapper.length).toBe(1);
            expect(drawerContainerWrapper.node.state.visible).toBeTruthy();
        });
    });


});
