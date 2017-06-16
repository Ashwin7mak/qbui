import * as types from '../actions/types';
import _ from 'lodash';

const appBuilder = (
    // default state
    state = {
        app: null,
        apps: []
    },
    action) => {
    switch (action.type) {
    case types.SHOW_APP_CREATION_DIALOG:
        return {
            ...state,
            dialogOpen: true
        };
    default:
        return state;
    }
};
export default appBuilder;
