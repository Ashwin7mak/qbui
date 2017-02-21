import * as types from '../actions/types';
import _ from 'lodash';

const featureSwitches = (
    state = {
        //  default states
        edited: false,
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
            switches: action.switches,
            edited: false
        };


    case types.SET_FEATURE_SWITCH_DEFAULT_STATE: {
        const switches = [...state.switches];
        const switchToToggle = switches.find(item => item.id === action.id);
        switchToToggle.defaultOn = action.defaultOn;

        return  {
            ...state,
            switches,
            edited: true
        };
    }

    case types.CREATE_FEATURE_SWITCH:
        return {
            ...state,
            switches: [...state.switches, action.feature],
            edited: true
        };

    case types.DELETE_FEATURE_SWITCH: {
        return {
            ...state,
            switches: state.switches.filter(fs => fs.id !== action.id),
            edited: true
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

    case types.FEATURE_SWITCH_EDITED: {
        const switches = [...state.switches];
        const switchToConfirmEdit = switches.find(item => item.id === action.id);
        delete switchToConfirmEdit.editing;
        switchToConfirmEdit[action.property] = action.value;

        return {
            ...state,
            switches,
            edited: true
        };
    }

    case types.SAVED_FEATURE_SWITCHES:
        return {
            ...state,
            edited: false
        };

    // overrides
    case types.SELECT_FEATURE_SWITCH_OVERRIDES: {
        const currentSwitch = state.switches.find(item => item.id === action.id);
        return {
            ...state,
            overrides: currentSwitch ? [...currentSwitch.overrides] : [],
            edited: false
        };
    }

    case types.SET_OVERRIDE_STATE: {
        const overrides = [...state.overrides];
        overrides[action.row].on = action.on;
        return  {
            ...state,
            overrides,
            edited: true
        };
    }
    case types.EDIT_OVERRIDE: {
        const overrides = [...state.overrides];
        overrides[action.row].editing = action.column;
        return {
            ...state,
            overrides
        };
    }
    case types.OVERRIDE_EDITED: {
        const overrides = [...state.overrides];
        delete overrides[action.row].editing;
        overrides[action.row][action.property] = action.value;

        return {
            ...state,
            overrides,
            edited: true
        };
    }

    case types.CREATE_OVERRIDE:
        return {
            ...state,
            overrides: [...state.overrides, action.override],
            edited: true
        };

    case types.DELETE_OVERRIDES: {
        const overrides = [...state.overrides];
        _.pullAt(overrides, action.ids);

        return {
            ...state,
            overrides,
            edited: true
        };
    }
    case types.SAVED_FEATURE_SWITCH_OVERRIDES:
        return {
            ...state,
            edited: false
        };
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
