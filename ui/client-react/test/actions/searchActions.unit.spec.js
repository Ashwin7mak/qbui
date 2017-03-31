import * as searchActions from '../../src/actions/searchActions';
import * as types from '../../src/actions/types';

describe('Search actions', () => {
    it('should create an action to clear search input', () => {
        let content = 'inputContent';
        expect(searchActions.searchInput(content)).toEqual({type: types.SEARCH_INPUT, content});
    });
    it('should create an action to set search input', () => {
        expect(searchActions.clearSearchInput()).toEqual({type: types.SEARCH_INPUT, content: ''});
    });
});
