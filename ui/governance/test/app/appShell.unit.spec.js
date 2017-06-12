import React from "react";
import {shallow} from "enzyme";
import {GovernanceAppShell} from "../../src/app/GovernanceAppShell";
let component;
describe('<GovernanceAppShell />', () => {
    let props = {
        isNavOpen: true,
        isNavCollapsed: true,
        match: {params: {accountId: 1}}
    };

    it('renders the left nav and top nav components', () => {
        component = shallow(
            <GovernanceAppShell {...props} />
        );
        // Verify that the left and top nav are being rendered
        expect(component.find('Connect(GovernanceLeftNav)').length).toEqual(1);
        expect(component.find('TopNav').length).toEqual(1);
    });

    it('renders any subroutes correctly', () => {
        let testComponent = <h1>Hello World</h1>;
        let propsWithRoutes = {
            ...props,
            routes: [{
                path: '/hello/world',
                component: testComponent
            }]
        };
        component = shallow(<GovernanceAppShell {...propsWithRoutes} />);

        // Verify that subroutes are being rendered
        expect(component.find('RouteWithSubRoutes').props().component).toBe(testComponent);
        expect(component.find('RouteWithSubRoutes').props().path).toBe(propsWithRoutes.routes[0].path);

    });

    it('pushes the correct isNavOpen & isNavCollapsed props to the LeftNav', () => {
        component = shallow(<GovernanceAppShell {...props}/>);
        let leftNav = component.find('Connect(GovernanceLeftNav)');
        expect(leftNav.props().isNavCollapsed).toBe(props.isNavCollapsed);
        expect(leftNav.props().isNavOpen).toBe(props.isNavOpen);
    });
});
