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

export const KEYBOARD_MOVE_FIELD_UP = 'KEYBOARD_MOVE_FIELD_UP';
export const KEYBOARD_MOVE_FIELD_DOWN = 'KEYBOARD_MOVE_FIELD_DOWN';
export const MOVE_FIELD = 'MOVE_FIELD';
export const REMOVE_FIELD = 'REMOVE_FIELD';
export const TOGGLE_FORM_BUILDER_CHILDREN_TABINDEX = 'TOGGLE_FORM_BUILDER_CHILDREN_TABINDEX';

export const SYNC_FORM = 'SYNC_FORM';

export const SELECT_FIELD = 'SELECT_FIELD';
export const DESELECT_FIELD = 'DESELECT_FIELD';
export const UPDATE_FORM_ANIMATION_STATE = 'UPDATE_FORM_ANIMATION_STATE';

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

export const ERROR = 'ERROR';


export const SHOW_TABLE_CREATION_DIALOG = 'SHOW_TABLE_CREATION_DIALOG';
export const HIDE_TABLE_CREATION_DIALOG = 'HIDE_TABLE_CREATION_DIALOG';
export const NEXT_TABLE_CREATION_PAGE = 'NEXT_TABLE_CREATION_PAGE';
export const PREVIOUS_TABLE_CREATION_PAGE = 'PREVIOUS_TABLE_CREATION_PAGE';

export const TABLE_CREATION_MENU_OPEN = 'TABLE_CREATION_MENU_OPEN';
export const TABLE_CREATION_MENU_CLOSED = 'TABLE_CREATION_MENU_CLOSED';

export const SET_EDITING_PROPERTY = 'SET_EDITING_PROPERTY';
export const SET_TABLE_CREATION_PROPERTY = 'SET_TABLE_CREATION_PROPERTY';
export const SET_TABLE_PROPERTY = 'SET_TABLE_PROPERTY';
export const SAVING_TABLE = 'SAVING_TABLE';
export const SAVING_TABLE_FAILED = 'SAVING_TABLE_FAILED';
export const CREATED_TABLE = 'CREATED_TABLE';
export const UPDATED_TABLE = 'UPDATED_TABLE';

export const NOTIFY_TABLE_CREATED = 'NOTIFY_TABLE_CREATED';
export const NOTIFY_TABLE_UPDATED = 'NOTIFY_TABLE_UPDATED';


