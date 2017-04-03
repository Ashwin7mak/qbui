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
        menuOpen: false,
        savingTable: false,
        tableInfo: defaultTableInfo,
        edited: false,
        editing: null
    },
    action) => {

    switch (action.type) {
    case types.TABLE_PROPS_MENU_OPEN: {
        return {
            ...state,
            menuOpen: true
        };
    }

    case types.TABLE_PROPS_MENU_CLOSED: {
        return {
            ...state,
            menuOpen: false
        };
    }

    case types.SET_TABLE_PROPS: {

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

    case types.LOADED_TABLE_PROPS: {

        const tableInfo = action.tableInfo;

        let newTableInfo = {};
        Object.keys(tableInfo).forEach(function(key, index) {
            newTableInfo[key] = {value: tableInfo[key],
                validationError: action.validationError,
                edited: action.isUserEdit
            };
        });

        return {
            ...state,
            tableInfo: newTableInfo
        };
    }

    case types.SET_PROPS_EDITING_PROPERTY: {
        return {
            ...state,
            editing: action.editing
        };
    }
    case types.UPDATING_TABLE: {
        return {
            ...state,
            savingTable: true
        };
    }
    case types.UPDATING_TABLE_FAILED: {
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
    default:
        // return existing state by default in redux
        return state;
    }
};

export default tableProperties;
