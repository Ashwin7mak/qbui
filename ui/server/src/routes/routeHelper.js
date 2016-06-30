(function() {
    'use strict';

    let APPS = 'apps';
    let FACET_RESULTS = 'facets/results';
    let FIELDS = 'fields';
    let FORMS = 'forms';
    let TABLES = 'tables';
    let RECORDS = 'records';
    let REPORTS = 'reports';
    let REPORT_RESULTS = 'results';
    let DEFAULT_HOMEPAGE = 'defaulthomepage';

    function getUrlRoot(url, type) {

        if (typeof url === 'string') {
            let elements = url.split('/');
            let path = '';
            for (let idx = 0; idx < elements.length; idx++) {
                if (elements[idx].toLowerCase() === type) {
                    path += elements[idx];
                    if (idx + 1 < elements.length) {
                        if (elements[idx + 1].length > 0) {
                            path += '/' + elements[idx + 1];
                            return path;
                        }
                    }
                    //  no id associated with the type, that's an invalid root..
                    break;
                }
                path += elements[idx] + '/';
            }
            //  if fall out of loop, did not found type in url; return null
        }
        return null;
    }

    module.exports  = {

        /**
         * Supporting method to transform a segment of the url component.  If curRoute segement is found
         * in the url, the new route segment is placed in the starting position of where curRoute is located.
         *
         * Example:
         *  let newUrl = transformUrlRoute('apps/123/tables/456/component', 'tables', 'forms/789');
         *  newUrl ==> apps/123/forms/789
         *
         * @param url - url to examine
         * @param curRoute - route to search
         * @param newRoute - new route to replace
         * @returns {*}
         */
        transformUrlRoute: function(url, curRoute, newRoute) {
            if (typeof url === 'string') {
                var offset = url.toLowerCase().indexOf(curRoute);
                if (offset !== -1) {
                    return url.substring(0, offset) + newRoute;
                }
            }
            //  return requestUrl unchanged
            return url;
        },

        /**
         * For the given req.url, extract the APPS identifier/id and
         * append the TABLE identifier and optional tableId.
         *
         * Example:  url: /apps/123/rest/of/url
         *           return: /apps/123/tables/<tableId>
         *
         * @param url
         * @param tableId
         * @returns {*}
         */
        getTablesRoute: function(url, tableId) {
            let root = getUrlRoot(url, APPS);
            if (root) {
                return root + '/' + TABLES + (tableId ? '/' + tableId : '');
            }

            //  no url root for APPS found; return original url unchanged
            return url;
        },

        /**
         * For the given req.url, extract the APPS and TABLES identifiers/ids and
         * append the DEFAULT HOMEPAGE identifier
         *
         * Example:  url: /apps/123/tables/456/rest/of/url
         *           return: /apps/123/tables/456/defaulthomepage
         *
         * @param url
         * @returns {*}
         */
        getTablesDefaultReportHomepageRoute: function(url) {
            let root = getUrlRoot(url, TABLES);
            if (root) {
                return root + '/' + DEFAULT_HOMEPAGE;
            }

            //  no url root for TABLES found; return original url unchanged
            return url;
        },

        /**
         * For the given req.url, extract the APPS and TABLES identifiers/ids and
         * append the FIELDS identifier and optional fieldId.
         *
         * Example:  url: /apps/123/tables/456/rest/of/url
         *           return: /apps/123/tables/456/fields/<fieldId>
         *
         * @param url
         * @param fieldId
         * @returns {*}
         */
        getFieldsRoute: function(url, fieldId) {
            let root = getUrlRoot(url, TABLES);
            if (root) {
                return root + '/' + FIELDS + (fieldId ? '/' + fieldId : '');
            }

            //  no url root for TABLES found; return original url unchanged
            return url;
        },

        /**
         * For the given req.url, extract the APPS and TABLES identifiers/ids and
         * append the FORMS identifier and optional formId.
         *
         * Example:  url: /apps/123/tables/456/rest/of/url
         *           return: /apps/123/tables/456/forms/<formId>
         *
         * @param url
         * @param formId
         * @returns {*}
         */
        getFormsRoute: function(url, formId) {
            let root = getUrlRoot(url, TABLES);
            if (root) {
                return root + '/' + FORMS + (formId ? '/' + formId : '');
            }

            //  no url root for TABLES found; return original url unchanged
            return url;
        },

        /**
         * For the given req.url, extract the APPS and TABLES identifiers/ids and
         * append the RECORDS identifier and optional recordId.
         *
         * Example:  url: /apps/123/tables/456/rest/of/url
         *           return: /apps/123/tables/456/records/<recordId>
         *
         * @param url
         * @param recordId
         * @returns {*}
         */
        getRecordsRoute: function(url, recordId) {
            let root = getUrlRoot(url, TABLES);
            if (root) {
                return root + '/' + RECORDS + (recordId ? '/' + recordId : '');
            }

            //  no url root for TABLES found; return original url unchanged
            return url;
        },

        /**
         * For the given req.url, extract the APPS, TABLES and REPORTS identifiers/ids and
         * append the FACETS RESULTS identifier.
         *
         * Example:  url: /apps/123/tables/456/reports/789/rest/of/url
         *           return: /apps/123/tables/456/reports/789/facets/results
         *
         * @param url
         * @returns {*}
         */
        getReportsFacetRoute: function(url) {
            let root = getUrlRoot(url, REPORTS);
            if (root) {
                return root + "/" + FACET_RESULTS;
            }

            //  no url root for REPORTS found; return original url unchanged
            return url;
        },

        /**
         * For the given req.url, extract the APPS and TABLES identifiers/ids and
         * append the REPORTS identifier and optional recordId.
         *
         * Example:  url: /apps/123/tables/456/rest/of/url
         *           return: /apps/123/tables/456/reports/<recordId>
         *
         * @param url
         * @param reportId
         * @returns {*}
         */
        getReportsRoute: function(url, reportId) {
            let root = getUrlRoot(url, TABLES);
            if (root) {
                return root + '/' + REPORTS + (reportId ? '/' + reportId : '');
            }

            //  no url root for TABLES found; return original url unchanged
            return url;
        },

        /**
         * For the given req.url:
         *  a) if no reportID, extract the APPS, TABLES and REPORTS identifiers/ids and
         *    append the REPORT RESULTS identifier.
         *    Example:  url: /apps/123/tables/456/reports/789/rest/of/url
         *              return: /apps/123/tables/456/reports/789/results
         *
         *  b) if reportId, extract the APPS and TABLES identifiers/ids and
         *    append the REPORTS identifier and recordId.

         *    Example:  url: /apps/123/tables/456/rest/of/url
         *               return: /apps/123/tables/456/reports/<reportId>/results
         * @param url
         * @param reportId
         * @returns {*}
         */
        getReportsResultsRoute: function(url, reportId) {
            let root = '';
            if (reportId) {
                root = getUrlRoot(url, TABLES);
                if (root) {
                    root += '/' + REPORTS + '/' + reportId;
                }
            } else {
                root = getUrlRoot(url, REPORTS);
            }

            if (root) {
                return root + '/' + REPORT_RESULTS;
            }

            //  no url root found; return original url unchanged
            return url;
        }

    };

}());
