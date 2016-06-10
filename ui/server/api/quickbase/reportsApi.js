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

    module.exports = function(config) {
        let requestHelper = require('./requestHelper')(config);
        let facetRecordsFormatter = require('./formatter/facetRecordsFormatter')();
        let recordsApi = require('./recordsApi')(config);

        //Module constants:
        let APPLICATION_JSON = 'application/json';
        let CONTENT_TYPE = 'Content-Type';

        //  url components for facets
        let FACETS = 'facets';
        let REPORTS = 'reports';
        let NODE_REPORTCOMPONENT_ROUTE = 'reportcomponents';
        let CORE_REPORTFACETS_ROUTE = FACETS + '/results';

        //  url components for table report home page
        let NODE_HOMEPAGE_ROUTE = 'homepage';
        let CORE_HOMEPAGE_ID_ROUTE = 'homepagereportid';

        function transformUrlRoute(requestUrl, curRoute, newRoute) {
            if (requestUrl) {
                let offset = requestUrl.toLowerCase().indexOf(curRoute);
                if (offset !== -1) {
                    return requestUrl.substring(0, offset) + newRoute;
                }
            }
            //  return requestUrl unchanged
            return requestUrl;
        }

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
             * @returns {*}
             */
            fetchFacetResults: function(req) {
                let opts = requestHelper.setOptions(req);
                opts.headers[CONTENT_TYPE] = APPLICATION_JSON;

                // Node request is ../report/{reportId}/reportComponents  --> convert to
                // ../report/{reportId}/facets/results to return the facet data from core
                opts.url = transformUrlRoute(opts.url, NODE_REPORTCOMPONENT_ROUTE, CORE_REPORTFACETS_ROUTE);

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
            fetchReportComponents: function(req) {

                //  Fetch report meta and grid data
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
                var facetPromise = new Promise((resolve2, reject2) => {
                    this.fetchFacetResults(req).then(
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

            fetchTableHomePageReport: function(req) {

                return new Promise((resolve, reject) => {

                    let opts = requestHelper.setOptions(req);
                    opts.headers[CONTENT_TYPE] = APPLICATION_JSON;

                    // Node request is ../tables/{tableId}/homepage  --> transform the url to
                    // ../tables/{tableId}/homepagereportid to return the table report homepage id from core
                    opts.url = transformUrlRoute(opts.url, NODE_HOMEPAGE_ROUTE, CORE_HOMEPAGE_ID_ROUTE);

                    //  make the api request to get the table homepage report id
                    requestHelper.executeRequest(req, opts).then(
                        (response) => {
                            // parse out the id and fetch the report components.
                            var homepageReportId = JSON.parse(response.body)[0];
                            let reportComponentRoute = REPORTS + '/' + homepageReportId + '/' + NODE_REPORTCOMPONENT_ROUTE;
                            req.url = transformUrlRoute(CORE_HOMEPAGE_ID_ROUTE, reportComponentRoute);

                            this.fetchReportComponents(req).then(
                                (reportResponse) => {
                                    resolve(reportResponse);
                                },
                                (reportError) => {
                                    //  the core error has already been logged...just want to ensure visibility that the
                                    //  error is when fetching the table homepage report
                                    log.error('Error fetching table homepage report in fetchTableHomePageReport.  ReportRoute: ' + reportComponentRoute);
                                    reject(reportError);
                                }
                            ).catch((ex) => {
                                requestHelper.logUnexpectedError('reportsAPI..fetchReportComponents in fetchTableHomePageReport', ex, true);
                                reject(ex);
                            });
                        },
                        (error) => {
                            let errorMsg = 'Error undefined';
                            if (error) {
                                if (error.body) {
                                    errorMsg = error.body ? error.body.replace(/"/g, "'") : error.statusMessage;
                                }
                            }
                            log.error("Error getting table homepage reportId in fetchTableHomePageReport: " + errorMsg);
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

