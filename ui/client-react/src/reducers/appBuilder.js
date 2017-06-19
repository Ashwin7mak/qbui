import * as types from '../actions/types';

const appBuilder = (state = {}, action) => {
    switch (action.type) {
    case types.SHOW_APP_CREATION_DIALOG:
        return {
            ...state,
            dialogOpen: true
        };

    case types.HIDE_APP_CREATION_DIALOG:
        return {
            ...state,
            dialogOpen: false
        };
    default:
        return state;
    }
};
export default appBuilder;
