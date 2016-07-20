/**
 The purpose of this module is to process /apps/<id>/tables/<id>/reports api requests.
 This uses recordsApi to make calls out to /apps/<id>/tables/<id>/records end points when needed.
 Created by agoel on 2/10/16.
 */
(function() {
    'use strict';

    let Promise = require('bluebird');
    let log = require('../../logger').getLogger();
    /* See comment in recordsApi.js */
    let jsonBigNum = require('json-bignum');
    let errorCodes = require('../errorCodes');
    let constants = require('../../../../common/src/constants');
    let stringUtils = require('../../utility/stringUtils');

    module.exports = function(config) {
        let requestHelper = require('./requestHelper')(config);
        let facetRecordsFormatter = require('./formatter/facetRecordsFormatter')();
        let recordsApi = require('./recordsApi')(config);
        let routeHelper = require('../../routes/routeHelper');

        //Module constants:
        let APPLICATION_JSON = 'application/json';
        let CONTENT_TYPE = 'Content-Type';
        let FACETS = 'facets';

        //TODO: only application/json is supported for content type.  Need a plan to support XML
        let reportsApi = {

            /**
             * This is for testing only
             * @param requestOverride
             */
            setRequestHelper: function(requestOverride) {
                requestHelper = requestOverride;
            },

            /**
             * This is for testing only
             * @param requestOverride
             */
            setRecordsApi: function(requestOverride) {
                recordsApi = requestOverride;
            },

            /** Returns a promise that is resolved with the facets data or rejected
             *  with an error code
             *
             * @param req
             * @param reportId
             * @returns {*}
             */
            fetchFacetResults: function(req, reportId) {
                let opts = requestHelper.setOptions(req);
                opts.headers[CONTENT_TYPE] = APPLICATION_JSON;
                opts.url = requestHelper.getRequestJavaHost() + routeHelper.getReportsFacetRoute(req.url, reportId);
                return requestHelper.executeRequest(req, opts);
            },

            fetchReportResults: function(req) {
                return new Promise((resolve, reject) => {
                    recordsApi.fetchRecordsAndFields(req).then(
                        (response) => {
                            resolve(response);
                        },
                        (error) => {
                            let errorMsg = 'Error undefined';
                            if (error) {
                                if (error.body) {
                                    errorMsg = error.body ? error.body.replace(/"/g, "'") : error.statusMessage;
                                }
                            }
                            log.error("Error getting report results in fetchReportResults: " + errorMsg);
                            reject(error);
                        }
                    ).catch((ex) => {
                        requestHelper.logUnexpectedError('reportsAPI..fetchReportResults', ex, true);
                        reject1(ex);
                    });
                });
            },

            /** Returns a promise that is resolved with the records, fields meta data and facets
             *  or is rejected with a descriptive error code
             */
            fetchReportComponents: function(req, reportId) {

                //  Fetch field meta data and grid data for a report
                var reportPromise = new Promise((resolve1, reject1) => {
                    this.fetchReportResults(req).then(
                        (resultsResponse) => {
                            resolve1(resultsResponse);
                        },
                        (error) => {
                            // no need to generate an error message as it's logged in fetchReportResults
                            reject1(error);
                        }
                    ).catch((ex) => {
                        requestHelper.logUnexpectedError('reportsAPI..fetchReportComponents in fetchReportComponents', ex, true);
                        reject1(ex);
                    });
                });

                //  Fetch report facet data (if any).
                //
                //  NOTE:  if an error occurs while fetching the faceting information, we still want the promise to
                //  resolve as we want to always display the report data if that promise returns w/o error.
                var facetPromise = new Promise((resolve2) => {
                    this.fetchFacetResults(req, reportId).then(
                        (facetResponse) => {
                            resolve2(facetResponse);
                        },
                        (error) => {
                            var facetError = JSON.parse(error.body)[0];
                            var errorObj = {id: null, errorCode: facetError && facetError.code ? facetError.code : errorCodes.UNKNOWN};
                            log.error("Error getting facets in fetchReportComponents.  Facet Error Code: " + errorObj.errorCode);
                            resolve2(errorObj);
                        }
                    ).catch((ex) => {
                        requestHelper.logUnexpectedError('reportsAPI..fetchFacetResults in fetchReportComponents', ex, true);
                        var errorObj = {id: null, errorCode: errorCodes.UNKNOWN};
                        resolve2(errorObj);
                    });
                });

                return new Promise((resolve, reject) => {

                    //  Now fetch the report data and report facet information asynchronously.  Return a
                    //  responseObject with field, record, grouping(if any) and facet(if any) information for client processing.
                    var promises = [reportPromise, facetPromise];
                    Promise.all(promises).then(
                        (result) => {
                            //  populate the response object with the report with fields, groups and
                            //  records output from recordsApi.
                            let responseObject = result[0];
                            responseObject[FACETS] = [];

                            /*eslint no-lonely-if:0 */
                            if (result[1]) {
                                //  check for any facet error...if one found, return the error object to the client
                                //  in the facet response.
                                if (result[1].errorCode) {
                                    responseObject[FACETS].push(result[1]);
                                } else {
                                    //  Parse the facet response and format into an object that the client can consume and process
                                    //  IE: Facet objects of type {id, name, type, hasBlanks, [values]} using fields array.
                                    if (result[1].body && result[1].body.length > 0) {
                                        //  jsonBigNum.parse throws exception if the input is empty array
                                        let facetRecords = jsonBigNum.parse(result[1].body);
                                        responseObject[FACETS] = facetRecordsFormatter.formatFacetRecords(facetRecords, result[0].fields);
                                    }
                                }
                            }
                            resolve(responseObject);
                        },
                        (error) => {
                            // no need to log a message as it has already been done in the individual promise call
                            reject(error);
                        }
                    ).catch((ex) => {
                        requestHelper.logUnexpectedError('reportsAPI..fetchReportComponents', ex, true);
                        reject(ex);
                    });
                });
            },

            /**
             * Fetch the meta data for a given report id
             *
             * @param req
             * @param opts
             * @returns {bluebird|exports|module.exports}
             */
            fetchReportMetaData(req, reportId) {

                let opts = requestHelper.setOptions(req);
                opts.headers[CONTENT_TYPE] = APPLICATION_JSON;
                opts.url = requestHelper.getRequestJavaHost() + routeHelper.getReportsRoute(req.url, reportId);

                //  promise to return report meta data
                return new Promise((resolve1, reject1) => {
                    requestHelper.executeRequest(req, opts).then(
                        (response) => {
                            resolve1(response);
                        },
                        (error) => {
                            reject1(error);
                        }
                    );
                });
            },

            /**
             * Return the table homepage report using it's meta data to determine its initial display state.
             *
             * @param req
             * @returns {bluebird|exports|module.exports}
             */
            fetchTableHomePageReport: function(req) {

                //  report object returned to the client;  gets populated in the success workflow, otherwise
                //  is returned uninitialized if no report home page is found.
                var reportObj = {
                    reportMetaData: {
                        data: ''
                    },
                    reportData: {
                        data: ''
                    }
                };

                return new Promise((resolve, reject) => {

                    let opts = requestHelper.setOptions(req);
                    opts.headers[CONTENT_TYPE] = APPLICATION_JSON;
                    opts.url = requestHelper.getRequestJavaHost() + routeHelper.getTablesDefaultReportHomepageRoute(req.url);

                    //  make the api request to get the table homepage report id
                    requestHelper.executeRequest(req, opts).then(
                        (response) => {
                            // parse out the id and use to fetch the report meta data.  Process the meta data
                            // to fetch and return the report content.
                            if (response.body) {
                                let homepageReportId = JSON.parse(response.body);

                                //  have a homepage id; first get the report meta data
                                this.fetchReportMetaData(req, homepageReportId).then(
                                    (metaDataResult) => {
                                        //  parse the metadata and set the request parameters for the default sortList, fidList and query expression (if defined).
                                        //  NOTE:  this always overrides any incoming request parameters that may be set by the caller.
                                        let reportMetaData = JSON.parse(metaDataResult.body);

                                        //  look for any existing parameters on the url
                                        req.params = req.params || {};

                                        //  add display formatting
                                        requestHelper.addQueryParameter(req, constants.REQUEST_PARAMETER.FORMAT, constants.FORMAT.DISPLAY);

                                        //  add any sortList requirements
                                        let sortList = stringUtils.convertListToDelimitedString(reportMetaData.sortList, constants.REQUEST_PARAMETER.LIST_DELIMITER);
                                        if (sortList) {
                                            requestHelper.addQueryParameter(req, constants.REQUEST_PARAMETER.SORT_LIST, sortList);
                                        }

                                        //  add any columnList requirements
                                        let columnList = stringUtils.convertListToDelimitedString(reportMetaData.fids, constants.REQUEST_PARAMETER.LIST_DELIMITER);
                                        if (columnList) {
                                            requestHelper.addQueryParameter(req, constants.REQUEST_PARAMETER.COLUMNS, columnList);
                                        }

                                        //  add any query expression requirements
                                        let query = reportMetaData.query ? reportMetaData.query : '';
                                        if (query) {
                                            requestHelper.addQueryParameter(req, constants.REQUEST_PARAMETER.QUERY, query);
                                        }

                                        //  TODO: initial page size
                                        //req.params[constants.REQUEST_PARAMETER.OFFSET] = 0;
                                        //req.params[constants.REQUEST_PARAMETER.NUM_ROWS] = ?;

                                        this.fetchReportComponents(req, homepageReportId).then(
                                            (reportData) => {
                                                //  return the metadata and report content
                                                reportObj.reportMetaData.data = reportMetaData;
                                                reportObj.reportData.data = reportData;
                                                resolve(reportObj);
                                            },
                                            (reportError) => {
                                                log.error({req:req}, 'Error fetching table homepage report content in fetchTableHomePageReport.');
                                                reject(reportError);
                                            }
                                        ).catch((ex) => {
                                            requestHelper.logUnexpectedError('reportsAPI..unexpected error fetching table homepage report content in fetchTableHomePageReport', ex, true);
                                            reject(ex);
                                        });
                                    },
                                    (metaDataError) => {
                                        log.error({req:req}, 'Error fetching table homepage report metaData in fetchTableHomePageReport.');
                                        reject(metaDataError);
                                    }
                                ).catch((ex) => {
                                    requestHelper.logUnexpectedError('reportsAPI..unexpected error fetching table homepage report metaData in fetchTableHomePageReport', ex, true);
                                    reject(ex);
                                });
                            } else {
                                //  no report id returned (because one is not defined); return empty report object
                                log.warn({req:req}, 'No report homepage defined for table.');
                                resolve(reportObj);
                            }
                        },
                        (error) => {
                            log.error({req: req}, "Error getting table homepage reportId in fetchTableHomePageReport");
                            reject(error);
                        }
                    ).catch((ex) => {
                        requestHelper.logUnexpectedError('reportsAPI..fetch report homepage in fetchTableHomePageReport', ex, true);
                        reject(ex);
                    });
                });

            }
        };
        return reportsApi;
    };
}());
