import * as types from '../actions/types';
import _ from 'lodash';
import Locale from '../locales/locales';

const defaultAppIcon = 'Customer';
const APP_PROPS = ['name', 'icon', 'description'];
const VALIDATION_ERROR_AND_IS_EDITED = ['pendingValidationError', 'validationError', 'isEdited'];

const setDefaultSettings = {
    isAppIconChooserOpen: false,
    isDialogOpen: false,
    isSavingApp: false,
    description: '',
    icon: defaultAppIcon,
    name: {
        value: '',
        pendingValidationError: Locale.getMessage('appCreation.validateAppNameEmpty')
    },
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
        let appInfo = {};

        if (action.property === 'name') {
            appInfo[action.property] = {
                value: action.value,
                pendingValidationError: action.pendingValidationError,
                validationError: action.validationError,
                isEdited: true
            };
        } else {
            appInfo[action.property] = action.value;
        }
        return {
            ...state,
            ...appInfo
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

export const getValidationErrorAndIsEdited = (state) => _.pick(state.appBuilder.name, VALIDATION_ERROR_AND_IS_EDITED);

export const getAppProperties = (state) => {
    let {name, icon, description} =  _.pick(state.appBuilder, APP_PROPS);

    return {
        name: name ? name.value : undefined,
        icon,
        description
    };
};

export const getNewAppInfo = (state) => {
    let {name, icon, description} = getAppProperties(state);

    if (name) {
        return {
            name,
            icon,
            description
        };
    }
    return null;
};
