import React from "react";
import {mount} from "enzyme";
import jasmineEnzyme from "jasmine-enzyme";
import * as Actions from "../../../src/account/users/AccountUsersActions";
import StandardGridToolBar from "../../../src/common/grid/toolbar/StandardGridToolbar";
import StandardGridNavigation from "../../../src/common/grid/toolbar/StandardGridNavigation";
import StandardGridItemsCount from "../../../src/common/grid/toolbar/StandardGridItemsCount";
import GenericFilterSearchBox from "../../../../reuse/client/src/components/facets/genericFilterSearchBox";
import {Provider} from "react-redux";
import configureMockStore from "redux-mock-store";

describe('StandardGridToolBar', () => {

    const mockStore = configureMockStore();
    beforeEach(() => {
        jasmineEnzyme();
    });

    fit('should render with navigation, search and itemsCount component', () => {

        let mockSearchTerm = "test search";

        let component = mount(
            <Provider store={mockStore({Grids : {accountUsers: {pagination: {totalItems: 1500}, searchTerm: mockSearchTerm}}})}>
                <StandardGridToolBar
                    doUpdate={Actions.doUpdate}
                    doFacet={false}
                    id={"accountUsers"}
                    rowKey={"uid"}
                    itemTypePlural= "users"
                    itemTypeSingular="user"
                    numberOfItemsPerPage={500}
                />
            </Provider>);

        expect(component).toBeDefined();
        expect(component.length).toBeTruthy();

        let StandardGridNavigationComponent = component.find(StandardGridNavigation);
        expect(StandardGridNavigationComponent).toBeDefined();
        expect(StandardGridNavigationComponent.length).toBeTruthy();
        expect(StandardGridNavigationComponent.props().id).toEqual("accountUsers");

        let StandardGridSearchComponent = component.find(GenericFilterSearchBox);
        expect(StandardGridSearchComponent).toBeDefined();
        expect(StandardGridSearchComponent.length).toBeTruthy();
        expect(StandardGridSearchComponent.props().placeholder).toEqual("Search users");
        expect(StandardGridSearchComponent).toHaveProp('searchTerm', mockSearchTerm);

        expect(component.find(StandardGridItemsCount)).toBePresent();
    });

    it('should not render with navigation but render with search and itemsCount component', () => {

        let mockSearchTerm = "test search";

        let component = mount(
            <Provider store={mockStore({Grids : {accountUsers: {pagination: {totalItems: 20}, searchTerm: mockSearchTerm}}})}>
                <StandardGridToolBar
                    doUpdate={Actions.doUpdate}
                    doFacet={false}
                    id={"accountUsers"}
                    rowKey={"uid"}
                    itemTypePlural= "users"
                    itemTypeSingular="user"
                    numberOfItemsPerPage={20}
                />
            </Provider>);

        expect(component).toBeDefined();
        expect(component.length).toBeTruthy();

        let StandardGridNavigationComponent = component.find(StandardGridNavigation);
        expect(StandardGridNavigationComponent).not.toBePresent();

        let StandardGridSearchComponent = component.find(GenericFilterSearchBox);
        expect(StandardGridSearchComponent).toBeDefined();
        expect(StandardGridSearchComponent.length).toBeTruthy();
        expect(StandardGridSearchComponent.props().placeholder).toEqual("Search users");
        expect(StandardGridSearchComponent).toHaveProp('searchTerm', mockSearchTerm);

        expect(component.find(StandardGridItemsCount)).toBePresent();
    });
});
