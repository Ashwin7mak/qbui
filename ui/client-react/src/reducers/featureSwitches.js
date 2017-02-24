import * as types from '../actions/types';
import _ from 'lodash';

const featureSwitches = (
    state = {
        //  default states
        switches: [],
        overrides: [],
        states: [],
    },
    action) => {

    // reducer - no mutations!
    switch (action.type) {
    case types.SET_FEATURE_SWITCHES:
        return {
            ...state,
            switches: action.switches
        };

    case types.CREATED_FEATURE_SWITCH: {

        let newSwitch = {...action.feature, overrides: []};
        return {
            ...state,
            switches: [...state.switches, newSwitch]
        };
    }

    case types.FEATURE_SWITCHES_DELETED: {
        return {
            ...state,
            switches: state.switches.filter(fs => action.ids.indexOf(fs.id) === -1)
        };
    }

    case types.EDIT_FEATURE_SWITCH: {
        const switches = [...state.switches];
        const switchToEdit = switches.find(item => item.id === action.id);
        switchToEdit.editing = action.column;
        return {
            ...state,
            switches
        };
    }

    case types.FEATURE_SWITCH_UPDATED: {
        const switches = [...state.switches];
        const switchToConfirmEdit = switches.find(item => item.id === action.id);
        delete switchToConfirmEdit.editing;
        switchToConfirmEdit[action.property] = action.value;

        return {
            ...state,
            switches
        };
    }

    // overrides
    case types.SELECT_FEATURE_SWITCH_OVERRIDES: {
        const currentSwitch = state.switches.find(item => item.id === action.id);
        return {
            ...state,
            overrides: currentSwitch && currentSwitch.overrides ? [...currentSwitch.overrides] : []
        };
    }

    case types.EDIT_OVERRIDE: {
        const overrides = [...state.overrides];
        const overrideToEdit = overrides.find(item => item.id === action.id);
        overrideToEdit.editing = action.column;
        return {
            ...state,
            overrides
        };
    }
    case types.OVERRIDE_UPDATED: {
        const overrides = [...state.overrides];
        const overrideToConfirmEdit = overrides.find(item => item.id === action.id);
        delete overrideToConfirmEdit.editing;
        overrideToConfirmEdit[action.property] = action.value;

        return {
            ...state,
            overrides
        };
    }

    case types.CREATED_OVERRIDE:
        return {
            ...state,
            overrides: [...state.overrides, action.override]
        };

    case types.OVERRIDES_DELETED: {

        return {
            ...state,
            overrides: state.overrides.filter(override => action.ids.indexOf(override.id) === -1)
        };
    }

    case types.SET_FEATURE_SWITCH_STATES:
        return {
            ...state,
            states: action.states
        };

    default:
        // return existing state by default in redux
        return state;
    }
};

export default featureSwitches;
