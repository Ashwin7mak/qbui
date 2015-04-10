(function () {
    'use strict';
    var promise = require('bluebird');
    var assert = require('assert');
    module.exports = function (config) {
        var apiBase = require('./apiBase.mock.js')(config);
        var init = apiBase.initialize();

        var recordBase = {
            apiBase: apiBase,
            //Helper method to create an app, can be used by multiple test cases
            createApp: function (appToCreate) {
                var deferred = promise.pending();
                init.then(function (createdRealm) {
                    apiBase.executeRequest(apiBase.resolveAppsEndpoint(), apiBase.constants.POST, appToCreate).then(function (appResponse) {
                        deferred.resolve(appResponse);
                    }).catch(function (error) {
                        deferred.reject(error);
                        assert(false, 'failed to create app: ' + JSON.stringify(error));
                    });
                });
                return deferred.promise;
            },

            // Creates and fetches a record, returning a promise that is resolved or rejected on successful
            // record GET following the create
            createAndFetchRecord: function (recordsEndpoint, record, params) {
                var fetchRecordDeferred = promise.pending();

                init.then(function () {
                    apiBase.executeRequest(recordsEndpoint, apiBase.constants.POST, record)
                        .then(function (recordIdResponse) {
                            var getEndpoint = recordsEndpoint + JSON.parse(recordIdResponse.body).id;
                            if (params) {
                                getEndpoint += params;
                            }
                            apiBase.executeRequest(getEndpoint, apiBase.constants.GET)
                                .then(function (fetchedRecordResponse) {
                                    var fetchedRecord = JSON.parse(fetchedRecordResponse.body);
                                    fetchRecordDeferred.resolve(fetchedRecord);
                                }).catch(function (error) {
                                    fetchRecordDeferred.reject(error);
                                });
                        });
                });
                return fetchRecordDeferred.promise;
            }
        };

        return recordBase;
    }
}());