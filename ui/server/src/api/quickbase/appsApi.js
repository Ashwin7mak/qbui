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
             * TODO
             *
             * @param req
             * @returns Promise
             */
            //  TODO should the get and post be broken out into 2 separate methods????
            stackPreference: function(req) {
                let opts = requestHelper.setOptions(req, true);
                opts.headers[constants.CONTENT_TYPE] = constants.APPLICATION_JSON;

                //  reset url to call the legacy stack
                let isPost = requestHelper.isPost(req);
                let openInMercury = false;
                if (isPost === true) {
                    let resp = JSON.parse(opts.body);
                    //TODO openInMercury should be a common constant
                    //TODO confirm the default behavior if invalid value..
                    if (resp) {
                        openInMercury = resp.openInMercury;
                    }
                }
                opts.url = requestHelper.getLegacyHost() + routeHelper.getApplicationStackRoute(req.params.appId, isPost, openInMercury);

                //return requestHelper.executeRequest(req, opts);
                return Promise.resolve('ok');
            }

        };
        return appsApi;
    };
}());
