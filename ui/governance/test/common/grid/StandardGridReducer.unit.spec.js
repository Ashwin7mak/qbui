import * as StandardGridReducer from "../../../src/common/grid/standardGridReducer";
import * as StandardGridActionType from "../../../src/common/grid/standardGridActionTypes";

describe('StandardGridReducer', () => {
    const initialState = {
        items: [],
        sortFids: [],
        pagination: {totalItems:0, totalFilteredItems: 0, totalPages: 0, currentPage: 1, itemsPerPage: 10},
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

    it('should set page offset when current page is last page', () => {
        const init = {...initialState, items: [{'firstName':'test'}], pagination: {totalPages: 1, currentPage: 1}};
        const state = StandardGridReducer.grid(init,
            {offset: 1, type: StandardGridActionType.SET_CURRENTPAGE_OFFSET});
        expect(state).toEqual(init);
    });

    it('should set page offset to previous', () => {
        const init = {...initialState, items: [{'firstName':'test'}], pagination: {totalPages: 2, currentPage: 2}};
        const state = StandardGridReducer.grid(init,
            {offset: -1, type: StandardGridActionType.SET_CURRENTPAGE_OFFSET});
        expect(state.pagination.currentPage).toEqual(1);
    });

    it('should set page offset to next', () => {
        const init = {...initialState, items: [{'firstName':'test'}], pagination: {totalPages: 2, currentPage: 1}};
        const state = StandardGridReducer.grid(init,
            {offset: 1, type: StandardGridActionType.SET_CURRENTPAGE_OFFSET});
        expect(state.pagination.currentPage).toEqual(2);
    });

    it('should set pagination state', () => {
        const pagination = {pagination: {totalFilteredItems: 10, totalPages: 10, currentPage: 1, itemsPerPage: 10}};
        const state = StandardGridReducer.grid(initialState,
            {pagination: pagination, type: StandardGridActionType.SET_PAGINATION});
        expect(state.pagination).toEqual({...initialState.pagination, ...pagination});
    });

    it('should set total records state', () => {
        const state = StandardGridReducer.grid(initialState,
            {totalItems: 10, type: StandardGridActionType.SET_TOTAL_ITEMS});
        expect(state.pagination).toEqual({...initialState.pagination, totalItems:10});
    });

    it('should set facet selection state', () => {
        const facetSelections = {'0' : 1};
        const state = StandardGridReducer.grid(initialState,
            {facetSelections: facetSelections, type: StandardGridActionType.SET_FACET_SELECTIONS});
        expect(state.facets.facetSelections).toEqual(facetSelections);
    });

    it('should set sort asc', () => {
        const state = StandardGridReducer.grid(initialState,
            {sortFid: [1], asc: true, type: StandardGridActionType.SET_SORT});
        expect(state.sortFids).toEqual([1]);
    });

    it('should set sort desc', () => {
        const state = StandardGridReducer.grid(initialState,
            {sortFid: [1], asc: false, type: StandardGridActionType.SET_SORT});
        expect(state.sortFids).toEqual([-1]);
    });

    it('should remove sort', () => {
        const state = StandardGridReducer.grid(initialState,
            {sortFid: [1], remove: true, type: StandardGridActionType.SET_SORT});
        expect(state.sortFids).toEqual([]);
    });
});
