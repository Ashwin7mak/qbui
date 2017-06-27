import React from "react";
import {mount} from "enzyme";
import jasmineEnzyme from "jasmine-enzyme";
import * as AccountUsersActions from "../../../src/account/users/AccountUsersActions";
import StandardGridToolBar from "../../../src/common/grid/toolbar/StandardGridToolbar";
import StandardGridNavigation from "../../../src/common/grid/toolbar/StandardGridNavigation";
import StandardGridFacetsMenu from "../../../src/common/grid/toolbar/StandardGridFacetsMenu";
import StandardGridItemsCount from "../../../../reuse/client/src/components/itemsCount/StandardGridItemsCount";
import GenericFilterSearchBox from "../../../../reuse/client/src/components/facets/genericFilterSearchBox";
import {Provider} from "react-redux";
import configureMockStore from "redux-mock-store";

describe('StandardGridToolBar', () => {

    const mockStore = configureMockStore();
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('should hide facet component when shouldFacet is false', () => {

        let component = mount(
            <Provider store={mockStore({Grids : {accountUsers: {pagination: {totalItems: 1500, totalFilteredItems: 1500}, searchTerm: ""}}})}>
                <StandardGridToolBar
                    doUpdate={AccountUsersActions.doUpdateUsers}
                    id={"accountUsers"}
                    shouldFacet={false}
                    rowKey={"uid"}
                    itemTypePlural= "users"
                    itemTypeSingular="user"
                    itemsPerPage={500}
                />
            </Provider>);

        expect(component).toBeDefined();
        expect(component.length).toBeTruthy();

        let GenericFilterSearchBoxComponent = component.find(GenericFilterSearchBox);
        expect(GenericFilterSearchBoxComponent).toBePresent();


        // Facet Component should NOT be there
        let StandardGridFacetsMenuComponent = component.find(StandardGridFacetsMenu);
        expect(StandardGridFacetsMenuComponent).not.toBePresent();

        // ItemsCount Component should be there
        let StandardGridItemsCountComponent = component.find(StandardGridItemsCount);
        expect(StandardGridItemsCountComponent).toBePresent();


        // Navigation Component should be there
        let StandardGridNavigationComponent = component.find(StandardGridNavigation);
        expect(StandardGridNavigationComponent).toBePresent();
    });

    it('should hide search component when shouldSearch is false', () => {

        let component = mount(
            <Provider store={mockStore({Grids : {accountUsers: {pagination: {totalItems: 1500, totalFilteredItems: 1500}, searchTerm: ""}}})}>
                <StandardGridToolBar
                    doUpdate={AccountUsersActions.doUpdateUsers}
                    id={"accountUsers"}
                    shouldSearch={false}
                    rowKey={"uid"}
                    itemTypePlural= "users"
                    itemTypeSingular="user"
                    itemsPerPage={500}
                />
            </Provider>);

        expect(component).toBeDefined();
        expect(component.length).toBeTruthy();

        // SearchBox Component should NOT be there
        let GenericFilterSearchBoxComponent = component.find(GenericFilterSearchBox);
        expect(GenericFilterSearchBoxComponent).not.toBePresent();


        // Facet Component should NOT there
        let StandardGridFacetsMenuComponent = component.find(StandardGridFacetsMenu);
        expect(StandardGridFacetsMenuComponent).toBePresent();

        // ItemsCount Component should be there
        let StandardGridItemsCountComponent = component.find(StandardGridItemsCount);
        expect(StandardGridItemsCountComponent).toBePresent();


        // Navigation Component should be there
        let StandardGridNavigationComponent = component.find(StandardGridNavigation);
        expect(StandardGridNavigationComponent).toBePresent();
    });
});
