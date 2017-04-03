(function() {
    'use strict';

    let constants = require('../../../common/src/constants');

    let ACCESS_RIGHTS = 'accessRights';
    let ADMIN = 'admin';
    let APPS = 'apps';
    let DEFAULT_HOMEPAGE = 'defaulthomepage';
    let FACET_RESULTS = 'facets/results';
    let FIELDS = 'fields';
    let FORMS = 'forms';
    let FORM_TYPE = 'formType';
    let TABLES = 'tables';
    let TICKET = 'ticket';
    let RECORDS = 'records';
    let COUNT_QUERY = 'countQuery';
    let REPORTS = 'reports';
    let REPORT_COUNT = 'count';
    let REPORT_RESULTS = 'results';
    let ROLES = 'roles';
    let REPORT_INVOKE = 'invoke';
    let USERS = 'users';
    let RELATIONSHIPS = 'relationships';
    let TABLEPROPERTIES = 'tableproperties';

    let FEATURE_SWITCHES = 'featureSwitches';
    let FEATURE_SWITCH_STATES = FEATURE_SWITCHES + '/status';
    let WHOAMI = 'whoami';

    //  regular expressions to determine a url route. The expression is interpreted as:
    //      (.*)? - optionally match any character(s)
    //      \/ - escaped forward slash
    //      .* - wildcard match any character(s)
    //      /i - case insensitive
    let REGEX_FIELDS_ROUTE = /apps\/.*\/tables\/.*\/fields(.*)?$/i;
    let REGEX_RECORDS_FORMS_COMPONENT_ROUTE = /apps\/.*\/tables\/.*\/records\/.*\/formcomponents(.*)?$/i;
    let REGEX_FORMS_COMPONENT_ROUTE = /apps\/.*\/tables\/.*\/formcomponents(.*)?$/i;
    let REGEX_RECORDS_ROUTE = /apps\/.*\/tables\/.*\/records(.*)?$/i;
    let REGEX_REPORT_RESULTS_ROUTE = /apps\/.*\/tables\/.*\/reports\/.*\/results(.*)?$/i;
    let REGEX_TABLE_HOMEPAGE_ROUTE = /apps\/.*\/tables\/.*\/homepage(.*)?$/i;
    let REGEX_ADMIN_ROUTE = /admin(.*)?$/i;


    /**
     * Root endpoint of current stack
     * .NET handlers are /qb/
     */
    function getLegacyStackDotNetRoot() {
        return '/qb';
    }

    function getLegacyStackMainHandlerRoot() {
        return '/db/main';
    }

    /**
     *
     */
    function getEERoot() {
        return '/ee';
    }

    /**
     *
     */
    function getAWSRoot() {
        return '/dev';
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

    /**
     * For the given req.url, extract the '/api' in the path and
     * replace them with experience engine URL path.
     *
     * Example:  url: /api/api/apps/123/tables/456/formComponents/rest/of/url
     *           return: /ee/apps/123/tables/456/formComponents/rest/of/url
     *
     * @param url
     * @returns {*}
     */
    function getEEReqURL(url) {
        if (url) {
            if (url.search('/api/api') !== -1) {
                url = url.replace('/api/api', getEERoot());
            }

            if (url.search('/api') !== -1) {
                url = url.replace('/api', getEERoot());
            }
        }
        return url;
    }

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
    function getCoreFormsRoute(url, formId) {
        let root = getUrlRoot(url, TABLES);
        if (root) {
            return root + '/' + FORMS + (formId ? '/' + formId : '');
        }

        //  no url root for TABLES found; return original url unchanged
        return url;
    }

    /**
     * For the given req.url, extract the APPS and TABLES identifiers/ids and
     * append the FORMS identifier.
     *
     * Example:  url: /apps/123/tables/456/formComponents/rest/of/url
     *           return: /apps/123/tables/456/forms/action/formtype
     *
     * @param url
     * @param formId
     * @returns {*}
     */
    function getEEFormsRoute(url, formId) {
        let root = getUrlRoot(url, TABLES);
        if (!root) {
            return url;
        }

        let eeUrl = getEEReqURL(root);

        if (!eeUrl) {
            //  no url root for TABLES found; return original url unchanged
            return eeUrl;
        }
        eeUrl = eeUrl + '/' + FORMS;
        if (REGEX_RECORDS_FORMS_COMPONENT_ROUTE.test(url) ||
            REGEX_FORMS_COMPONENT_ROUTE.test(url)) {
            if (formId) {
                return eeUrl + (formId ? '/' + formId : '');
            }

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

                return eeUrl + (formType ? '/' + FORM_TYPE + '/' + formType.toUpperCase() : '');
            }
        }
        return eeUrl;
    }

    /**
     * get feature switches route on AWS
     * @param url
     * @returns {string}
     */
    function getAWSFeatureSwitchesRoute(url) {

        return getAWSRoot() + '/' + FEATURE_SWITCHES;
    }

    /**
     * get feature switch states route on AWS
     * @param url
     * @returns {string}
     */
    function getAWSFeatureSwitchStatesRoute(url) {

        return getAWSRoot() + '/' + FEATURE_SWITCH_STATES;
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
         * Given a url segment containging an APPS id, return the relationships
         * end point for that app.
         * Example:  url: /apps/123/rest/of/url
         *           return: /apps/123/relationships
         * @param url
         * @returns {*}
         */
        getRelationshipsRoute: function(url) {
            let root = getUrlRoot(url, APPS);
            if (root) {
                return root + '/' + RELATIONSHIPS;
            }
            return url;
        },

        /**
         * For the given req.url, extract the APPS identifier/id and
         * append the ROLES identifier.
         *
         * Example:  url: /apps/123/rest/of/url
         *           return: /apps/123/roles
         *
         * @param url
         * @returns {*}
         */
        getAppRolesRoute: function(url) {
            let root = getUrlRoot(url, APPS);
            if (root) {
                return root + '/' + ROLES + '/';
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

        getTablePropertiesRoute: function(url, tableId) {
            let root = getUrlRoot(url, APPS);
            if (root) {
                let eeUrl = getEEReqURL(root);
                if (eeUrl) {
                    return eeUrl + '/' + TABLES + (tableId ? '/' + tableId : '') + '/' + TABLEPROPERTIES;
                }
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
         * @param isEeEnable
         * @param formId
         * @returns {*}
         */
        getFormsRoute: function(url, isEeEnable, formId) {
            if (isEeEnable) {
                return getEEFormsRoute(url);
            } else {
                return getCoreFormsRoute(url, formId);
            }
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
         * Return the ticket route from the req.url.
         * @param url
         * @returns {*}
         */
        getTicketRoute: function(url) {
            //if (typeof url === 'string') {
            //    let offset = url.toLowerCase().indexOf(TICKET);
            //    if (offset !== -1) {
            //        let root = url.substring(0, offset) + TICKET;
            //        return root;
            //    }
            //}
            let root = getUrlRoot(url, TICKET);
            if (root) {
                return root;
            }
            return url;
        },

        /**
         * Return the ticket/whoAmI route from the req.url.
         * @param url
         * @returns {*}
         */
        getWhoAmIRoute: function(url) {
            if (typeof url === 'string') {
                let offset = url.toLowerCase().indexOf(TICKET);
                if (offset !== -1) {
                    let root = url.substring(0, offset) + TICKET + '/' + WHOAMI;
                    return root;
                }
            }
            return url;
        },

        /**
         * Return the users/{userId} route from the req.url.
         * @param url
         * @returns {*}
         */
        getUsersRoute: function(url, userId) {
            if (typeof url === 'string') {
                let offset = url.toLowerCase().indexOf(USERS);
                if (offset !== -1) {
                    let root = url.substring(0, offset) + USERS;
                    if (userId) {
                        root += '/' + userId;
                    }
                    return root;
                }
            }
            return url;
        },

        /**
         * Return the users/{userId} route from the req.url.
         * @param url
         * @returns {*}
         */
        getUsersRouteForAdmin: function(url, userId) {
            if (typeof url === 'string') {
                let offset = url.toLowerCase().indexOf(ADMIN);
                if (offset !== -1) {
                    let root = url.substring(0, offset) + USERS;
                    if (userId) {
                        root += '/' + userId;
                    }
                    return root;
                }
            }
            return url;
        },

        isAdminRoute(url) {
            if (typeof url === 'string') {
                return REGEX_ADMIN_ROUTE.test(url);
            }
            return false;
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
        },

        /**
         * get AWS route for feature switches
         * @param url
         * @param isOverrides
         * @param switchId
         * @param overrideId
         * @returns {string}
         */
        getFeatureSwitchesRoute: function(url, isOverrides, switchId, overrideId) {

            let route = getAWSFeatureSwitchesRoute(url);

            if (switchId) {
                route += '/' + switchId;
            }

            if (isOverrides) {
                route += '/featureSwitchOverrides';
            }

            if (overrideId) {
                route += '/' + overrideId;
            }
            return route;
        },

        /**
         * get AWS route for feature switches bulk operations
         * @param url
         * @param isOverrides
         * @param switchId
         * @param overrideId
         * @param ids
         * @returns {string}
         */
        getFeatureSwitchesBulkRoute: function(url, isOverrides, switchId) {

            let route = getAWSFeatureSwitchesRoute(url);

            if (switchId) {
                route += '/' + switchId;
            }
            if (isOverrides) {
                route += '/featureSwitchOverrides';
            }
            route += '/bulk';

            return route;
        },

        /**
         * get AWS route for feature switch states
         * @param url
         * @param appId
         * @param realmId
         * @returns {string}
         */
        getFeatureSwitchStatesRoute: function(url, realmId, appId) {

            let route = getAWSFeatureSwitchStatesRoute(url);

            route += '?realmId=' + realmId;

            if (appId) {
                route += '&appId=' + appId;
            }

            return route;
        },

        /**
         * Call .NET handler to return the Current Stack Account Users information
         * @returns {string}
         */
        getAccountUsersLegacyStackRoute: function(accountId) {
            return `${getLegacyStackDotNetRoot()}/governance/${accountId}/users`;
        },

        /**
         * Call .NET handler to return the context of the account and user
         * @returns {string}
         */
        getGovernanceContextLegacyStackRoute: function(accountId) {
            return `${getLegacyStackDotNetRoot()}/governance/context/${accountId ? accountId : ''}`;
        },

        /**
         * Navigate to the legacy stack 'My Apps' page
         * @returns {string}
         */
        getMyAppsLegacyStackRoute: function() {
            return `${getLegacyStackMainHandlerRoot()}?a=myqb`;
        }


    };

}());
