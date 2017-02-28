import reducer from '../../src/reducers/featureSwitches';
import * as types from '../../src/actions/types';

let initialState = {};

function initializeState() {
    initialState = {
        switches: [],
        overrides: [],
        states: []
    };
}

beforeEach(() => {
    initializeState();
});

describe('Test initial state of feature switches reducer', () => {
    it('return correct initial state', () => {
        expect(reducer(undefined, {})).toEqual(initialState);
    });
});

