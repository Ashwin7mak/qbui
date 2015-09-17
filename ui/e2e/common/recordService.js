/**
 * Integration base module that defines common locators / actions / functions to be used by all Protractor tests
 * Created by klabak on 4/15/15.
 */

(function() {
    'use strict';
    // Bluebird Promise library
    var promise = require('bluebird');
    var recordGenerator = require('../../test_generators/record.generator.js');

    module.exports = function(recordBase) {
        var recordService = {
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
    ///**
    // * Takes an array of field objects and returns an array containing the specified number of generated record JSON objects.
    // */
    //exports.generateRecords = function(fields, numRecords) {
    //    var generatedRecords = [];
    //    for (var i = 0; i < numRecords; i++) {
    //        var generatedRecord = recordGenerator.generateRecord(fields);
    //        //console.log(generatedRecord);
    //        generatedRecords.push(generatedRecord);
    //    }
    //    return generatedRecords;
    //};
}());