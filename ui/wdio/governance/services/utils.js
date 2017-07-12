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
     * @param userCredentials - JSON object
     * @returns string - formatted url
     */
    // TODO: need to get server from config file ***
    constructURL(hostname, app, action, urlParams, userCredentials) {
        // Format URL for http request
        return (sysDefVars.HTTPS + hostname + server + sysDefVars.SLASH_DB_SLASH + app + sysDefVars.ACTION + action +
            sysDefVars.AMP_USERNAME + userCredentials.Username + sysDefVars.AMP_PASSWROD + userCredentials.Password + sysDefVars.AMP + urlParams);
    },
    /**
     * Construct body by adding qbdapi tags
     * @param body
     * @returns string - formated body
     */
    constructBody(body) {
        // Add qdbapi around body
        return `sysDefVars.QDBAPI_OPENTAG ${body} sysDefVars.QDBAPI_CLOSETAG`;
    },
    /**
     * Parse http response in xml to json
     * @param httpResponse - http response in xml format
     * @returns {Array} - response body in json
     */
    parseXMLResponseToJSON(httpResponse) {
        // Parse XML response to JSON
        let resJSON = [], resXML = [];
        try {
            resXML = httpResponse.body;
            resJSON = parser.toJson(resXML.trim());
            // resJSON = JSON.stringify(resJSON);
            return (resJSON);
        } catch (ex) {
            log.debug(ex);
            throw ex;
        }
    },
    /**
     * Return JSON respone qdbapi data
     * @param responseBody
     * @returns {Array}
     */
    getJSONQdbapiData(responseBody) {
        try {
            responseBody = JSON.parse(responseBody);
            return responseBody.qdbapi;
        } catch (ex) {
            log.debug(ex);
            throw ex;
        }
    },
    /**
     * Generate an unique ID
     * @returns {number}
     */
    generateUniqueID() {
        return Date.now();
    },

};
