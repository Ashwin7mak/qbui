import Configuration from '../config/app.config';

export default {

    // REQUEST HEADERS
    HEADER: {
        SESSION_ID      : 'sid',
        TRANSACTION_ID  : 'tid',
        TICKET          : 'ticket'
    },

    // Define the base context when calling node:
    //
    //  QBUI:    indicates the route performs qbui custom/composition work in
    //           the node layer before routing the request to the appropriate
    //           back-end server for processing.
    //  PROXY:   indicates the route will directly proxy through node to an
    //           external server endpoint.  Note the content of 'proxy' is
    //           blank..this is intentional as this constant is to better
    //           self-document the endpoint call within the service.
    //  NODE:    indicates the route performs node only work.
    BASE_URL: {
        QBUI          : '/qbui',
        NODE          : '/qbn',
        PROXY         : '',
        AUTOMATION    : '/we/workflow'
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
    TICKET              : 'ticket',
    ADMIN               : 'admin',

    // Node Entity actions
    FORMCOMPONENTS      : 'formComponents',
    HOMEPAGE            : 'homePage',
    RECORDSCOUNT        : 'recordsCount',
    RESULTS             : 'results',
    INVOKE              : 'invoke',
    PARSE               : 'parse',
    BULK                : 'bulk',
    REQUSER             : 'reqUser',
    TABLECOMPONENTS     : 'tableComponents',
    // Legacy actions
    STACK               : 'stack'
};
