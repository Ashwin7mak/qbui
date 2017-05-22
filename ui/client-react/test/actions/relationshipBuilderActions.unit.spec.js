import {showRelationshipDialog, draggingLinkToRecord} from '../../src/actions/relationshipBuilderActions';
import * as types from '../../src/actions/types';

describe('relationshipBuilder Actions', () => {

    describe('showRelationshipDialog', () => {
        it('creates an action that updates showRelationshipDialog state to true', () => {
            expect(showRelationshipDialog(true)).toEqual({
                type: types.SHOW_RELATIONSHIP_DIALOG,
                show: true});
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
