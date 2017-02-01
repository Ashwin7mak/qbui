/*
 *  Define all Redux store action constants
 */

//  **** App actions ****
//      ...

//  **** Form actions ****
export const LOADING_FORM = 'LOADING_FORM';
export const LOAD_FORM_ERROR = 'LOAD_FORM_ERROR';
export const LOAD_FORM_SUCCESS = 'LOAD_FORM_SUCCESS';

export const SAVE_FORM = 'SAVE_FORM';
export const SAVE_FORM_SUCCESS = 'SAVE_FORM_SUCCESS';
export const SAVE_FORM_FAILED = 'SAVE_FORM_FAILED';

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

//  **** Record actions ****
export const OPEN_RECORD = 'OPEN_RECORD';
export const OPEN_PREVIOUS_RECORD = 'OPEN_PREVIOUS_RECORD';
export const OPEN_NEXT_RECORD = 'OPEN_PREVIOUS_RECORD';

export const EDIT_REPORT_RECORD = 'EDIT_REPORT_RECORD';

//  **** Report actions ****
export const LOAD_REPORT = 'LOAD_REPORT';
export const LOAD_REPORT_SUCCESS = 'LOAD_REPORT_SUCCESS';
export const LOAD_REPORT_FAILED = 'LOAD_REPORT_FAILED';

//  **** table reports actions ****
export const LOAD_REPORTS = 'LOAD_REPORTS';
export const LOAD_REPORTS_SUCCESS = 'LOAD_REPORTS_SUCCESS';
export const LOAD_REPORTS_FAILED = 'LOAD_REPORTS_FAILED';
