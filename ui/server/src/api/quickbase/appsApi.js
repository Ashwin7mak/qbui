/*
 The purpose of this module is to process /apps/<id>/ api requests.
 */
(function() {
    'use strict';

    let env = require('../../config/environment');
    let defaultRequest = require('../../requestClient').getClient(env);
    let perfLogger = require('../../perfLogger');
    let httpStatusCodes = require('../../constants/httpStatusCodes');
    let log = require('../../logger').getLogger();
    let _ = require('lodash');

    module.exports = function(config) {
        let requestHelper = require('./requestHelper')(config);
        let routeHelper = require('../../routes/routeHelper');
        let constants = require('../../../../common/src/constants');
        let rolesApi = require('./rolesApi')(config);

        let request = defaultRequest;

        let appsApi = {

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

            getAppAccessRights: function(req, appId) {
                return new Promise((resolve, reject) => {
                    let opts = requestHelper.setOptions(req);
                    opts.headers[constants.CONTENT_TYPE] = constants.APPLICATION_JSON;
                    opts.url = requestHelper.getRequestJavaHost() + routeHelper.getAppsAccessRightsRoute(req.url, appId);

                    //  make the api request to get the app rights
                    requestHelper.executeRequest(req, opts).then(
                        (response) => {
                            let rights = JSON.parse(response.body);
                            resolve(rights);
                        },
                        (error) => {
                            log.error({req: req}, "appsApi.getAppAccessRights(): Error retrieving app access rights.");
                            reject(error);
                        }
                    ).catch((ex) => {
                        requestHelper.logUnexpectedError('appsApi.getAppAccessRights(): unexpected error fetching app access rights.', ex, true);
                        reject(ex);
                    });
                });
            },

            /** TODO: This method has been copied from tableApi.js but will be refactored to be removed once
             *  circular dependencies between tableApi.js and appsApi.js have been sorted out.
             *
             * Create endpoint on the tableProperties object.
             * @param req
             * @param tableId
             * @returns {Promise}
             */
            _createTableProperties: function(req, table) {
                return new Promise((resolve, reject) =>{
                    let opts = requestHelper.setOptions(req);
                    opts.url = requestHelper.getRequestEeHost() + routeHelper.getTablePropertiesRoute(req.url, table.id);

                    requestHelper.executeRequest(req, opts).then(
                        (eeResponse) =>{
                            resolve(JSON.parse(eeResponse.body));
                        },
                        (error) =>{
                            requestHelper.logUnexpectedError('appsApi._createTableProperties(): error creating table properties', error, true);
                            resolve();
                        }).catch((ex) =>{
                            requestHelper.logUnexpectedError('appsApi._createTableProperties(): unexpected error creating table properties', ex, true);
                            resolve();
                        });
                });
            },

            /**
             * Get endpoint for tableProperties object.
             * @param req
             * @param table
             * @returns {Promise}
             */
            getTablePropertiesList: function(req) {
                return new Promise((resolve, reject) => {
                    let opts = requestHelper.setOptions(req);
                    opts.url = requestHelper.getRequestEeHost() + routeHelper.getTablePropertiesRoute(req.url);

                    requestHelper.executeRequest(req, opts).then(
                        (eeResponse) => {
                            resolve(JSON.parse(eeResponse.body));
                        },
                        (error) => {
                            log.error({req: req}, "appsApi.getTablePropertiesList(): Error getting table properties list from EE");
                            //resolve - we do not want to block the get Apps call on this failure
                            resolve({});
                        }).catch((ex) => {
                            requestHelper.logUnexpectedError('appsApi.getTablePropertiesList(): unexpected error getting table properties list from EE', ex, true);
                            //always resolve - we do not want to block the get Apps call on this failure
                            resolve({});
                        });
                });
            },

            /**
             * Helper method to update the app's tables after table properties have been retrieved
             * @param app
             * @param tablePropsArray
             * @private
             */
            _mergeTableProps(app, tablePropsArray, tablesWithoutProps) {
                //ideally there should be same number of responses as tables but just to be sure look up which response corresponds to which table
                app.tables.map((table) => {
                    let idx = _.findIndex(tablePropsArray, function(props) {return props.tableId === table.id;});
                    if (idx !== -1) {
                        Object.keys(tablePropsArray[idx]).forEach(function(key, index) {
                            table[key] = tablePropsArray[idx][key];
                        });
                    } else if (tablesWithoutProps) {
                        //no props found - maybe this table was created through api so populate values into the tableProperties object for the benefit of UI
                        tablesWithoutProps.push(table);
                    }
                });
            },

            /**
             * Create endpoint for the app object.
             *
             * NOTE: no tables are created in EE.  This is a future requirement but not yet implemented.
             *
             * @param req
             * @returns {Promise}
             */
            createApp: function(req) {
                return new Promise((resolve, reject) => {
                    let opts = requestHelper.setOptions(req);
                    opts.url = requestHelper.getRequestJavaHost() + routeHelper.getAppsRoute(req.url);

                    requestHelper.executeRequest(req, opts).then(
                        (response) => {
                            let resp = JSON.parse(response.body);
                            resolve(resp);
                        },
                        (error) => {
                            log.error({req: req}, "appsApi.createApp(): Error creating app.");
                            reject(error);
                        }
                    ).catch((ex) => {
                        requestHelper.logUnexpectedError('appsApi.createApp(): unexpected error creating app.', ex, true);
                        reject(ex);
                    });
                });
            },

            getApp: function(req, appId) {
                return new Promise((resolve, reject) => {
                    let opts = requestHelper.setOptions(req);
                    opts.headers[constants.CONTENT_TYPE] = constants.APPLICATION_JSON;
                    opts.url = requestHelper.getRequestJavaHost() + routeHelper.getAppsRoute(req.url, appId);

                    let appPromises = [];
                    appPromises.push(requestHelper.executeRequest(req, opts));
                    //also get the table properties list for the app
                    let propsReq = _.clone(req);
                    appPromises.push(this.getTablePropertiesList(propsReq));

                    Promise.all(appPromises).then(
                        (responses) => {
                            let app = JSON.parse(responses[0].body);
                            if (responses.length > 1) {
                                let tablesWithoutProps = [];
                                this._mergeTableProps(app, responses[1], tablesWithoutProps);
                                if (tablesWithoutProps.length > 0) {
                                    let tablePromises = [];
                                    tablesWithoutProps.forEach(table => {
                                        let tablePropsReq = _.clone(req);
                                        tablePropsReq.method = 'POST';
                                        tablePropsReq.rawBody = JSON.stringify({"tableNoun": table.name});
                                        tablePropsReq.headers[constants.CONTENT_LENGTH] = tablePropsReq.rawBody.length;
                                        tablePromises.push(this._createTableProperties(tablePropsReq, table));
                                    });
                                    Promise.all(tablePromises).then(
                                        (propsResponses) => {
                                            this._mergeTableProps(app, propsResponses);
                                            resolve(app);
                                        },
                                        () => {
                                            resolve(app);
                                        }
                                    ).catch((ex) => {
                                        requestHelper.logUnexpectedError('appsApi.getApp(): unexpected error creating table props for tables missing props in EE', ex, true);
                                        resolve(app);
                                    });
                                } else {
                                    resolve(app);
                                }
                            } else {
                                resolve(app);
                            }
                        }
                    ).catch((ex) => {
                        requestHelper.logUnexpectedError('appsApi.getApp(): unexpected error fetching app', ex, true);
                        reject(ex);
                    });
                });
            },

            /**
             * Return a hydrated app; this includes appAccessRights, core table properties and client table properties
             *
             * @param req
             * @param appId
             * @returns {Promise}
             */
            getHydratedApp: function(req, appId) {
                return new Promise((resolve, reject) => {
                    let appRequests = [this.getApp(req, appId), this.getAppAccessRights(req, appId)];
                    Promise.all(appRequests).then(
                        function(response) {
                            let app = response[0];
                            app.accessRights = response[1];

                            //sort tables by id to match create order
                            if (app.tables) {
                                app.tables = _.sortBy(app.tables, 'id');
                            }

                            resolve(app);
                        },
                        function(error) {
                            log.error({req: req}, "appsApi.getHydratedApp(): Error retrieving hydrated app.");
                            reject(error);
                        }
                    ).catch(function(error) {
                        requestHelper.logUnexpectedError('reportsAPI..getHydratedApp', error, true);
                        reject(error);
                    });
                });
            },

            getApps: function(req) {
                let hydrate = (requestHelper.getQueryParameterValue(req, constants.REQUEST_PARAMETER.HYDRATE) === '1');
                if (hydrate === true) {
                    return new Promise((resolve, reject) => {
                        let opts = requestHelper.setOptions(req);
                        opts.headers[constants.CONTENT_TYPE] = constants.APPLICATION_JSON;
                        opts.url = requestHelper.getRequestJavaHost() + routeHelper.getAppsRoute(req.url);

                        //  make the api request to get the apps
                        requestHelper.executeRequest(req, opts).then(
                            (response) => {
                                let apps = JSON.parse(response.body);

                                let promises = [];
                                apps.forEach((app) => {
                                    promises.push(this.getHydratedApp(_.clone(req), app.id));
                                });

                                Promise.all(promises).then(
                                    function(resp) {
                                        let hydratedApps = [];
                                        for (let i = 0; i < resp.length; i++) {
                                            hydratedApps.push(resp[i]);
                                        }
                                        resolve(hydratedApps);
                                    },
                                    function(err) {
                                        log.error({req: req}, "appsApi.getApps(): Error retrieving app in hydrated apps");
                                        reject(err);
                                    }
                                );
                            },
                            (error) => {
                                log.error({req: req}, "appsApi.getApps(): Error retrieving list of apps");
                                reject(error);
                            }
                        ).catch((ex) => {
                            requestHelper.logUnexpectedError('appsApi.getApps()..unexpected error retrieving list of hydrated apps', ex, true);
                            reject(ex);
                        });
                    });
                } else {
                    return new Promise((resolve, reject) => {
                        let opts = requestHelper.setOptions(req);
                        opts.headers[constants.CONTENT_TYPE] = constants.APPLICATION_JSON;
                        opts.url = requestHelper.getRequestJavaHost() + routeHelper.getAppsRoute(req.url);

                        //  make the api request to get the apps
                        requestHelper.executeRequest(req, opts).then(
                            (response) => {
                                let apps = JSON.parse(response.body);
                                resolve(apps);
                            },
                            (error) => {
                                log.error({req: req}, "appsApi.getApps(): Error retrieving hydrated apps");
                                reject(error);
                            }
                        ).catch((ex) => {
                            requestHelper.logUnexpectedError('appsApi.getApps()..unexpected error fetching apps', ex, true);
                            reject(ex);
                        });
                    });
                }
            },

            /**
             *
             * @param req
             * @returns Promise
             */
            getAppUsers: function(req) {
                return new Promise((resolve, reject) => {
                    let opts = requestHelper.setOptions(req);
                    opts.headers[constants.CONTENT_TYPE] = constants.APPLICATION_JSON;
                    opts.url = requestHelper.getRequestJavaHost() + routeHelper.getAppUsersRoute(req.url);

                    //  make the api request to get the app users
                    requestHelper.executeRequest(req, opts).then(
                        (response) => {
                            let users = {};
                            let usersFormatted = [];
                            if (response.body) {
                                users = JSON.parse(response.body);
                                if (users) {
                                    //  convert id property to userId for consistency with user values in records
                                    Object.keys(users).forEach(function(key) {
                                        users[key].forEach(user => {
                                            user.userId = user.id;
                                            _.unset(user, "id");
                                            usersFormatted.push(user);
                                        });
                                    });
                                }
                            }
                            //we need to return the users formatted with userId as an array of users for the user picker
                            //we also need to return the hashmap given to use from core for the App User Management screen
                            resolve([usersFormatted, users]);
                        },
                        (error) => {
                            log.error({req: req}, "Error getting app users in getAppUsers()");
                            reject(error);
                        }
                    ).catch((ex) => {
                        requestHelper.logUnexpectedError('appsAPI..unexpected error fetching app user in getAppUsers method', ex, true);
                        reject(ex);
                    });
                });
            },

            /**
             * Gets relationships object from relationships endpoint for a specific app given that the req.url contains
             * an appId.
             * @param req assumes that req.url contains an appId
             * @returns {Promise}
             */
            getRelationshipsForApp: function(req) {
                return new Promise((resolve, reject) => {
                    let opts = requestHelper.setOptions(req);
                    opts.headers[constants.CONTENT_TYPE] = constants.APPLICATION_JSON;
                    opts.url = requestHelper.getRequestJavaHost() + routeHelper.getRelationshipsRoute(req.url);

                    //  make the api request to get the relationships for an app
                    requestHelper.executeRequest(req, opts).then(
                        (response) => {
                            let relationships = JSON.parse(response.body);
                            resolve(relationships);
                        },
                        (error) => {
                            log.error({req: req}, "appsApi.getRelationshipsForApp(): Error retrieving relationships.");
                            reject(error);
                        }
                    ).catch((ex) => {
                        requestHelper.logUnexpectedError('appsApi.getRelationshipsForApp(): unexpected error fetching relationships', ex, true);
                        reject(ex);
                    });
                });
            },

            /**
             * Get a single table or all tables for an app
             *
             * @param req
             * @returns {Promise}
             */
            getTablesForApp: function(req, tableId) {
                return new Promise((resolve, reject) => {
                    let opts = requestHelper.setOptions(req, true);
                    opts.url = requestHelper.getRequestJavaHost() + routeHelper.getTablesRoute(req.url, tableId);

                    requestHelper.executeRequest(req, opts).then(
                        (response) => {
                            const tables = JSON.parse(response.body);
                            resolve(tables);
                        },
                        (error) => {
                            log.error({req: req}, "appsApi.getTablesForApp(): Error fetching app tables on core");
                            reject(error);
                        }
                    ).catch((ex) => {
                        requestHelper.logUnexpectedError('appsApi.getTablesForApp(): unexpected error fetching app tables on core', ex, true);
                        reject(ex);
                    });
                });
            },

            /**
             * Fetch app users and a hydrated app
             *
             * @param req
             * @param appId
             * @returns {Promise}
             */
            getAppComponents: function(req, appId) {
                return new Promise((resolve, reject) => {
                    let appComponents = [this.getAppUsers(req), this.getHydratedApp(req, appId)];
                    Promise.all(appComponents).then(
                        function(response) {
                            resolve({
                                users: response[0],
                                app: response[1]
                            });
                        },
                        function(error) {
                            log.error({req: req}, "appsApi.getAppComponents(): Error retrieving app components.");
                            reject(error);
                        }
                    ).catch(function(error) {
                        requestHelper.logUnexpectedError('reportsAPI..getAppComponents', error, true);
                        reject(error);
                    });
                });
            }

        };
        return appsApi;
    };
}());
