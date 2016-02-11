/**
 * Created by agoel on 2/10/16.
 */

/*
TODO: Update comments
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
        let FACETS = 'facets';
        let FACETRESULTS = 'results';
        let FIELDS = 'fields';
        let RECORDS = 'records';
        let CONTENT_TYPE = 'Content-Type';
        let APPLICATION_JSON = 'application/json';
        let request = defaultRequest;

        //the immediately resolve flag is set, resolve the deferred without making a call
        function executeRequest(req, opts, immediatelyResolve) {
            //  Generate tid for all requests..and log it
            requestHelper.setTidHeader(req);
            log.info({req: req});

            let deferred = Promise.pending();
            if (immediatelyResolve) {
                deferred.resolve(null);
            } else {
                request(opts, function(error, response) {
                    if (error) {
                        deferred.reject(new Error(error));
                    } else if (response.statusCode !== 200) {
                        deferred.reject(response);
                    } else {
                        deferred.resolve(response);
                    }
                });
            }
            return deferred.promise;
        }



        //TODO: only application/json is supported for content type.  Need a plan to support XML
        let reportsApi = {

            /**
             * Allows you to override the
             * @param requestOverride
             */
            setRequestObject: function(requestOverride) {
                request = requestOverride;
            },

            //Returns a promise that is resolved with the facets data or rejected with an error code
            fetchFacetResults: function(req) {
                let opts = requestHelper.setOptions(req);
                opts.headers[CONTENT_TYPE] = APPLICATION_JSON;
                let inputUrl = opts.url.toLowerCase();
                if (inputUrl.indexOf("results") !== -1) {
                    opts.url = inputUrl.substring(0, inputUrl.indexOf("results")) + FACETS + "/" + FACETRESULTS;
                }

                return executeRequest(req, opts);
            },

            //Returns a promise that is resolved with the records and fields meta data
            //or is rejected with a descriptive error code
            fetchReportResultsAndFacets: function(req) {
                let deferred = Promise.pending();
                let fetchRequests = [recordsApi.fetchRecordsAndFields(req), this.fetchFacetResults(req)];

                Promise.all(fetchRequests).then(
                    function(response) {
                        let records = response[0].records;
                        let fields = response[0].fields;
                        let facetRecords = jsonBigNum.parse(response[1].body);

                        // format the facetRecords into Facet objects of type {id, name, type, [values]} using fields array.
                        let facets = facetRecordsFormatter.formatFacetRecords(facetRecords, fields);

                        let responseObject;
                        responseObject = {};
                        responseObject[FIELDS] = fields;
                        responseObject[RECORDS] = records;
                        responseObject[FACETS] = facets;

                        deferred.resolve(responseObject);
                    },
                    function(response) {
                        deferred.reject(response);
                    }
                ).catch(function(error) {
                    log.error("Caught unexpected error in fetchReportResultsAndFacets: " + JSON.stringify(error));
                    deferred.reject(error);
                });
                return deferred.promise;
            }
        };
        return reportsApi;
    };
}());

