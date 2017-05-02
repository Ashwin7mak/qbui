import React from "react";
import jasmineEnzyme from "jasmine-enzyme";
import {StandardGridNavigation} from "../../../src/common/grid/toolbar/StandardGridNavigation";
import {mount, shallow} from "enzyme";
import Pagination from "../../../../reuse/client/src/components/pagination/pagination";

describe('StandardGridNavigation', () => {

    let StandardGridNavigationComponent;
    let getPreviousUsersPage;
    let getNextUsersPage;

    beforeEach(() => {
        jasmineEnzyme();

        getPreviousUsersPage = () => {
        };
        getNextUsersPage = () => {
        };
        const paginationInfo = {currentPage: 1, totalPages: 10, totalRecords: 10, itemsPerPage: 10};


        StandardGridNavigationComponent = shallow(
            <StandardGridNavigation getPreviousUsersPage={getPreviousUsersPage}
                                    getNextUsersPage={getNextUsersPage}
                                    id={"accountUsers"}
                                    paginationInfo ={paginationInfo}/>);
    });


    it('should render', () => {
        expect(StandardGridNavigationComponent).toBeDefined();
        expect(StandardGridNavigationComponent.length).toBeTruthy();

        let StandardGridPagination = StandardGridNavigationComponent.find(Pagination);
        expect(StandardGridPagination).toBeDefined();
        expect(StandardGridPagination.length).toBeTruthy();
        expect(StandardGridPagination.props().onClickPrevious).toEqual(getPreviousUsersPage);
        expect(StandardGridPagination.props().onClickNext).toEqual(getNextUsersPage);
    });
});


