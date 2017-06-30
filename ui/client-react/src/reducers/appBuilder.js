import * as types from '../actions/types';
import _ from 'lodash';

const defaultAppIcon = 'Customer';

const setDefaultSettings = {
    name: '',
    description: '',
    icon: defaultAppIcon,
    isAppIconChooserOpen: false,
    isDialogOpen: false,
    isSavingApp: false
};

const appBuilder = (
    //  default states
    state = {
        ...setDefaultSettings
    },
    action) => {
    // reducer - no mutations!
    switch (action.type) {

    case types.CREATE_APP:
        return {
            ...state,
            isSavingApp: true
        };

    case types.CREATE_APP_SUCCESS:
        return {
            ...state,
            ...setDefaultSettings,
            isSavingApp: false,
        };

    case types.CREATE_APP_FAILED:
        return {
            //  TODO: depending on XD design, should the error condition be added to state or is the promise reject enough
            ...state,
            isSavingApp: false
        };

    case types.SHOW_APP_CREATION_DIALOG:
        return {
            ...state,
            isDialogOpen: true
        };

    case types.HIDE_APP_CREATION_DIALOG:
        return {
            ...state,
            ...setDefaultSettings
        };

    case types.SET_APP_PROPERTY:
        return {
            ...state,
            [action.property]: action.value
        };

    case types.OPEN_ICON_CHOOSER_FOR_APP:
        return {
            ...state,
            isAppIconChooserOpen: true
        };

    case types.CLOSE_ICON_CHOOSER_FOR_APP:
        return {
            ...state,
            isAppIconChooserOpen: false
        };
    default:
        return state;
    }
};

export default appBuilder;

export const getIsDialogOpenState = (state) => _.get(state.appBuilder, 'isDialogOpen', false);

export const isAppIconChooserOpen = (state) => _.get(state.appBuilder, 'isAppIconChooserOpen', false);

export const getAppProperty = (state, property) => _.get(state.appBuilder, property, '');

export const getNewAppInfo = (state) => {
    let name = getAppProperty(state, 'name');

    if (name.length > 0) {
        return {
            name,
            icon: getAppProperty(state, 'icon'),
            description: getAppProperty(state, 'description')
        };
    }
    return null;
};
