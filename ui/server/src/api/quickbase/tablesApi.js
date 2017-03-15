///*
// The purpose of this module is to process /ticket api requests.
// */
//(function() {
//    'use strict';
//
//    let defaultRequest = require('request');
//    let perfLogger = require('../../perfLogger');
//    let httpStatusCodes = require('../../constants/httpStatusCodes');
//    let log = require('../../logger').getLogger();
//    let _ = require('lodash');
//
//    module.exports = function(config) {
//        let requestHelper = require('./requestHelper')(config);
//        let routeHelper = require('../../routes/routeHelper');
//        let constants = require('../../../../common/src/constants');
//        let cookieUtils = require('../../utility/cookieUtils');
//        let ob32Utils = require('../../utility/ob32Utils');
//        let request = defaultRequest;
//
//        let tablesApi = {
//
//            /**
//             * Allows you to override the request object
//             * @param requestOverride
//             */
//            setRequestObject: function(requestOverride) {
//                request = requestOverride;
//            },
//            /**
//             * Allows you to override the requestHelper object
//             * @param requestRequestOverride
//             */
//            setRequestHelperObject: function(requestHelperOverride) {
//                requestHelper = requestHelperOverride;
//            },
//
//            createTableProperties: function(req, payload) {
//                let table = JSON.parse(response.body);
//                opts.url = requestHelper.getRequestEeHost() + routeHelper.getTablePropertiesRoute(req.url);
//                //opts.body = JSON.stringify({tableNoun: payload.tableName, description: payload.description, icon: payload.icon});
//                requestHelper.executeRequest(req, opts).then(
//                    (eeResponse) =>{
//                        resolve(table);
//                    },
//                    (error) => {
//                        //in case of error/exception while setting table properties on EE clean out the table created on core because there is no queue right now.
//                        log.error({req: req}, "tablesApi.createTableProperties(): Error setting table properties");
//                        reject(error);
//                    }).catch((ex) => {
//                        requestHelper.logUnexpectedError('tablesApi.createTableProperties(): unexpected error setting table properties', ex, true);
//                        reject(ex);
//                    });
//            },
//            createTable: function(req, payload) {
//                return new Promise((resolve, reject) => {
//                    let opts = requestHelper.setOptions(req, true);
//                    opts.headers[constants.CONTENT_TYPE] = constants.APPLICATION_JSON;
//                    opts.url = requestHelper.getRequestJavaHost() + routeHelper.getTablesRoute(req.url);
//
//                    //opts.body = JSON.stringify({name: payload.tableName});
//                    //  make the api request to get the user object
//                    requestHelper.executeRequest(req, opts).then(
//                        (response) => {
//                            let table = JSON.parse(response.body);
//                            //opts.body = JSON.stringify({tableNoun: payload.tableName, description: payload.description, icon: payload.icon});
//                            this.createTableProperties(req, payload).then(
//                                (eeResponse) =>{
//                                    resolve(table);
//                                },
//                                (error) => {
//                                    //in case of error/exception while setting table properties on EE clean out the table created on core because there is no queue right now.
//                                    this.deleteTable(req, payload);
//                                    reject(error);
//                                }).catch((ex) => {
//                                    this.deleteTable(req, payload);
//                                    reject(ex);
//                                });
//                        },
//                        (error) => {
//                            log.error({req: req}, "tablesApi.createTable(): Error creating table on core");
//                            reject(error);
//                        }
//                    ).catch((ex) => {
//                        requestHelper.logUnexpectedError('tablesApi.createTable(): unexpected error creating table on core', ex, true);
//                        reject(ex);
//                    });
//                });
//            },
//            /**
//             * Get requesting user's meta data.
//             * @param req
//             * @returns {Promise}
//             */
//            getReqUser: function(req) {
//                return new Promise((resolve, reject) => {
//                    let ticket = req.cookies[constants.COOKIES.TICKET];
//                    if (!ticket) {
//                        ticket = req.headers.ticket;
//                    }
//                    if (ticket) {
//                        let userId = cookieUtils.getUserId(ticket);
//                        this.getUserById(req, userId).then(function(response) {
//                            resolve(response);
//                        },
//                        function(error) {
//                            log.error({req: req}, "usersApi.getReqUser(): Error retrieving user.");
//                            reject(error);
//                        }).catch(function(error) {
//                            requestHelper.logUnexpectedError('usersApi..getReqUser', error, true);
//                            reject(error);
//                        });
//                    }
//                });
//            },
//            /**
//             * Given a userId get that user's meta data.
//             * @param req
//             * @param userId
//             * @returns {Promise}
//             */
//            getUserById: function(req, userId) {
//                return new Promise((resolve, reject) => {
//                    let opts = requestHelper.setOptions(req, true);
//                    opts.headers[constants.CONTENT_TYPE] = constants.APPLICATION_JSON;
//                    if (routeHelper.isAdminRoute(req.url)) {
//                        opts.url = requestHelper.getRequestJavaHost() + routeHelper.getUsersRouteForAdmin(req.url, userId);
//                    } else {
//                        opts.url = requestHelper.getRequestJavaHost() + routeHelper.getUsersRoute(req.url, userId);
//                    }
//                    //  make the api request to get the user object
//                    requestHelper.executeRequest(req, opts).then(
//                        (response) => {
//                            let user = JSON.parse(response.body);
//                            resolve(user);
//                        },
//                        (error) => {
//                            log.error({req: req}, "usersApi.getUserById(): Error retrieving user for userId:" + userId);
//                            reject(error);
//                        }
//                    ).catch((ex) => {
//                        requestHelper.logUnexpectedError('usersApi.getUserById(): unexpected error fetching user', ex, true);
//                        reject(ex);
//                    });
//                });
//            }
//        };
//        return usersApi;
//    };
//}());
