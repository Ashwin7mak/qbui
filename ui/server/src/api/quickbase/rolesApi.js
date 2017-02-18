/**
 * Created by rbeyer on 2/18/17.
 */
/*
 The purpose of this module is to process /apps/<id>/roles/ api requests.
 */
(function() {
    'use strict';

    let defaultRequest = require('request');

    module.exports = function(config) {
        let requestHelper = require('./requestHelper')(config);
        let routeHelper = require('../../routes/routeHelper');
        let constants = require('../../../../common/src/constants');
        let log = require('../../logger').getLogger();
        let url = require('url');

        let request = defaultRequest;

        let rolesApi = {

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
             * Fetch the requested field meta data for a table.
             *
             * @param req
             * @param includeQueryParameters
             * @returns Promise
             */
            getAppRoles: function(req) {
                return new Promise((resolve, reject) => {
                    let opts = requestHelper.setOptions(req);
                    opts.headers[constants.CONTENT_TYPE] = constants.APPLICATION_JSON;
                    opts.url = requestHelper.getRequestJavaHost() + routeHelper.getAppRolesRoute(req.url);

                    //  make the api request to get the app users
                    requestHelper.executeRequest(req, opts).then(
                        (response) => {
                            let roles = {};
                            if (response.body) {
                                roles = JSON.parse(response.body);
                            }
                            resolve(roles);
                        },
                        (error) => {
                            log.error({req: req}, "Error getting app users in getAppRoles()");
                            reject(error);
                        }
                    ).catch((ex) => {
                        requestHelper.logUnexpectedError('rolesAPI..unexpected error fetching app roles in getAppRoles method', ex, true);
                        reject(ex);
                    });
                });
            }

        };

        return rolesApi;

    };
}());
