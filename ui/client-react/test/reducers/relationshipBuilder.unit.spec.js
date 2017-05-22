import reducer, {__RewireAPI__ as ReducerRewireAPI} from '../../src/reducers/relationshipBuilder';
import * as types from '../../src/actions/types';


describe('RelationshipBuilder reducer functions', () => {


    describe('readyToShowRelationshipDialog state', () => {

        const actionPayload = {
            type: types.SHOW_RELATIONSHIP_DIALOG,
            show: true
        };

        it('returns a new state with readyToShowRelationshipDialog set to true', () => {
            expect(reducer({}, actionPayload)).toEqual({
                readyToShowRelationshipDialog: true
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
                readyToShowRelationshipDialog: false
            });
        });

        const endDraggingActionPayload = {
            type: types.DRAGGING_LINK_TO_RECORD,
            dragging: false
        };
        it('returns a new state with draggingLinkToRecord set to false', () => {
            expect(reducer({draggingLinkToRecord: true}, endDraggingActionPayload)).toEqual({
                draggingLinkToRecord: false,
                readyToShowRelationshipDialog: true
            });
        });
    });

});
