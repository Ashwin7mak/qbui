import Configuration from '../config/app.config';

export default {

    // REQUEST HEADERS
    HEADER: {
        SESSION_ID      : 'sid',
        TRANSACTION_ID  : 'tid',
        TICKET          : 'ticket'
    },

    DEFAULT_CONFIG: {
        apiVersion: 'v1',
        locale: {
            supported: ['en-us', 'de-de', 'fr-fr'],
            default: 'en-us'
        },
    },

    BASE_GOVERNANCE_URL: `'/api/governance/${DEFAULT_CONFIG.apiVersion}`,

    USERS               : 'users',
};
