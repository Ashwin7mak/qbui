import * as types from '../actions/types';

export const draggingColumnStart = sourceLabel => {
    return {
        type: types.DRAGGING_COLUMN_START,
        content: {sourceLabel}
    };
};

export const draggingColumnEnd = () => {
    return {
        type: types.DRAGGING_COLUMN_END
    };
};
