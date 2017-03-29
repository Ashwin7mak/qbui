import * as types from '../actions/types';

const defaultTableInfo = {
    name: {
        value: "",
    },
    description: {
        value: "",
    },
    tableIcon: {
        value: "projects",
    },
    tableNoun: {
        value: "",
    }
};

const tableProperties = (
    state = {
        //  default states
        dialogOpen: false,
        pageIndex: 0,
        menuOpen: false,
        savingTable: false,
        tableInfo: defaultTableInfo,
        edited: false,
        editing: null,
        notifyTableCreated: false
    },
    action) => {

    switch (action.type) {
    case types.TABLE_CREATION_MENU_OPEN: {
        return {
            ...state,
            menuOpen: true
        };
    }

    case types.TABLE_CREATION_MENU_CLOSED: {
        return {
            ...state,
            menuOpen: false
        };
    }

    case types.SET_TABLE_PROPERTY: {

        const tableInfo = {...state.tableInfo};

        const fieldInfo = tableInfo[action.property];

        tableInfo[action.property] = {
            value: action.value,
            validationError: action.validationError,
            edited: fieldInfo.edited || action.isUserEdit
        };

        return {
            ...state,
            edited: state.edited || action.isUserEdit,
            tableInfo: tableInfo
        };
    }

    case types.SET_EDITING_PROPERTY: {
        return {
            ...state,
            editing: action.editing
        };
    }
    case types.SAVING_TABLE: {
        return {
            ...state,
            savingTable: true
        };
    }
    case types.SAVING_TABLE_FAILED: {
        return {
            ...state,
            savingTable: false
        };
    }
    case types.UPDATED_TABLE: {
        return {
            ...state,
            savingTable: false
        };
    }

    case types.NOTIFY_TABLE_UPDATED: {
        return {
            ...state,
            notifyTableUpdated: action.notifyTableUpdated
        };
    }
    default:
        // return existing state by default in redux
        return state;
    }
};

export default tableProperties;
