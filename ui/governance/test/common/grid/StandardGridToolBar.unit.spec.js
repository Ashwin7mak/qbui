import React from "react";
import {mount} from "enzyme";
import jasmineEnzyme from "jasmine-enzyme";
import * as AccountUsersActions from "../../../src/account/users/AccountUsersActions";
import StandardGridToolBar from "../../../src/common/grid/toolbar/StandardGridToolbar";
import StandardGridNavigation from "../../../src/common/grid/toolbar/StandardGridNavigation";
import StandardGridItemsCount from "../../../../reuse/client/src/components/itemsCount/StandardGridItemsCount";
import GenericFilterSearchBox from "../../../../reuse/client/src/components/facets/genericFilterSearchBox";
import {Provider} from "react-redux";
import configureMockStore from "redux-mock-store";

describe('StandardGridToolBar', () => {

    const mockStore = configureMockStore();
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('should render with navigation, search and itemsCount component', () => {

        let mockSearchTerm = "test search";

        let component = mount(
            <Provider store={mockStore({Grids : {accountUsers: {pagination: {totalItems: 1500}, searchTerm: mockSearchTerm}}})}>
                <StandardGridToolBar
                    doUpdate={AccountUsersActions.doUpdateUsers}
                    id={"accountUsers"}
                    rowKey={"uid"}
                    itemTypePlural= "users"
                    itemTypeSingular="user"
                    itemsPerPage={500}
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

    it('should render the search and itemsCount component but not the navigation component', () => {

        let mockSearchTerm = "test search";

        let component = mount(
            <Provider store={mockStore({Grids : {accountUsers: {pagination: {totalItems: 20}, searchTerm: mockSearchTerm}}})}>
                <StandardGridToolBar
                    doUpdate={AccountUsersActions.doUpdateUsers}
                    doFacet={false}
                    id={"accountUsers"}
                    rowKey={"uid"}
                    itemTypePlural= "users"
                    itemTypeSingular="user"
                    itemsPerPage={20}
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

    it('should render with search component but not the navigation and itemsCount component', () => {

        let mockSearchTerm = "test search";

        let component = mount(
            <Provider store={mockStore({Grids : {accountUsers: {pagination: {totalItems: 0}, searchTerm: mockSearchTerm}}})}>
                <StandardGridToolBar
                    doUpdate={AccountUsersActions.doUpdate}
                    doFacet={false}
                    id={"accountUsers"}
                    rowKey={"uid"}
                    itemTypePlural= "users"
                    itemTypeSingular="user"
                    itemsPerPage={0}
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

        expect(component.find(StandardGridItemsCount)).not.toBePresent();
    });
});
