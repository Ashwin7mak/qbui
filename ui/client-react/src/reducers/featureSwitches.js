import * as types from '../actions/types';
import _ from 'lodash';

const featureSwitches = (
    state = {
        //  default states
        edited: false,
        switches: [],
        exceptions: [],
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

    // exceptions
    case types.SELECT_FEATURE_SWITCH_EXCEPTIONS: {
        const currentSwitch = state.switches.find(item => item.id === action.id);
        return {
            ...state,
            exceptions: currentSwitch ? [...currentSwitch.exceptions] : [],
            edited: false
        };
    }

    case types.SET_EXCEPTION_STATE: {
        const exceptions = [...state.exceptions];
        exceptions[action.row].on = action.on;
        return  {
            ...state,
            exceptions,
            edited: true
        };
    }
    case types.EDIT_EXCEPTION: {
        const exceptions = [...state.exceptions];
        exceptions[action.row].editing = action.column;
        return {
            ...state,
            exceptions
        };
    }
    case types.EXCEPTION_EDITED: {
        const exceptions = [...state.exceptions];
        delete exceptions[action.row].editing;
        exceptions[action.row][action.property] = action.value;

        return {
            ...state,
            exceptions,
            edited: true
        };
    }

    case types.CREATE_EXCEPTION:
        return {
            ...state,
            exceptions: [...state.exceptions, action.exception],
            edited: true
        };

    case types.DELETE_EXCEPTIONS: {
        const exceptions = [...state.exceptions];
        _.pullAt(exceptions, action.ids);

        return {
            ...state,
            exceptions,
            edited: true
        };
    }
    case types.SAVED_FEATURE_SWITCH_EXCEPTIONS:
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
