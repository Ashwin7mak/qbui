import {ROUTES} from '../../../common/src/constants';
const {BASE_CLIENT_ROUTE} = ROUTES;

export const DEFAULT_PAGE_TITLE = 'QuickBase';
export const EDIT_RECORD_KEY = 'editRec';
export const DETAIL_APPID = 'detailAppId';
export const DETAIL_TABLEID = 'detailTableId';
export const DETAIL_REPORTID = 'detailReportId';
export const DETAIL_KEY_FID = 'detailKeyFid';
export const DETAIL_KEY_VALUE = 'detailKeyValue';
export const NEW_RECORD_VALUE = 'new';
export const SUPPORT_LINK_PATH = '/qb/support/NewCase?subject=MercuryBeta';
export const FEEDBACK_LINK_PATH = 'quickbase.uservoice.com/forums/378045-mercury';
export const WALKME_ID_FOR_LARGE = 228348;
export const WALKME_ID_FOR_SMALL_AND_MEDIUM = 272137;

//  client routes
export const APPS_ROUTE = `${BASE_CLIENT_ROUTE}/apps`;
export const APP_ROUTE = `${BASE_CLIENT_ROUTE}/app`;
export const BUILDER_ROUTE = `${BASE_CLIENT_ROUTE}/builder`;

// This is a special route that determines whether or not the settings button with routes to form and table builder is shown
// It helps correctly pass props from the URL to that menu component
export const BUILDER_MENU_ROUTE = `${APP_ROUTE}/:appId/table/:tblId/(report)?/:rptId?/(record)?/:recordId?`;

export const ADMIN_ROUTE = `${BASE_CLIENT_ROUTE}/admin`;
export const USERS_ROUTE = `${APP_ROUTE}/{0}/users`;
export const TABLE_LINK = `${APP_ROUTE}/{0}/table/{1}`;
export const SETTINGS_ROUTE = `${BASE_CLIENT_ROUTE}/settings`;
export const REPORT_LINK = `${APP_ROUTE}/{0}/table/{1}/report/{2}`;
export const CHILD_REPORT_LINK = `${APP_ROUTE}/{0}/table/{1}/report/{2}?detailKeyFid={3}&detailKeyValue={4}`;
export const ADD_RELATED_CHILD_LINK = `{0}?${EDIT_RECORD_KEY}=new&${DETAIL_APPID}={1}&${DETAIL_TABLEID}={2}&${DETAIL_REPORTID}={3}&${DETAIL_KEY_FID}={4}&${DETAIL_KEY_VALUE}={5}`;

export const FORBIDDEN = `${BASE_CLIENT_ROUTE}/forbidden`;
export const UNAUTHORIZED = `${BASE_CLIENT_ROUTE}/unauthorized`;
export const INTERNAL_SERVER_ERROR = `${BASE_CLIENT_ROUTE}/internalServerError`;
