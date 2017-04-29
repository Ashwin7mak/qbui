import * as StandardGridReducer from '../../../src/common/grid/standardGridReducer';
import * as StandardGridActionType from "../../../src/common/grid/standardGridActionTypes";

describe('StandardGridReducer', () => {
    const initialState = {
        items: [],
        sortFids: [],
        pagination: {totalRecords: 0, totalPages: 0, currentPage: 1, itemsPerPage: 10},
        searchTerm : ""
    };

    it('should set items to empty', () => {
        const state = StandardGridReducer.grid(initialState, {items: [], type: StandardGridActionType.SET_ITEMS});
        expect(state.items).toEqual([]);
    });

    it('should set items', () => {
        const items = [{'firstName' :'test'}];
        const state = StandardGridReducer.grid(initialState, {items: items, type: StandardGridActionType.SET_ITEMS});
        expect(state.items).toEqual(items);
    });

    it('should set search term', () => {
        const searchTerm = "searchTerm";
        const state = StandardGridReducer.grid(initialState, {searchTerm: searchTerm, type: StandardGridActionType.SET_SEARCH});
        expect(state.searchTerm).toEqual(searchTerm);
    });

    it('should set page offset when items are empty', () => {
        const state = StandardGridReducer.grid(initialState,
            {offset: 1, type: StandardGridActionType.SET_CURRENTPAGE_OFFSET});
        expect(state).toEqual(initialState);
    });

    it('should not set page offset when current page is first page', () => {
        const init = {...initialState, items: [{'firstName':'test'}], pagination: {totalPages: 1, currentPage: 1}};
        const state = StandardGridReducer.grid(init,
            {offset: -1, type: StandardGridActionType.SET_CURRENTPAGE_OFFSET});
        expect(state).toEqual(init);
    });

    // it('should set page offset when current page is last page', () => {
    //     const state = StandardGridReducer.grid({...initialState, pagination: {totalPages: 1, currentPage: 1}},
    //         {offset: 1, type: StandardGridActionType.SET_CURRENTPAGE_OFFSET});
    //     expect(state).toEqual(initialState);
    // });
    //
    // it('should set page offset to next', () => {
    //     const state = StandardGridReducer.grid({...initialState, pagination: {totalPages: 2, currentPage: 1}},
    //         {offset: 1, type: StandardGridActionType.SET_CURRENTPAGE_OFFSET});
    //     expect(state.pagination.currentPage).toEqual(2);
    // });
    //
    // it('should set page offset to previous', () => {
    //     const state = StandardGridReducer.grid({...initialState, pagination: {totalPages: 2, currentPage: 2}},
    //         {offset: -1, type: StandardGridActionType.SET_CURRENTPAGE_OFFSET});
    //     expect(state.pagination.currentPage).toEqual(1);
    // });
    //
    // it('should set pagination state', () => {
    //     const pagination = {pagination: {totalRecords: 0, totalPages: 0, currentPage: 1, itemsPerPage: 10}};
    //     const state = StandardGridReducer.grid(initialState,
    //         {pagination: pagination, type: StandardGridActionType.SET_PAGINATION});
    //     expect(state.pagination).toEqual(pagination);
    // });
});
