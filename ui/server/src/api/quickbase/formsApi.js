/**
 The purpose of this module is to process /apps/<id>/tables/<id>/form api requests.
 */
(function() {
    'use strict';

    let Promise = require('bluebird');
    let log = require('../../logger').getLogger();
    let constants = require('../../../../common/src/constants');
    let stringUtils = require('../../utility/stringUtils');

    module.exports = function(config) {

        //Module constants:
        var APPLICATION_JSON = 'application/json';
        var CONTENT_TYPE = 'Content-Type';

        let requestHelper = require('./requestHelper')(config);
        let recordsApi = require('./recordsApi')(config);
        let routeHelper = require('../../routes/routeHelper');
        let lodash = require('lodash');

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

                    //var fetchRequests = [this.fetchFormMetaData(req), recordsApi.fetchSingleRecordAndFields(req)];

                    //Promise.all(fetchRequests).then(
                    this.fetchFormMetaData(req).then(
                        function(response) {
                            let formObj = JSON.parse(response.body);
                            let fidList = [];

                            let tabs = formObj.tabs;
                            if (tabs) {
                                for (var tabKey in tabs) {
                                    var tab = tabs[tabKey];
                                    var sections = tab.sections;
                                    if (sections) {
                                        for (var sectionKey in sections) {
                                            var section = sections[sectionKey];
                                            var elements = section.elements;
                                            if (elements) {
                                                for (var elementKey in elements) {
                                                    var element = elements[elementKey];
                                                    if (element.FormTextElement) {
                                                        if (element.FormTextElement.fieldId) {
                                                            fidList.push(element.FormTextElement.fieldId);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            // not sure if lodash.find(formObj,'fieldId') works...need better data

                            let columnList = stringUtils.convertListToDelimitedString(fidList, constants.REQUEST_PARAMETER.LIST_DELIMITER);
                            if (columnList) {
                                requestHelper.addQueryParameter(req, constants.REQUEST_PARAMETER.COLUMNS, columnList);
                            }

                            recordsApi.fetchSingleRecordAndFields(req).then(
                                function(resp) {
                                    let obj = {
                                        formMeta: formObj,
                                        record: resp.record,
                                        fields: resp.fields
                                    };
                                    resolve(obj);
                                },
                                function(err) {
                                    let obj = {};
                                    if (err) {
                                        obj.statusCode = err.statusCode;
                                        obj.message = err.statusMessage;
                                        obj.body = JSON.parse(err.body);
                                    }
                                    reject(obj);
                                });
                        },
                        function(error) {
                            let obj = {};
                            if (error) {
                                obj.statusCode = error.statusCode;
                                obj.message = error.statusMessage;
                                obj.body = JSON.parse(error.body);
                            }
                            reject(obj);
                        }
                    ).catch(function(ex) {
                        requestHelper.logUnexpectedError('formsApi...fetchFormComponents', ex, true);
                        reject(ex);
                    });
                }.bind(this));
            }
        };

        return formsApi;
    };

}());
