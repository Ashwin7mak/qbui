import * as URL from '../constants/urlConstants';

/**
 * URL Utility for Governance
 * @module
 * @type {{getGovernanceHelpLink: (())}}
 */
const UrlUtils = {
    /**
     * Get the help link for the User Account Management
     * @returns {string}
     */
    getGovernanceHelpLink() {
        return `http://${URL.GOVERNANCE_HELP_LINK_PATH}`;
    },
};

export default UrlUtils;
