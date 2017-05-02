import React from "react";
import jasmineEnzyme from "jasmine-enzyme";
import {StandardGridNavigation} from "../../../src/common/grid/toolbar/StandardGridNavigation";
import {shallow} from "enzyme";
import Pagination from "../../../../reuse/client/src/components/pagination/pagination";

describe('StandardGridNavigation', () => {

    beforeEach(() => {
        jasmineEnzyme();
    });


    const basePageInfo = {
        currentPage: 1,
        firstRecordInCurrentPage: 1,
        lastRecordInCurrentPage: 10,
        totalPages: 1,
        totalRecords: 10,
        itemsPerPage: 10
    };


    it('should render', () => {
        let getPreviousUsersPage = () => {
        };
        let getNextUsersPage = () => {
        };
        let StandardGridNavigationComponent = shallow(
            <StandardGridNavigation getPreviousUsersPage={getPreviousUsersPage}
                                    getNextUsersPage={getNextUsersPage}
                                    id={"accountUsers"}
                                    paginationInfo={basePageInfo}/>);

        expect(StandardGridNavigationComponent).toBeDefined();
        expect(StandardGridNavigationComponent.length).toBeTruthy();

        let StandardGridPagination = StandardGridNavigationComponent.find(Pagination);
        expect(StandardGridPagination).toBeDefined();
        expect(StandardGridPagination.length).toBeTruthy();
        expect(StandardGridPagination.props().onClickPrevious).toEqual(getPreviousUsersPage);
        expect(StandardGridPagination.props().onClickNext).toEqual(getNextUsersPage);
    });

    it('should set the start and end records appropriately', () => {
        let paginationInfo =
            {
                ...basePageInfo,
                firstRecordInCurrentPage: 10,
                lastRecordInCurrentPage: 20
            };

        let StandardGridNavigationComponent = shallow(
            <StandardGridNavigation getPreviousUsersPage={() => {}}
                                    getNextUsersPage={() => {}}
                                    id={"accountUsers"}
                                    paginationInfo={paginationInfo}/>);

        expect(StandardGridNavigationComponent.props().startRecord).toEqual(paginationInfo.firstRecordInCurrentPage);
        expect(StandardGridNavigationComponent.props().endRecord).toEqual(paginationInfo.lastRecordInCurrentPage);
    });

    describe('Previous Disabled', () => {

        it('should set previous disabled when total records is 0', () => {
            let paginationInfo =
                {
                    ...basePageInfo,
                    totalRecords: 0
                };

            let StandardGridNavigationComponent = shallow(
                <StandardGridNavigation getPreviousUsersPage={() => {}}
                                        getNextUsersPage={() => {}}
                                        id={"accountUsers"}
                                        paginationInfo={paginationInfo}/>);

            expect(StandardGridNavigationComponent.props().isPreviousDisabled).toEqual(true);
        });


        it('should set previous disabled when current page is 1', () => {
            let paginationInfo =
                {
                    ...basePageInfo,
                    currentPage: 1
                };

            let StandardGridNavigationComponent = shallow(
                <StandardGridNavigation getPreviousUsersPage={() => {}}
                                        getNextUsersPage={() => {}}
                                        id={"accountUsers"}
                                        paginationInfo={paginationInfo}/>);

            expect(StandardGridNavigationComponent.props().isPreviousDisabled).toEqual(true);
        });

        it('should not disable when current page is not 1 and has totalRecords > 0', () => {
            let paginationInfo =
                {
                    ...basePageInfo,
                    currentPage: 2,
                    totalRecords: 10
                };

            let StandardGridNavigationComponent = shallow(
                <StandardGridNavigation getPreviousUsersPage={() => {}}
                                        getNextUsersPage={() => {}}
                                        id={"accountUsers"}
                                        paginationInfo={paginationInfo}/>);

            expect(StandardGridNavigationComponent.props().isPreviousDisabled).toEqual(false);
        });
    });

    describe('Next Disabled', () => {

        it('should set next disabled when total records is 0', () => {
            let paginationInfo =
                {
                    ...basePageInfo,
                    totalRecords: 0
                };

            let StandardGridNavigationComponent = shallow(
                <StandardGridNavigation getPreviousUsersPage={() => {}}
                                        getNextUsersPage={() => {}}
                                        id={"accountUsers"}
                                        paginationInfo={paginationInfo}/>);

            expect(StandardGridNavigationComponent.props().isNextDisabled).toEqual(true);
        });


        it('should set next disabled when current page is 1', () => {
            let paginationInfo =
                {
                    ...basePageInfo,
                    currentPage: 10,
                    totalPages : 10
                };

            let StandardGridNavigationComponent = shallow(
                <StandardGridNavigation getPreviousUsersPage={() => {}}
                                        getNextUsersPage={() => {}}
                                        id={"accountUsers"}
                                        paginationInfo={paginationInfo}/>);

            expect(StandardGridNavigationComponent.props().isNextDisabled).toEqual(true);
        });

        it('should not disable when current page is not 1 and has totalRecords > 0', () => {
            let paginationInfo =
                {
                    ...basePageInfo,
                    currentPage: 2,
                    totalPages: 3
                };

            let StandardGridNavigationComponent = shallow(
                <StandardGridNavigation getPreviousUsersPage={() => {}}
                                        getNextUsersPage={() => {}}
                                        id={"accountUsers"}
                                        paginationInfo={paginationInfo}/>);

            expect(StandardGridNavigationComponent.props().isNextDisabled).toEqual(false);
        });
    });
});


