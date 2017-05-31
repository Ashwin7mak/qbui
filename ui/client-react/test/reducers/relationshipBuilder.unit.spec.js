import reducer, {__RewireAPI__ as ReducerRewireAPI} from '../../src/reducers/relationshipBuilder';
import * as types from '../../src/actions/types';


describe('RelationshipBuilder reducer functions', () => {


    describe('newFormFieldId state', () => {

        const actionPayload = {
            type: types.HIDE_RELATIONSHIP_DIALOG
        };

        it('returns a new state with newFormFieldId set to true', () => {
            expect(reducer({}, actionPayload)).toEqual({
                newFormFieldId: null
            });
        });
    });

    describe('draggingLinkToRecord state', () => {

        const startDraggingActionPayload = {
            type: types.DRAGGING_LINK_TO_RECORD,
            dragging: true
        };

        it('returns a new state with draggingLinkToRecord set to true', () => {
            expect(reducer({}, startDraggingActionPayload)).toEqual({
                draggingLinkToRecord: true,
            });
        });

        const endDraggingActionPayload = {
            type: types.DRAGGING_LINK_TO_RECORD,
            dragging: false
        };
        it('returns a new state with draggingLinkToRecord set to false', () => {
            expect(reducer({draggingLinkToRecord: true}, endDraggingActionPayload)).toEqual({
                draggingLinkToRecord: false
            });
        });
    });

});
