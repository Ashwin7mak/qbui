import React from 'react';
import {shallow, mount} from 'enzyme';
import {MemoryRouter} from 'react-router-dom';
import DrawerContainer from '../../../src/components/drawer/drawerContainer';

describe('Drawer Container functions ', () => {
    'use strict';

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
        let rootProps = {
            rootDrawer: true,
            closeDrawer: () => {
            },
            match: {
                url: "/qbase/app/app1/table/tbl1/report/rpt1/record/rcd1",
            }
        };
        let childProps = {
            rootDrawer: false,
            closeDrawer: () => {
            },
            match: {
                url: "/qbase/app/app1/table/tbl1/report/rpt2/record/rcd2",
            }
        };

        beforeEach(() => {
            spyOn(rootProps, 'closeDrawer');
            spyOn(childProps, 'closeDrawer');
        });

        afterEach(() => {
            if (rootProps.closeDrawer()) {
                rootProps.closeDrawer().calls.reset();
            }
            if (childProps.closeDrawer()) {
                childProps.closeDrawer().calls.reset();
            }
        });

        it('test render of drawer container, drawer and transition group', () => {
            // let parentRoute = mount(<DrawerContainer {...rootProps}/>);
            // let parentRouteContainer = parentRoute.find('Route');
            // expect(parentRouteContainer.length).toBe(1);
            // let parentDrawerContainer = parentRouteContainer.find('DrawerContainer');
            // expect(parentDrawerContainer.length).toBe(1);
            // let parentTransitionGroupContainer = parentDrawerContainer.find('ReactCSSTransitionGroup');
            // expect(parentTransitionGroupContainer.length).toBe(1);
            //
            // let childRoute = parentRoute.mount(<DrawerContainer {...childProps}/>);
            // let childRouteContainer = childRoute.find('Route');
            // expect(childRouteContainer.length).toBe(1);
            // let childDrawerContainer = childRouteContainer.find('DrawerContainer');
            // expect(childDrawerContainer.length).toBe(1);
            // let childTransitionGroupContainer = childDrawerContainer.find('ReactCSSTransitionGroup');
            // expect(childTransitionGroupContainer.length).toBe(1);
        });

        it('test that show drawer container function is invoked', () => {
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

    });

});
