import {ROUTES} from '../../../common/src/constants';

export const AUTOMATION_BASE_ROUTE = `${ROUTES.BASE_CLIENT_ROUTE}/automation`;
export const AUTOMATION_APP_ROUTE = `${AUTOMATION_BASE_ROUTE}/:appId`;
export const AUTOMATION_BUILDER_ROUTE = `${AUTOMATION_APP_ROUTE}/config`;
