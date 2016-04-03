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
        let FACETS = 'facets';
        let FIELDS = 'fields';
        let RECORDS = 'records';
        let RESULTS = 'results';
        let REPORTCOMPONENTS = 'reportcomponents';

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

            //Returns a promise that is resolved with the facets data or rejected with an error code
            fetchFacetResults: function(req) {
                let opts = requestHelper.setOptions(req);
                opts.headers[CONTENT_TYPE] = APPLICATION_JSON;
                let inputUrl = opts.url.toLowerCase();

                // The request came in for report/{reportId}/reportComponents.
                // Convert that to report/{reportId}/facets/results to get facets data
                if (inputUrl.indexOf(REPORTCOMPONENTS) !== -1) {
                    opts.url = inputUrl.substring(0, inputUrl.indexOf(REPORTCOMPONENTS)) + FACETS + "/" + RESULTS;
                }

                return requestHelper.executeRequest(req, opts);
            },

            fetchReportResults: function(req) {
                return new Promise((resolve, reject) => {
                    recordsApi.fetchRecordsAndFields(req).then(
                        (response) => {
                            if (recordsApi.isDisplayFormat(req)) {
                                // TODO: the result set returned is a 'flat' heirarchy.  Since we are formatting our
                                // TODO: result data, look to summarize the records per grouping requirement.
                            }
                            resolve(response);
                        },
                        (error) => {
                            reject(error);
                        }
                    );
                });
            },

            //Returns a promise that is resolved with the records, fields meta data and facets
            //or is rejected with a descriptive error code
            fetchReportComponents: function(req) {
                return new Promise((resolve, reject) =>{
                    //  TODO: current implementation requires 2 synchronized calls.
                    //  TODO: Investigate whether there is a way to call async, but only drop
                    //  TODO: into the error flow if the reportResults returns an error.
                    this.fetchReportResults(req).then(
                        (resultsResponse) => {
                            let records = resultsResponse.records;
                            let fields = resultsResponse.fields;

                            let facets = [];

                            let responseObject = {};
                            responseObject[FIELDS] = fields;
                            responseObject[RECORDS] = records;

                            this.fetchFacetResults(req).then(
                                (facetResponse) => {
                                    let facetRecords = [];

                                    //jsonBigNum.parse throws exception if the input is empty array
                                    if (facetResponse.body && facetResponse.body.length > 0) {
                                        facetRecords = jsonBigNum.parse(facetResponse.body);

                                        // format the facetRecords into Facet objects of type {id, name, type, hasBlanks, [values]} using fields array.
                                        // this also applies display properties to the raw record data.
                                        facets = facetRecordsFormatter.formatFacetRecords(facetRecords, fields);
                                    }
                                    responseObject[FACETS] = facets;
                                    resolve(responseObject);
                                },

                                (error) => {
                                    log.error("Error getting facets in fetchReportComponents: " + JSON.stringify(error));
                                    var facetError = JSON.parse(error.body)[0];
                                    facets.push({id: null, errorCode: facetError && facetError.code ? facetError.code : errorCodes.UNKNOWN});
                                    responseObject[FACETS] = facets;
                                    resolve(responseObject);
                                }
                            ).catch((ex) => {
                                log.error("Caught unexpected error getting facets in fetchReportComponents: " + JSON.stringify(ex));
                                facets.push({id: null, errorCode: errorCodes.UNKNOWN});
                                responseObject[FACETS] = facets;
                                resolve(responseObject);
                            });
                        },
                        (error) => {
                            log.error("Error getting report results in fetchReportComponents: " + JSON.stringify(error));
                            reject(error);
                        }
                    ).catch((ex) => {
                        log.error("Caught unexpected error getting report results in fetchReportComponents: " + JSON.stringify(ex));
                        reject(ex);
                    });
                });
            }
        };
        return reportsApi;
    };
}());

