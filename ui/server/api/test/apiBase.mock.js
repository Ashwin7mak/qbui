(function () {
    'use strict';
    var request = require('request');
    var Promise = require('bluebird');
    var assert = require('assert');

    module.exports = function (config) {
        //Module constants
        var HTTPS = 'http://';
        var BASE_ENDPOINT = '/api/v1';
        var REALMS_ENDPOINT = BASE_ENDPOINT + '/realms/';
        var TICKET_ENDPOINT = BASE_ENDPOINT + '/ticket?uid=1000000&realmID=';
        var POST = 'POST';
        var GET = 'GET';
        var DELETE = 'DELETE';
        var SUBDOMAIN_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var CONTENT_TYPE = 'Content-Type';
        var APPLICATION_JSON = 'application/json';
        var TICKET_HEADER_KEY = 'ticket';
        var DEFAULT_HEADERS = {};
        DEFAULT_HEADERS[CONTENT_TYPE] = APPLICATION_JSON;

        //Resolves a full URL using the instance subdomain and the configured javaHost
        function resolveFullUrl(path, realmSubdomain) {
            var fullPath;
            if(realmSubdomain === '') {
                fullPath = config.javaHost + path;
            } else {
                var methodLess = config.javaHost.replace(HTTPS, '');
                fullPath = HTTPS + realmSubdomain + '.' + methodLess + path;
            }
            return fullPath;
        }

        //Private helper method to generate a request options object
        function generateRequstOpts(stringPath, method, realmSubdomain) {
            return {
                url: resolveFullUrl(stringPath, realmSubdomain),
                method: method
            };
        }

        //Generates and returns a psuedo-random 32 char string that is URL safe
        function generateRandomString() {
            var text = '';
            for( var i=0; i < 32; i++ ) {
                text += SUBDOMAIN_CHARS.charAt(Math.floor(Math.random() * SUBDOMAIN_CHARS.length));
            }
            return text;
        }

        var apiBase = {
            //Executes a REST request against the instance's realm using the configured javaHost
            executeRequest: function(stringPath, method, body, headers) {
                //if there is a realm & we're not making a ticket or realm request, use the realm subdomain request URL
                var subdomain = '';
                if(this.realm
                    && stringPath.indexOf(TICKET_ENDPOINT) === -1
                    && stringPath.indexOf(REALMS_ENDPOINT) === -1) {
                    subdomain = this.realm.subdomain;
                }
                var opts = generateRequstOpts(stringPath, method, subdomain);
                if(body) {
                    opts.body = JSON.stringify(body);
                }

                //Setup headers
                if(headers) {
                    opts.headers = headers;
                } else {
                    opts.headers = {};
                }
                if(this.authTicket) {
                    opts.headers[TICKET_HEADER_KEY] = this.authTicket;
                }

                //Make request and return promise
                var deferred = Promise.pending();
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
            initialize: function() {
                var context = this;
                var deferred = Promise.pending();
                if(!context.realm) {
                    //Create a realm to use for API tests
                    this.createRealm()
                        .then(function(realmResponse) {
                            context.realm = JSON.parse(realmResponse.body);
                            console.log('Realm created: ' + realmResponse.body);
                            //Realm creation succeeded, now create a ticket
                            context.createTicket(context.realm.id)
                                .then(function(authResponse){
                                    context.authTicket = authResponse.body;
                                    deferred.resolve(context.realm);
                                    console.log('Ticket created: ' + context.authTicket);
                                }).catch(function(authError){
                                    //If auth request fails, delete the realm & fail the tests
                                    context.cleanup();
                                    deferred.reject(authError);
                                    assert(false, 'failed to resolve ticket: ' + JSON.stringify(authError));
                                });
                        }).catch(function(realmError){
                            deferred.reject(realmError);
                        });
                } else {
                    //The realm already exists, no-op
                    deferred.resolve(context.realm);
                }
                return deferred.promise;

            },

            //Create realm helper method generates an arbitrary realm, calls execute request and returns a promise
            createRealm: function() {
                var realmToMake = {
                    "id": Math.floor(Math.random() * 100000000 - 0),
                    "subdomain": generateRandomString(),
                    "name": generateRandomString()
                };
                return this.executeRequest(REALMS_ENDPOINT, POST, realmToMake, DEFAULT_HEADERS);
            },

            //Helper method creates a ticket given a realm ID.  Returns a promise
            createTicket: function(realmId) {
                return this.executeRequest(TICKET_ENDPOINT + realmId, GET, '', DEFAULT_HEADERS);
            },

            //Deletes a realm, if one is set on the instance, returns a promise
            cleanup: function() {
                //delete the realm  if not null
                var context = this;
                var deferred = Promise.pending();
                if(context.realm) {
                    context.executeRequest(REALMS_ENDPOINT + context.realm.id, DELETE, '', DEFAULT_HEADERS)
                        .then(function (response) {
                            deferred.resolve(response);
                            context.realm = null;
                        }).catch(function (error) {
                            context.realm = null;
                            assert(false, 'Unable to delete realm due to: ' + JSON.stringify(error));
                            deferred.reject(error);
                        });
                } else {
                    deferred.resolve();
                }
                return deferred;
            }
        }

        return apiBase;
    }
}());