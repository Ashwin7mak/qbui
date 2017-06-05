/*
 *  Define all Redux store action constants
 */

//  **** App actions ****
//      ...

//  ******** App Role actions ********
export const LOAD_APP_ROLES = 'LOAD_APP_ROLES';
export const LOAD_APP_ROLES_SUCCESS = 'LOAD_APP_ROLES_SUCCESS';
export const LOAD_APP_ROLES_FAILED = 'LOAD_APP_ROLES_FAILED';

//  ******** Form actions ********
export const LOADING_FORM = 'LOADING_FORM';
export const LOAD_FORM_ERROR = 'LOAD_FORM_ERROR';
export const LOAD_FORM_SUCCESS = 'LOAD_FORM_SUCCESS';
export const UPDATE_FORM_REDIRECT_ROUTE = 'UPDATE_FORM_REDIRECT_ROUTE';
export const DRAGGING_LINK_TO_RECORD = 'DRAGGING_LINK_TO_RECORD';
export const HIDE_RELATIONSHIP_DIALOG = 'HIDE_RELATIONSHIP_DIALOG';

//  Used when saving a form or a record to show/hide the spinner
export const SAVE_FORM = 'SAVE_FORM';
export const SAVE_FORM_COMPLETE = 'SAVE_FORM_COMPLETE';
export const SAVING_FORM = 'SAVING_FORM';
export const SAVING_FORM_SUCCESS = 'SAVING_FORM_SUCCESS';
export const SAVING_FORM_ERROR = 'SAVING_FORM_ERROR';
export const KEYBOARD_MOVE_FIELD_UP = 'KEYBOARD_MOVE_FIELD_UP';
export const KEYBOARD_MOVE_FIELD_DOWN = 'KEYBOARD_MOVE_FIELD_DOWN';
export const ADD_FIELD = 'ADD_FIELD';
export const MOVE_FIELD = 'MOVE_FIELD';
export const REMOVE_FIELD = 'REMOVE_FIELD';
export const TOGGLE_FORM_BUILDER_CHILDREN_TABINDEX = 'TOGGLE_FORM_BUILDER_CHILDREN_TABINDEX';
export const TOGGLE_TOOL_PALETTE_BUILDER_CHILDREN_TABINDEX = 'TOGGLE_TOOL_PALETTE_BUILDER_CHILDREN_TABINDEX';
export const SYNC_FORM = 'SYNC_FORM';
export const SELECT_FIELD = 'SELECT_FIELD';
export const DESELECT_FIELD = 'DESELECT_FIELD';
export const END_DRAG = 'END_DRAG';
export const IS_DRAGGING = 'IS_DRAGGING';
export const SET_IS_PENDING_EDIT_TO_FALSE = 'SET_IS_PENDING_EDIT_TO_FALSE';
export const UNLOAD_FORM = 'UNLOAD_FORM';

//  ********  Nav shell actions ********
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

//  ******** Field actions *********
export const LOAD_FIELDS = 'LOAD_FIELDS';
export const LOAD_FIELDS_SUCCESS = 'LOAD_FIELDS_SUCCESS';
export const LOAD_FIELDS_ERROR = 'LOAD_FIELDS_ERROR';
export const SAVE_NEW_FIELD = 'SAVE_NEW_FIELD';
export const UPDATE_FIELD_ID = 'UPDATE_FIELD_ID';
export const UPDATE_FIELD = 'UPDATE_FIELD';

//  ******** Record actions ********
export const OPEN_RECORD = 'OPEN_RECORD';
export const SAVE_RECORD = 'SAVE_RECORD';
export const SAVE_RECORD_SUCCESS = 'SAVE_RECORD_SUCCESS';
export const SAVE_RECORD_ERROR = 'SAVE_RECORD_ERROR';
export const SAVE_RECORD_COMPLETE = 'SAVE_RECORD_COMPLETE';
export const ADD_CHILD_RECORD = 'ADD_CHILD_RECORD';

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
export const LOAD_EMBEDDED_REPORT = 'LOAD_EMBEDDED_REPORT';
export const LOAD_EMBEDDED_REPORT_SUCCESS = 'LOAD_EMBEDDED_REPORT_SUCCESS';
export const LOAD_EMBEDDED_REPORT_FAILED = 'LOAD_EMBEDDED_REPORT_FAILED';
export const UNLOAD_EMBEDDED_REPORT = 'UNLOAD_EMBEDDED_REPORT';
export const LOAD_REPORT_RECORDS_COUNT_SUCCESS = 'LOAD_REPORT_RECORDS_COUNT_SUCCESS';
export const LOAD_REPORT_RECORDS_COUNT_FAILED = 'LOAD_REPORT_RECORDS_COUNT_FAILED';
export const SELECT_REPORT_RECORDS = 'SELECT_REPORT_RECORDS';
export const REMOVE_REPORT_RECORDS = 'REMOVE_REPORT_RECORDS';
export const ADD_BLANK_REPORT_RECORD = 'ADD_BLANK_REPORT_RECORD';
export const REMOVE_BLANK_REPORT_RECORD = 'REMOVE_BLANK_REPORT_RECORD';

