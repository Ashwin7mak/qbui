(function () {
    'use strict';
    var request = require('request');
    var promise = require('bluebird');
    var assert = require('assert');
    var consts = require('../constants');

    module.exports = function (config) {
        //Module constants
        var HTTP = 'http://';
        var BASE_ENDPOINT = '/api/v1';
        var APPS_ENDPOINT = '/apps/';
        var TABLES_ENDPOINT = '/tables/';
        var RECORDS_ENDPOINT = '/records/';
        var REALMS_ENDPOINT = '/realms/';
        var LOCALHOST_REALM = 117000;
        var TICKETS_ENDPOINT = '/ticket?uid=1000000&realmID=';
        var SUBDOMAIN_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789';
        var CONTENT_TYPE = 'Content-Type';
        var APPLICATION_JSON = 'application/json';
        var TICKET_HEADER_KEY = 'ticket';
        var DEFAULT_HEADERS = {};
        DEFAULT_HEADERS[CONTENT_TYPE] = APPLICATION_JSON;

        //Resolves a full URL using the instance subdomain and the configured javaHost
        function resolveFullUrl(path, realmSubdomain) {
            var fullPath;
            //If there is no subdomain, hit the javaHost directly and don't proxy through the node server
            //This is required for actions like ticket creation and realm creation
            if (realmSubdomain === '') {
                fullPath = config.javaHost + path;
            } else {
                var methodLess = config.DOMAIN.replace(HTTP, '');
                //If we're dealing with a delete realm, use the javaHost and not the node server, which doesn't
                //proxy realm requests to the javahost for security reasons
                if(path.indexOf(REALMS_ENDPOINT) !== -1) {
                    methodLess = config.javaHost.replace(HTTP, '');
                }
                fullPath = HTTP + realmSubdomain + '.' + methodLess + path;
            }
            return fullPath;
        }

        //Private helper method to generate a request options object
        function generateRequestOpts(stringPath, method, realmSubdomain) {
            return {
                url: resolveFullUrl(stringPath, realmSubdomain),
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

        var apiBase = {
            resolveAppsEndpoint: function (appId) {
                var appsEndpoint = BASE_ENDPOINT + APPS_ENDPOINT;
                if (appId) {
                    appsEndpoint = appsEndpoint + appId;
                }
                return appsEndpoint;
            },
            resolveRecordsEndpoint: function (appId, tableId, recordId) {
                var endpoint = this.resolveTablesEndpoint(appId, tableId) + RECORDS_ENDPOINT;
                if (recordId) {
                    endpoint = endpoint + recordId;
                }
                return endpoint;
            },
            resolveTablesEndpoint: function (appId, tableId) {
                var tableEndpoint = this.resolveAppsEndpoint(appId) + TABLES_ENDPOINT;
                if (tableId) {
                    tableEndpoint = tableEndpoint + tableId;
                }
                return tableEndpoint;
            },
            resolveRealmsEndpoint: function (realmId) {
                var endpoint = BASE_ENDPOINT + REALMS_ENDPOINT;
                if (realmId) {
                    endpoint = endpoint + realmId;
                }
                return endpoint;
            },
            resolveTicketEndpoint: function () {
                return BASE_ENDPOINT + TICKETS_ENDPOINT;
            },
            defaultHeaders: DEFAULT_HEADERS,
            //Executes a REST request against the instance's realm using the configured javaHost
            executeRequest: function (stringPath, method, body, headers) {
                //if there is a realm & we're not making a ticket request, use the realm subdomain request URL
                var subdomain = '';
                if (this.realm && stringPath.indexOf(TICKETS_ENDPOINT) === -1) {
                    subdomain = this.realm.subdomain;
                }
                var opts = generateRequestOpts(stringPath, method, subdomain);
                if (body) {
                    opts.body = JSON.stringify(body);
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
                // TODO: Add back in for debugging purposes
                //console.log('About to execute the request: ' + JSON.stringify(opts));
                //Make request and return promise
                var deferred = promise.pending();
                request(opts, function (error, response) {
                    if (error) {
                        deferred.reject(new Error(error));
                    } else if (response.statusCode != 200) {
                        deferred.reject(response);
                    } else {
                        deferred.resolve(response);
                    }
                });
                return deferred.promise;
            },
            //Create a realm for API tests to run against and generates a ticket
            initialize: function () {
                var context = this;
                var deferred = promise.pending();
                if (!context.realm) {
                    /*
                     * What follows are the steps needed to create a realm and a ticket for that realm such that
                     * subsequent requests can be made that are realm specific without worrying about ticket creation
                     * or realm subdomain resolution.  The steps:
                     *  1) create an admin ticket
                     *  2) use the admin ticket to create a realm
                     *  3) create a ticket valid on the realm in question
                     *  4) If any step above fails, assert!
                    */
                    context.createTicket(LOCALHOST_REALM)
                        .then(function (authResponse) {
                            //TODO: tickets come back quoted, invalid JSON, we regex the quotes away.  hack.
                            context.authTicket = authResponse.body.replace(/"/g, '');
                            context.createRealm()
                                .then(function (realmResponse) {
                                    context.realm = JSON.parse(realmResponse.body);
                                    context.createTicket(context.realm.id)
                                        .then(function(realmTicketResponse){
                                            context.authTicket = realmTicketResponse.body.replace(/"/g, '');
                                            deferred.resolve(context.realm);
                                        }).catch(function(realmTicketError){
                                            deferred.reject(realmTicketError);
                                            assert(false, 'failed to create ticket for realm: ' + context.realm.id);
                                        });
                                }).catch(function (realmError) {
                                    deferred.reject(realmError);
                                    assert(false, 'failed to create realm: ' + JSON.stringify(realmError));
                                });
                        }).catch(function (authError) {
                            //If auth request fails, delete the realm & fail the tests
                            context.cleanup();
                            deferred.reject(authError);
                            assert(false, 'failed to resolve ticket: ' + JSON.stringify(authError));
                        });
                } else {
                    //The realm already exists, no-op
                    deferred.resolve(context.realm);
                }
                return deferred.promise;

            },
            //Create realm helper method generates an arbitrary realm, calls execute request and returns a promise
            createRealm: function () {
                var realmToMake = {
                    "id": Math.floor(Math.random() * 100000000 - 0),
                    "subdomain": generateValidSubdomainString(),
                    "name": generateValidSubdomainString()
                };
                return this.executeRequest(this.resolveRealmsEndpoint(), consts.POST, realmToMake, DEFAULT_HEADERS);
            },
            //Helper method creates a ticket given a realm ID.  Returns a promise
            createTicket: function (realmId) {
                return this.executeRequest(this.resolveTicketEndpoint() + realmId, consts.GET, '', DEFAULT_HEADERS);
            },
            //Deletes a realm, if one is set on the instance, returns a promise
            cleanup: function () {
                //delete the realm  if not null
                var context = this;
                var deferred = promise.pending();
                if (context.realm) {
                    context.executeRequest(context.resolveRealmsEndpoint(context.realm.id),
                        consts.DELETE, '', DEFAULT_HEADERS)
                        .then(function (response) {
                            deferred.resolve(response);
                            context.realm = null;
                        }).catch(function (error) {
                            var r = context.realm;
                            context.realm = null;
                            assert(false, 'Unable to delete realm '
                            + JSON.stringify(r) + ' due to: '
                            + JSON.stringify(error));
                            deferred.reject(error);
                        });
                } else {
                    deferred.resolve();
                }
                return deferred.promise;
            }
        };

        return apiBase;
    }
}());