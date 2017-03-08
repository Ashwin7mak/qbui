import Configuration from '../config/app.config';

export default {

    // REQUEST HEADERS
    HEADER: {
        SESSION_ID      : 'sid',
        TRANSACTION_ID  : 'tid',
        TICKET          : 'ticket'
    },

    // Define the base urls for QuickBase and Node API endpoints.
    //
    // A Quickbase or Experience Engine endpoint that calls out to
    // the public api, proxying through the node server.
    //
    // A Node endpoint DOES NOT require the Quickbase API to fulfill
    // its request.  Work is done exclusively on the Node server.
    BASE_URL: {
        QUICKBASE   : '/api/api/' + Configuration.api.qbVersion,
        EXPERIENCE  : '/ee/' + Configuration.api.eeVersion,
        NODE        : '/api/n/' + Configuration.api.nodeVersion,
        LEGACY      : '/api/l/' + Configuration.api.legacyVersion
    },

    // Entities
    APPS                : 'apps',
    FIELD               : 'fields',
    RECORDS             : 'records',
    REPORTS             : 'reports',
    TABLES              : 'tables',
    FIELDS              : 'fields',
    FACETS              : 'facets',
    FORMS               : 'forms',
    FORMS_TYPE          : 'formsType',
    LOG                 : 'log',
    LOG_PERF            : 'clientPerf',
    USERS               : 'users',
    RIGHTS              : 'accessRights',

    FEATURE_SWITCHES    : 'featureSwitches',
    FEATURE_OVERRIDES   : 'overrides',
    FEATURE_STATES      : 'featureStates',

    ROLES               : 'roles',

    // Node Entity actions
    FORMCOMPONENTS      : 'formComponents',
    HOMEPAGE            : 'homePage',
    RECORDSCOUNT        : 'recordsCount',
    RESULTS             : 'results',
    INVOKE              : 'invoke',
    PARSE               : 'parse',
    BULK                : 'bulk',

    // Legacy actions
    STACK               : 'stack'
};
