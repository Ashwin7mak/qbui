(function() {
    'use strict';
    var promise = require('bluebird');
    var assert = require('assert');
    var consts = require('../../../common/src/constants');
    var log = require('../../src/logger').getLogger();

    var recordGenerator = require('../../../test_generators/record.generator.js');

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
        var apiBase = require('./api.base.js')(config);
        var init;

        if (config !== undefined) {
            init = apiBase.initialize();
        }

        var recordBase = {
            apiBase           : apiBase,
            //delegate to apiBase to initialize
            initialize        : function() {
                init = apiBase.initialize();
            },
            //set the baseUrl we want to use to reach out for testing
            setBaseUrl        : function(baseUrlConfig) {
                apiBase.setBaseUrl(baseUrlConfig);
            },
            //Helper method to create an app, can be used by multiple test cases
            createApp         : function(appToCreate) {
                var self = this;
                return init.then(function() {
                    return apiBase.executeRequest(apiBase.resolveAppsEndpoint(), consts.POST, appToCreate).then(function(appResponse) {
                        let createdApp = JSON.parse(appResponse.body);
                        log.debug('App create response: ' + JSON.stringify(createdApp));
                        var initTablePropsPromises = [];
                        createdApp.tables.forEach(function(table, index) {
                            initTablePropsPromises.push(self.initTableProperties(createdApp.id, table.id, table.name));
                        });
                        // Set the tableProperties for each table
                        return promise.all(initTablePropsPromises).then(function(results) {
                            // if all promises successful return the createApp response or code will error to catch block below
                            return appResponse;
                        });
                    }).catch(function(error) {
                        log.error('Error in createApp');
                        return promise.reject(error);
                    });
                });
            },
            initTableProperties: function(appId, tableId, tableNoun) {
                let propsJson = {tableNoun: tableNoun};
                const tablePropertiesEndpoint = recordBase.apiBase.resolveTablePropertiesEndpoint(appId, tableId);
                return recordBase.apiBase.executeRequest(tablePropertiesEndpoint, 'POST', propsJson, null, null, true).then(function(result) {
                    return JSON.parse(result.body);
                }).catch(function(error) {
                    log.error("Error in initTableProperties");
                    return promise.reject(error);
                });
            },
            //Helper method to create a relationship between two tables in an app
            createRelationship: function(relationshipToCreate) {
                var deferred = promise.pending();
                init.then(function() {
                    apiBase.executeRequest(apiBase.resolveRelationshipsEndpoint(relationshipToCreate.appId), consts.POST, relationshipToCreate).
                            then(function(relResponse) {
                                deferred.resolve(relResponse);
                            }).catch(function(error) {
                                deferred.reject(error);
                                assert(false, 'failed to create app: ' + JSON.stringify(error));
                            });
                });
                return deferred.promise;
            },
            createField: function(appId, tableId, fieldToCreate) {
                var deferred = promise.pending();
                init.then(function() {
                    apiBase.executeRequest(apiBase.resolveFieldsEndpoint(appId, tableId), consts.POST, fieldToCreate).
                            then(function(relResponse) {
                                deferred.resolve(relResponse);
                            }).catch(function(error) {
                                deferred.reject(error);
                                assert(false, 'failed to create field: ' + JSON.stringify(error));
                            });
                });
                return deferred.promise;
            },
            fetchRecord: function(appId, tableId, recordId, params) {
                var deferred = promise.pending();
                var endpoint = apiBase.resolveRecordsEndpoint(appId, tableId, recordId);
                if (params) {
                    endpoint += params;
                }
                init.then(function() {
                    apiBase.executeRequest(endpoint, consts.GET).
                            then(function(recResp) {
                                deferred.resolve(recResp);
                            }).
                            catch(function(error) {
                                deferred.reject(error);
                                assert(false, 'failed to resolve record');
                            });
                });
                return deferred.promise;
            },
            // Creates and fetches a record, returning a promise that is resolved or rejected on successful
            // record GET following the create
            createAndFetchRecord: function(recordsEndpoint, record, params) {
                var fetchRecordDeferred = promise.pending();
                init.then(function() {
                    apiBase.executeRequest(recordsEndpoint, consts.POST, record)
                            .then(function(recordIdResponse) {
                                var getEndpoint = recordsEndpoint + JSON.parse(JSON.parse(recordIdResponse.body).body).id;
                                if (params) {
                                    getEndpoint += params;
                                }
                                apiBase.executeRequest(getEndpoint, consts.GET)
                                              .then(function(fetchedRecordResponse) {
                                                  var fetchedRecord = jsonBigNum.parse(fetchedRecordResponse.body);
                                                  fetchRecordDeferred.resolve(fetchedRecord);
                                              }).catch(function(error) {
                                                  fetchRecordDeferred.reject(error);
                                              });
                            }).catch(function(currError) {
                                log.error(JSON.stringify(currError));
                                fetchRecordDeferred.reject(currError);
                            });
                }).catch(function(err) {
                    log.error(JSON.stringify(err));
                    fetchRecordDeferred.reject(err);
                });
                return fetchRecordDeferred.promise;
            },
            // Creates a record, returning a promise that is resolved or rejected on successful
            //TODO: Fix promise anti-pattern QBSE-20581 - fixed createRecord and editRecord (nv, 12/29/16)
            createRecord: function(recordsEndpoint, record, params) {
                return init
                    .then(function() {
                        return {
                            stringPath: recordsEndpoint,
                            method: consts.POST,
                            body: record,
                            params: params
                        };
                    })
                    .then(apiBase.executeRequest)
                    .then(function(recordIdResponse) {
                        return JSON.parse(JSON.parse(recordIdResponse.body).body).id;
                    })
                    .catch(function(err) {
                        log.error(JSON.stringify(err));
                        return promise.reject(err);
                    });
            },
            // Creates a list of records using the bulk record endpoint, returning a promise that is resolved or rejected on successful
            createRecords: function(recordsEndpoint, records) {
                log.debug('Records to create: ' + JSON.stringify(records));
                var fetchRecordDeferred = promise.pending();
                init.then(function() {
                    var recordBulkEndpoint = recordsEndpoint + 'bulk';

                    //Get the actual record JSON out of the records
                    var recordObjects = [];
                    records.forEach(function(object) {
                        recordObjects.push(object.record);
                    });
                    return apiBase.executeRequest(recordBulkEndpoint, consts.POST, recordObjects)
                            .then(function(recordBulkResponse) {
                                var parsedRecordIdList = JSON.parse(recordBulkResponse.body);

                                var recordIdList = [];
                                parsedRecordIdList.forEach(function(jsonObj) {
                                    recordIdList.push(jsonObj.id);
                                });

                                fetchRecordDeferred.resolve(recordIdList);
                            }, function(recordBulkResponseError) {
                                fetchRecordDeferred.reject(recordBulkResponseError);
                            })
                        .catch(function(currError) {
                            log.error(JSON.stringify(currError));
                            fetchRecordDeferred.reject(currError);
                        });
                }).catch(function(err) {log.error(JSON.stringify(err));});
                return fetchRecordDeferred.promise;
            },
            // Creates a list of records using the bulk record endpoint, returning a promise that is resolved or rejected on successful
            createBulkRecords: function(recordsEndpoint, records) {
                log.debug('Records to create: ' + JSON.stringify(records));
                var fetchRecordDeferred = promise.pending();
                init.then(function() {
                    var recordBulkEndpoint = recordsEndpoint + 'bulk';

                    apiBase.executeRequest(recordBulkEndpoint, consts.POST, records)
                        .then(function(recordBulkResponse) {
                            var parsedRecordIdList = JSON.parse(recordBulkResponse.body);

                            var recordIdList = [];
                            parsedRecordIdList.forEach(function(jsonObj) {
                                recordIdList.push(jsonObj.id);
                            });

                            fetchRecordDeferred.resolve(recordIdList);
                        }).catch(function(currError) {
                            log.error(JSON.stringify(currError));
                            fetchRecordDeferred.reject(currError);
                        });
                }).catch(function(err) {
                    log.error(JSON.stringify(err));
                    fetchRecordDeferred.reject(err);
                });
                return fetchRecordDeferred.promise;
            },
            editRecord: function(recordsEndpoint, recordId, record) {
                return init
                    .then(function(payload) {
                        return {
                            stringPath: recordsEndpoint + recordId,
                            method: consts.PATCH,
                            body: record
                        };
                    })
                    .then(apiBase.executeRequest)
                    .then(function(recordIdResponse) {
                        return recordIdResponse;
                    }).catch(function(err) {
                        log.error(JSON.stringify(err));
                        return promise.reject(err);
                    });
            },
            // Gets a record given their record ID, returning a promise that is resolved or rejected on successful
            getRecord: function(recordsEndpoint, recordId, params) {
                var fetchRecordDeferred = promise.pending();
                log.debug('Attempting record GET: ' + recordsEndpoint + ' recordId: ' + recordId);
                init.then(function() {
                    var getEndpoint = recordsEndpoint + recordId;
                    if (params) {
                        getEndpoint += params;
                    }
                    apiBase.executeRequest(getEndpoint, consts.GET)
                            .then(function(fetchedRecordResponse) {
                                var fetchedRecord = jsonBigNum.parse(fetchedRecordResponse.body);
                                fetchRecordDeferred.resolve(fetchedRecord);
                            }).catch(function(error) {
                                log.debug('Error getting record: ' + JSON.stringify(error) + ' Endpoint that failed: ' + recordsEndpoint + recordId);
                                fetchRecordDeferred.reject(error);
                            });
                }).catch(function(currError) {
                    log.error(JSON.stringify(currError));
                    fetchRecordDeferred.reject(currError);
                });
                return fetchRecordDeferred.promise;
            },
            /**
             * Given a table JSON object check for and return an array containing the non built-in fields
             * @Returns An array containing the non built-in fields
             */
            getNonBuiltInFields: function(createdTable) {
                var nonBuiltIns = [];
                createdTable.fields.forEach(function(field) {
                    if (field.builtIn !== true) {
                        nonBuiltIns.push(field);
                    }
                });
                return nonBuiltIns;
            },
            /**
             * Uses the generators in the test_generators package to generate a list of record objects based on the
             * given list of fields and number of records. This list can then be passed into the addRecords function.
             * @Returns An array of generated record JSON objects
             */
            generateRecords: function(fields, numRecords) {
                var genRecords = [];
                for (var i = 0; i < numRecords; i++) {
                    var generatedRecord = recordGenerator.generateRecord(fields);
                    genRecords.push(generatedRecord);
                }
                return genRecords;
            },
            /**
             * Uses the generators in the test_generators package to generate a list of empty record objects based on the
             * given list of fields and number of records. This list can then be passed into the addRecords function.
             */
            generateEmptyRecords: function(fields, numRecords) {
                var generatedEmptyRecords = [];
                for (var i = 0; i < numRecords; i++) {
                    var generatedRecord = recordGenerator.generateEmptyRecord(fields);
                    generatedEmptyRecords.push(generatedRecord);
                }
                return generatedEmptyRecords;
            },
            /**
             * Given an already created app and table, create a list of generated record JSON objects via the API.
             * @Returns A promise chain.
             */
            addRecords: function(createdApp, createdTable, genRecords) {
                //Resolve the proper record endpoint specific to the generated app and table
                var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(createdApp.id, createdTable.id);
                var fetchRecordPromises = [];
                genRecords.forEach(function(currentRecord) {
                    fetchRecordPromises.push(recordBase.createAndFetchRecord(recordsEndpoint, currentRecord, null));
                });
                return Promise.all(fetchRecordPromises)
                    .then(function(results) {
                        return results;
                    }).catch(function(error) {
                        // Proper error handling, you need to rethrow not just return the error
                        throw new Error(error);
                    });
            }
        };
        return recordBase;
    };
}());
