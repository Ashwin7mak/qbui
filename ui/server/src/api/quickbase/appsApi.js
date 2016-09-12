/*
 The purpose of this module is to process /apps/<id>/ api requests.
 */
(function() {
    'use strict';

    let defaultRequest = require('request');
    let perfLogger = require('../../perfLogger');
    var httpStatusCodes = require('../../constants/httpStatusCodes');
    let log = require('../../logger').getLogger();

    module.exports = function(config) {
        var requestHelper = require('./requestHelper')(config);
        let routeHelper = require('../../routes/routeHelper');
        var constants = require('../../../../common/src/constants');

        //Module constants:
        var APPLICATION_JSON = 'application/json';
        var CONTENT_TYPE = 'Content-Type';

        var request = defaultRequest;

        //TODO: only application/json is supported for content type.  Need a plan to support XML
        //TODO: move getApps logic into this api
        var appsApi = {

            /**
             * Allows you to override the request object
             * @param requestOverride
             */
            setRequestObject: function(requestOverride) {
                request = requestOverride;
            },
            /**
             * Allows you to override the requestHelper object
             * @param requestRequestOverride
             */
            setRequestHelperObject: function(requestHelperOverride) {
                requestHelper = requestHelperOverride;
            },

            /**
             *
             * @param req
             * @returns Promise
             */
            getAppUsers: function(req) {

                return new Promise((resolve, reject) => {
                    var opts = requestHelper.setOptions(req);
                    opts.headers[CONTENT_TYPE] = APPLICATION_JSON;
                    opts.url = requestHelper.getRequestJavaHost() + routeHelper.getAppUsersRoute(req.url);

                    //  make the api request to get the app users
                    requestHelper.executeRequest(req, opts).then(
                        (response) => {
                            if (response.body) {
                                let users = JSON.parse(response.body);
                                resolve(users);
                            } else {
                                resolve({});
                            }
                        },
                        (error) => {
                            log.error({req: req}, "Error getting app users in getAppUsers()");
                            reject(error);
                        });
                });
            }

        };
        return appsApi;
    };
}());
