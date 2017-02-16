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
            switches: action.switches
        };

    case types.SET_FEATURE_SWITCH_STATES:
        return {
            ...state,
            states: action.states
        };

    case types.SET_SWITCH_DEFAULT_STATE: {
        const switches = [...state.switches];
        const switchToToggle = switches.find(item => item.id === action.id);
        switchToToggle.defaultOn = action.defaultOn;

        return  {
            ...state,
            switches,
            edited: true
        };
    }

    case types.CREATE_ROW:
        return {
            ...state,
            switches: [...state.switches, action.feature],
            edited: true
        };

    case types.DELETE_ROW:
        return {
            ...state,
            switches: _.remove([...state.switches], fs => fs.id !== action.id),
            edited: true
        };

    case types.EDIT_ROW: {
        const switches = [...state.switches];
        const switchToEdit = switches.find(item => item.id === action.id);
        switchToEdit.editing = action.column;
        return {
            ...state,
            switches
        };
    }

    case types.CONFIRM_EDIT: {
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
    case types.EDIT_EXCEPTIONS: {
        const currentSwitch = state.switches.find(item => item.id === action.id);
        return {
            ...state,
            exceptions: _.cloneDeep(currentSwitch.exceptions)
        }
    }

    case types.SET_EXCEPTION_STATE: {
        const exceptions = _.cloneDeep(state.exceptions);
        exceptions[action.row].on = action.on;
        return  {
            ...state,
            exceptions,
            edited: true
        };
    }
    case types.EDIT_EXCEPTION_ROW: {
        const exceptions = _.cloneDeep(state.exceptions);
        exceptions[action.row].editing = action.column;
        return {
            ...state,
            exceptions
        };
    }
    case types.CONFIRM_EXCEPTION_EDIT: {
        const exceptions = _.cloneDeep(state.exceptions);
        delete exceptions[action.row].editing;
        exceptions[action.row][action.property] = action.value;

        return {
            ...state,
            exceptions,
            edited: true
        };
    }
    default:
        // return existing state by default in redux
        return state;
    }
};

export default featureSwitches;
