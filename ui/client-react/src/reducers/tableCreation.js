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

const tableCreation = (
    state = {
        //  default states
        dialogOpen: false,
        dialogPage: 0,
        menuOpen: false,
        savingTable: false,
        tableInfo: defaultTableInfo,
        edited: false,
        editing: null,
        notifyTableCreated: false
    },
    action) => {

    switch (action.type) {
    case types.SHOW_TABLE_CREATION_DIALOG:
        return {
            ...state,
            dialogOpen: true,
            dialogPage: 0,
            menuOpen: false,
            savingTable: false,
            tableInfo: {...defaultTableInfo},
            edited: false,
            editing: null
        };

    case types.HIDE_TABLE_CREATION_DIALOG: {
        return {
            ...state,
            dialogOpen: false,
            dialogPage: 0
        };
    }

    case types.NEXT_TABLE_CREATION_PAGE: {
        return {
            ...state,
            dialogPage: state.dialogPage + 1
        };
    }

    case types.PREVIOUS_TABLE_CREATION_PAGE: {
        return {
            ...state,
            dialogPage: state.dialogPage > 0 ? state.dialogPage - 1 : 0
        };
    }
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

    case types.SET_TABLE_CREATION_PROPERTY: {

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
    case types.CREATED_TABLE: {
        return {
            ...state,
            savingTable: false
        };
    }

    case types.NOTIFY_TABLE_CREATED: {
        return {
            ...state,
            notifyTableCreated: action.notifyTableCreated
        };
    }
    default:
        // return existing state by default in redux
        return state;
    }
};

export default tableCreation;
