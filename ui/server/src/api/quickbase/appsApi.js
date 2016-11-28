/*
 The purpose of this module is to process /apps/<id>/ api requests.
 */
(function() {
    'use strict';

    let defaultRequest = require('request');
    let perfLogger = require('../../perfLogger');
    let httpStatusCodes = require('../../constants/httpStatusCodes');
    let log = require('../../logger').getLogger();
    let _ = require('lodash');

    module.exports = function(config) {
        var requestHelper = require('./requestHelper')(config);
        let routeHelper = require('../../routes/routeHelper');
        var constants = require('../../../../common/src/constants');

        var request = defaultRequest;

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
                    opts.headers[constants.CONTENT_TYPE] = constants.APPLICATION_JSON;
                    opts.url = requestHelper.getRequestJavaHost() + routeHelper.getAppUsersRoute(req.url);

                    //  make the api request to get the app users
                    requestHelper.executeRequest(req, opts).then(
                        (response) => {
                            if (response.body) {
                                let users = JSON.parse(response.body);

                                /**
                                 * convert id property to userId for consistency with user values in records
                                 */
                                users.forEach(user => {
                                    user.userId = user.id;
                                    _.unset(user, "id");
                                });

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
            },

            /**
             * Supports both GET and POST request to resolve an applications run-time stack
             * preference.
             *
             * For a GET request, will return which stack (mercury or classic) the application is
             * configured to run in.
             *
             * For a POST request, will set the application stack (mercury or classic) preference
             * on where the application is to be run.
             *
             * @param req
             * @returns Promise
             */
            stackPreference: function(req) {
                let opts = requestHelper.setOptions(req);
                opts.headers[constants.CONTENT_TYPE] = constants.APPLICATION_JSON;

                //  intentionally declare value as undefined
                let value;

                //  if a post request, then updating stack preference
                if (requestHelper.isPost(req)) {
                    //TODO review && document
                    let resp = JSON.parse(opts.body);
                    value = resp[constants.REQUEST_PARAMETER.OPEN_IN_V3] === true ? 1 : 0;
                }

                //  configure the current stack url
                opts.url = requestHelper.getLegacyHost() + routeHelper.getApplicationStackPreferenceRoute(req.params.appId, value);
                log.debug("Stack preference: " + opts.url);

                return requestHelper.executeRequest(req, opts);
            }

        };
        return appsApi;
    };
}());
