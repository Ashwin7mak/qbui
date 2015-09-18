/**
 * Record service module which contains methods for generating record JSON objects and interacting with the Node server layer
 * Created by klabak on 9/17/15.
 */
(function() {
    'use strict';
    // Bluebird Promise library
    var promise = require('bluebird');
    var recordGenerator = require('../../test_generators/record.generator.js');
    module.exports = function(recordBase) {
        var recordService = {
            /**
             * Given an already created app and table, create a list of generated record JSON objects via the API.
             * Returns a promise.
             */
            addRecords: function(app, table, genRecords) {
                var deferred = promise.pending();
                // Resolve the proper record endpoint specific to the generated app and table
                var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, table.id);
                var fetchRecordPromises = [];
                genRecords.forEach(function(currentRecord) {
                    fetchRecordPromises.push(recordBase.createAndFetchRecord(recordsEndpoint, currentRecord, null));
                });
                promise.all(fetchRecordPromises)
                    .then(function(results) {
                        deferred.resolve(results);
                    }).catch(function(error) {
                        console.log(JSON.stringify(error));
                        deferred.reject(error);
                    });
                return deferred.promise;
            },
            /**
             * Uses the generators in the test_generators package to generate a list of record objects based on the
             * given list of fields and number of records. This list can then be passed into the addRecords function.
             */
            generateRecords: function(fields, numRecords) {
                var generatedRecords = [];
                for (var i = 0; i < numRecords; i++) {
                    var generatedRecord = recordGenerator.generateRecord(fields);
                    //console.log(generatedRecord);
                    generatedRecords.push(generatedRecord);
                }
                return generatedRecords;
            }
        };
        return recordService;
    };
}());