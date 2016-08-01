import Configuration from '../config/app.config';

export default {
    //  COOKIES
    COOKIE: {
        TICKET: 'ticket'
    },

    // REQUEST HEADERS
    HEADER: {
        SESSION_ID      : 'sid',
        TRANSACTION_ID  : 'tid',
        TICKET          : 'ticket'
    },

    // Define the base urls for QuickBase and Node API endpoints.
    //
    // A Quickbase endpoint calls out to the public api, proxying through
    // the node server.
    //
    // A Node endpoint DOES NOT require the Quickbase API to fulfill
    // its request.  Work is done exclusively on the Node server.
    BASE_URL: {
        QUICKBASE   : '/api/api/' + Configuration.api.qbVersion,
        NODE        : '/api/n/' + Configuration.api.nodeVersion
    },

    // API Entities
    APPS                : 'apps',
    FIELD               : 'fields',
    RECORDS             : 'records',
    REPORTS             : 'reports',
    TABLES              : 'tables',
    FIELDS              : 'fields',
    FACETS              : 'facets',
    FORMS               : 'forms',
    LOG                 : 'log',
    LOG_PERF            : 'clientPerf',

    // API Entity actions
    FORMCOMPONENTS      : 'formComponents',
    HOMEPAGE            : 'homePage',
    REPORTCOMPONENTS    : 'reportComponents',
    RECORDSCOUNT        : 'count',
    RESULTS             : 'results',
    PARSE               : 'parse',

    // Query String and parameters constants
    QUERYSTRING         : '?',
    PARAMSEPARATOR      : '&'
};
