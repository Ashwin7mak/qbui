/*
 The purpose of this module is to process /ticket api requests.
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
        let cookieUtils = require('../../utility/cookieUtils');
        let ob32Utils = require('../../utility/ob32Utils');
        let fieldsApi = require('./fieldsApi')(config);
        let reportsApi = require('./reportsApi')(config);
        let formsApi = require('./formsApi')(config);
        let cannedNewTableElements = require('./cannedNewTableElements');
        let request = defaultRequest;

        let tablesApi = {

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
             * Allows overriding the fieldApi object.
             * This is only here for the purpose of testing.
             * @param override
             */
            setFieldsApi: function(override) {
                fieldsApi = override;
            },
            /**
             * Allows overriding the formsApi object.
             * This is only here for the purpose of testing.
             * @param override
             */
            setFormsApi: function(override) {
                formsApi = override;
            },
            /**
             * Allows overriding the reportsApi object.
             * This is only here for the purpose of testing.
             * @param override
             */
            setReportsApi: function(override) {
                reportsApi = override;
            },

            /**
             * Create endpoint on the tableProperties object.
             * @param req
             * @param tableId
             * @returns {Promise}
             */
            createTableProperties: function(req, tableId) {
                return new Promise((resolve, reject) =>{
                    let opts = requestHelper.setOptions(req);
                    opts.url = requestHelper.getRequestEeHost() + routeHelper.getTablePropertiesRoute(req.url, tableId);

                    requestHelper.executeRequest(req, opts).then(
                        (eeResponse) =>{
                            resolve(JSON.parse(eeResponse.body));
                        },
                        (error) =>{
                            log.error({req: req}, "tablesApi.createTableProperties(): Error setting table properties");
                            reject(error);
                        }).catch((ex) =>{
                            requestHelper.logUnexpectedError('tablesApi.createTableProperties(): unexpected error setting table properties', ex, true);
                            reject(ex);
                        });
                });
            },
            /**
             * Delete endpoint on the tableProperties object
             * @param req
             * @param tableId
             * @returns {Promise}
             */
            deleteTableProperties: function(req, tableId) {
                return new Promise((resolve, reject) =>{
                    let opts = requestHelper.setOptions(req);
                    opts.method = 'delete';
                    opts.url = requestHelper.getRequestEeHost() + routeHelper.getTablePropertiesRoute(req.url, tableId);

                    requestHelper.executeRequest(req, opts).then(
                        (eeResponse) =>{
                            resolve(eeResponse);
                        },
                        (error) =>{
                            log.error({req: req}, "tablesApi.deleteTableProperties(): Error deleting table properties");
                            reject(error);
                        }).catch((ex) =>{
                            requestHelper.logUnexpectedError('tablesApi.deleteTableProperties(): unexpected error deleting table properties', ex, true);
                            reject(ex);
                        });
                });
            },
            /**
             * Delete endpoint on EE to delete all the entities for a table. This includes tableProperties, forms for now.
             * @param req
             * @param tableId
             * @returns {Promise}
             */
            deleteTableEntities: function(req, tableId) {
                return new Promise((resolve, reject) =>{
                    let opts = requestHelper.setOptions(req);
                    opts.method = 'delete';
                    opts.url = requestHelper.getRequestEeHost() + routeHelper.getEETablesRoute(req.url, tableId);

                    requestHelper.executeRequest(req, opts).then(
                        (eeResponse) =>{
                            resolve(eeResponse);
                        },
                        (error) =>{
                            log.error({req: req}, "tablesApi.deleteTableEntities(): Error deleting table entitied");
                            reject(error);
                        }).catch((ex) =>{
                            requestHelper.logUnexpectedError('tablesApi.deleteTableEntities(): unexpected error deleting table entities', ex, true);
                            reject(ex);
                        });
                });
            },
            /**
             * Create endpoint for the table object
             * @param req
             * @returns {Promise}
             */
            createTable: function(req) {
                return new Promise((resolve, reject) => {
                    let opts = requestHelper.setOptions(req);
                    opts.url = requestHelper.getRequestJavaHost() + routeHelper.getTablesRoute(req.url);

                    //  make the api request to get the user object
                    requestHelper.executeRequest(req, opts).then(
                        (response) => {
                            let tableId = JSON.parse(response.body);
                            resolve(tableId);
                        },
                        (error) => {
                            log.error({req: req}, "tablesApi.createTable(): Error creating table on core");
                            reject(error);
                        }
                    ).catch((ex) => {
                        requestHelper.logUnexpectedError('tablesApi.createTable(): unexpected error creating table on core', ex, true);
                        reject(ex);
                    });
                });
            },
            /**
             * Delete endpoint for the table object
             * @param req
             * @param tableId
             * @returns {Promise}
             */
            deleteTable: function(req, tableId) {
                return new Promise((resolve, reject) => {
                    let opts = requestHelper.setOptions(req);
                    opts.method = 'delete';
                    opts.url = requestHelper.getRequestJavaHost() + routeHelper.getTablesRoute(req.url, tableId);

                    requestHelper.executeRequest(req, opts).then(
                        (response) => {
                            resolve(response);
                        },
                        (error) => {
                            log.error({req: req}, "tablesApi.deleteTable(): Error deleting table on core:" + tableId);
                            reject(error);
                        }
                    ).catch((ex) => {
                        requestHelper.logUnexpectedError('tablesApi.deleteTable(): unexpected error deleting table on core', ex, true);
                        reject(ex);
                    });
                });
            },

            /**
             * Patch endpoint for the table object
             * @param req
             * @returns {Promise}
             */
            patchTable: function(req, tableId) {
                return new Promise((resolve, reject) => {
                    let opts = requestHelper.setOptions(req);
                    opts.url = requestHelper.getRequestJavaHost() + routeHelper.getTablesRoute(req.url, tableId);
                    opts.method = 'patch';

                    requestHelper.executeRequest(req, opts).then(
                        (response) => {
                            resolve(response.body);
                        },
                        (error) => {
                            log.error({req: req}, "tablesApi.patchTable(): Error patching table on core");
                            reject(error);
                        }
                    ).catch((ex) => {
                        requestHelper.logUnexpectedError('tablesApi.patchTable(): unexpected error patching table on core', ex, true);
                        reject(ex);
                    });
                });
            },

            /**
             * Put endpoint for tableProperties object.
             * @param req
             * @param tableId
             * @returns {Promise}
             */
            replaceTableProperties: function(req, tableId) {
                return new Promise((resolve, reject) => {
                    let opts = requestHelper.setOptions(req);
                    opts.url = requestHelper.getRequestEeHost() + routeHelper.getTablePropertiesRoute(req.url, tableId);
                    opts.method = 'PUT';

                    requestHelper.executeRequest(req, opts).then(
                        (response) => {
                            resolve(JSON.parse(response.body));
                        },
                        (error) => {
                            log.error({req: req}, "tablesApi.replaceTableProperties(): Error replacing table properties on EE");
                            // If the table properties object is not in ee, create one with table noun in it.
                            if (error.statusCode === 404) {
                                let tableProperReq = _.clone(req);

                                tableProperReq.method = 'POST';
                                tableProperReq.rawBody = JSON.stringify({"tableNoun": req.body.tableNoun});
                                tableProperReq.headers[constants.CONTENT_LENGTH] = tableProperReq.rawBody.length;

                                this.createTableProperties(tableProperReq, tableId).then(
                                    (eeResponse) => {
                                        resolve(eeResponse);
                                    },
                                    (eeError) => {
                                        // Reject, let the caller know that the properties creation failed
                                        log.error({req: req}, "tablesApi.createTableProperties(): Error creating table properties on EE");
                                        reject(eeError);
                                    }
                                ).catch((ex) => {
                                    requestHelper.logUnexpectedError('tablesApi.createTableProperties(): unexpected error creating table properties on EE', ex, true);
                                    reject(ex);
                                });
                            } else {
                                //resolve - we do not want to block the get Apps call on this failure
                                resolve({});
                            }
                        }
                    ).catch((ex) => {
                        requestHelper.logUnexpectedError('tablesApi.replaceTableProperties(): unexpected error replacing table properties on EE', ex, true);
                        reject(ex);
                    });
                });
            },

           /**
             * This api creates a table with 2 fields to the table - one Text and one Datein core,
            *  initializes a tableproperties object in EE.
             * Then creates 2 reports a List All and List Changes report
             * And a form with the previously created fields.
             * @param req
             * @returns {Promise}
             */
            createTableComponents: function(req) {
                return new Promise((resolve, reject) =>{
                // this has input for both creating table and props
                // core fails if its passed in props that are not recognized for some reason
                // so we need to parse this here and send only what's recognized.
                    let reqPayload = req.body;
                    if (!reqPayload.name || !reqPayload.tableNoun) {
                        reject("Required parameters missing");
                    }
                    let tableReq = _.clone(req);
                    tableReq.rawBody = JSON.stringify({name: reqPayload.name, fields :  cannedNewTableElements.getCannedFields()});
                    tableReq.headers[constants.CONTENT_LENGTH] = tableReq.rawBody.length;
                    this.createTable(tableReq).then(
                        (tableId) => {
                            fieldsApi.getFieldsForTable(req, tableId).then(
                                (fields) => {
                                    let fieldIds = [];
                                    fields.forEach((field) =>{
                                        if (field.builtIn === false) {
                                            fieldIds.push(field.id);
                                        }
                                    });

                                    let tableProperReq = _.clone(req);
                                    let tablePropsPayload = _.pick(reqPayload, ['tableNoun', 'description', 'tableIcon']);
                                    tableProperReq.rawBody = JSON.stringify(Object.assign(tablePropsPayload, {recordTitleFieldId: fieldIds[0]}));
                                    tableProperReq.headers[constants.CONTENT_LENGTH] = tableProperReq.rawBody.length;

                                    this.createTableProperties(tableProperReq, tableId).then(
                                        () => {
                                            let promises = [];
                                            let reportsToCreate = cannedNewTableElements.getCannedReports(reqPayload.name);
                                            let tablesRootUrl = routeHelper.getTablesRoute(req.url, tableId);

                                            reportsToCreate.forEach((report) => {
                                                let reportReq = _.clone(req);
                                                reportReq.url = tablesRootUrl;
                                                reportReq.rawBody = JSON.stringify(report);
                                                reportReq.headers[constants.CONTENT_LENGTH] = reportReq.rawBody.length;
                                                promises.push(reportsApi.createReport(reportReq));
                                            });
                                            let formsToCreate = cannedNewTableElements.getCannedForms(reqPayload.tableNoun, fieldIds);
                                            formsToCreate.forEach((form) => {
                                                let formReq = _.clone(req);
                                                formReq.url = tablesRootUrl;
                                                formReq.rawBody = JSON.stringify(form);
                                                formReq.headers[constants.CONTENT_LENGTH] = formReq.rawBody.length;
                                                promises.push(formsApi.createForm(formReq));
                                            });
                                            Promise.all(promises).then(
                                                (response) => {
                                                    let reportIds = [];
                                                    reportIds.push(response[0], response[1]);
                                                    resolve(tableId);
                                                },
                                                (error) => {
                                                    this.deleteTableProperties(req, tableId);
                                                    this.deleteTable(req, tableId);
                                                    reject(error);
                                                }
                                            );
                                        },
                                        (error) => {
                                            //delete the table if table props creation failed to clean up core.
                                            // Dont wait for response because what can you really do if it fails?
                                            this.deleteTable(req, tableId);
                                            reject(error);
                                        }
                                    );
                                },
                                (error) => {
                                    //delete the table if we don't get the id's for newly created canned fields(non-builtin).
                                    this.deleteTable(req, tableId);
                                    reject(error);
                                }
                            );
                        },
                        (error) => {
                            reject(error);
                        }
                    );
                });
            },

            /**
             * The update Table call will send the whole object for TableProperties + name of the table if it has been updated.
             * This api is responsible for making 2 calls -
             *  1. to Core to update table name (if its on the payload)
             *  2. to EE to call PUT on the tableproperties object
             *  NOTE: The patch for tableproperties is not usable so use PUT instead.
             * @param req
             * @returns {Promise}
             */
            updateTable: function(req) {
                // this has input for both creating table and props
                // core fails if its passed in props that are not recognized for some reason
                // so we need to parse this here and send only what's recognized.
                let reqPayload = req.body;

                let promises = [];
                if (reqPayload.name) {
                    let tableReq = _.clone(req);
                    tableReq.rawBody = JSON.stringify({name: reqPayload.name});
                    tableReq.headers[constants.CONTENT_LENGTH] = tableReq.rawBody.length;
                    promises.push(this.patchTable(tableReq, req.params.tableId));
                }

                let tableProperReq = _.clone(req);
                tableProperReq.rawBody = JSON.stringify(_.omit(reqPayload, ['name']));
                tableProperReq.headers[constants.CONTENT_LENGTH] = tableProperReq.rawBody.length;
                promises.push(this.replaceTableProperties(tableProperReq, req.params.tableId));

                return Promise.all(promises);
            },

            /**
             * deleteTableComponents calls deleteTable on Core + deleteTableEntities on EE
             * deleteTableEntities needs to be called first because if the table doesnt exist in core, EE validation fails
             * This is a restriction for now until a synchronization service is set up between the two.
             * @param req
             * @returns {Promise.<T>|Promise<R>}
             */
            deleteTableComponents: function(req) {
                let tableProperReq = _.clone(req);
                let tableReq = _.clone(req);
                return this.deleteTableEntities(tableProperReq, tableProperReq.params.tableId).then(
                    (success) => {return this.deleteTable(tableReq, tableReq.params.tableId);},
                    (error) => {
                        log.error({req: tableReq}, "tablesApi.deleteTableComponents(): Error deleting table entities in EE");
                        return this.deleteTable(tableReq, tableReq.params.tableId);
                    }
                ).catch((ex) => {
                    requestHelper.logUnexpectedError('tablesApi.deleteTableComponents(): unexpected error deleting table entities in EE', ex, true);
                    return this.deleteTable(tableReq, tableReq.params.tableId);
                });
            }
        };
        return tablesApi;
    };
}());
