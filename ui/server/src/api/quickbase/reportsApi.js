/**
 The purpose of this module is to process /apps/<id>/tables/<id>/reports api requests.
 This uses recordsApi to make calls out to /apps/<id>/tables/<id>/records end points when needed.
 Created by agoel on 2/10/16.
 */
(function() {
    'use strict';

    let Promise = require('bluebird');
    let log = require('../../logger').getLogger();
    let perfLogger = require('../../perfLogger');
    let lodash = require('lodash');

    /* See comment in recordsApi.js */
    let jsonBigNum = require('json-bignum');
    let errorCodes = require('../errorCodes');
    let constants = require('../../../../common/src/constants');
    let collectionUtils = require('../../utility/collectionUtils');

    module.exports = function(config) {

        let facetRecordsFormatter = require('./formatter/facetRecordsFormatter')();
        let recordFormatter = require('./formatter/recordFormatter')();
        let groupFormatter = require('./formatter/groupFormatter');
        let recordsApi = require('./recordsApi')(config);
        let fieldsApi = require('./fieldsApi')(config);
        let requestHelper = require('./requestHelper')(config);
        let routeHelper = require('../../routes/routeHelper');
        var url = require('url');

        //Module constants:
        let FACETS = 'facets';
        let FIELDS = 'fields';
        let META = 'metaData';
        let RECORDS = 'records';
        let GROUPS = 'groups';
        let FILTERED_RECORDS_COUNT = 'filteredCount';

        /**
         * Take a sort list request parameter and convert in to list of sort list objects
         *
         * @param sortList
         * @returns {Array}
         */
        function getSortListAsObject(sortList) {
            let sortListParts = sortList.split(constants.REQUEST_PARAMETER.LIST_DELIMITER);
            let sListObj = [];
            if (sortListParts) {
                sortListParts.forEach((sort) => {
                    let sortObj = {};

                    //  format is fid:groupType..split by delimiter(':') to allow us
                    // to pass in the fid for server side sorting.
                    var sortEl = sort.split(constants.REQUEST_PARAMETER.GROUP_DELIMITER, 2);
                    if (sortEl.length > 1) {
                        sortObj.groupType = sortEl[1];
                    }
                    sortObj.sortOrder = sortEl[0] < 0 ? constants.SORT_ORDER.DESC : constants.SORT_ORDER.ASC;
                    sortObj.fieldId = Math.abs(sortEl[0]);
                    sListObj.push(sortObj);
                });
            }
            return sListObj;
        }

        function getFieldsOnReport(records, fields) {
            let record = null;
            if (Array.isArray(records) && records.length > 0) {
                record = records[0];
            }
            return fieldsApi.removeUnusedFields(record, fields);
        }

        /**
         * Take a list of sort list objects and parse into string that can be used as a request parameter
         *
         * @param sortList
         * @returns {string}
         */
        function parseSortList(sortList) {
            let sList = '';
            if (Array.isArray(sortList)) {
                //  convert the object in a list of strings of format <+/-|fid|:groupType>
                let sortListArray = [];
                sortList.forEach(function(sortObj) {
                    if (sortObj.fieldId) {
                        let result = '';
                        result += (sortObj.sortOrder === constants.SORT_ORDER.DESC ? '-' : '') + sortObj.fieldId;
                        if (sortObj.groupType) {
                            result += constants.REQUEST_PARAMETER.GROUP_DELIMITER + sortObj.groupType;
                        }
                        sortListArray.push(result);
                    }
                });

                //  any entries to convert
                if (sortListArray.length > 0) {
                    sList = collectionUtils.convertListToDelimitedString(sortListArray, constants.REQUEST_PARAMETER.LIST_DELIMITER);
                }
            }
            return sList;
        }

        /**
         * Return a query expression sourced from the reportMetaData and supplied query expression
         *
         * @param reportMetaData
         * @param query
         * @returns {*}
         */
        function getQueryExpression(reportMetaData, query) {
            if (reportMetaData && reportMetaData.query && reportMetaData.query.length > 0) {
                if (query && query.length > 0) {
                    return '((' + reportMetaData.query + ')' + constants.QUERY_AND + query + ')';
                } else {
                    return reportMetaData.query;
                }
            }
            return query || null;
        }

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

            /**
             * Returns the fields for the report request
             *
             * @param req
             * @returns {*|Promise}
             */
            fetchFields: function(req) {
                return fieldsApi.fetchFields(req);
            },

            /** Returns a promise that is always resolved with either facets data or
             *  an object with error information.
             *
             * @param req
             * @param reportId
             * @returns {*}
             */
            fetchReportFacets: function(req, reportId) {
                let opts = requestHelper.setOptions(req, true);
                opts.headers[constants.CONTENT_TYPE] = constants.APPLICATION_JSON;
                opts.url = requestHelper.getRequestJavaHost() + routeHelper.getReportsFacetRoute(req.url, reportId);

                // NOTE:  if an error occurs while fetching the faceting information, we still want the promise to
                // resolve with the faceting data or an error object.
                return new Promise((resolve, reject) => {
                    requestHelper.executeRequest(req, opts).then(
                        (facetResponse) => {
                            resolve(facetResponse);
                        },
                        (error) => {
                            var facetError = JSON.parse(error.body)[0];
                            var errorObj = {
                                id: null,
                                errorCode: facetError && facetError.code ? facetError.code : errorCodes.UNKNOWN
                            };
                            log.error("Error getting facets in fetchReportFacets.  Facet Error Code: " + errorObj.errorCode);
                            resolve(errorObj);
                        }
                    ).catch((ex) => {
                        requestHelper.logUnexpectedError('reportsAPI..unexpected error in fetchReportFacets', ex, true);
                        var errorObj = {id: null, errorCode: errorCodes.UNKNOWN};
                        resolve(errorObj);
                    });
                });
            },

            /**
             * Fetch the meta data for a given report id
             *
             * @param req
             * @param reportId
             * @param withReportDefaults - include report defaults in the response
             * @returns {bluebird|exports|module.exports}
             */
            fetchReportMetaData(req, reportId, withReportDefaults) {
                let opts = requestHelper.setOptions(req, true);
                opts.headers[constants.CONTENT_TYPE] = constants.APPLICATION_JSON;
                opts.url = requestHelper.getRequestJavaHost() + routeHelper.getReportsRoute(req.url, reportId);

                //  are report defaults to be included in response -- default is no.
                if (arguments && arguments.length < 3) {
                    withReportDefaults = requestHelper.getQueryParameterValue(req, constants.REQUEST_PARAMETER.META_DATA.WITH_REPORT_DEFAULTS);
                    if (withReportDefaults) {
                        withReportDefaults = (withReportDefaults.toLowerCase() === 'true');
                    }
                }

                //  the request parameter must be true/false or we'll get an exception thrown by the server
                if (typeof withReportDefaults === 'boolean') {
                    requestHelper.addQueryParameter(opts, constants.REQUEST_PARAMETER.META_DATA.WITH_REPORT_DEFAULTS, withReportDefaults);
                }

                //  promise to return report meta data
                return new Promise((resolve, reject) => {
                    requestHelper.executeRequest(req, opts).then(
                        (response) => {
                            resolve(response);
                        },
                        (error) => {
                            reject(error);
                        }
                    );
                });
            },

            /**
             * Wrapper function that calls either the reports get record count endpoint or
             * the records count endpoint.  Returns a promise that resolves with the count
             * of all records for the given report request.
             *
             * @param req
             * @param reportId
             */
            fetchReportCount: function(req, reportId) {
                //  if there is a query parameter (ie: filter), need to query for the count using
                //  the records endpoint; otherwise can use the reports endpoint to get the count.
                //  TODO: this is temporary and go away once report summary is implemented as it
                //  TODO: is expected to include report record counts.
                let query = requestHelper.getQueryParameterValue(req, constants.REQUEST_PARAMETER.QUERY);
                if (query !== null) {
                    return new Promise((resolve, reject) => {
                        //  Need to fetch the report meta data to determine if there is a query
                        //  parameter defined for the report.
                        this.fetchReportMetaData(req, reportId).then(
                            (metaDataResult) => {
                                //  make a copy cause we could be altering if meta data query is defined
                                let req2 = lodash.clone(req);

                                //  check for existing query expression defined on the report meta data
                                let reportMetaData = JSON.parse(metaDataResult.body);
                                if (reportMetaData && reportMetaData.query) {
                                    query = getQueryExpression(reportMetaData, query);

                                    //  remove the current query request parameter and update with the new expression
                                    requestHelper.removeRequestParameter(req2, constants.REQUEST_PARAMETER.QUERY);
                                    requestHelper.addQueryParameter(req2, constants.REQUEST_PARAMETER.QUERY, encodeURIComponent(query));
                                }

                                recordsApi.fetchCountForRecords(req2).then(
                                    (response) => {
                                        resolve(response);
                                    },
                                    (error) => {
                                        reject(error);
                                    }
                                ).catch((ex) => {
                                    requestHelper.logUnexpectedError('reportsAPI..fetchRecordsCount', ex, true);
                                    reject(ex);
                                });
                            },
                            (metaError) => {
                                reject(metaError);
                            }
                        );
                    });
                } else {
                    return this.fetchReportRecordsCount(req, reportId);
                }
            },

            /**
             * Returns a promise that resolves with the count of all records for a report,
             * or rejects with an error code.
             * @param req
             */
            fetchReportRecordsCount: function(req, reportId) {
                let opts = requestHelper.setOptions(req, true);
                opts.headers[constants.CONTENT_TYPE] = constants.APPLICATION_JSON;

                let reportUrl = reportId ? routeHelper.getReportsRoute(req.url, reportId) : req.url;
                opts.url = requestHelper.getRequestJavaHost() + routeHelper.getReportsCountRoute(reportUrl);

                return new Promise((resolve, reject) => {
                    requestHelper.executeRequest(req, opts).then(
                        (result) => {
                            resolve(result);
                        },
                        (error) => {
                            reject(error);
                        }
                    ).catch((ex) => {
                        requestHelper.logUnexpectedError('reportsAPI..fetchReportRecordsCount', ex, true);
                        reject(ex);
                    });
                });
            },

            /**
             * Fetch the report result for a given report id.
             *
             * If useReportMetaData is set to true, then the report/results endpoint is called, which
             * uses the default report meta data to generate the report.  Otherwise, the report/invoke
             * endpoint is called, which uses the default report meta data as a baseline, but allows
             * for override's based on request query parameter input.
             *
             * @param req
             * @param report id
             * @param useReportMetaData
             *
             * @returns {bluebird|exports|module.exports}
             */
            fetchReportResult: function(req, reportId, useReportMetaData) {

                var responseObj = {
                    metaData: null,
                    report: null
                };

                // Ensure the offset and numRows request parameter is set to either a supplied value or the defaults if invalid or not supplied
                let offset = requestHelper.getQueryParameterValue(req, constants.REQUEST_PARAMETER.OFFSET);
                let numRows = requestHelper.getQueryParameterValue(req, constants.REQUEST_PARAMETER.NUM_ROWS);
                if (offset === null || numRows === null || !Number.isInteger(+offset) || !Number.isInteger(+numRows)) {
                    offset = constants.PAGE.DEFAULT_OFFSET;
                    numRows = constants.PAGE.DEFAULT_NUM_ROWS;
                } else {
                    //  make sure the number of rows requested does not exceed the maximum allowed row fetch limit.
                    /*eslint no-lonely-if:0*/
                    if (numRows > constants.PAGE.MAX_NUM_ROWS) {
                        log.warn("Report results request number of rows exceeds allowed limit.  Setting to max number of row limit of " + constants.PAGE.MAX_NUM_ROWS);
                        numRows = constants.PAGE.MAX_NUM_ROWS;
                    }
                }

                if (useReportMetaData === true) {
                    //  Call the the report results endpoint, which will generate a report using the saved report meta data.
                    return new Promise((resolve, reject) => {
                        this.fetchReportMetaData(req, reportId, true).then(
                            (metaDataResult) => {
                                let reportMetaData = JSON.parse(metaDataResult.body);

                                //  Call the report result endpoint as a GET request to get default report
                                let opts = requestHelper.setOptions(req, true);
                                opts.headers[constants.CONTENT_TYPE] = constants.APPLICATION_JSON;
                                opts.url = requestHelper.getRequestJavaHost() + routeHelper.getReportsResultsRoute(req.url, reportId);

                                //  Add the offset and num row parameters to the request
                                requestHelper.addQueryParameter(opts, constants.REQUEST_PARAMETER.OFFSET, offset);
                                requestHelper.addQueryParameter(opts, constants.REQUEST_PARAMETER.NUM_ROWS, numRows);

                                requestHelper.executeRequest(req, opts).then(
                                    (result) => {
                                        responseObj.metaData = reportMetaData;
                                        responseObj.report = result;
                                        resolve(responseObj);
                                    },
                                    (error) => {
                                        reject(error);
                                    }
                                ).catch((ex) => {
                                    requestHelper.logUnexpectedError('reportsAPI..fetchReportResult', ex, true);
                                    reject(ex);
                                });
                            },
                            (metaDataError) => {
                                log.error({req: req}, 'Error fetching table homepage report metaData in fetchTableHomePageReport.');
                                reject(metaDataError);
                            }
                        ).catch((ex) => {
                            requestHelper.logUnexpectedError('reportsAPI..unexpected error fetching table homepage report metaData in fetchTableHomePageReport', ex, true);
                            reject(ex);
                        });
                    });
                } else {
                    //  A request to fetch the report using the default report meta data definition as a baseline
                    //  and then override the sortList, query and columnList(future) to generate a custom report.
                    //  NOTE: if no overrides, then the baseline report is generated, no different than if
                    //  loadReportWithDefaultMetaData == true.
                    return new Promise((resolve, reject) => {
                        this.fetchReportMetaData(req, reportId, true).then(
                            (metaDataResult) => {
                                let reportMetaData = JSON.parse(metaDataResult.body);

                                //  The report invoke endpoint is a POST request as it allows for override of
                                //  the report's default meta data in the body of the request.
                                let req2 = lodash.clone(req);
                                req2.method = 'POST';

                                let opts = requestHelper.setOptions(req2);
                                opts.headers[constants.CONTENT_TYPE] = constants.APPLICATION_JSON;
                                opts.url = requestHelper.getRequestJavaHost() + routeHelper.getInvokeReportRoute(req2.url);

                                //  Add the offset and num row parameters to the request
                                requestHelper.addQueryParameter(opts, constants.REQUEST_PARAMETER.OFFSET, offset);
                                requestHelper.addQueryParameter(opts, constants.REQUEST_PARAMETER.NUM_ROWS, numRows);

                                //  override the default report meta data setting for sort list
                                let sList = requestHelper.getQueryParameterValue(req2, constants.REQUEST_PARAMETER.SORT_LIST);
                                if (sList !== null) {
                                    //  we have a sort List parameter; initialize the sort list in the event the parameter value is empty.
                                    reportMetaData.sortList = [];
                                    try {
                                        if (sList !== '') {
                                            let sListObj = getSortListAsObject(sList);
                                            sListObj.forEach((el) => {
                                                reportMetaData.sortList.push(el);
                                            });
                                        }
                                    } catch (e) {
                                        //  log error and continue on with no sort/grouping
                                        log.warn('Error parsing request parameter sort list.  SortList: ' + sList + '. Error stack:\n' + e.stack);
                                    }
                                }

                                //  Supplement the default report meta data setting(if any) with any client query(if any)
                                let query = requestHelper.getQueryParameterValue(req2, constants.REQUEST_PARAMETER.QUERY);
                                reportMetaData.query = getQueryExpression(reportMetaData, query);

                                //  override the default report meta data column fid list
                                let columnFids = requestHelper.getQueryParameterValue(req2, constants.REQUEST_PARAMETER.COLUMNS);
                                if (columnFids !== null) {
                                    //  we have a cList parameter; initialize the fid list in the event the parameter value is empty.
                                    reportMetaData.fids = [];
                                    if (columnFids !== '') {
                                        try {
                                            //  convert list delimited string into array and ensure the fid id's are integers
                                            reportMetaData.fids = columnFids.split(constants.REQUEST_PARAMETER.LIST_DELIMITER);
                                            for (let fid in reportMetaData.fids) {
                                                reportMetaData.fids[fid] = parseInt(reportMetaData.fids[fid], 10);
                                            }
                                        } catch (e) {
                                            //  log error and continue on with no fid list set..meaning all columns returned
                                            log.warn('Error parsing request parameter fid list.  FidList: ' + columnFids + '. Error stack:\n' + e.stack);
                                        }
                                    }
                                }

                                //  set the request body to the updated meta data object and the body length
                                opts.body = JSON.stringify(reportMetaData);
                                opts.headers[constants.CONTENT_LENGTH] = opts.body.length;

                                requestHelper.executeRequest(req2, opts).then(
                                    (result) => {
                                        responseObj.metaData = reportMetaData;
                                        responseObj.report = result;
                                        resolve(responseObj);
                                    },
                                    (error) => {
                                        reject(error);
                                    }
                                ).catch((ex) => {
                                    requestHelper.logUnexpectedError('reportsAPI..fetchReportResult', ex, true);
                                    reject(ex);
                                });
                            },
                            (metaDataError) => {
                                log.error({req: req2}, 'Error fetching table homepage report metaData in fetchTableHomePageReport.');
                                reject(metaDataError);
                            }
                        ).catch((ex) => {
                            requestHelper.logUnexpectedError('reportsAPI..unexpected error fetching table homepage report metaData in fetchTableHomePageReport', ex, true);
                            reject(ex);
                        });
                    });
                }
            },

            /**
             * Fetch report content.  Use report result endpoint to fetch a report using its meta data.
             *
             * @param req
             * @param reportId
             * @param includeFacets
             * @param useReportMetaData
             *
             * @returns Promise
             */
            fetchReport: function(req, reportId, includeFacets, useReportMetaData) {
                return new Promise(function(resolve, reject) {
                    let fetchRequests = [this.fetchReportResult(req, reportId, useReportMetaData), this.fetchFields(req), this.fetchReportCount(req, reportId)];

                    if (includeFacets === true) {
                        fetchRequests.push(this.fetchReportFacets(req, reportId));
                    }

                    Promise.all(fetchRequests).then(
                        function(response) {
                            let responseObject = {};

                            let report = jsonBigNum.parse(response[0].report.body);
                            let metaData = response[0].metaData;  // already parsed..
                            let fields = JSON.parse(response[1].body);
                            let reportRecordCount = response[2].body;

                            //  return raw undecorated record values due to flag format=raw
                            if (requestHelper.isRawFormat(req)) {
                                responseObject = report;
                            } else {
                                //  response object array elements to return
                                responseObject[FACETS] = [];
                                responseObject[FIELDS] = [];
                                responseObject[GROUPS] = [];
                                responseObject[RECORDS] = [];
                                responseObject[META] = metaData;
                                responseObject[FILTERED_RECORDS_COUNT] = reportRecordCount;

                                //  Is core returning a report object that is grouped
                                if (report.type === constants.RECORD_TYPE.GROUP) {
                                    //  the fetchFields response includes all fields on the table. Want to populate the
                                    //  response object fields entry to only include those fields on the report
                                    let groupedRecords = null;
                                    if (Array.isArray(report.groups)) {
                                        if (report.groups[0]) {
                                            groupedRecords = report.groups[0].records;
                                        }
                                    }
                                    responseObject[FIELDS] = getFieldsOnReport(groupedRecords, fields);

                                    //  Organize the grouping data for the client
                                    let sortList = parseSortList(metaData.sortList);
                                    let groupBy = groupFormatter.groupData(responseObject[FIELDS], report, sortList, requestHelper.isDisplayFormat(req));

                                    //  If for some reason there is no grouping returned, will return the records
                                    if (groupBy.hasGrouping) {
                                        responseObject[GROUPS] = groupBy;
                                    } else {
                                        responseObject[RECORDS] = groupBy.records;
                                    }
                                } else {
                                    //  the fetchFields response includes all fields on the table. Want to populate the
                                    //  response object fields entry to only include those fields on the report
                                    responseObject[FIELDS] = getFieldsOnReport(report.records, fields);

                                    if (requestHelper.isDisplayFormat(req)) {
                                        let perfLog = perfLogger.getInstance();
                                        perfLog.init("ReportsApi...Format Display Records", {req: req, idsOnly: true});
                                        responseObject[RECORDS] = recordFormatter.formatRecords(report.records, responseObject[FIELDS]);
                                        perfLog.log();
                                    } else {
                                        responseObject[RECORDS] = report.records;
                                    }
                                }

                                //  add any faceting data to the response
                                if (includeFacets === true) {
                                    /*eslint no-lonely-if:0 */
                                    let facets = response[3];
                                    //  if a facet error, return the error object to the client in the facet response.
                                    if (facets.errorCode) {
                                        responseObject[FACETS].push(facets);
                                    } else {
                                        //  Parse the facet response and format into an object that the client can consume and process
                                        //  IE: Facet objects of type {id, name, type, hasBlanks, [values]} using fields array.
                                        if (facets.body && facets.body.length > 0) {
                                            try {
                                                let facetRecords = jsonBigNum.parse(facets.body);
                                                responseObject[FACETS] = facetRecordsFormatter.formatFacetRecords(facetRecords, fields);
                                            } catch (e) {
                                                //  log as a warning..no faceting returned
                                                log.warn('Unexpected error parsing facet result.  Facet object is not in expected format. Error stack:\n' + e.stack);
                                            }
                                        }
                                    }
                                }
                            }

                            resolve(responseObject);
                        },
                        function(response) {
                            reject(response);
                        }
                    ).catch(function(error) {
                        requestHelper.logUnexpectedError('reportsAPI..fetchRecordsAndFields', error, true);
                        reject(error);
                    });
                }.bind(this));
            },


            /**
             * Get the default report id, defaults to constants.SYNTHETIC_TABLE_REPORT.ID if not found.
             * @param req
             * @param tableId Optional tableId to use instead of the tableId in the req.url
             * @returns Promise
             */
            fetchDefaultReportId: function(req, tableId) {
                let opts = requestHelper.setOptions(req, true);
                opts.headers[constants.CONTENT_TYPE] = constants.APPLICATION_JSON;

                let requestUrl = req.url;
                if (tableId) {
                    requestUrl = routeHelper.getTablesRoute(req.url, tableId);
                }
                opts.url = requestHelper.getRequestJavaHost() + routeHelper.getTablesDefaultReportHomepageRoute(requestUrl);
                return new Promise((resolve, reject) => {
                    return requestHelper.executeRequest(req, opts).then(
                        (response) => {
                            //  As a default, will generate a synthetic report using the table defaults if
                            //  a saved report is not defined as the homepage.
                            let homepageReportId = constants.SYNTHETIC_TABLE_REPORT.ID;
                            if (response.body) {
                                let responseBodyParsed = JSON.parse(response.body);
                                if (responseBodyParsed) {
                                    //  fetch the specified report home page report id..we don't necessarily
                                    //  know if the id value is valid, so fetch it and find out..
                                    homepageReportId = responseBodyParsed;
                                }
                            }

                            resolve(homepageReportId);
                        },
                        (error) => {
                            log.error({req: req}, "Error getting table homepage reportId in fetchTableHomePageReport");
                            reject(error);
                        }
                    ).catch((ex) => {
                        requestHelper.logUnexpectedError('reportsAPI..unexpected error fetching homepage report id in fetchDefaultReportId', ex, true);
                        reject(ex);
                    });
                });
            },

            /**
             * Return the table homepage report using it's meta data to determine its initial display state.
             *
             * @param req
             * @returns {bluebird|exports|module.exports}
             */
            fetchTableHomePageReport: function(req) {
                return new Promise((resolve, reject) => {
                    //  make the api request to get the table homepage report id
                    this.fetchDefaultReportId(req).then(
                        (homepageReportId) => {
                            //  fetch the report
                            this.fetchReport(req, homepageReportId, true, true).then(
                                (reportResponse) => {
                                    resolve(reportResponse);
                                },
                                (reportError) => {
                                    log.error({req:req}, 'Error fetching table homepage report content in fetchTableHomePageReport.');
                                    reject(reportError);
                                }
                            ).catch((ex) => {
                                requestHelper.logUnexpectedError('reportsAPI..unexpected error fetching table homepage report content in fetchTableHomePageReport', ex, true);
                                reject(ex);
                            });
                        }
                    ).catch((ex) => {
                        requestHelper.logUnexpectedError('reportsAPI..fetch report homepage in fetchTableHomePageReport', ex, true);
                        reject(ex);
                    });
                });
            },

            /**
             *
             */
            createReport: function(req) {
                return new Promise((resolve, reject) => {
                    let opts = requestHelper.setOptions(req);
                    opts.url = requestHelper.getRequestJavaHost() + routeHelper.getReportsRoute(req.url);
                    requestHelper.executeRequest(req, opts).then(
                        (response) => {
                            let reportId = null;
                            if (response.body) {
                                reportId = JSON.parse(response.body).id;
                            }
                            resolve(reportId);
                        },
                        (error) => {
                            log.error({req: req}, "reportsApi.createReport(): Error creating report on core");
                            reject(error);
                        }
                    ).catch((ex) => {
                        requestHelper.logUnexpectedError('reportsApi.createReport(): unexpected error creating report on core', ex, true);
                        reject(ex);
                    });
                });
            }
        };

        return reportsApi;
    };
}());
