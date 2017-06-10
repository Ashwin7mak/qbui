import {hideRelationshipDialog, draggingLinkToRecord} from '../../src/actions/relationshipBuilderActions';
import * as types from '../../src/actions/types';

describe('relationshipBuilder Actions', () => {

    describe('hideRelationshipDialog', () => {
        it('creates an action that updates hideRelationshipDialog state to true', () => {
            expect(hideRelationshipDialog(true)).toEqual({
                type: types.HIDE_RELATIONSHIP_DIALOG
            });
        });
    });

    describe('draggingLinkToRecord', () => {
        it('creates an action that updates draggingLinkToRecord state to true', () => {
            expect(draggingLinkToRecord(true)).toEqual({
                type: types.DRAGGING_LINK_TO_RECORD,
                dragging: true});
        });
    });
});
