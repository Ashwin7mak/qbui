import * as types from '../actions/types';

/**
 * Called at the start of a drag in QbGrid. Will update the QbCells under the sourceLabel so they show a dragging style.
 * @param sourceLabel
 * @returns {{type, content: {sourceLabel: *}}}
 */
export const draggingColumnStart = sourceLabel => {
    return {
        type: types.DRAGGING_COLUMN_START,
        content: {sourceLabel}
    };
};

/**
 * Called at the end of a drag in QbGrid. Resets the state so any dragging style disappears.
 * @returns {{type}}
 */
export const draggingColumnEnd = () => {
    return {
        type: types.DRAGGING_COLUMN_END
    };
};
