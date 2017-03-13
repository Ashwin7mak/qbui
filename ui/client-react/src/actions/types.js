/*
 *  Define all Redux store action constants
 */

//  **** App actions ****
//      ...

//  ******** Form actions ********
export const LOADING_FORM = 'LOADING_FORM';
export const LOAD_FORM_ERROR = 'LOAD_FORM_ERROR';
export const LOAD_FORM_SUCCESS = 'LOAD_FORM_SUCCESS';
//  Used when saving a form or a record to show/hide the spinner
export const SAVE_FORM = 'SAVE_FORM';
export const SAVE_FORM_COMPLETE = 'SAVE_FORM_COMPLETE';
export const SAVING_FORM = 'SAVING_FORM';
export const SAVING_FORM_SUCCESS = 'SAVING_FORM_SUCCESS';
export const SAVING_FORM_ERROR = 'SAVING_FORM_ERROR';
export const MOVE_FIELD = 'MOVE_FIELD';
export const SYNC_FORM = 'SYNC_FORM';

//  ********  Nav shell actions ********
export const REMOVE_FIELD = 'REMOVE_FIELD';
export const UPDATE_FORM_ANIMATION_STATE = 'UPDATE_FORM_ANIMATION_STATE';
export const HIDE_TROWSER = 'HIDE_TROWSER';
export const SHOW_TROWSER = 'SHOW_TROWSER';
export const TOGGLE_LEFT_NAV_VISIBLE = 'TOGGLE_LEFT_NAV_VISIBLE';
export const TOGGLE_LEFT_NAV_EXPANDED = 'TOGGLE_LEFT_NAV_EXPANDED';
export const TOGGLE_ROW_POP_UP_MENU = 'TOGGLE_ROW_POP_UP_MENU';
export const TOGGLE_APPS_LIST = 'TOGGLE_APPS_LIST';
export const SHOW_ERROR_MSG_DIALOG = 'SHOW_ERROR_MSG_DIALOG';
export const HIDE_ERROR_MSG_DIALOG = 'HIDE_ERROR_MSG_DIALOG';
export const CHANGE_LOCALE = 'CHANGE_LOCALE';

//  ******** Record actions ********
export const OPEN_RECORD = 'OPEN_RECORD';
export const SAVE_RECORD = 'SAVE_RECORD';
export const SAVE_RECORD_SUCCESS = 'SAVE_RECORD_SUCCESS';
export const SAVE_RECORD_ERROR = 'SAVE_RECORD_ERROR';
export const SAVE_RECORD_COMPLETE = 'SAVE_RECORD_COMPLETE';

//  Record actions for inline edit
export const EDIT_RECORD_START = 'EDIT_RECORD_START';
export const EDIT_RECORD_CHANGE = 'EDIT_RECORD_CHANGE';
export const EDIT_RECORD_CANCEL = 'EDIT_RECORD_CANCEL';
export const EDIT_RECORD_VALIDATE_FIELD = 'EDIT_RECORD_VALIDATE_FIELD';

//  Record actions for delete
export const DELETE_RECORDS = 'DELETE_RECORDS';
export const DELETE_RECORDS_COMPLETE = 'DELETE_RECORDS_COMPLETE';
export const DELETE_RECORDS_ERROR = 'DELETE_RECORDS_ERROR';

//  ******** Report actions ********
export const LOAD_REPORT = 'LOAD_REPORT';
export const LOAD_REPORT_SUCCESS = 'LOAD_REPORT_SUCCESS';
export const LOAD_REPORT_FAILED = 'LOAD_REPORT_FAILED';
export const SELECT_REPORT_RECORDS = 'SELECT_REPORT_RECORDS';
export const REMOVE_REPORT_RECORDS = 'REMOVE_REPORT_RECORDS';
export const ADD_BLANK_REPORT_RECORD = 'ADD_BLANK_REPORT_RECORD';

//  ******** table report list actions ********
export const LOAD_REPORTS = 'LOAD_REPORTS';
export const LOAD_REPORTS_SUCCESS = 'LOAD_REPORTS_SUCCESS';
export const LOAD_REPORTS_FAILED = 'LOAD_REPORTS_FAILED';

//  ******** search actions ********
export const SEARCH_INPUT = 'SEARCH_INPUT';

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

export const ERROR = 'ERROR';
