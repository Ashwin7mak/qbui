/**
 * Report service module which contains methods for generating app JSON objects and interacting with the Node server layer
 * Created by klabak on 9/17/15.
 */
(function() {
    'use strict';
    //Bluebird Promise library
    var promise = require('bluebird');
    module.exports = function(recordBase) {
        var reportService = {
            /**
             * Generates a report and creates it in a table via the API. Not supplying a query string
             * will generate a 'list all' report. Returns a promise.
             */
            // TODO: QBSE-13518 Write a report generator in the test_generators package
            // TODO: Fix promise anti-pattern QBSE-20581
            createReport: function(appId, tableId, query, reportName, facetFids) {
                var deferred = promise.pending();
                var reportJSON = {
                    name      : reportName || 'Test Report',
                    type      : 'TABLE',
                    description : 'This is the report description and it belongs in the stage. We could be so lucky!',
                    ownerId   : '10000',
                    hideReport: false,
                    query: query
                };
                if (facetFids) {
                    reportJSON.facetFids = facetFids;
                }
                var reportsEndpoint = recordBase.apiBase.resolveReportsEndpoint(appId, tableId);

                // TODO: QBSE-13843 Create helper GET And POST functions that extend this executeRequest function
                recordBase.apiBase.executeRequest(reportsEndpoint, 'POST', reportJSON).then(function(result) {
                    //console.log('Report create result');
                    var parsed = JSON.parse(result.body);
                    var id = parsed.id;
                    deferred.resolve(id);
                }).catch(function(error) {
                    console.error(JSON.stringify(error));
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            /**
             * Generates a report with Fids and creates it in a table via the API. Not supplying a query string
             * will generate a 'list all' report. Returns a promise.
             */
            // TODO: QBSE-13518 Write a report generator in the test_generators package
            createReportWithFids: function(appId, tableId, fids, query, reportName) {
                var deferred = promise.pending();
                var reportJSON = {
                    name      : reportName || 'Report With Sorting',
                    type      : 'TABLE',
                    fids  : fids,
                    ownerId   : '10000',
                    hideReport: false
                };
                var reportsEndpoint = recordBase.apiBase.resolveReportsEndpoint(appId, tableId);

                // TODO: QBSE-13843 Create helper GET And POST functions that extend this executeRequest function
                recordBase.apiBase.executeRequest(reportsEndpoint, 'POST', reportJSON).then(function(result) {
                    //console.log('Report create result');
                    var parsed = JSON.parse(result.body);
                    var id = parsed.id;
                    deferred.resolve(id);
                }).catch(function(error) {
                    console.error(JSON.stringify(error));
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            /**
             * Generates a report with sorting and grouping and creates it in a table via the API. Not supplying a query string
             * will generate a 'list all' report. Returns a promise.
             */
            // TODO: QBSE-13518 Write a report generator in the test_generators package
            createReportWithSortAndGroup: function(appId, tableId, fids, query, reportName) {
                var deferred = promise.pending();
                var reportJSON = {
                    name      : reportName || 'Report With Sorting And Grouping',
                    type      : 'TABLE',
                    sortList  : fids,
                    ownerId   : '10000',
                    hideReport: false
                };
                var reportsEndpoint = recordBase.apiBase.resolveReportsEndpoint(appId, tableId);

                // TODO: QBSE-13843 Create helper GET And POST functions that extend this executeRequest function
                recordBase.apiBase.executeRequest(reportsEndpoint, 'POST', reportJSON).then(function(result) {
                    //console.log('Report create result');
                    var parsed = JSON.parse(result.body);
                    var id = parsed.id;
                    deferred.resolve(id);
                }).catch(function(error) {
                    console.error(JSON.stringify(error));
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            /**
             * Generates a report with Fids and sorting and creates it in a table via the API. Not supplying a query string
             * will generate a 'list all' report. Returns a promise.
             */
            // TODO: QBSE-13518 Write a report generator in the test_generators package
            createReportWithFidsAndSortList: function(appId, tableId, fids, sortfids, query, reportName) {
                var deferred = promise.pending();
                var reportJSON = {
                    name      : reportName || 'Report With Sorting',
                    type      : 'TABLE',
                    fids  : fids,
                    sortList  : sortfids,
                    ownerId   : '10000',
                    hideReport: false
                };
                var reportsEndpoint = recordBase.apiBase.resolveReportsEndpoint(appId, tableId);

                // TODO: QBSE-13843 Create helper GET And POST functions that extend this executeRequest function
                recordBase.apiBase.executeRequest(reportsEndpoint, 'POST', reportJSON).then(function(result) {
                    //console.log('Report create result');
                    var parsed = JSON.parse(result.body);
                    var id = parsed.id;
                    deferred.resolve(id);
                }).catch(function(error) {
                    console.error(JSON.stringify(error));
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            /**
             * Generates a report with filters and creates it in a table via the API. Not supplying a query string
             * will generate a 'list all' report. Returns a promise.
             */
            // TODO: QBSE-13518 Write a report generator in the test_generators package
            createReportWithFacets: function(appId, tableId, fids, query, reportName) {
                var deferred = promise.pending();
                var reportJSON = {
                    name      : reportName || 'Report With Facets',
                    type      : 'TABLE',
                    facetFids : fids,
                    ownerId   : '10000',
                    hideReport: false
                };
                var reportsEndpoint = recordBase.apiBase.resolveReportsEndpoint(appId, tableId);

                // TODO: QBSE-13843 Create helper GET And POST functions that extend this executeRequest function
                recordBase.apiBase.executeRequest(reportsEndpoint, 'POST', reportJSON).then(function(result) {
                    //console.log('Report create result');
                    var parsed = JSON.parse(result.body);
                    var id = parsed.id;
                    deferred.resolve(id);
                }).catch(function(error) {
                    console.error(JSON.stringify(error));
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            /**
             * Generates a report with filters and sortLists and creates it in a table via the API. Not supplying a query string
             * will generate a 'list all' report. Returns a promise.
             */
            // TODO: QBSE-13518 Write a report generator in the test_generators package
            createReportWithFidsAndFacetsAndSortLists: function(appId, tableId, fids, facetFids, sortFids, query, reportName) {
                var deferred = promise.pending();
                var reportJSON = {
                    name      : reportName || 'Report With Fids SortList And Facets',
                    type      : 'TABLE',
                    fids      : fids,
                    facetFids : facetFids,
                    sortList  : sortFids,
                    ownerId   : '10000',
                    hideReport: false
                };
                var reportsEndpoint = recordBase.apiBase.resolveReportsEndpoint(appId, tableId);

                // TODO: QBSE-13843 Create helper GET And POST functions that extend this executeRequest function
                recordBase.apiBase.executeRequest(reportsEndpoint, 'POST', reportJSON).then(function(result) {
                    //console.log('Report create result');
                    var parsed = JSON.parse(result.body);
                    var id = parsed.id;
                    deferred.resolve(id);
                }).catch(function(error) {
                    console.error(JSON.stringify(error));
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            /**
             * Helper function that will run an existing report in a table via the API. Returns a promise.
             */
            runReport: function(appId, tableId, reportId) {
                var deferred = promise.pending();
                var reportsEndpoint = recordBase.apiBase.resolveReportsEndpoint(appId, tableId, reportId);
                var runReportEndpoint = reportsEndpoint + '/results';
                recordBase.apiBase.executeRequest(runReportEndpoint, 'GET').then(function(result) {
                    //console.log('Report create result');
                    var responseBody = JSON.parse(result.body);
                    //console.log(parsed);
                    deferred.resolve(responseBody.records);
                }).catch(function(error) {
                    console.log(JSON.stringify(error));
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            createDefaultReport: function(appId, tableId, name, fids, facetFids, sortList, query) {
                var deferred = promise.pending();
                var reportJSON = {
                    name      : name || 'Default Test Report',
                    description : 'This is the default report description and it belongs in the stage. We could be so lucky! ' +
                    'This report was created with the following parameters - ' +
                    'fids: ' + fids + ', ' +
                    'sortList: ' + sortList + ', ' +
                    'facetFids: ' + facetFids + ', ' +
                    'query: ' + query,
                    type      : 'TABLE',
                    //TODO: Extend function when we add test data support for roles and perms
                    ownerId   : '10000',
                    //showDescriptionOnReport: false,
                    //hideReport: false,
                    //showSearchBox: true,
                    fids      : fids,
                    sortList  : sortList,
                    facetFids : facetFids,
                    //facetBehavior: 'default',
                    query      : query
                    //allowEdit: true,
                    //allowView: true,
                    //displayNewlyChangedRecords: false,
                    //reportFormat: '',
                    //calculatedColumns: null,
                    //rolesWithGrantedAccess: [],
                    //summary: 'hide'
                };
                var reportsEndpoint = recordBase.apiBase.resolveReportsEndpoint(appId, tableId);

                // TODO: QBSE-13843 Create helper GET And POST functions that extend this executeRequest function
                recordBase.apiBase.executeRequest(reportsEndpoint, 'POST', reportJSON).then(function(result) {
                    //console.log('Report create result');
                    var parsed = JSON.parse(result.body);
                    var id = parsed.id;
                    deferred.resolve(id);
                }).catch(function(error) {
                    console.error(JSON.stringify(error));
                    deferred.reject(error);
                });
                return deferred.promise;
            }
        };
        return reportService;
    };
}());
