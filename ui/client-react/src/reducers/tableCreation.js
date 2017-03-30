import * as types from '../actions/types';

const defaultTableInfo = {
    name: {
        value: "",
    },
    description: {
        value: "",
    },
    tableIcon: {
        value: "tasks",
    },
    tableNoun: {
        value: "",
    }
};

const tableCreation = (
    state = {
        //  default states
        dialogOpen: false,
        pageIndex: 0,
        iconChooserOpen: false,
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
            pageIndex: 0,
            iconChooserOpen: false,
            savingTable: false,
            tableInfo: {...defaultTableInfo},
            edited: false,
            editing: null
        };

    case types.HIDE_TABLE_CREATION_DIALOG: {
        return {
            ...state,
            dialogOpen: false,
            pageIndex: 0
        };
    }

    case types.NEXT_TABLE_CREATION_PAGE: {
        return {
            ...state,
            pageIndex: state.pageIndex + 1
        };
    }

    case types.PREVIOUS_TABLE_CREATION_PAGE: {
        return {
            ...state,
            pageIndex: state.pageIndex > 0 ? state.pageIndex - 1 : 0
        };
    }
    case types.TABLE_ICON_CHOOSER_OPEN: {
        return {
            ...state,
            iconChooserOpen: action.isOpen
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
