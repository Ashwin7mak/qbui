/*
 *  Define all Redux store action constants
 */

//  **** App actions ****
//      ...

//  **** Form actions ****
export const LOADING_FORM = 'LOADING_FORM';
export const LOAD_FORM_ERROR = 'LOAD_FORM_ERROR';
export const LOAD_FORM_SUCCESS = 'LOAD_FORM_SUCCESS';

export const EDIT_REPORT_RECORD = 'EDIT_REPORT_RECORD';

//  TODO: these actions seem to be used when saving a RECORD.
//  TODO: thinking they should be renamed to record constants
//  TODO: to better reflect what is happending.
export const SAVE_FORM = 'SAVE_FORM';
export const SAVE_FORM_SUCCESS = 'SAVE_FORM_SUCCESS';
export const SAVE_FORM_FAILED = 'SAVE_FORM_FAILED';

export const SAVING_FORM = 'SAVING_FORM';
export const SAVING_FORM_SUCCESS = 'SAVING_FORM_SUCCESS';
export const SAVING_FORM_ERROR = 'SAVING_FORM_ERROR';

export const MOVE_FIELD = 'MOVE_FIELD';

export const SYNC_FORM = 'SYNC_FORM';

//  ****  Nav shell actions ****
export const HIDE_TROWSER = 'HIDE_TROWSER';
export const SHOW_TROWSER = 'SHOW_TROWSER';
export const TOGGLE_LEFT_NAV_VISIBLE = 'TOGGLE_LEFT_NAV_VISIBLE';
export const TOGGLE_LEFT_NAV_EXPANDED = 'TOGGLE_LEFT_NAV_EXPANDED';
export const TOGGLE_ROW_POP_UP_MENU = 'TOGGLE_ROW_POP_UP_MENU';
export const TOGGLE_APPS_LIST = 'TOGGLE_APPS_LIST';
export const SHOW_ERROR_MSG_DIALOG = 'SHOW_ERROR_MSG_DIALOG';
export const HIDE_ERROR_MSG_DIALOG = 'HIDE_ERROR_MSG_DIALOG';

//  **** Report actions ****

//  **** table reports actions ****
export const LOAD_REPORTS = 'LOAD_REPORTS';
export const LOAD_REPORTS_SUCCESS = 'LOAD_REPORTS_SUCCESS';
export const LOAD_REPORTS_FAILED = 'LOAD_REPORTS_FAILED';

// **** feature switches ****
export const SET_FEATURE_SWITCH_STATES = 'SET_FEATURE_SWITCH_STATES';

export const SET_FEATURE_SWITCHES = 'SET_FEATURE_SWITCHES';
export const CREATED_FEATURE_SWITCH = 'CREATED_FEATURE_SWITCH';
export const EDIT_FEATURE_SWITCH = 'EDIT_FEATURE_SWITCH';
export const FEATURE_SWITCH_UPDATED = 'FEATURE_SWITCH_UPDATED';
export const FEATURE_SWITCHES_DELETED = 'FEATURE_SWITCHES_DELETED';

export const SET_FEATURE_OVERRIDES = 'SET_FEATURE_OVERRIDES';
export const CREATED_OVERRIDE = 'CREATED_OVERRIDE';
export const EDIT_OVERRIDE = 'EDIT_OVERRIDE';
export const OVERRIDE_UPDATED = 'OVERRIDE_UPDATED';
export const OVERRIDES_DELETED = 'OVERRIDES_DELETED';

export const REQ_USER = 'REQ_USER';

export const FORBIDDEN = 'FORBIDDEN';
