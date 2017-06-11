import * as types from '../actions/types';

const appUser = (
	state = {
	//  default states
    successDialogOpen: false,
    addedAppUser: [],
    changeUserRoleDialog: false,
},
	action) => {

    switch (action.type) {
    case types.TOGGLE_ADD_TO_APP_SUCCESS_DIALOG: {
        return {
            ...state,
            successDialogOpen: action.content.isOpen,
            addedAppUser: [action.content.email]
        };
    }
    case types.TOGGLE_CHANGE_USER_ROLE: {
        return {
            ...state,
            changeUserRoleDialog: action.content.isOpen
        };
    }


    default:
    // return existing state by default in redux
        return state;
    }
};

export default appUser;
