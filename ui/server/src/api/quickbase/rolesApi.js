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
             * Fetch the list of roles for an app
             *
             * @param req
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
                            let roles = JSON.parse(response.body);
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
            },

            /**
             * Remove a list of usersIds from an App Role
             *
             * @param req
             * @returns Promise
             */
            removeUsersFromRole: function(req) {
                return new Promise((resolve, reject) => {
                    let opts = requestHelper.setOptions(req);
                    opts.headers[constants.CONTENT_TYPE] = constants.APPLICATION_JSON;

                    //  make the api request to remove the users from the app role
                    requestHelper.executeRequest(req, opts).then(
                        (response) => {
                            resolve(response);
                        },
                        (error) => {
                            log.error({req: req}, "Error removing Users from Role");
                            reject(error);
                        }
                    ).catch((ex) => {
                        requestHelper.logUnexpectedError('rolesAPI..unexpected error removing Users from role in removeUsersFromRole method', ex, true);
                        reject(ex);
                    });
                });
            },

            /**
             * Assign a list of usersIds to an App Role
             *
             * @param req
             * @returns Promise
             */
            assignUsersToRole: function(req) {
                return new Promise((resolve, reject) => {
                    let opts = requestHelper.setOptions(req);
                    opts.headers[constants.CONTENT_TYPE] = constants.APPLICATION_JSON;

                    //  make the api request to remove the users from the app role
                    requestHelper.executeRequest(req, opts).then(
                        (response) => {
                            resolve(response);
                        },
                        (error) => {
                            log.error({req: req}, "Error Assigning Users to Role");
                            reject(error);
                        }
                    ).catch((ex) => {
                        requestHelper.logUnexpectedError('rolesAPI..unexpected error assigning Users to role in assignUsersToRole method', ex, true);
                        reject(ex);
                    });
                });
            }

        };

        return rolesApi;

    };
}());
