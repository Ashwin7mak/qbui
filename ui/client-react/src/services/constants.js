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
    //           back-end server (if required) for processing.
    //  PROXY:   indicates the route will directly proxy through node to an
    //           external server endpoint.  Note the content of 'proxy' is
    //           blank..this is intentional as this constant is to better
    //           self-document the endpoint call within the service.
    BASE_URL: {
        QBUI            : '/qbui',
        PROXY           : '',
        AUTOMATION      : '/we'
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
    USERS               : 'users',
    RELATIONSHIPS       : 'relationships',
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
    APPCOMPONENTS       : 'appComponents',
    // Legacy actions
    STACK               : 'stack',

	// Slugs
    SEARCH              : 'search',

    // Automations
    AUTOMATION : {
        INVOKE   : 'workflow',
        API      : 'api/v1',
        FLOWS    : 'workflow/flows'
    }
};
