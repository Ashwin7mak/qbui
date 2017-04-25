import React from 'react';
import {shallow, mount} from 'enzyme';
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
                path: "/qbase/app/:appId/table/:tblId/(report)?/:rptId?/record/:recordId",
                url: "/qbase/app/app1/table/tbl1/report/rpt1/record/rcd1",
                isExact: false,
            }
        };

        beforeEach(() => {
            spyOn(props, 'closeDrawer');
        });

        afterEach(() => {
            if (props.closeDrawer()) {
                props.closeDrawer().calls.reset();
            }
        });

        it('test render of drawer container, drawer and transition group', () => {
            let routeDiv = mount(<MemoryRouter><DrawerContainer {...props}/></MemoryRouter>);
            let drawerContainerWrapper = routeDiv.find('DrawerContainer');
            expect(drawerContainerWrapper.length).toBe(1);
            let transitionGroupContainer = drawerContainerWrapper.find('ReactCSSTransitionGroup');
            expect(transitionGroupContainer.length).toBe(1);
        });

        it('test that container calls getDrawer function when route match occurs', () => {
            // blah
        });


        it('test that container render results in showDrawerContainer function being invoked', () => {
            // let routeDiv = mount(<MemoryRouter><DrawerContainer {...props}/></MemoryRouter>);
            // let drawerContainerWrapper = routeDiv.find('DrawerContainer');
            // expect(drawerContainerWrapper.length).toBe(1);
            // spyOn(drawerContainerWrapper.node, 'getDrawer');
            // expect(drawerContainerWrapper.node.getDrawer).toHaveBeenCalled();
            // // drawerContainerWrapper.node.showDrawerContainer().calls.reset();
        });

        it('test that hideDrawerContainer function is invoked when contained drawer is unmounted', () => {
            // let routeDiv = mount(<MemoryRouter><DrawerContainer {...props}/></MemoryRouter>);
            // let drawerContainerWrapper = routeDiv.find('DrawerContainer');
            // drawerContainerWrapper.unmount();
            // expect(drawerContainerWrapper.hideDrawerContainer).toHaveBeenCalled();
        });


        it('test that closeDrawer function is invoked', () => {
            // let routeDiv = mount(<MemoryRouter><DrawerContainer {...props}/></MemoryRouter>);
            // let drawerContainerWrapper = routeDiv.find('DrawerContainer');
            // drawerContainerWrapper.unmount();
            // expect(props.closeDrawer).toHaveBeenCalled();
        });

    });

    describe('Non-root drawer', () => {
        let childProps = {
            rootDrawer: false,
            closeDrawer: () => {
            },
            match: {
                url: "/qbase/app/app1/table/tbl1/report/rpt2/record/rcd2",
            }
        };
        let matchedChildProps = {
            rootDrawer: false,
            closeDrawer: () => {
            },
            match: {
                url: "/qbase/app/app1/table/tbl1/report/rpt2/record/rcd2",
            }
        };

        ///sr_app_app2_table_tbl2_report_rpt2_record_rcd2
        //path: "/qbase/app/:appId/table/:tblId/(report)?/:rptId?/record/:recordId",

        it('renders Route, DrawerContainer and TransitionGroup', () => {
            let childRoute = mount(<MemoryRouter><DrawerContainer {...childProps}/></MemoryRouter>);
            let childRouteContainer = childRoute.find('Route');
            expect(childRouteContainer.length).toBe(1);
            let childDrawerContainer = childRoute.find('DrawerContainer');
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

        it('test that drawer container is rendered when a match occurs', () => {
            let childRoute = mount(
                <MemoryRouter initialEntries={["/qbase/app/app1/table/tbl1/report/rpt2/record/rcd2/sr_app_app2_table_tbl2_report_rpt2_record_rcd2"]}>
                    <DrawerContainer {...matchedChildProps}/>
                </MemoryRouter>);
            let drawer = childRoute.find('.drawer');
            expect(drawer.length).toBe(1);
        });

        it('test that drawer container is not rendered when a match does not occur', () => {
            // let parentRoute = mount(<DrawerContainer {...rootProps}/>);
            // let childRoute = parentRoute.mount(<DrawerContainer {...childProps}/>);
            // let childRouteContainer = childRoute.find('Route');
            // let childDrawerContainer = childRouteContainer.find('DrawerContainer');
            // expect(childDrawerContainer.showDrawerContainer).toHaveBeenCalled();
        });

        it('test that hide drawer container function is invoked', () => {
            // let parentRoute = mount(<DrawerContainer {...rootProps}/>);
            // let childRoute = parentRoute.mount(<DrawerContainer {...childProps}/>);
            // let childRouteContainer = childRoute.find('Route');
            // let childDrawerContainer = childRouteContainer.find('DrawerContainer');
            // childDrawerContainer.unmount();
            // expect(childDrawerContainer.hideDrawerContainer).toHaveBeenCalled();
        });


        it('test that close drawer function is invoked', () => {
            // let parentRoute = mount(<DrawerContainer {...rootProps}/>);
            // let childRoute = parentRoute.mount(<DrawerContainer {...childProps}/>);
            // let childRouteContainer = childRoute.find('Route');
            // let childDrawerContainer = childRouteContainer.find('DrawerContainer');
            // childDrawerContainer.unmount();
            // expect(childProps.closeDrawer).toHaveBeenCalled();
        });

        xit('test render of drawer container, drawer and transition group', () => {
            let routeDiv = mount(<MemoryRouter><DrawerContainer {...props}/></MemoryRouter>);
            let drawerContainerWrapper = routeDiv.find('DrawerContainer');
            expect(drawerContainerWrapper.length).toBe(1);
            let transitionGroupContainer = drawerContainerWrapper.find('ReactCSSTransitionGroup');
            expect(transitionGroupContainer.length).toBe(1);
        });

        it('test that container calls getDrawer function when route match occurs', () => {
            // blah
        });


        it('test that container render results in showDrawerContainer function being invoked', () => {
            // let routeDiv = mount(<MemoryRouter><DrawerContainer {...props}/></MemoryRouter>);
            // let drawerContainerWrapper = routeDiv.find('DrawerContainer');
            // expect(drawerContainerWrapper.length).toBe(1);
            // spyOn(drawerContainerWrapper.node, 'getDrawer');
            // expect(drawerContainerWrapper.node.getDrawer).toHaveBeenCalled();
            // // drawerContainerWrapper.node.showDrawerContainer().calls.reset();
        });

        it('test that hideDrawerContainer function is invoked when contained drawer is unmounted', () => {
            // let routeDiv = mount(<MemoryRouter><DrawerContainer {...props}/></MemoryRouter>);
            // let drawerContainerWrapper = routeDiv.find('DrawerContainer');
            // drawerContainerWrapper.unmount();
            // expect(drawerContainerWrapper.hideDrawerContainer).toHaveBeenCalled();
        });


        it('test that closeDrawer function is invoked', () => {
            // let routeDiv = mount(<MemoryRouter><DrawerContainer {...props}/></MemoryRouter>);
            // let drawerContainerWrapper = routeDiv.find('DrawerContainer');
            // drawerContainerWrapper.unmount();
            // expect(props.closeDrawer).toHaveBeenCalled();
        });

    });

});
