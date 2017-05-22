import {ROUTES} from "COMMON/constants";
import GovernanceBundleLoader from "../locales/governanceBundleLoader";
import config from "../../../client-react/src/config/app.config";

export const GOVERNANCE_BASE_ROUTE = `${ROUTES.BASE_CLIENT_ROUTE}/governance`;
export const GOVERNANCE_ACCOUNT_ROUTE = `${GOVERNANCE_BASE_ROUTE}/:accountId`;
export const GOVERNANCE_ACCOUNT_USERS_ROUTE = `${GOVERNANCE_ACCOUNT_ROUTE}/users`;

GovernanceBundleLoader.changeLocale(config.locale.default);
