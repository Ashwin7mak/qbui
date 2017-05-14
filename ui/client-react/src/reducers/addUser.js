import * as types from '../actions/types';

const defaultUserInfo = {
    name: {
        value: "",
    },
    description: {
        value: "",
    },
    tableIcon: {
        value: "Spreadsheet",
    },
    tableNoun: {
        value: "",
    }
};

const AddUser = (
    state = {
        //  default states
        dialogOpen: false,
        showUserReadyDialog: false,
        pageIndex: 0,
        iconChooserOpen: false,
        savingUser: false,
        userInfo: defaultUserInfo,
        edited: false,
        editing: null
    },
    action) => {

    switch (action.type) {
    case types.SHOW_ADD_USER_DIALOG:
        return {
            ...state,
            dialogOpen: true,
            pageIndex: 0,
            iconChooserOpen: false,
            savingUser: false,
            UserInfo: {...defaultUserInfo},
            edited: false,
            editing: null
        };

    case types.HIDE_ADD_USER_DIALOG: {
        return {
            ...state,
            dialogOpen: false,
            pageIndex: 0
        };
    }

    // case types.SHOW_TABLE_READY_DIALOG: {
    //     return {
    //         ...state,
    //         showTableReadyDialog: true
    //     };
    // }
    //
    // case types.HIDE_TABLE_READY_DIALOG: {
    //     return {
    //         ...state,
    //         showTableReadyDialog: false
    //     };
    // }
    //
    // case types.TABLE_ICON_CHOOSER_OPEN: {
    //     return {
    //         ...state,
    //         iconChooserOpen: action.isOpen
    //     };
    // }
    //
    // case types.SET_TABLE_CREATION_PROPERTY: {
    //
    //     const tableInfo = {...state.tableInfo};
    //
    //     const fieldInfo = tableInfo[action.property];
    //
    //     tableInfo[action.property] = {
    //         value: action.value,
    //         validationError: action.validationError,
    //         pendingValidationError: action.pendingValidationError,
    //         edited: fieldInfo.edited || action.isUserEdit
    //     };
    //
    //     return {
    //         ...state,
    //         edited: state.edited || action.isUserEdit,
    //         tableInfo: tableInfo
    //     };
    // }
    //
    // case types.SET_EDITING_PROPERTY: {
    //     return {
    //         ...state,
    //         editing: action.editing
    //     };
    // }
    // case types.SAVING_TABLE: {
    //     return {
    //         ...state,
    //         savingTable: true
    //     };
    // }
    // case types.SAVING_TABLE_FAILED: {
    //     return {
    //         ...state,
    //         savingTable: false
    //     };
    // }
    // case types.CREATED_TABLE: {
    //     return {
    //         ...state,
    //         savingTable: false
    //     };
    // }

    default:
        // return existing state by default in redux
        return state;
    }
};

export default AddUser;
