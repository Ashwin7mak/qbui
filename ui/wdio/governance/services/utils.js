/**
 * Utility functions
 */
const parser = require('xml2json');
const sysDefVars = require('../config/sysDefVars');
const log = require('../../../server/src/logger').getLogger();
let server = '.currentstack-int.quickbaserocks.com';

module.exports = {
    /**
     * Construct URL for http request
     * @param hostname - reaml name
     * @param app - app type: main or app
     * @param action - api method
     * @param urlParams - extra paramenters
     * @param username - username
     * @param password - password
     * @returns string - formatted url
     */
    // TODO: need to get server from config file ***
    constructURL(hostname, app, action, urlParams, username, password) {
        // Format URL for http request
        // console.log('config.legacyBase = ', config.legacyBase);
        // server = config.legacyBase;
        return sysDefVars.HTTPS + hostname + server + sysDefVars.SLASH_DB_SLASH + app + sysDefVars.ACTION + action +
            sysDefVars.AMP_USERNAME + username + sysDefVars.AMP_PASSWROD + password + sysDefVars.AMP + urlParams;
    },
    /**
     * Construct body by adding qbdapi tags
     * @param body
     * @returns string - formated body
     */
    constructBody(body) {
        // Add qdbapi around body
        return (sysDefVars.QDBAPI_OPENTAG + body + sysDefVars.QDBAPI_CLOSETAG);
    },
    /**
     * Parse http response in xml to json
     * @param httpResponse - http response in xml format
     * @returns {Array} - response body in json
     */
    parseXMLResponseToJSON(httpResponse) {
        // Parse XML response to JSON
        let res_json = [], res_xml = [];
        res_xml = httpResponse.body;
        res_json = parser.toJson(res_xml.trim());
        // res_json = JSON.stringify(res_json);
        return (res_json);
    },
    /**
     * Return JSON respone qdbapi data
     * @param res_body
     * @returns {Array}
     */
    getJsonQdbapiData(res_body) {
        let res_data = [];
        try{
            res_body = JSON.parse(res_body);
            res_data = res_body.qdbapi;
            return res_data;
        } catch (ex) {
            log.debug(ex);
            console.log(ex);
        }
    },
    /**
     * Generate an unique ID
     * @returns {number}
     */
    generateUniqueID() {
        return Date.now();
    },
    /**
     * Switch to Gevernance page
     * @param browser
     */
    switchToGovernancePage(browser) {
        let tabIds = browser.getTabIds();
        return browser.switchTab(tabIds[1]);
    }
}

