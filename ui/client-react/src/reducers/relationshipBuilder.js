import * as types from '../actions/types';

const relationshipBuilder = (state = [], action) => {
    // reducer - no mutations!

    switch (action.type) {


    case types.ADD_FIELD: {
        return {
            ...state,
            newFormFieldId: action.content.field.FormFieldElement.fieldId
        };
    }

    case types.HIDE_RELATIONSHIP_DIALOG: {

        return {
            ...state,
            newFormFieldId: null
        };
    }

    case types.DRAGGING_LINK_TO_RECORD: {

        return {
            ...state,
            draggingLinkToRecord: action.dragging,
        };
    }

    default:
        // return existing state by default in redux
        return state;
    }
};

export default relationshipBuilder;

export const getDroppedNewFormFieldId = (state) => {
    return state.relationshipBuilder.draggingLinkToRecord ? null : state.relationshipBuilder.newFormFieldId ;
};

