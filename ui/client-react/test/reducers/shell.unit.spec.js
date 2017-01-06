import reducer from '../../src/reducers/shell';
import * as types from '../../src/constants/actions';

describe('Nav reducer functions', () => {

    let initialState = {trowserOpen: false, trowserContent: null};

    it('returns correct initial state', () => {
        expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('returns correct state with trowser shown', () => {
        expect(reducer(initialState, {type: types.SHOW_TROWSER, content: 'someContent'})).toEqual({trowserOpen: true, trowserContent: 'someContent'});
    });

    let openState = {trowserOpen: true, trowserContent: 'someContent'};

    it('returns correct state with trowser hidden', () => {
        expect(reducer(openState, {type: types.HIDE_TROWSER})).toEqual({trowserOpen: false, trowserContent: 'someContent'});
    });
});
