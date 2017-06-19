import * as types from '../actions/types';

const qbGrid = (
    state = {
        collapsedGroups: [],
        labelBeingDragged: '',
        isDragging: false
    }, action) => {

    switch (action.type) {
    case types.DRAGGING_COLUMN_START: {
        return {
            ...state,
            isDragging: true,
            labelBeingDragged: action.content.sourceLabel
        }
    }
    case types.DRAGGING_COLUMN_END: {
        return {
            ...state,
            isDragging: false,
            labelBeingDragged: ''
        }
    }
    case types.SET_COLLAPSED_GROUPS: {
        return {
            ...state,
            collapsedGroups: action.content.collapsedGroups
        }
    }
    default:
        // return existing state by default in redux
        return state;
    }
};

export default qbGrid;
