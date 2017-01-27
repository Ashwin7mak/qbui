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

export const SAVE_FORM = 'SAVE_FORM';
export const SAVE_FORM_SUCCESS = 'SAVE_FORM_SUCCESS';
export const SAVE_FORM_FAILED = 'SAVE_FORM_FAILED';

export const SYNC_FORM = 'SYNC_FORM';

//  ****  Nav shell actions ****
export const HIDE_TROWSER = 'HIDE_TROWSER';
export const SHOW_TROWSER = 'SHOW_TROWSER';
export const TOGGLE_LEFT_NAV_VISIBLE = 'TOGGLE_LEFT_NAV_VISIBLE';
export const TOGGLE_LEFT_NAV_EXPANDED = 'TOGGLE_LEFT_NAV_EXPANDED';

//  **** Report actions ****

//  **** table reports actions ****
export const LOAD_REPORTS = 'LOAD_REPORTS';
export const LOAD_REPORTS_SUCCESS = 'LOAD_REPORTS_SUCCESS';
export const LOAD_REPORTS_FAILED = 'LOAD_REPORTS_FAILED';
