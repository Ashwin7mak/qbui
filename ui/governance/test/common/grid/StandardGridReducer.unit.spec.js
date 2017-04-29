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

    it('should set items to empty', () => {
        const items = [{'firstName' :'test'}];
        const state = StandardGridReducer.grid(initialState, {items: items, type: StandardGridActionType.SET_ITEMS});
        expect(state.items).toEqual(items);
    });
});
