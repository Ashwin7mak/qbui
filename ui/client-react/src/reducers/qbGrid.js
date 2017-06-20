import * as types from '../actions/types';

const qbGrid = (
    state = {
        labelBeingDragged: '',
        isDragging: false
    }, action) => {

    switch (action.type) {
    case types.DRAGGING_COLUMN_START: {
        return {
            ...state,
            isDragging: true,
            labelBeingDragged: action.content.sourceLabel
        };
    }
    case types.DRAGGING_COLUMN_END: {
        return {
            ...state,
            isDragging: false,
            labelBeingDragged: ''
        };
    }
    default:
        // return existing state by default in redux
        return state;
    }
};

export default qbGrid;
