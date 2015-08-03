(function () {
    'use strict';
    var promise = require('bluebird');
    var assert = require('assert');
    var consts = require('../constants');
    var log = require('../../logger').getLogger();

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

    module.exports = function (config) {
        var apiBase = require('./api.base.js')(config);
        var init = apiBase.initialize();

        var recordBase = {
            apiBase: apiBase,
            //Helper method to create an app, can be used by multiple test cases
            createApp: function (appToCreate) {
                var deferred = promise.pending();
                init.then(function () {
                    apiBase.executeRequest(apiBase.resolveAppsEndpoint(), consts.POST, appToCreate).then(function (appResponse) {
                        log.debug('App create response: ' + appResponse);
                        deferred.resolve(appResponse);
                    }).catch(function (error) {
                        deferred.reject(error);
                        //TODO: figure out how we want to handle
                        assert(false, 'failed to create app: ' + JSON.stringify(error) + ', appToCreate: ' + JSON.stringify(appToCreate));
                    });
                });
                return deferred.promise;
            },
            //Helper method to create a relationship between two tables in an app
            createRelationship: function(relationshipToCreate) {
                var deferred = promise.pending();
                init.then(function () {
                    apiBase.executeRequest(apiBase.resolveRelationshipsEndpoint(relationshipToCreate.appId), consts.POST, relationshipToCreate).
                        then(function (relResponse) {
                        deferred.resolve(relResponse);
                    }).catch(function (error) {
                        deferred.reject(error);
                        assert(false, 'failed to create app: ' + JSON.stringify(error));
                    });
                });
                return deferred.promise;
            },

            createField: function(appId, tableId, fieldToCreate) {
                var deferred = promise.pending();
                init.then(function () {
                    apiBase.executeRequest(apiBase.resolveFieldsEndpoint(appId, tableId), consts.POST, fieldToCreate).
                        then(function (relResponse) {
                            deferred.resolve(relResponse);
                        }).catch(function (error) {
                            deferred.reject(error);
                            assert(false, 'failed to create field: ' + JSON.stringify(error));
                        });
                });
                return deferred.promise;
            },

            fetchRecord: function(appId, tableId, recordId, params) {
                var deferred = promise.pending();
                var endpoint = apiBase.resolveRecordsEndpoint(appId, tableId, recordId);
                if(params) {
                    endpoint += params;
                }
                init.then(function(){
                    apiBase.executeRequest(endpoint, consts.GET).
                        then(function(recResp){
                            deferred.resolve(recResp);
                        }).
                        catch(function(error){
                            deferred.reject(error);
                            assert(false, 'failed to resolve record');
                        });
                });
                return deferred.promise;
            },

            // Creates and fetches a record, returning a promise that is resolved or rejected on successful
            // record GET following the create
            createAndFetchRecord: function (recordsEndpoint, record, params) {
                var fetchRecordDeferred = promise.pending();
                init.then(function () {
                    apiBase.executeRequest(recordsEndpoint, consts.POST, record)
                        .then(function (recordIdResponse) {
                            var getEndpoint = recordsEndpoint + JSON.parse(recordIdResponse.body).id;
                            if (params) {
                                getEndpoint += params;
                            }
                            apiBase.executeRequest(getEndpoint, consts.GET)
                                .then(function (fetchedRecordResponse) {
                                    var fetchedRecord = jsonBigNum.parse(fetchedRecordResponse.body);
                                    fetchRecordDeferred.resolve(fetchedRecord);
                                }).catch(function (error) {
                                    fetchRecordDeferred.reject(error);
                                });
                        }).catch(function(currError){log.error(JSON.stringify(currError));});
                }).catch(function(err){log.error(JSON.stringify(err));});
                return fetchRecordDeferred.promise;
            },

            // Creates a list of records using the bulk record endpoint, returning a promise that is resolved or rejected on successful
            createRecords: function (recordsEndpoint, records) {
                log.debug('Records to create: ' + JSON.stringify(records));
                var fetchRecordDeferred = promise.pending();
                init.then(function () {
                    var recordBulkEndpoint = recordsEndpoint + 'bulk';

                    //Get the actual record JSON out of the records
                    var recordObjects = [];
                    records.forEach(function(object){
                        recordObjects.push(object.record);
                    });

                    apiBase.executeRequest(recordBulkEndpoint, consts.POST, recordObjects)
                        .then(function (recordBulkResponse) {
                            var parsedRecordIdList = JSON.parse(recordBulkResponse.body);

                            var recordIdList = [];
                            parsedRecordIdList.forEach(function (jsonObj){
                                recordIdList.push(jsonObj.id);
                            });

                            fetchRecordDeferred.resolve(recordIdList);
                        }).catch(function(currError){log.error(JSON.stringify(currError));});
                }).catch(function(err){log.error(JSON.stringify(err));});
                return fetchRecordDeferred.promise;
            },

            // Gets a record given their record ID, returning a promise that is resolved or rejected on successful
            getRecord: function (recordsEndpoint, recordId, params) {
                var fetchRecordDeferred = promise.pending();
                log.debug('Attempting record GET: ' + recordsEndpoint + ' recordId: ' + recordId);
                init.then(function () {
                    var getEndpoint = recordsEndpoint + recordId;
                    if (params) {
                        getEndpoint += params;
                    }
                    apiBase.executeRequest(getEndpoint, consts.GET)
                        .then(function (fetchedRecordResponse) {
                            var fetchedRecord = jsonBigNum.parse(fetchedRecordResponse.body);
                            fetchRecordDeferred.resolve(fetchedRecord);
                        }).catch(function (error) {
                            log.debug('Error getting record: ' + JSON.stringify(error) + ' Endpoint that failed: ' + recordsEndpoint + recordId);
                            fetchRecordDeferred.reject(error);
                        });
                }).catch(function(currError){log.error(JSON.stringify(currError));});
                return fetchRecordDeferred.promise;
            }
        };
        return recordBase;
    };
}());
