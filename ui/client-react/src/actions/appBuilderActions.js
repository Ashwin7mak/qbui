import * as types from '../actions/types';

/**
 * Construct apps store redux store payload
 *
 * @param type - event type
 * @param content - optional content related to event type
 * @returns {{id: *, type: *, content: *}}
 */
function event(type, content) {
    return {
        type: type,
        content: content || null
    };
}

export const showAppCreationDialog = () => {
    return event(types.SHOW_APP_CREATION_DIALOG);
};
