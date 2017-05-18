import * as types from '../actions/types';

const defaultUserInfo = {};

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
    case types.SHOW_ADD_USER_TO_APP_DIALOG:
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

    case types.HIDE_ADD_USER_TO_DIALOG: {
        return {
            ...state,
            dialogOpen: false,
            pageIndex: 0
        };
    }

    default:
        // return existing state by default in redux
        return state;
    }
};

export default AddUser;
