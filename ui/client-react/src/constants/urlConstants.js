import {ROUTES} from '../../../common/src/constants';
const {BASE_CLIENT_ROUTE} = ROUTES;

export const DEFAULT_PAGE_TITLE = 'QuickBase';
export const EDIT_RECORD_KEY = 'editRec';
export const NEW_RECORD_VALUE = 'new';
export const SUPPORT_LINK_PATH = '/qb/support/NewCase?subject=MercuryBeta';
export const WALKME_ID_FOR_LARGE = 228348;
export const WALKME_ID_FOR_SMALL_AND_MEDIUM = 272137;

//  client routes
export const APPS_ROUTE = `${BASE_CLIENT_ROUTE}/apps`;
export const APP_ROUTE = `${BASE_CLIENT_ROUTE}/app`;
export const BUILDER_ROUTE = `${BASE_CLIENT_ROUTE}/builder`;
export const ADMIN_ROUTE = `${BASE_CLIENT_ROUTE}/admin`;
export const USERS_ROUTE = `${APP_ROUTE}/{0}/users`;
export const SETTINGS_ROUTE = `${BASE_CLIENT_ROUTE}/settings`;
export const REPORT_LINK = `${APP_ROUTE}/{0}/table/{1}/report/{2}`;
export const CHILD_REPORT_LINK = `${APP_ROUTE}/{0}/table/{1}/report/{2}?detailKeyFid={3}&detailKeyValue={4}`;

export const FORBIDDEN = `${BASE_CLIENT_ROUTE}/forbidden`;
