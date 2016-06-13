(function() {
    'use strict';
    var request = require('request');
    var promise = require('bluebird');
    var assert = require('assert');
    var consts = require('../constants');
    var log = require('../../logger').getLogger();
    //This is the url that will be used for making requests to the node server or the java server
    var baseUrl;

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
        var HTTPS_REGEX = /https:\/\/.*/;

        var HTTP = 'http://';
        var HTTPS = 'https://';
        var NODE_BASE_ENDPOINT = '/api/api/v1';
        var JAVA_BASE_ENDPOINT = '/api/api/v1';
        var APPS_ENDPOINT = '/apps/';
        var RELATIONSHIPS_ENDPOINT = '/relationships/';
        var TABLES_ENDPOINT = '/tables/';
        var FIELDS_ENDPOINT = '/fields/';
        var REPORTS_ENDPOINT = '/reports/';
        var RECORDS_ENDPOINT = '/records/';
        var REALMS_ENDPOINT = '/realms/';
        var USERS_ENDPOINT = '/users/';
        var ROLES_ENDPOINT = '/roles/';
        var ADMIN_REALM = 'localhost';
        var ADMIN_REALM_ID = 117000;
        var TICKETS_ENDPOINT = '/ticket?uid=10000&realmId=';
        var HEALTH_ENDPOINT = '/health';
        var SUBDOMAIN_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789';
        var CONTENT_TYPE = 'Content-Type';
        var APPLICATION_JSON = 'application/json';
        var TICKET_HEADER_KEY = 'ticket';
        var DEFAULT_HEADERS = {};
        DEFAULT_HEADERS[CONTENT_TYPE] = APPLICATION_JSON;
        var ERROR_HPE_INVALID_CONSTANT = 'HPE_INVALID_CONSTANT';
        var ERROR_ENOTFOUND = 'ENOTFOUND';
        //add comment about this usage
        baseUrl = config === undefined ? '' : config.DOMAIN;

        //Resolves a full URL using the instance subdomain and the configured javaHost
        function resolveFullUrl(realmSubdomain, path) {
            var fullPath;
            var protocol = HTTP;
            log.info('Resolving full url for path: ' + path + ' realm: ' + realmSubdomain);

            var methodLess;
            if (HTTPS_REGEX.test(baseUrl)) {
                protocol = HTTPS;
                methodLess = baseUrl.replace(HTTPS, '');
            } else {
                methodLess = baseUrl.replace(HTTP, '');
            }

            log.debug('baseUrl: ' + baseUrl + ' methodLess: ' + methodLess);
            //If there is no subdomain, hit the javaHost directly and don't proxy through the node server
            //This is required for actions like ticket creation and realm creation
            //Both of these requests must now hit localhost.<javaHostUrl> to create the admin ticket and new realm
            if (realmSubdomain === '') {
                fullPath = protocol + ADMIN_REALM + '.' + methodLess + path;
                log.debug('resulting fullpath: ' + fullPath);
            } else {
                fullPath = protocol + realmSubdomain + '.' + methodLess + path;
                log.debug('resulting fullpath: ' + fullPath);
            }

            return fullPath;
        }

        //Private helper method to generate a request options object
        function generateRequestOpts(stringPath, method, realmSubdomain) {
            return {
                url   : resolveFullUrl(realmSubdomain, stringPath),
                method: method
            };
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
            return generateString(10) + '_' + generateString(10) + '@intuit.com';
        }

        var apiBase = {
            setBaseUrl                  : function(baseUrlConfig) {
                log.info('Setting baseUrl on api.base: ' + baseUrlConfig);
                baseUrl = baseUrlConfig;
            },
            generateFullRequest         : function(subdomain, relativePath) {
                return resolveFullUrl(subdomain, relativePath);
            },
            resolveAppsEndpoint         : function(appId) {
                var appsEndpoint = JAVA_BASE_ENDPOINT + APPS_ENDPOINT;
                if (appId) {
                    appsEndpoint = appsEndpoint + appId;
                }
                return appsEndpoint;
            },
            resolveRecordsEndpoint      : function(appId, tableId, recordId) {
                var endpoint = NODE_BASE_ENDPOINT + APPS_ENDPOINT + appId + TABLES_ENDPOINT + tableId + RECORDS_ENDPOINT;
                if (recordId) {
                    endpoint = endpoint + recordId;
                }
                return endpoint;
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
            resolveTablesEndpoint       : function(appId, tableId) {
                var tableEndpoint = this.resolveAppsEndpoint(appId) + TABLES_ENDPOINT;
                if (tableId) {
                    tableEndpoint = tableEndpoint + tableId;
                }
                return tableEndpoint;
            },
            resolveReportsEndpoint      : function(appId, tableId, reportId) {
                var reportEndpoint = NODE_BASE_ENDPOINT + APPS_ENDPOINT + appId + TABLES_ENDPOINT + tableId + REPORTS_ENDPOINT;
                if (reportId) {
                    reportEndpoint = reportEndpoint + reportId;
                }
                return reportEndpoint;
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
                return JAVA_BASE_ENDPOINT + TICKETS_ENDPOINT;
            },
            resolveHealthEndpoint       : function() {
                return JAVA_BASE_ENDPOINT + HEALTH_ENDPOINT;
            },
            resolveUsersEndpoint        : function(userId) {
                var endpoint = JAVA_BASE_ENDPOINT + USERS_ENDPOINT;
                if (userId) {
                    endpoint = endpoint + userId;
                }
                return endpoint;
            },
            resolveAppRolesEndpoint        : function(appId, roleId) {
                var endpoint = JAVA_BASE_ENDPOINT + APPS_ENDPOINT + appId + ROLES_ENDPOINT + roleId + USERS_ENDPOINT;
                //if (roleId) {
                //    endpoint = endpoint + roleId;
                //}
                return endpoint;
            },
            defaultHeaders              : DEFAULT_HEADERS,
            //Executes a REST request against the instance's realm using the configured javaHost
            executeRequest              : function(stringPath, method, body, headers, params) {
                //if there is a realm & we're not making a ticket request, use the realm subdomain request URL
                var subdomain = '';
                if (this.realm) {
                    subdomain = this.realm.subdomain;
                }
                var opts = generateRequestOpts(stringPath, method, subdomain);
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
                //Make request and return promise
                var deferred = promise.pending();
                apiBase.executeRequestRetryable(opts, 3).then(function(resp) {
                    log.debug('Response for reqInfo ' + reqInfo + ' got success response' + resp);
                    deferred.resolve(resp);
                }).catch(function(error) {
                    log.debug('Response ERROR! for reqInfo ' + reqInfo + ' got error response' + error);
                    deferred.reject(error);
                });
                return deferred.promise;
            },

            executeRequestRetryable: function(opts, numRetries) {
                var deferred = promise.pending();
                var tries = numRetries;
                request(opts, function(error, response) {
                    if (error || response.statusCode !== 200) {
                        if (tries > 1 && error && (error.code === ERROR_HPE_INVALID_CONSTANT || error.code === ERROR_ENOTFOUND)) {
                            tries--;
                            log.debug('Attempting a retry: ' + JSON.stringify(opts) + ' Tries remaining: ' + tries);
                            apiBase.executeRequestRetryable(opts, tries).then(function(res2) {
                                log.debug('Success following retry/retries');
                                deferred.resolve(res2);
                            }).catch(function(err2) {
                                log.debug('Failure after retries');
                                deferred.reject(err2);
                            });
                        } else {
                            log.error('Network request failed, no retries left or an unsupported error for retry found');
                            log.info('Unknown failure mode. Error: ' + JSON.stringify(error) + ' response: ' + JSON.stringify(response));
                            deferred.reject(error);
                        }
                    } else {
                        deferred.resolve(response);
                    }
                });
                return deferred.promise;
            },

            //Create a realm for API tests to run against and generates a ticket
            initialize        : function() {
                var self = this;
                var deferred = promise.pending();
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
                    self.createTicket(ADMIN_REALM_ID)
                            .then(function(authResponse) {
                                      //TODO: tickets come back quoted, invalid JSON, we regex the quotes away.  hack.
                                self.authTicket = authResponse.body.replace(/"/g, '');
                                var realmPromise;
                                if (config && config.realmToUse) {
                                    realmPromise = self.getRealm(config.realmToUse);
                                } else {
                                    realmPromise = self.createRealm();
                                }
                                realmPromise.then(function(realmResponse) {
                                    self.realm = JSON.parse(realmResponse.body);
                                    self.createTicket(self.realm.id)
                                                    .then(function(realmTicketResponse) {
                                                        self.authTicket = realmTicketResponse.body.replace(/"/g, '');
                                                        deferred.resolve(self.realm);
                                                    }).catch(function(realmTicketError) {
                                                        deferred.reject(realmTicketError);
                                                        assert(false, 'failed to create ticket for realm: ' + self.realm.id);
                                                    });
                                }).catch(function(realmError) {
                                    deferred.reject(realmError);
                                    assert(false, 'failed to create realm: ' + JSON.stringify(realmError));
                                });
                            }).catch(function(authError) {
                                               //If auth request fails, delete the realm & fail the tests
                                self.cleanup();
                                deferred.reject(authError);
                                assert(false, 'failed to resolve ticket: ' + JSON.stringify(authError));
                            });
                } else {
                    //The realm already exists, no-op
                    deferred.resolve(self.realm);
                }
                return deferred.promise;

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
                return this.executeRequest(this.resolveUsersEndpoint(), consts.POST, userToMake, DEFAULT_HEADERS);
            },
            //Create user helper method generates an arbitrary user, calls execute request and returns a promise
            createUser        : function() {
                var userToMake = {
                    firstName        : generateString(10),
                    lastName         : generateString(10),
                    screenName       : generateString(10),
                    email            : generateEmail(),
                    password         : 'quickbase',
                    challengeQuestion: 'who is your favorite scrum team?',
                    challengeAnswer  : 'blue'
                };
                return this.createSpecificUser(userToMake);
            },
            //Create realm helper method generates an arbitrary realm, calls execute request and returns a promise
            assignUsersToAppRole       : function(appId, roleId, userIds) {
                var deferred = promise.pending();
                this.executeRequest(this.resolveAppRolesEndpoint(appId, roleId), consts.POST, userIds).then(function(appRoleResponse) {
                    log.debug('assign Users to App Role create response: ' + appRoleResponse);
                    deferred.resolve(appRoleResponse);
                }).catch(function(error) {
                    deferred.reject(error);
                    //TODO: figure out how we want to handle
                    assert(false, 'failed to assign Users to App Role: ' + JSON.stringify(error) + ', usersToCreate: ' + JSON.stringify(userIds));
                });
                return deferred.promise;
            },
            //Helper method creates a ticket given a realm ID.  Returns a promise
            createTicket      : function(realmId) {
                return this.executeRequest(this.resolveTicketEndpoint() + realmId, consts.GET, '', DEFAULT_HEADERS);
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

        return apiBase;
    };
}());
