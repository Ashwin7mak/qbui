/*
 The purpose of this module is to process /ticket api requests.
 */
(function() {
    'use strict';

    let defaultRequest = require('request');
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

                    //  make the api request to get the user object
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
             * This api creates a table in core, initializes a tableproperties object in EE.
             * Adds 2 fields to the table - one Text and one Date.
             * Then creates 2 reports a List All and List Changes report
             * And a form with the previously created fields.
             * @param req
             * @returns {Promise}
             */
            createTableComponents: function(req) {
                return new Promise((resolve, reject) => {
                    // this has input for both creating table and props
                    // core fails if its passed in props that are not recognized for some reason
                    // so we need to parse this here and send only what's recognized.
                    let reqPayload = req.body;
                    if (!reqPayload.name || !reqPayload.tableNoun) {
                        reject("Required parameters missing");
                    }
                    let tableReq = _.clone(req);
                    tableReq.rawBody = JSON.stringify({name: reqPayload.name});
                    let tableProperReq = _.clone(req);
                    tableProperReq.rawBody = JSON.stringify(_.pick(reqPayload, ['tableNoun', 'description', 'tableIcon']));
                    this.createTable(tableReq).then(
                        (tableId) => {
                            this.createTableProperties(tableProperReq, tableId).then(
                                () => {
                                    //create the components
                                    let tablesRootUrl = routeHelper.getTablesRoute(req.url, tableId);
                                    let fieldsToCreate = cannedNewTableElements.getCannedFields();

                                    let promises = [];
                                    fieldsToCreate.forEach((field) => {
                                        let fieldReq = _.clone(req);
                                        fieldReq.url = tablesRootUrl;
                                        fieldReq.rawBody = JSON.stringify(field);
                                        promises.push(fieldsApi.createField(fieldReq));
                                    });
                                    Promise.all(promises).then(
                                        (fieldsResponse) => {
                                            let fieldIds = [];
                                            fieldIds.push(fieldsResponse[0], fieldsResponse[1]);
                                            promises = [];
                                            let reportsToCreate = cannedNewTableElements.getCannedReports(reqPayload.name);
                                            reportsToCreate.forEach((report) => {
                                                let reportReq = _.clone(req);
                                                reportReq.url = tablesRootUrl;
                                                reportReq.rawBody = JSON.stringify(report);
                                                promises.push(reportsApi.createReport(reportReq));
                                            });
                                            let formsToCreate = cannedNewTableElements.getCannedForms(reqPayload.tableNoun, fieldIds);
                                            formsToCreate.forEach((form) => {
                                                let formReq = _.clone(req);
                                                formReq.url = tablesRootUrl;
                                                formReq.rawBody = JSON.stringify(form);
                                                promises.push(formsApi.createForm(formReq));
                                            });
                                            Promise.all(promises).then(
                                                (response) => {
                                                    let reportIds = [];
                                                    reportIds.push(response[0], response[1]);
                                                    resolve(tableId);
                                                },
                                                (error) => {
                                                    this.deleteTable(req, tableId);
                                                    this.deleteTableProperties(req, tableId);
                                                    reject(error);
                                                }
                                            );
                                        },
                                        (error) => {
                                            // dont go forward with creation of report/form
                                            this.deleteTable(req, tableId);
                                            this.deleteTableProperties(req, tableId);
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
                            reject(error);
                        }
                    );
                });
            },
        };
        return tablesApi;
    };
}());
