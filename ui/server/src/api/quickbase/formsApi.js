/**
 The purpose of this module is to process /apps/<id>/tables/<id>/form api requests.
 This uses recordsApi to make calls out to /apps/<id>/tables/<id>/records end points when needed.
 */
(function() {
    'use strict';

    let Promise = require('bluebird');
    let log = require('../../logger').getLogger();

    module.exports = function(config) {

        let requestHelper = require('./requestHelper')(config);
        let recordsApi = require('./recordsApi')(config);

        let formsApi = {

            fetchFormMetaData: function(req, rootUrl) {
                var opts = requestHelper.setOptions(req);
                opts.headers['Content-Type'] = 'application/json';

                if (rootUrl) {
                    opts.url = requestHelper.transformUrlRoute(opts.url, rootUrl, rootUrl + 'forms/1');
                }
                return requestHelper.executeRequest(req, opts);
            },

            fetchFormComponents: function(req, rootUrl) {

                return new Promise(function(resolve, reject) {

                    var fetchRequests = [this.fetchFormMetaData(req, rootUrl), recordsApi.fetchSingleRecordAndFields(req, rootUrl)];

                    Promise.all(fetchRequests).then(
                        function(response) {
                            let obj = {
                                fieldMeta: response[0],
                                record: response[1].record,
                                fields: response[1].fields
                            };
                            resolve(obj);
                        },
                        function(error) {
                            reject(error);
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
