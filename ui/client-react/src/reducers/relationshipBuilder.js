import * as types from '../actions/types';
import * as constants from '../../../common/src/constants';
import _ from 'lodash';

const relationshipBuilder = (
    state = {
        newRelationshipFieldIds: [],
        newFormFieldId: null
    }, action) => {
    // reducer - no mutations!

    switch (action.type) {


    case types.LOAD_FORM_SUCCESS: {
        return {
            newRelationshipFieldIds: [],
            newFormFieldId: null
        };
    }
    case types.ADD_FIELD: {

        const fieldType = _.get(action, "content.field.datatypeAttributes.type");
        const newFormFieldId = _.get(action, "content.field.id");
        if (fieldType === constants.LINK_TO_RECORD) {

            return {
                ...state,
                newRelationshipFieldIds: [...state.newRelationshipFieldIds, newFormFieldId],
                newFormFieldId
            };
        }
        return {
            ...state,
        };
    }

    case types.REMOVE_FIELD: {
        return {
            ...state,
            newRelationshipFieldIds: _.without(state.newRelationshipFieldIds, action.field.id),
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

