import * as qbGridActions from '../../src/actions/qbGridActions';
import * as types from '../../src/actions/types';

const sourceLabel = 'source';

describe('QbGrid actions', () => {
    it('draggingColumnStart action dispatches types.DRAGGING_COLUMN_START with parameters', () => {
        const expectedAction = {
            type: types.DRAGGING_COLUMN_START,
            content: {sourceLabel}
        };
        expect(qbGridActions.draggingColumnStart(sourceLabel)).toEqual(expectedAction);
    });

    it('draggingColumnEnd action dispatches types.DRAGGING_COLUMN_END', () => {
        const expectedAction = {
            type: types.DRAGGING_COLUMN_END
        };
        expect(qbGridActions.draggingColumnEnd()).toEqual(expectedAction);
    });

});
