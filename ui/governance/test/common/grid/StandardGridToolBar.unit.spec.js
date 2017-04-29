import React from "react";
import {mount} from "enzyme";
import jasmineEnzyme from "jasmine-enzyme";
import * as Actions from "../../../src/account/users/AccountUsersActions";
import StandardGridToolBar from "../../../src/common/grid/toolbar/StandardGridToolbar";
import StandardGridNavigation from "../../../src/common/grid/toolbar/StandardGridNavigation";
import {Provider} from "react-redux";
import configureMockStore from "redux-mock-store";

describe('StandardGridToolBar', () => {

    const mockStore = configureMockStore();
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('should render with navigation component and search component', () => {

        let component = mount(
            <Provider store={mockStore({Grids : 1})}>
                <StandardGridToolBar
                    doUpdate={Actions.doUpdate}
                    id={"accountUsers"}
                    rowKey={"uid"}
                />
            </Provider>);

        expect(component).toBeDefined();
        expect(component.length).toBeTruthy();

        let StandardGridNavigationComponent = component .find(StandardGridNavigation);
        expect(StandardGridNavigationComponent).toBeDefined();
        expect(StandardGridNavigationComponent.length).toBeTruthy();
        expect(StandardGridNavigationComponent.props().id).toEqual("accountUsers");

        let StandardGridSearchComponent = component.find("input");
        expect(StandardGridSearchComponent.props().placeholder).toEqual("Search users");
        expect(StandardGridSearchComponent).toBeDefined();
        expect(StandardGridSearchComponent.length).toBeTruthy();

    });
});


