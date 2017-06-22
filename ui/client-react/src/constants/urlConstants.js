import {ROUTES} from '../../../common/src/constants';
const {BASE_CLIENT_ROUTE} = ROUTES;

export const DEFAULT_PAGE_TITLE = 'QuickBase';
export const EDIT_RECORD_KEY = 'editRec';
export const DETAIL_APPID = 'detailAppId';
export const DETAIL_TABLEID = 'detailTableId';
export const DETAIL_REPORTID = 'detailReportId';
export const DETAIL_KEY_FID = 'detailKeyFid';
export const DETAIL_KEY_VALUE = 'detailKeyValue';
export const DETAIL_KEY_DISPLAY = 'detailKeyDisplay';
export const NEW_RECORD_VALUE = 'new';
export const SUPPORT_LINK_PATH = '/qb/support/NewCase?subject=MercuryBeta';
export const FEEDBACK_LINK_PATH = 'quickbase.uservoice.com/forums/378045-mercury';
export const HELP_LINK_PATH = `quickbase.com/mercury/help`;
export const WALKME_ID_FOR_LARGE = 228348;
export const WALKME_ID_FOR_SMALL_AND_MEDIUM = 272137;
export const EMBEDDED_REPORT = 'embeddedReport';
//  client routes
export const APPS_ROUTE = `${BASE_CLIENT_ROUTE}/apps`;
export const APP_ROUTE = `${BASE_CLIENT_ROUTE}/app`;
export const BUILDER_ROUTE = `${BASE_CLIENT_ROUTE}/builder`;

// This is a special route that determines whether or not the settings button with routes to form and table builder is shown
// It helps correctly pass props from the URL to that menu component
export const BUILDER_MENU_ROUTE = `${APP_ROUTE}/:appId/(table)?/:tblId?/(report)?/:rptId?/(record)?/:recordId?`;

export const ADMIN_ROUTE = `${BASE_CLIENT_ROUTE}/admin`;
export const USERS_ROUTE = `${APP_ROUTE}/{0}/users`;
export const TABLE_LINK = `${APP_ROUTE}/{0}/table/{1}`;
export const SETTINGS_ROUTE = `${BASE_CLIENT_ROUTE}/settings`;
export const REPORT_LINK = `${APP_ROUTE}/{0}/table/{1}/report/{2}`;
export const CHILD_REPORT_LINK = `${APP_ROUTE}/{0}/table/{1}/report/{2}?detailKeyFid={3}&detailKeyValue={4}&detailKeyDisplay={5}`;
export const ADD_RELATED_CHILD_LINK = `{0}?${EDIT_RECORD_KEY}=new&${DETAIL_APPID}={1}&${DETAIL_TABLEID}={2}&${DETAIL_REPORTID}={3}&${DETAIL_KEY_FID}={4}&${DETAIL_KEY_VALUE}={5}&${DETAIL_KEY_DISPLAY}={6}&${EMBEDDED_REPORT}={7}`;
export const FORBIDDEN = `${BASE_CLIENT_ROUTE}/forbidden`;
export const UNAUTHORIZED = `${BASE_CLIENT_ROUTE}/unauthorized`;
export const INTERNAL_SERVER_ERROR = `${BASE_CLIENT_ROUTE}/internalServerError`;

// url segment related constants used for components rendered in drawers
let drawer = {
    RECORD_SEGMENT: `/sr_app_{0}_table_{1}_report_{2}_record_{3}`,
    REPORT_SEGMENT: `/sr_report_app_{0}_table_{1}_report_{2}_dtFid_{3}_dtVal_{4}_dtDsp_{5}`,
    MATCHER: {
        APP_ID: ':appId([A-Za-z0-9]+)',
        TABLE_ID: ':tblId([A-Za-z0-9]+)',
        REPORT_ID: ':rptId([A-Za-z0-9]+)',
        RECORD_ID: ':recordId([A-Za-z0-9]+)',
        DETAIL_KEY_FID: ':detailKeyFid([A-Za-z0-9]+)',
        DETAIL_KEY_VALUE: ':detailKeyValue([A-Z-a-z0-9 ]+)',
        DETAIL_KEY_DISPLAY: ':detailKeyDisplay([A-Z-a-z0-9 ]+)'
    }
};
export const DRAWER = Object.assign(drawer, {
    RECORD_SEGMENT_PATH: `/sr_app_${drawer.MATCHER.APP_ID}_table_${drawer.MATCHER.TABLE_ID}_report_${drawer.MATCHER.REPORT_ID}_record_${drawer.MATCHER.RECORD_ID}`,
    REPORT_SEGMENT_PATH: `/sr_report_app_${drawer.MATCHER.APP_ID}_table_${drawer.MATCHER.TABLE_ID}_report_${drawer.MATCHER.REPORT_ID}_dtFid_${drawer.MATCHER.DETAIL_KEY_FID}_dtVal_${drawer.MATCHER.DETAIL_KEY_VALUE}_dtDsp_${drawer.MATCHER.DETAIL_KEY_DISPLAY}`
});

export const AUTOMATION = Object.freeze({
    PATH : 'automation',
    VIEW : 'view',
    EDIT : 'edit'
});
