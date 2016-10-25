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
             * @param opts
             * @returns {bluebird|exports|module.exports}
             */
            fetchReportMetaData(req, reportId) {
                let opts = requestHelper.setOptions(req, true);
                opts.headers[constants.CONTENT_TYPE] = constants.APPLICATION_JSON;
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
             * Returns a promise that resolves with the count of all records for a report,
             * or rejects with an error code.
             * @param req
             */
            fetchReportRecordsCount: function(req, reportId) {
                let opts = requestHelper.setOptions(req, true);
                opts.headers[constants.CONTENT_TYPE] = constants.APPLICATION_JSON;

                let reportUrl = reportId ? routeHelper.getReportsRoute(req.url, reportId) : req.url;
                opts.url = requestHelper.getRequestJavaHost() + routeHelper.getReportsCountRoute(reportUrl);

                return new Promise((resolve1, reject1) => {
                    requestHelper.executeRequest(req, opts).then(
                        (result) => {
                            resolve1(result);
                        },
                        (error) => {
                            reject1(error);
                        }
                    ).catch((ex) => {
                        requestHelper.logUnexpectedError('reportsAPI..fetchReportRecordsCount', ex, true);
                        reject1(ex);
                    });
                });
            },

            /**
             * Fetch the report result for a given report id
             *
             * @param req
             * @param opts
             * @returns {bluebird|exports|module.exports}
             */
            fetchReportResult(req, reportId) {

                var responseObj = {
                    metaData: null,
                    report: null
                };

                // Ensure the offset and numRows request parameter is set to either the supplied value or the defaults
                let offset = requestHelper.getQueryParameterValue(req, constants.REQUEST_PARAMETER.OFFSET);
                let numRows = requestHelper.getQueryParameterValue(req, constants.REQUEST_PARAMETER.NUM_ROWS);
                if (offset === null || numRows === null || !Number.isInteger(+offset) || !Number.isInteger(+numRows)) {
                    offset = constants.PAGE.DEFAULT_OFFSET;
                    numRows = constants.PAGE.DEFAULT_NUM_ROWS;
                } else {
                    /*eslint no-lonely-if:0*/
                    if (numRows > constants.PAGE.MAX_NUM_ROWS) {
                        log.warn("Report results request number of rows exceeds allowed limit.  Setting to max number of row limit of " + constants.PAGE.MAX_NUM_ROWS);
                        numRows = constants.PAGE.MAX_NUM_ROWS;
                    }
                }

                //  A get request means fetch the report with the default report meta data definition
                if (requestHelper.isGet(req)) {
                    //  Use the default report meta data to build and return the report results
                    return new Promise((resolve1, reject1) => {
                        this.fetchReportMetaData(req, reportId).then(
                            (metaDataResult) => {
                                let opts = requestHelper.setOptions(req, true);
                                opts.headers[constants.CONTENT_TYPE] = constants.APPLICATION_JSON;
                                opts.url = requestHelper.getRequestJavaHost() + routeHelper.getReportsResultsRoute(req.url, reportId);

                                //  Add the offset and num row parameters are included on the request
                                requestHelper.addQueryParameter(opts, constants.REQUEST_PARAMETER.OFFSET, offset);
                                requestHelper.addQueryParameter(opts, constants.REQUEST_PARAMETER.NUM_ROWS, numRows);

                                requestHelper.executeRequest(req, opts).then(
                                    (result) => {
                                        //  necessary to ensure if any group result is returned that it can be organized as expected by the client
                                        let reportMetaData = JSON.parse(metaDataResult.body);
                                        let sortList = parseSortList(reportMetaData.sortList);
                                        if (sortList) {
                                            requestHelper.addQueryParameter(req, constants.REQUEST_PARAMETER.SORT_LIST, sortList);
                                        }

                                        responseObj.metaData = reportMetaData;
                                        responseObj.report = result;
                                        resolve1(responseObj);
                                    },
                                    (error) => {
                                        reject1(error);
                                    }
                                ).catch((ex) => {
                                    requestHelper.logUnexpectedError('reportsAPI..fetchReportResult', ex, true);
                                    reject1(ex);
                                });
                            },
                            (metaDataError) => {
                                log.error({req: req}, 'Error fetching table homepage report metaData in fetchTableHomePageReport.');
                                reject1(metaDataError);
                            }
                        ).catch((ex) => {
                            requestHelper.logUnexpectedError('reportsAPI..unexpected error fetching table homepage report metaData in fetchTableHomePageReport', ex, true);
                            reject1(ex);
                        });
                    });
                } else {
                    //  A post request means fetch the report with using the default report meta data definition as a baseline
                    //  and then override the sortList, query and columnList(future) to generate a custom report.
                    return new Promise((resolve1, reject1) => {
                        this.fetchReportMetaData(req, reportId).then(
                            (metaDataResult) => {
                                let reportMetaData = JSON.parse(metaDataResult.body);

                                let opts = requestHelper.setOptions(req);
                                opts.headers[constants.CONTENT_TYPE] = constants.APPLICATION_JSON;
                                opts.url = requestHelper.getRequestJavaHost() + routeHelper.getDynamicReportsResultsRoute(req.url);

                                //  Add the offset and num row parameters are included on the request
                                requestHelper.addQueryParameter(opts, constants.REQUEST_PARAMETER.OFFSET, offset);
                                requestHelper.addQueryParameter(opts, constants.REQUEST_PARAMETER.NUM_ROWS, numRows);

                                //  override the default report meta data setting for sort list
                                let sList = requestHelper.getQueryParameterValue(req, constants.REQUEST_PARAMETER.SORT_LIST);
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

                                //  override the default report meta data setting for query parameter
                                let query = requestHelper.getQueryParameterValue(req, constants.REQUEST_PARAMETER.QUERY);
                                if (query !== null) {
                                    reportMetaData.query = query;
                                }

                                //  override the default report meta data column fid list
                                let columnFids = requestHelper.getQueryParameterValue(req, constants.REQUEST_PARAMETER.COLUMNS);
                                if (columnFids !== null) {
                                    //  we have a cList parameter; initialize the fid list in the event the parameter value is empty.
                                    reportMetaData.fids = [];
                                    if (columnFids !== '') {
                                        try {
                                            //  convert list delimited string into array and ensure the fid id's are integers
                                            reportMetaData.fids = columnsFids.split(constants.REQUEST_PARAMETER.LIST_DELIMITER);
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

                                requestHelper.executeRequest(req, opts).then(
                                    (result) => {
                                        responseObj.metaData = reportMetaData;
                                        responseObj.report = result;
                                        resolve1(responseObj);
                                    },
                                    (error) => {
                                        reject1(error);
                                    }
                                ).catch((ex) => {
                                    requestHelper.logUnexpectedError('reportsAPI..fetchReportResult', ex, true);
                                    reject1(ex);
                                });
                            },
                            (metaDataError) => {
                                log.error({req: req}, 'Error fetching table homepage report metaData in fetchTableHomePageReport.');
                                reject1(metaDataError);
                            }
                        ).catch((ex) => {
                            requestHelper.logUnexpectedError('reportsAPI..unexpected error fetching table homepage report metaData in fetchTableHomePageReport', ex, true);
                            reject1(ex);
                        });
                    });
                }
            },

            /**
             * Fetch report content.  Use report result endpoint to fetch a report using its meta data.
             *
             * @param req
             * @returns Promise
             */
            fetchReport: function(req, reportId, includeFacets) {
                return new Promise(function(resolve, reject) {
                    let fetchRequests = [this.fetchReportResult(req, reportId), this.fetchFields(req), this.fetchReportRecordsCount(req, reportId)];
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
                                    responseObject[FIELDS] = getFieldsOnReport(report.groups[0].records, fields);

                                    //  Organize the grouping data for the client
                                    let groupBy = groupFormatter.groupData(req, responseObject[FIELDS], report);

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
                                //  NOTE: this conditional block must run after responseObject[FIELDS] is set.
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
                                            //  jsonBigNum.parse throws exception if the input is empty array
                                            let facetRecords = jsonBigNum.parse(facets.body);
                                            responseObject[FACETS] = facetRecordsFormatter.formatFacetRecords(facetRecords, responseObject[FIELDS]);
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
                        requestHelper.logUnexpectedError('recordsAPI..fetchRecordsAndFields', error, true);
                        reject(error);
                    });
                }.bind(this));
            },

            /**
             * Return the table homepage report using it's meta data to determine its initial display state.
             *
             * @param req
             * @returns {bluebird|exports|module.exports}
             */
            fetchTableHomePageReport: function(req) {
                return new Promise((resolve, reject) => {
                    let opts = requestHelper.setOptions(req, true);
                    opts.headers[constants.CONTENT_TYPE] = constants.APPLICATION_JSON;
                    opts.url = requestHelper.getRequestJavaHost() + routeHelper.getTablesDefaultReportHomepageRoute(req.url);

                    //  make the api request to get the table homepage report id
                    requestHelper.executeRequest(req, opts).then(
                        (response) => {
                            // parse out the id and use to fetch the report meta data.  Process the meta data
                            // to fetch and return the report content.
                            if (response.body) {
                                let homepageReportId = JSON.parse(response.body);

                                //  have a homepage id; fetch the report
                                this.fetchReport(req, homepageReportId, true).then(
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
                            } else {
                                //  no report id returned (because one is not defined); return empty report object
                                log.warn({req:req}, 'No report homepage defined for table.');
                                resolve({});
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
