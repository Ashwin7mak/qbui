import * as types from '../actions/types';

/**
 * show (or hide) the relationship dialog (parent table picker)
 * this should be set when the drop has occurred or it is simply clicked (no drag)
 * @param show link to record field should display its initial table picker dialog
 * @returns {{type, show: boolean}}
 */
export const hideRelationshipDialog = () => {
    return {
        type: types.HIDE_RELATIONSHIP_DIALOG
    };
};

/**
 * set dragging state of a link-to-record field
 * @param dragging
 * @returns {{type, dragging: boolean}}
 */
export const draggingLinkToRecord = (dragging = true) => {
    return {
        type: types.DRAGGING_LINK_TO_RECORD,
        dragging
    };
};
