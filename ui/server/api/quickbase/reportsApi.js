/**
 The purpose of this module is to process /apps/<id>/tables/<id>/reports api requests.
 This uses recordsApi to make calls out to /apps/<id>/tables/<id>/records end points when needed.
 Created by agoel on 2/10/16.
 */
(function() {
    'use strict';
    let Promise = require('bluebird');
    let defaultRequest = require('request');
    let log = require('../../logger').getLogger();
    /* See comment in recordsApi.js */
    let jsonBigNum = require('json-bignum');
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
        let REPORTS = 'reports';
        let RESULTS = 'results';
        let RESULTSANDFACETS = 'resultsandfacets';
        let request = defaultRequest;

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
                //the request came in for report/{reportId}/resultsAndFacets.
                // Convert that to report/{reportId}/facets/results to get facets data
                if (inputUrl.indexOf(RESULTSANDFACETS) !== -1) {
                    opts.url = inputUrl.substring(0, inputUrl.indexOf(RESULTSANDFACETS)) + FACETS + "/" + RESULTS;
                }

                return requestHelper.executeRequest(req, opts);
            },
            //Returns a promise that is resolved with the records and fields meta data
            //or is rejected with a descriptive error code
            //NOTE: This call just hands off responsibility to the recordsApi.
            fetchReportResults: function(req) {
                return recordsApi.fetchRecordsAndFields(req);
            },
            //Returns a promise that is resolved with the records, fields meta data and facets
            //or is rejected with a descriptive error code
            fetchReportResultsAndFacets: function(req) {
                var self = this;
                return new Promise(function(resolve, reject) {
                    self.fetchReportResults(req).then(
                        (resultsResponse) => {
                            let records = resultsResponse.records;
                            let fields = resultsResponse.fields;
                            let facets = [];
                            let responseObject = {};
                            responseObject[FIELDS] = fields;
                            responseObject[RECORDS] = records;
                            self.fetchFacetResults(req).then(
                                // TODO: handle the case when table has more than 10000K
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
                                // In case of error or exception on getFacets we want to silently fail, that is, just return the records and fields.
                                // In future might want to tell client that fetching facets failed so it can display an error message.
                                (error) => {
                                    resolve(responseObject);
                                    log.error("Error getting facets in fetchReportResultsAndFacets: " + JSON.stringify(error));
                                }
                            ).catch((ex) => {
                                resolve(responseObject);
                                log.error("Caught unexpected error getting facets in fetchReportResultsAndFacets: " + JSON.stringify(ex));
                            });
                        },
                        (error) => {
                            log.error("Error getting report results in fetchReportResultsAndFacets: " + JSON.stringify(error));
                            reject(error);
                        }
                    ).catch((ex) => {
                        log.error("Caught unexpected error getting report results in fetchReportResultsAndFacets: " + JSON.stringify(ex));
                        reject(ex);
                    });
                });
            }
        };
        return reportsApi;
    };
}());

