import * as types from '../actions/types';

const defaultTableInfo = {
    name: {
        value: ""
    },
    description: {
        value: ""
    },
    tableIcon: {
        value: ""
    },
    tableNoun: {
        value: ""
    }
};

const tableProperties = (
    state = {
        //  default states
        iconChooserOpen: false,
        savingTable: false,
        tableInfo: defaultTableInfo,
        isDirty: false,
        editing: null
    },
    action) => {

    switch (action.type) {
    case types.TABLE_PROPS_ICON_CHOOSER_OPEN: {
        return {
            ...state,
            iconChooserOpen: action.isOpen
        };
    }
    case types.SET_TABLE_PROPS: {

        const tableInfo = {...state.tableInfo};

        const fieldInfo = tableInfo[action.property];

        tableInfo[action.property] = {
            origValue: fieldInfo ? fieldInfo.origValue : "",
            value: action.value,
            validationError: action.validationError,
            edited: fieldInfo ? fieldInfo.edited || action.isUserEdit : action.isUserEdit
        };

        return {
            ...state,
            isDirty: state.edited || action.isUserEdit,
            tableInfo: tableInfo
        };
    }

    case types.LOADED_TABLE_PROPS: {

        const tableInfo = action.tableInfo;

        let newTableInfo = {};
        Object.keys(tableInfo).forEach(function(key, index) {
            newTableInfo[key] = {
                origValue: tableInfo[key],
                value: tableInfo[key],
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
    case types.TABLE_SAVED: {
        let tableInfo = action.tableInfo;
        let newTableInfo = {};
        Object.keys(tableInfo).forEach(function(key, index) {
            newTableInfo[key] = {
                origValue: tableInfo[key].value,
                value: tableInfo[key].value,
                validationError: null,
                edited: null
            };
        });
        return {
            ...state,
            tableInfo: newTableInfo,
            isDirty: false,
            savingTable: false
        };
    }
    case types.RESET_TABLE_PROPS: {
        let tableInfo = state.tableInfo;
        let newTableInfo = {};
        Object.keys(tableInfo).forEach(function(key, index) {
            newTableInfo[key] = {
                origValue: tableInfo[key].origValue,
                value: tableInfo[key].origValue,
                validationError: null,
                edited: null
            };
        });
        return {
            ...state,
            tableInfo: newTableInfo,
            isDirty: false,
            savingTable: false
        };
    }
    default:
        // return existing state by default in redux
        return state;
    }
};

export default tableProperties;
