import * as types from '../actions/types';

const relationshipBuilder = (state = [], action) => {
    // reducer - no mutations!
    switch (action.type) {

    case types.SHOW_RELATIONSHIP_DIALOG: {

        return {
            ...state,
            readyToShowRelationshipDialog: action.show
        };
    }

    case types.DRAGGING_LINK_TO_RECORD: {

        return {
            ...state,
            draggingLinkToRecord: action.dragging,
            readyToShowRelationshipDialog: (state.draggingLinkToRecord === true) && !action.dragging // show relationship dialogs waiting for drop
        };
    }

    default:
        // return existing state by default in redux
        return state;
    }
};

export default relationshipBuilder;

