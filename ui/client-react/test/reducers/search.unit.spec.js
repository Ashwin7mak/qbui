import reducer from '../../src/reducers/search';
import * as types from '../../src/actions/types';

let initialState = {};

function initializeState() {
    initialState = {
        searchInput: ''
    };
}

beforeEach(() => {
    initializeState();
});

describe('Test search reducer', () => {
    it('return default state', () => {
        expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('return search input string', () => {
        const searchInput = '12345';
        const state = reducer(initialState, {type: types.SEARCH_INPUT, content: searchInput});
        expect(state.searchInput).toEqual(searchInput);
    });
});

