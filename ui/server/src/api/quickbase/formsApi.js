/**
 The purpose of this module is to process /apps/<id>/tables/<id>/form api requests.
 */
(function() {
    'use strict';

    let Promise = require('bluebird');
    let log = require('../../logger').getLogger();

    module.exports = function(config) {

        //Module constants:
        var APPLICATION_JSON = 'application/json';
        var CONTENT_TYPE = 'Content-Type';

        let requestHelper = require('./requestHelper')(config);
        let recordsApi = require('./recordsApi')(config);
        let routeHelper = require('../../routes/routeHelper');

        let formsApi = {

            /**
             * Allows you to override the requestHelper object for unit tests.
             * @param requestRequestOverride
             */
            setRequestHelperObject: function(obj) {
                requestHelper = obj;
            },

            /**
             * Allows you to override the recordsApi object for unit tests.
             * @param requestRequestOverride
             */
            setRecordsApiObject: function(obj) {
                recordsApi = obj;
            },

            fetchFormMetaData: function(req) {
                let opts = requestHelper.setOptions(req);
                opts.headers[CONTENT_TYPE] = APPLICATION_JSON;

                //  TODO: TEMPORARAY...JUST RETURN FORM ID 1 for now...
                //  TODO: NEED NEW ENDPOINT THAT DOES NOT REQUIRE AN ID...
                opts.url = requestHelper.getRequestJavaHost() + routeHelper.getFormsRoute(req.url, 1);
                return requestHelper.executeRequest(req, opts);
            },

            /**
             * Fetch form meta data, a single record and associated fields meta data from a table.
             *
             * @param req
             * @returns Promise
             */
            fetchFormComponents: function(req) {

                return new Promise(function(resolve, reject) {

                    var fetchRequests = [this.fetchFormMetaData(req), recordsApi.fetchSingleRecordAndFields(req)];

                    Promise.all(fetchRequests).then(
                        function(response) {
                            let obj = {
                                formMeta: response[0],
                                record: response[1].record,
                                fields: response[1].fields
                            };
                            resolve(obj);
                        },
                        function(error) {
                            let obj = {
                                statusCode: error.statusCode,
                                message: error.statusMessage,
                                body: JSON.parse(error.body)
                            };
                            reject(obj);
                        }
                    ).catch(function(ex) {
                        requestHelper.logUnexpectedError('formsApi...fetchFormComponents', error, true);
                        reject(ex);
                    });
                }.bind(this));
            }
        };

        return formsApi;
    };

}());
