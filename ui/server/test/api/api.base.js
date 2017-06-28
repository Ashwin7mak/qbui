(function() {
    'use strict';
    var request = require('request');
    var promise = require('bluebird');
    var assert = require('assert');
    var consts = require('../../../common/src/constants');
    var log = require('../../src/logger').getLogger();
    var requestUtils = require('../../src/utility/requestUtils');
    var crypto = require('crypto');
    var _ = require('lodash');
    //This is the url that will be used for making requests to the node server or the java server
    var baseUrl;
    var confTicket;

    /*
     * We can't use JSON.parse() with records because it is possible to lose decimal precision as a
     * result of the JavaScript implementation of its single numeric data type. In JS, all numbers are
     * 64 bit floating points where bits 0-51 store values, bits 52-62 store the exponent and
     * bit 63 is the sign bit. This is the IEEE 754 standard. Practically speaking, this means
     * that a java Long, which uses all bits 0-62 to store values, cannot be expressed in a JS
     * number without a loss of precision.  For this reason, we use a special implementation of
     * JSON.parse/stringify that depends on an implementation of BigDecimal, which is capable of
     * expressing all the precision of numeric values we expect to get from the java capabilities
     * APIs.  This is slower than using JSON.parse/stringify, but is necessary to avoid the loss
     * of precision. For more info, google it!
     */
    var jsonBigNum = require('json-bignum');

    module.exports = function(config) {
        //Module constants
        var QBUI_BASE_ENDPOINT = '/qbui';
        var JAVA_BASE_ENDPOINT = '/api/api/v1';
        var EE_BASE_ENDPOINT = '/ee/v1';
        var APPS_ENDPOINT = '/apps/';
        var RELATIONSHIPS_ENDPOINT = '/relationships/';
        var TABLES_ENDPOINT = '/tables/';
        var FIELDS_ENDPOINT = '/fields/';
        var FORMS_ENDPOINT = '/forms/';
        var FORM_TYPE_ENDPOINT = 'formType/';
        var REPORTS_ENDPOINT = '/reports/';
        var REPORTS_RESULTS_ENDPOINT = '/results';
        var RECORDS_ENDPOINT = '/records/';
        var RECORDS_BULK = '/records/bulk';
        var REALMS_ENDPOINT = '/realms/';
        var PRIVATE_USERS_ENDPOINT = '/private/users/';
        var USERS_ENDPOINT = '/users/';
        var BULK_USERS_ENDPOINT = '/users/bulk';
        var ROLES_ENDPOINT = '/roles/';
        var TABLES_RIGHTS = '/tableRights/';
        var FIELD_RIGHTS = '/fieldRights/';
        var ADMIN_REALM = 'localhost';
        var ADMIN_REALM_ID = 117000;
        var ADMIN_TICKETS_ENDPOINT = '/ticket?uid=10000&realmId=';
        var TICKETS_ENDPOINT = '/ticket';
        var HEALTH_ENDPOINT = '/health';
        var SUBDOMAIN_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789';
        var CONTENT_TYPE = 'Content-Type';
        var APPLICATION_JSON = 'application/json';
        var TICKET_HEADER_KEY = 'ticket';
        var PRIVATE_API_AUTH_HEADER = 'X-CORE-SHA256HASH';
        var PRIVATE_API_SALT_HEADER = 'X-CORE-SALT';
        var PRIVATE_API_TIMESTAMP_HEADER = 'X-CORE-TIMESTAMP';
        var DEFAULT_HEADERS = {};
        DEFAULT_HEADERS[CONTENT_TYPE] = APPLICATION_JSON;
        var PRIVATE_API_HEADERS = {};
        var apiSalt = generateSalt();
        var epochTimeNow = getEpochTimeNow();
        PRIVATE_API_HEADERS[CONTENT_TYPE] = APPLICATION_JSON;
        PRIVATE_API_HEADERS[PRIVATE_API_AUTH_HEADER] = hashAndEncode(epochTimeNow, apiSalt, 'e4d1d39f-3352-474e-83bb-74dda6c4d8d7');
        PRIVATE_API_HEADERS[PRIVATE_API_SALT_HEADER] = apiSalt;
        PRIVATE_API_HEADERS[PRIVATE_API_TIMESTAMP_HEADER] = epochTimeNow;
        var ERROR_HPE_INVALID_CONSTANT = 'HPE_INVALID_CONSTANT';
        var ERROR_ENOTFOUND = 'ENOTFOUND';
        var TABLES_PROPERTIES = '/tableproperties/';
        var TABLE_COMPONENTS = 'tableComponents';
        var REQ_USER = 'reqUser';
        //add comment about this usage
        baseUrl = config === undefined ? '' : config.DOMAIN;
        confTicket = config === undefined ? '' : config.ticket;

        function resolveFullUrl(realmSubdomain, path) {
            log.info('Resolving full url for path: ' + path + ' realm: ' + realmSubdomain + ' for base url: ' + baseUrl);

            if (realmSubdomain === '') {
                realmSubdomain = ADMIN_REALM;
            }

            let url = baseUrl.replace('://', '://' + realmSubdomain + '.') + path;
            log.info('Full URL: ' + url);
            log.debug('resulting fullpath: ' + url);

            return url;
        }

        //Generates and returns a psuedo-random 32 char string that is URL safe
        function generateValidSubdomainString() {
            var text = '';
            for (var i = 0; i < 32; i++) {
                text += SUBDOMAIN_CHARS.charAt(Math.floor(Math.random() * SUBDOMAIN_CHARS.length));
            }
            return text;
        }

        //Generates and returns a psuedo-random char string of specified length
        function generateString(length) {
            var text = '';
            for (var i = 0; i < length; i++) {
                text += SUBDOMAIN_CHARS.charAt(Math.floor(Math.random() * SUBDOMAIN_CHARS.length));
            }
            return text;
        }

        //Generates and returns a psuedo-random email string
        function generateEmail() {
            return generateString(10) + '_' + generateString(10) + '@quickbase.com';
        }

        // generates a salt for use with private apis (these should only be used in testing)
        function generateSalt() {
            var prime_length = 128;
            var diffHell = crypto.createDiffieHellman(prime_length);
            return diffHell.generateKeys('base64');;
        }

        // hashes + encodes secret and salt for use with private apis (these should only be used in testing)
        function hashAndEncode(timestamp, salt, secret) {
            var saltedSecret = timestamp + salt + secret;

            var sha256 = crypto.createHash("sha256");
            sha256.update(saltedSecret);
            var result = sha256.digest("base64");
            return result;
        }

        // Return the current time since Epoch
        function getEpochTimeNow() {
            return Math.round(new Date().getTime() / 1000);
        }

        var apiBase = {
            setBaseUrl                  : function(baseUrlConfig) {
                log.info('Setting baseUrl on api.base: ' + baseUrlConfig);
                baseUrl = baseUrlConfig;
            },
            generateFullRequest         : function(subdomain, relativePath) {
                return resolveFullUrl(subdomain, relativePath);
            },
            resolveAppsEndpoint         : function(appId, ee) {
                var appsEndpoint = (ee === true ? EE_BASE_ENDPOINT : JAVA_BASE_ENDPOINT) + APPS_ENDPOINT;
                if (appId) {
                    appsEndpoint = appsEndpoint + appId;
                }
                return appsEndpoint;
            },
            resolveRecordsEndpoint      : function(appId, tableId, recordId) {
                var endpoint = QBUI_BASE_ENDPOINT + APPS_ENDPOINT + appId + TABLES_ENDPOINT + tableId + RECORDS_ENDPOINT;
                if (recordId) {
                    endpoint = endpoint + recordId;
                }
                return endpoint;
            },
            resolveRecordsBulkEndpoint      : function(appId, tableId) {
                return this.resolveAppsEndpoint(appId) + TABLES_ENDPOINT + tableId + RECORDS_BULK;
            },
            resolveRelationshipsEndpoint: function(appId, realmId) {
                var endpoint = this.resolveAppsEndpoint(appId) + RELATIONSHIPS_ENDPOINT;
                if (realmId) {
                    endpoint = endpoint + realmId;
                }
                return endpoint;
            },
            resolveFieldsEndpoint       : function(appId, tableId, fieldId) {
                var endpoint = this.resolveTablesEndpoint(appId, tableId) + FIELDS_ENDPOINT;
                if (fieldId) {
                    endpoint = endpoint + fieldId;
                }
                return endpoint;
            },
            resolveTablesEndpoint       : function(appId, tableId, qbuiRoute) {
                var tableEndpoint;
                if (qbuiRoute) {
                    tableEndpoint = QBUI_BASE_ENDPOINT + APPS_ENDPOINT + appId + TABLES_ENDPOINT;
                } else {
                    tableEndpoint = this.resolveAppsEndpoint(appId) + TABLES_ENDPOINT;
                }

                if (tableId) {
                    tableEndpoint = tableEndpoint + tableId;
                }
                return tableEndpoint;
            },
            resolveFormsEndpoint      : function(appId, tableId, formId, formType) {
                var formEndpoint = this.resolveAppsEndpoint(appId, true) + TABLES_ENDPOINT + tableId + FORMS_ENDPOINT;
                if (formId) {
                    formEndpoint = formEndpoint + formId;
                }
                if (formType) {
                    formEndpoint = formEndpoint + FORM_TYPE_ENDPOINT + formType;
                }
                return formEndpoint;
            },
            resolveReportsEndpoint      : function(appId, tableId, reportId, qbuiRoute) {
                var reportEndpoint;
                if (qbuiRoute) {
                    reportEndpoint = QBUI_BASE_ENDPOINT + APPS_ENDPOINT + appId + TABLES_ENDPOINT + tableId + REPORTS_ENDPOINT;
                } else {
                    reportEndpoint = this.resolveAppsEndpoint(appId) + TABLES_ENDPOINT + tableId + REPORTS_ENDPOINT;
                }

                if (reportId) {
                    reportEndpoint =  reportEndpoint + reportId;
                }
                return reportEndpoint;
            },
            resolveReportsResultsEndpoint      : function(appId, tableId, reportId) {
                return QBUI_BASE_ENDPOINT + APPS_ENDPOINT + appId + TABLES_ENDPOINT + tableId + REPORTS_ENDPOINT + reportId + REPORTS_RESULTS_ENDPOINT;
            },
            resolveRealmsEndpoint       : function(realmId) {
                var endpoint = JAVA_BASE_ENDPOINT + REALMS_ENDPOINT;
                if (realmId) {
                    endpoint = endpoint + realmId;
                }
                return endpoint;
            },
            resolveRealmsGetEndpoint       : function(realmName) {
                var endpoint = JAVA_BASE_ENDPOINT + REALMS_ENDPOINT;
                if (realmName) {
                    endpoint = endpoint + "?subdomain=" + realmName;
                }
                return endpoint;
            },
            resolveTicketEndpoint       : function() {
                return JAVA_BASE_ENDPOINT + ADMIN_TICKETS_ENDPOINT;
            },
            resolveUserTicketEndpoint       : function() {
                return JAVA_BASE_ENDPOINT + TICKETS_ENDPOINT;
            },
            resolveHealthEndpoint       : function() {
                return JAVA_BASE_ENDPOINT + HEALTH_ENDPOINT;
            },
            resolvePrivateUsersEndpoint        : function(userId) {
                var endpoint = JAVA_BASE_ENDPOINT + PRIVATE_USERS_ENDPOINT;
                if (userId) {
                    endpoint = endpoint + userId;
                }
                return endpoint;
            },
            resolveBulkUsersEndpoint        : function() {
                return JAVA_BASE_ENDPOINT + BULK_USERS_ENDPOINT;
            },
            resolveCreateAppRolesEndpoint        : function(appId, roleId) {
                var endpoint = JAVA_BASE_ENDPOINT + APPS_ENDPOINT + appId + ROLES_ENDPOINT;
                return endpoint;
            },
            resolveAppRolesEndpoint        : function(appId, roleId) {
                var endpoint = JAVA_BASE_ENDPOINT + APPS_ENDPOINT + appId + ROLES_ENDPOINT + roleId + USERS_ENDPOINT;
                return endpoint;
            },
            resolveAppRoleTableRightsEndpoint        : function(appId, roleId, tableId) {
                var endpoint = JAVA_BASE_ENDPOINT + APPS_ENDPOINT + appId + ROLES_ENDPOINT + roleId + TABLES_ENDPOINT + tableId + TABLES_RIGHTS;
                return endpoint;
            },
            resolveAppRoleFieldRightsEndpoint        : function(appId, roleId, tableId, fieldId) {
                var endpoint = JAVA_BASE_ENDPOINT + APPS_ENDPOINT + appId + ROLES_ENDPOINT + roleId + TABLES_ENDPOINT + tableId + '/field/' + fieldId + FIELD_RIGHTS;
                return endpoint;
            },
            resolveTablePropertiesEndpoint      : function(appId, tableId) {
                var endpoint = this.resolveAppsEndpoint(appId, true) + TABLES_ENDPOINT + tableId + TABLES_PROPERTIES;
                return endpoint;
            },
            resolveGetReqUserEndpoint       : function() {
                return QBUI_BASE_ENDPOINT + USERS_ENDPOINT + REQ_USER;
            },
            resolveTableComponentsEndpoint       : function(appId) {
                return QBUI_BASE_ENDPOINT + APPS_ENDPOINT + appId + TABLES_ENDPOINT + TABLE_COMPONENTS;
            },
            defaultHeaders              : DEFAULT_HEADERS,

            /**
             * Executes a REST request against the instance's realm using the configured javaHost
             * If an object is passed in as the first argument, it will be used to fill in the other argumnents (e.g., when
             * passing this function in a promise chain.
             * @param {string|object} optsOrStringPath The path or an object that contains information for request
             * @param {string} optsOrStringPath.stringPath
             * @param {string} optsOrStringPath.method The type of request
             * @param optsOrStringPath.body
             * @param optsOrStringPath.body
             * @param optsOrStringPath.headers
             * @param optsOrStringPath.params
             * @param {string} method The type of request (GET, POST, PATCH, etc.)
             * @param body
             * @param headers
             * @param params
             */
            executeRequest              : function(optsOrStringPath, method, body, headers, params, isEE) {
                var stringPath = optsOrStringPath;
                if (_.isObject(stringPath)) {
                    var temp = _.assign({}, stringPath);
                    stringPath = temp.stringPath;
                    method = temp.method;
                    body = temp.body;
                    headers = temp.headers;
                    params = temp.params;
                }

                let path = isEE ? stringPath.replace('/api/api/', '/ee/') : stringPath;
                return apiBase.executeRequestToPath(path, method, body, headers, params);
            },

            executeRequestToPath:function(path, method, body, headers, parameters) {
                let subdomain = '';
                if (this.realm) {
                    subdomain = this.realm.subdomain;
                }

                let requestOptions = {
                    url: resolveFullUrl(subdomain, path),
                    method: method,
                    headers: headers ? headers : DEFAULT_HEADERS
                };

                if (body) {
                    requestOptions.body = jsonBigNum.stringify(body);
                }

                // if we have a GET request and have params to add (since GET requests don't use JSON body values)
                // we have to add those to the end of the generated URL as ?param=value
                if (parameters) {
                    // remove the trailing slash and add the parameters
                    requestOptions.url = requestOptions.url.substring(0, requestOptions.url.length - 1) + parameters;
                }

                if (this.authTicket) {
                    requestOptions.headers[TICKET_HEADER_KEY] = this.authTicket;
                }

                log.debug('About to execute the request: ' + jsonBigNum.stringify(requestOptions));
                return apiBase.executeRequestRetryable(requestOptions, 3);
            },

            executeRequestRetryable: function(opts, numRetries) {
                var tries = numRetries;

                return new promise(function(resolve, reject) {
                    request(opts, function(error, response) {
                        if (error || !requestUtils.wasRequestSuccessful(response.statusCode)) {
                            // These specific errors were due to an environment issue in Jenkins that we needed to check for and retry
                            if (tries > 1 && error && (error.code === ERROR_HPE_INVALID_CONSTANT || error.code === ERROR_ENOTFOUND)) {
                                tries--;
                                log.debug('Attempting a retry: ' + JSON.stringify(opts) + ' Tries remaining: ' + tries);
                                apiBase.executeRequestRetryable(opts, tries).then(function(res2) {
                                    log.debug('Success following retry/retries');
                                    resolve(res2);
                                }).catch(function(err2) {
                                    log.debug('Failure after retries');
                                    reject(err2);
                                });
                            } else {
                                // We need to handle if we get an error back from the network call (for example a 'ECONNREFUSED 127.0.0.1:8081' error)
                                // Or if we get an API response back but with a non 200 status code
                                var errorMsg = error ? JSON.stringify(error) : '';
                                var responseMsg = response ? 'Response statusCode: ' + response.statusCode + ', body: ' + response.body : '';

                                // Nice logging for Node output
                                log.error('Network request failed, no retries left or an unsupported error for retry found ' + JSON.stringify(opts));
                                log.error(`Unknown failure mode. ${errorMsg} ${responseMsg}`);

                                // Return whatever kind of object we get back for the test frameworks to do validation with
                                if (error) {
                                    return reject(error);
                                } else {
                                    return reject(response);
                                }
                            }
                        } else {
                            resolve(response);
                        }
                    });
                });
            },

            //Creates a REST request Object against the instance's realm using the configured javaHost
            createRequestObject              : function(stringPath, method, body, headers, params) {
                //if there is a realm & we're not making a ticket request, use the realm subdomain request URL
                let subdomain = '';
                if (this.realm) {
                    subdomain = this.realm.subdomain;
                }
                let opts = {
                    url   : resolveFullUrl(subdomain, stringPath),
                    method: method
                };
                if (body) {
                    opts.body = jsonBigNum.stringify(body);
                }
                // if we have a GET request and have params to add (since GET requests don't use JSON body values)
                // we have to add those to the end of the generated URL as ?param=value
                if (params) {
                    // remove the trailing slash and add the parameters
                    opts.url = opts.url.substring(0, opts.url.length - 1) + params;
                }
                //Setup headers
                if (headers) {
                    opts.headers = headers;
                } else {
                    opts.headers = DEFAULT_HEADERS;
                }
                if (this.authTicket) {
                    opts.headers[TICKET_HEADER_KEY] = this.authTicket;
                }
                var reqInfo = opts.url;
                log.debug('About to execute the request: ' + jsonBigNum.stringify(opts));
                return opts;
            },

            //Create a realm for API tests to run against and generates a ticket
            initialize        : function() {
                var self = this;

                return new promise(function(resolve, reject) {
                    if (!self.realm) {
                        /*
                         * What follows are the steps needed to create a realm and a ticket for that realm such that
                         * subsequent requests can be made to that are realm without worrying about ticket creation
                         * or realm subdomain resolution.  The steps:
                         *  1) create an admin ticket
                         *  2) use the admin ticket to create a realm
                         *  3) create a ticket valid on the realm in question
                         *  4) If any step above fails, assert!
                         */
                        return self.createTicket(ADMIN_REALM_ID).then(function(authResponse) {
                            //TODO: tickets come back quoted, invalid JSON, we regex the quotes away.  hack.
                            self.authTicket = authResponse.body.replace(/"/g, '');
                            var realmPromise;
                            if (config && config.realmToUse) {
                                realmPromise = self.getRealm(config.realmToUse);
                            } else {
                                realmPromise = self.createRealm();
                            }
                            return realmPromise.then(function(realmResponse) {
                                self.realm = JSON.parse(realmResponse.body);
                                return self.createTicket(self.realm.id).then(function(realmTicketResponse) {
                                    self.authTicket = realmTicketResponse.body.replace(/"/g, '');
                                    resolve(self.realm);
                                }).catch(function(realmTicketError) {
                                    return reject(realmTicketError);
                                });
                            }).catch(function(realmError) {
                                return reject(realmError);
                            });
                        }).catch(function(authError) {
                            //If auth request fails, delete the realm & fail the tests
                            return self.cleanup().then(function() {
                                return reject(authError);
                            });
                        });
                    } else {
                        //The realm already exists, no-op
                        log.info('Realm already exists: ' + self.realm);
                        resolve(self.realm);
                    }
                });
            },
            //Create realm helper method generates an arbitrary realm, calls execute request and returns a promise
            createRealm       : function() {
                var realmToMake = {
                    id       : Math.floor(Math.random() * 100000000 - 0),
                    subdomain: generateValidSubdomainString(),
                    name     : generateValidSubdomainString()
                };
                return this.executeRequest(this.resolveRealmsEndpoint(), consts.POST, realmToMake, DEFAULT_HEADERS);
            },
            //get realm calls execute request and returns a promise
            getRealm       : function(realmToUse) {
                return this.executeRequest(this.resolveRealmsGetEndpoint(realmToUse), consts.GET, null, DEFAULT_HEADERS);
            },
            //Create user helper method generates an specific user, calls execute request and returns a promise
            createSpecificUser: function(userToMake) {
                return this.executeRequest(this.resolvePrivateUsersEndpoint(), consts.POST, userToMake, PRIVATE_API_HEADERS);
            },
            //Create user helper method generates an arbitrary user, calls execute request and returns a promise
            createUser        : function() {
                var userToMake = {
                    firstName        : generateString(10),
                    lastName         : generateString(10),
                    screenName       : generateString(10),
                    email            : generateEmail(),
                    deactivated      : false,
                    administrator    : false
                };
                return this.createSpecificUser(userToMake);
            },
            //Create bulk of users, calls execute request and returns a promise
            createBulkUser : function(userList) {
                return this.executeRequest(this.resolveBulkUsersEndpoint(), consts.PUT, userList, DEFAULT_HEADERS);
            },
            //Create authentication for a specific user , calls execute request and returns a promise
            createUserAuthentication     : function(userId) {
                var self = this;
                return new promise(function(resolve, reject) {
                    self.executeRequest(self.resolveUserTicketEndpoint() + '?uid=' + userId + '&realmId=' + self.realm.id, consts.GET).then(function(ticketResponse) {
                        var userTicketId = JSON.parse(ticketResponse.body);
                        self.authTicket = ticketResponse.body.replace(/"/g, '');
                        resolve(self.authTicket);
                    }).catch(function(error) {
                        reject(error);
                        assert(false, 'failed to get authentication : ' + JSON.stringify(error) + ',for user: ' + JSON.stringify(userId));
                    });
                });
            },
            //Assign User to AppRole helper method , calls execute request and returns a promise
            assignUsersToAppRole       : function(appId, roleId, userIds) {
                var self = this;
                return new promise(function(resolve, reject) {
                    self.executeRequest(self.resolveAppRolesEndpoint(appId, roleId), consts.POST, userIds).then(function(appRoleResponse) {
                        log.debug('assign Users to App Role create response: ' + appRoleResponse);
                        resolve(appRoleResponse);
                    }).catch(function(error) {
                        reject(error);
                        assert(false, 'failed to assign Users to App Role: ' + JSON.stringify(error) + ', usersToCreate: ' + JSON.stringify(userIds));
                    });
                });
            },
            //Update Default table home page , calls execute request and returns a promise
            setDefaultTableHomePage       : function(appId, tableId, reportId) {
                var self = this;
                return new promise(function(resolve, reject) {
                    self.executeRequest(self.resolveTablesEndpoint(appId, tableId) + '/defaulthomepage?reportId=' + reportId, consts.POST).then(function(defaultHPResponse) {
                        log.debug('set default table home page response: ' + defaultHPResponse);
                        resolve(defaultHPResponse);
                    }).catch(function(error) {
                        reject(error);
                        assert(false, 'failed to set default table home page : ' + JSON.stringify(error) + ', report id: ' + JSON.stringify(reportId));
                    });
                });
            },
            //Create Default table home page for a role, calls execute request and returns a promise
            setCustDefaultTableHomePageForRole       : function(appId, tableId, roleReportMap) {
                var self = this;
                return new promise(function(resolve, reject) {
                    self.executeRequest(self.resolveTablesEndpoint(appId, tableId) + '/custhomepage', consts.POST, roleReportMap, DEFAULT_HEADERS).then(function(defaultHPResponse) {
                        log.debug('set default table home page for role response: ' + defaultHPResponse);
                        resolve(defaultHPResponse);
                    }).catch(function(error) {
                        reject(error);
                        assert(false, 'failed to set default table home page with report for role: ' + JSON.stringify(error) + ', report role map is: ' + JSON.stringify(roleReportMap));
                    });
                });
            },
            //Helper method creates a ticket given a realm ID.  Returns a promise
            createTicket      : function(realmId) {
                if (confTicket) {
                    return promise.resolve({body:confTicket});
                } else {
                    return this.executeRequest(this.resolveTicketEndpoint() + realmId, consts.GET, '', DEFAULT_HEADERS);
                }
            },
            //Deletes a realm, if one is set on the instance, returns a promise
            cleanup           : function() {
                //delete the realm  if not null
                var self = this;
                var deferred = promise.pending();
                // remove created realm if it was not an existing specified realmToUse in the config
                if (self.realm  && (!config || !config.realmToUse)) {
                    self.executeRequest(self.resolveRealmsEndpoint(self.realm.id),
                        consts.DELETE, '', DEFAULT_HEADERS)
                        .then(function(response) {
                            deferred.resolve(response);
                            self.realm = null;
                        }).catch(function(error) {
                            var realm = self.realm;
                            self.realm = null;
                            assert(false, 'Unable to delete realm ' +
                            JSON.stringify(realm) + ' due to: ' +
                            JSON.stringify(error));
                            deferred.reject(error);
                        });
                } else {
                    deferred.resolve();
                }
                return deferred.promise;
            }
        };

        // Need to bind some functions before exporting so that the context of `this` is consistent when used inside of other promises
        apiBase.executeRequest = apiBase.executeRequest.bind(apiBase);
        apiBase.executeRequestRetryable = apiBase.executeRequestRetryable.bind(apiBase);
        return apiBase;
    };

    function transformResponseBodyToJsonObject(response) {
        var transformedResponse = _.assign({}, response);
        try {
            transformedResponse.body = jsonBigNum.parse(response.body);
            if (_.isArray(transformedResponse.body)) {
                transformedResponse.body = transformedResponse.body[0];
            }

            if (_.has(transformedResponse.body, 'body')) {
                transformedResponse.body = jsonBigNum.parse(transformedResponse.body.body)[0];
            }
        } catch (err) {
            log.debug('Could not transform response body to JSON. ' + err);
        }

        return transformedResponse;
    }
}());