//  ******** Report Builder actions ********
export const UPDATE_REPORT_REDIRECT_ROUTE = 'UPDATE_REPORT_REDIRECT_ROUTE';
export const REFRESH_FIELD_SELECT_MENU = 'REFRESH_FIELD_SELECT_MENU';
export const INSERT_PLACEHOLDER_COLUMN = 'INSERT_PLACEHOLDER_COLUMN';
export const ADD_COLUMN_FROM_EXISTING_FIELD = 'ADD_COLUMN_FROM_EXISTING_FIELD';
export const HIDE_COLUMN = 'HIDE_COLUMN';
export const MOVE_COLUMN = 'MOVE_COLUMN';
export const CHANGE_REPORT_NAME = 'CHANGE_REPORT_NAME';
export const ENTER_BUILDER_MODE = 'ENTER_BUILDER_MODE';
export const EXIT_BUILDER_MODE = 'EXIT_BUILDER_MODE';

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


export const SHOW_TABLE_CREATION_DIALOG = 'SHOW_TABLE_CREATION_DIALOG';
export const HIDE_TABLE_CREATION_DIALOG = 'HIDE_TABLE_CREATION_DIALOG';

export const SHOW_TABLE_READY_DIALOG = 'SHOW_TABLE_READY_DIALOG';
export const HIDE_TABLE_READY_DIALOG = 'HIDE_TABLE_READY_DIALOG';

export const TABLE_ICON_CHOOSER_OPEN = 'TABLE_ICON_CHOOSER_OPEN';

export const SET_EDITING_PROPERTY = 'SET_EDITING_PROPERTY';
export const SET_TABLE_CREATION_PROPERTY = 'SET_TABLE_CREATION_PROPERTY';
export const CREATING_TABLE = 'CREATING_TABLE';
export const CREATING_TABLE_FAILED = 'CREATING_TABLE_FAILED';
export const CREATED_TABLE = 'CREATED_TABLE';

export const TABLE_PROPS_ICON_CHOOSER_OPEN = 'TABLE_PROPS_ICON_CHOOSER_OPEN';

export const SET_PROPS_EDITING_PROPERTY = 'SET_PROPS_EDITING_PROPERTY';
export const SET_TABLE_PROPS = 'SET_TABLE_PROPS';
export const SAVING_TABLE = 'SAVING_TABLE';
export const SAVING_TABLE_FAILED = 'SAVING_TABLE_FAILED';
export const TABLE_SAVED = 'TABLE_SAVED';
export const LOADED_TABLE_PROPS = 'LOADED_TABLE_PROPS';
export const NOTIFY_TABLE_CREATED = 'NOTIFY_TABLE_CREATED';
export const RESET_TABLE_PROPS = 'RESET_TABLE_PROPS';
export const DELETING_TABLE_FAILED = 'DELETING_TABLE_FAILED';
export const TABLE_DELETED = 'TABLE_DELETED';
export const NOTIFY_TABLE_DELETED = 'NOTIFY_TABLE_DELETED';

// ************ Used for the Add User Dialog *************
export const SHOW_ADD_USER_TO_APP_DIALOG = 'SHOW_ADD_USER_TO_APP_DIALOG';
export const HIDE_ADD_USER_TO_DIALOG = 'HIDE_ADD_USER_TO_DIALOG';

//  ******** automation actions ********
export const LOAD_AUTOMATIONS = 'LOAD_AUTOMATIONS';
export const LOAD_AUTOMATIONS_SUCCESS = 'LOAD_AUTOMATIONS_SUCCESS';
export const LOAD_AUTOMATIONS_FAILED = 'LOAD_AUTOMATIONS_FAILED';
export const LOAD_AUTOMATION = 'LOAD_AUTOMATION';
export const LOAD_AUTOMATION_SUCCESS = 'LOAD_AUTOMATION_SUCCESS';
export const LOAD_AUTOMATION_FAILED = 'LOAD_AUTOMATION_FAILED';
