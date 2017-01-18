(function() {
    'use strict';

    let constants = require('../../../common/src/constants');

    let ACCESS_RIGHTS = 'accessRights';
    let APPS = 'apps';
    let DEFAULT_HOMEPAGE = 'defaulthomepage';
    let FACET_RESULTS = 'facets/results';
    let FIELDS = 'fields';
    let FORMS = 'forms';
    let FORM_TYPE = 'action';
    let TABLES = 'tables';
    let RECORDS = 'records';
    let COUNT_QUERY = 'countQuery';
    let REPORTS = 'reports';
    let REPORT_COUNT = 'count';
    let REPORT_RESULTS = 'results';
    let REPORT_INVOKE = 'invoke';
    let USERS = 'users';

    let SET_APPLICATION_STACK_JBI = 'JBI_SetAdminRedirectToV3';
    let GET_APPLICATION_STACK_JBI = 'JBI_GetAdminRedirectToV3';

    //  regular expressions to determine a url route. The expression is interpreted as:
    //      (.*)? - optionally match any character(s)
    //      \/ - escaped forward slash
    //      .* - wildcard match any character(s)
    //      /i - case insensitive
    let REGEX_FIELDS_ROUTE = /apps\/.*\/tables\/.*\/fields(.*)?$/i;
    let REGEX_RECORDS_FORMS_COMPONENT_ROUTE = /apps\/.*\/tables\/.*\/records\/.*\/formcomponents(.*)?$/i;
    let REGEX_RECORDS_ROUTE = /apps\/.*\/tables\/.*\/records(.*)?$/i;
    let REGEX_REPORT_RESULTS_ROUTE = /apps\/.*\/tables\/.*\/reports\/.*\/results(.*)?$/i;
    let REGEX_TABLE_HOMEPAGE_ROUTE = /apps\/.*\/tables\/.*\/homepage(.*)?$/i;

    /**
     *
     */
    function getLegacyRoot() {
        return '/db';
    }

    /**
     *
     */
    function getEERoot() {
        return '/ee';
    }

    /**
     * Private function to extract the root url for the given type.
     *
     * @param url - request url to parse
     * @param type - parse the url to the specified root type.  Root type are APPS, TABLES, RECORDS, etc.
     * @returns {*}
     */
    function getUrlRoot(url, type) {

        if (typeof url === 'string') {
            //  split up the url into pieces
            let elements = url.split('/');
            let path = '';

            //  starting at the first element, construct a root url until the root type is found.
            //  For example, if the url is /apps/123/tables/456/records and the request is build
            //  the url for:
            //        apps   --> the return root url will be /apps/123
            //        tables --> the return root url will be /apps/123/tables/456
            //
            for (let idx = 0; idx < elements.length; idx++) {
                //  is this segment the root type
                if (elements[idx].toLowerCase() === type) {
                    path += elements[idx];

                    //  there has to be an id associated with the type
                    if (idx + 1 < elements.length) {
                        if (elements[idx + 1].length > 0) {
                            path += '/' + elements[idx + 1];
                            return path;
                        }
                    }
                    //  no id associated with the type, that's an invalid root..
                    break;
                }

                //  haven't reached the root type yet, so build out the url by appending the route
                //  segements.  Will continue to do this until the type segment is found.
                path += elements[idx] + '/';
            }
            //  if fall out of loop, did not find type in url; return null
        }
        return null;
    }

    /**
     * Return the report id segment to use when request a report route(execute, meta, facets and counts)
     * that supports the default table report.
     *
     * @param reportId
     * @returns {string}
     */
    function getReportIdentifier(reportId) {
        return (reportId === constants.SYNTHETIC_TABLE_REPORT.ID ? constants.SYNTHETIC_TABLE_REPORT.ROUTE : reportId);
    }

    /**
     * Modify the report route if rendering the default report
     *
     * @param route
     * @returns {*}
     */
    function updateReportRouteIdentifier(route) {
        if (route) {
            //  does the route end with a request to generate a synthetic default table report
            const reportRouteSuffix = REPORTS + '/' + constants.SYNTHETIC_TABLE_REPORT.ID;
            if (route.endsWith(reportRouteSuffix)) {
                //  this is a default route; change the report id with the default report suffix
                const defaultReportRouteSuffix = REPORTS + '/' + constants.SYNTHETIC_TABLE_REPORT.ROUTE;
                return route.replace(reportRouteSuffix, defaultReportRouteSuffix);
            }
        }
        return route;
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
                let offset = url.toLowerCase().indexOf(curRoute);
                if (offset !== -1) {
                    return url.substring(0, offset) + newRoute;
                }
            }
            //  return requestUrl unchanged
            return url;
        },

        /**
         * Return the get apps route from the req.url.
         * Append the appid if one is supplied.
         *
         * @param url
         * @param appId
         * @returns {*}
         */
        getAppsRoute: function(url, appId) {
            if (typeof url === 'string') {
                let offset = url.toLowerCase().indexOf(APPS);
                if (offset !== -1) {
                    let root = url.substring(0, offset) + APPS;
                    if (appId) {
                        root += '/' + appId;
                    }
                    return root;
                }
            }
            return url;
        },

        /**
         * Return get the et apps access rights route from the req.url.
         * Both url and appId must be supplied.
         *
         * @param url
         * @param appId
         * @returns {*}
         */
        getAppsAccessRightsRoute(url, appId) {
            if (typeof url === 'string' && appId) {
                if (url.toLowerCase().indexOf(APPS) !== -1) {
                    return this.getAppsRoute(url, appId) + '/' + ACCESS_RIGHTS;
                }
            }
            return url;
        },

        /**
         * For the given req.url, extract the APPS identifier/id and
         * append the USERS identifier.
         *
         * Example:  url: /apps/123/rest/of/url
         *           return: /apps/123/users
         *
         * @param url
         * @returns {*}
         */
        getAppUsersRoute: function(url) {
            let root = getUrlRoot(url, APPS);
            if (root) {
                return root + '/' + USERS + '/';
            }

            //  no url root for APPS found; return original url unchanged
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
        getCoreFormsRoute: function(url, formId) {
            let root = getUrlRoot(url, TABLES);
            if (root) {
                return root + '/' + FORMS + (formId ? '/' + formId : '');
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
        getEEFormsRoute: function(url) {
            let root = getUrlRoot(url, TABLES);

            if (root) {
                if (url.search('formType') !== -1) {
                    let formType;
                    url.split("&").forEach(item => {
                        let s = item.split("="),
                            k = s[0],
                            v = s[1];
                        if (k.search('formType') !== -1) {
                            formType = v;
                        }
                    });

                    return root + '/' + FORMS + (formType ? '/' + FORM_TYPE + '/' + formType.toUpperCase() : '');
                }

                return root;
            }

            //  no url root for TABLES found; return original url unchanged
            return url;
        },

        getEEReqURL: function(url) {
            if (url.search('/api/api') !== -1) {
                url = url.replace('/api/api', getEERoot());
            }

            if (url.search('/api') !== -1) {
                url = url.replace('/api', getEERoot());
            }
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
        getRecordsCountRoute: function(url) {
            let root = getUrlRoot(url, TABLES);
            if (root) {
                return root + '/' + RECORDS + '/' + COUNT_QUERY;
            }

            //  no url root for TABLES found; return original url unchanged
            return url;
        },

        /**
         * For the given req.url, extract the APPS and TABLES identifiers/ids and
         * append the REPORTS identifier and optional reportId.
         *
         * Example:  url: /apps/123/tables/456/rest/of/url
         *           return: /apps/123/tables/456/reports/<reportId>
         *
         * @param url
         * @param reportId
         * @returns {*}
         */
        getReportsRoute: function(url, reportId) {
            let root = getUrlRoot(url, TABLES);
            if (root) {
                root += '/' + REPORTS;
                if (reportId) {
                    root += '/' + getReportIdentifier(reportId);
                }
                return root;
            }

            //  no url root for TABLES found; return original url unchanged
            return url;
        },

        /**
         * For the given req.url, extract the APPS, TABLES and REPORTS identifiers/ids and
         * append the COUNT identifier.
         *
         * Example:  url: /apps/123/tables/456/reports/789/rest/of/url
         *           return: /apps/123/tables/456/reports/789/count
         *
         * @param url
         * @param reportId
         * @returns {*}
         */
        getReportsCountRoute: function(url, reportId) {
            let root = '';
            if (reportId) {
                root = getUrlRoot(url, TABLES);
                if (root) {
                    root += '/' + REPORTS + '/' + getReportIdentifier(reportId);
                }
            } else {
                root = updateReportRouteIdentifier(getUrlRoot(url, REPORTS));
            }

            if (root) {
                return root + "/" + REPORT_COUNT;
            }

            //  no url root for REPORTS found; return original url unchanged
            return url;
        },

        /**
         * For the given req.url, extract the APPS, TABLES and REPORTS identifiers/ids and
         * append the FACETS RESULTS identifier.
         *
         * Example:  url: /apps/123/tables/456/reports/789/rest/of/url
         *           return: /apps/123/tables/456/reports/789/facets/results
         *
         * For the given req.url:
         *  a) if no reportID, extract the APPS, TABLES and REPORTS identifiers/ids and
         *    append the REPORT FACETS identifier.
         *    Example:  url: /apps/123/tables/456/reports/789/rest/of/url
         *              return: /apps/123/tables/456/reports/789/facets/results
         *
         *  b) if reportId, extract the APPS and TABLES identifiers/ids and
         *    append the REPORTS identifier and recordId before appending the FACETS identifier.

         *    Example:  url: /apps/123/tables/456/rest/of/url
         *               return: /apps/123/tables/456/reports/<reportId>/facets/results
         * @param url
         * @param reportId
         * @returns {*}
         */
        getReportsFacetRoute: function(url, reportId) {
            let root = '';
            if (reportId) {
                root = getUrlRoot(url, TABLES);
                if (root) {
                    root += '/' + REPORTS + '/' + getReportIdentifier(reportId);
                }
            } else {
                root = updateReportRouteIdentifier(getUrlRoot(url, REPORTS));
            }

            if (root) {
                return root + "/" + FACET_RESULTS;
            }

            //  no url root for REPORTS found; return original url unchanged
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
         *
         *    Example:  url: /apps/123/tables/456/rest/of/url
         *               return: /apps/123/tables/456/reports/<reportId>/results
         *
         * @param url
         * @param reportId
         * @returns {*}
         */
        getReportsResultsRoute: function(url, reportId) {
            let root = '';
            if (reportId) {
                root = getUrlRoot(url, TABLES);
                if (root) {
                    root += '/' + REPORTS + '/' + getReportIdentifier(reportId);
                }
            } else {
                root = updateReportRouteIdentifier(getUrlRoot(url, REPORTS));
            }

            if (root) {
                return root + '/' + REPORT_RESULTS;
            }

            //  no url root found; return original url unchanged
            return url;
        },

        /**
         * Return the report invoke route that is used to generate a
         * report with customized meta data.
         *
         * @param url
         * @returns {*}
         */
        getInvokeReportRoute: function(url) {
            let root = getUrlRoot(url, TABLES);
            if (root) {
                return root + '/' + REPORTS + '/' + REPORT_INVOKE;
            }
            return url;
        },

        /**
         * Return the Quickbase classic url route to get the application's
         * current stack preference or set the application's stack preference.
         *
         * Examples:
         *      /db/<appid>/?a=JBI_GetAdminRedirectToV3
         *      /db/<appid>/?a=JBI_SetAdminRedirectToV3&value=1
         *
         * @param appId
         * @param isPost - is this a post request
         * @param value - value to set the application preference for post request
         *
         * @returns {*}
         */
        getApplicationStackPreferenceRoute: function(appId, isPost, value) {
            let root = getLegacyRoot();
            if (appId) {
                root += '/' + appId;

                if (isPost === true) {
                    root += '?' + constants.REQUEST_PARAMETER.LEGACY_STACK.ACTION + '=' + SET_APPLICATION_STACK_JBI + '&' + constants.REQUEST_PARAMETER.LEGACY_STACK.VALUE + '=' + value;
                } else {
                    root += '?' + constants.REQUEST_PARAMETER.LEGACY_STACK.ACTION + '=' + GET_APPLICATION_STACK_JBI;
                }
            }
            return root;
        },

        /**
         * Is the route a request for report results
         *
         * @param url
         * @returns {boolean}
         */
        isReportResultsRoute(url) {
            if (typeof url === 'string') {
                return REGEX_REPORT_RESULTS_ROUTE.test(url);
            }
            return false;
        },

        /**
         * Is the route a request for the table homepage
         *
         * @param url
         * @returns {boolean}
         */
        isTableHomePageRoute(url) {
            if (typeof url === 'string') {
                return REGEX_TABLE_HOMEPAGE_ROUTE.test(url);
            }
            return false;
        },

        /**
         * Is the route a request for form components
         *
         * @param url
         * @returns {boolean}
         */
        isFormsComponentRoute(url) {
            if (typeof url === 'string') {
                return REGEX_RECORDS_FORMS_COMPONENT_ROUTE.test(url);
            }
            return false;
        },

        /**
         * Is the route a request for records
         *
         * @param url
         * @returns {boolean}
         */
        isRecordsRoute(url) {
            if (typeof url === 'string') {
                return REGEX_RECORDS_ROUTE.test(url);
            }
            return false;
        },

        /**
         * Is the route a request for fields
         *
         * @param url
         * @returns {boolean}
         */
        isFieldsRoute(url) {
            if (typeof url === 'string') {
                return REGEX_FIELDS_ROUTE.test(url);
            }
            return false;
        }

    };

}());
