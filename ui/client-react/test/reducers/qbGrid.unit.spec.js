import reducer from '../../src/reducers/qbGrid';
import * as types from '../../src/actions/types';

let initialState = {};

const sourceLabel = 'source';

function initializeState() {
    initialState = {
        labelBeingDragged: '',
        isDragging: false
    };
}

beforeEach(() => {
    initializeState();
});

describe('Test initial state of reportBuilder reducer', () => {
    it('return correct initial state', () => {
        expect(reducer(undefined, {})).toEqual(initialState);
    });
});

describe('reportBuilder reducer', () => {
    it('DRAGGING_COLUMN_START sets labelBeingDragged to the source label', () => {
        const state = reducer(initialState, {type: types.DRAGGING_COLUMN_START, content: {sourceLabel}});
        expect(state.labelBeingDragged).toEqual(sourceLabel);
        expect(state.isDragging).toBeTruthy();
    });

    it('DRAGGING_COLUMN_END resets labelBeingDragged to an empty string', () => {
        const state = reducer(initialState, {type: types.DRAGGING_COLUMN_END});
        expect(state.labelBeingDragged).toEqual('');
        expect(state.isDragging).toBeFalsy();
    });
});
