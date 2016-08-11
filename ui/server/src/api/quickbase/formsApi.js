/**
 The purpose of this module is to process /apps/<id>/tables/<id>/form api requests.
 */
(function() {
    'use strict';

    let Promise = require('bluebird');
    let log = require('../../logger').getLogger();
    let constants = require('../../../../common/src/constants');
    let collectionUtils = require('../../utility/collectionUtils');
    var url = require('url');
    var lodash = require('lodash');

    module.exports = function(config) {

        //Module constants:
        var APPLICATION_JSON = 'application/json';
        var CONTENT_TYPE = 'Content-Type';

        let requestHelper = require('./requestHelper')(config);
        let recordsApi = require('./recordsApi')(config);
        let routeHelper = require('../../routes/routeHelper');

        /**
         * Scan through the forms response object and return a list of fids that are
         * defined on the form and have not been deleted from the table.
         *
         * @param form
         * @returns {Array}
         */
        function extractFidsListFromForm(form, tableFields) {
            if (!form) {
                return null;
            }

            let fidList = [];

            //  every form should have at least 1 tab
            let tabs = form.tabs;
            if (!tabs) {
                return fidList;
            }

            for (let tabKey in tabs) {
                //  each tab should have at least 1 section
                let tab = tabs[tabKey];
                if (tab.sections) {
                    for (let sectionKey in tab.sections) {
                        //  each section may have elements (text, header, field, etc)
                        let section = tab.sections[sectionKey];
                        if (section.elements) {
                            for (let elementKey in section.elements) {
                                //  is this a form field element
                                let element = section.elements[elementKey];
                                if (element.FormFieldElement) {
                                    //  examine the fieldId
                                    let fieldId = element.FormFieldElement.fieldId;

                                    //  has the field already been added to the list
                                    if (fieldId && !collectionUtils.contains(fidList, fieldId)) {
                                        //  is this field on the table...possible (in current stack)
                                        //  a field has been deleted from a table but reference is
                                        //  still defined on the form.
                                        let tableField = lodash.find(tableFields, function(field) {
                                            return fieldId === field.id;
                                        });

                                        //  add the field if defined on the table
                                        if (tableField) {
                                            fidList.push(fieldId);
                                        } else {
                                            log.warn("Fid " + fieldId + " defined on form " + form.formId + " but not found in table (app:" + form.appId + ";table:" + form.tableId + "). Skipping..");
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            return fidList;
        }

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

            /**
             * Return form meta data for a given record
             *
             * @param req
             * @returns {*}
             */
            fetchFormMetaData: function(req) {
                let opts = requestHelper.setOptions(req);
                opts.headers[CONTENT_TYPE] = APPLICATION_JSON;
                opts.url = requestHelper.getRequestJavaHost() + routeHelper.getFormsRoute(req.url);

                //  ensure any request parameters are appended..
                let search = url.parse(req.url).search;
                if (search) {
                    opts.url += search;
                }

                return requestHelper.executeRequest(req, opts);
            },

            fetchTableFields: function(req) {
                let opts = requestHelper.setOptions(req);
                opts.headers[CONTENT_TYPE] = APPLICATION_JSON;
                opts.url = requestHelper.getRequestJavaHost() + routeHelper.getFieldsRoute(req.url);
                // no query parameters to append to this route
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
                    //  fetch the form meta data and fields on the table
                    var fetchRequests = [this.fetchFormMetaData(req), this.fetchTableFields(req)];
                    Promise.all(fetchRequests).then(
                        function(response) {
                            //  create return object with the form meta data
                            let obj = {
                                formMeta: JSON.parse(response[0].body),
                                tableFields: JSON.parse(response[1].body),
                                record: {},
                                fields: {}
                            };

                            //  extract into list all the fields defined on the form.  If any fields, will query
                            //  for record and fields; otherwise will return just the form meta data and empty
                            //  object for records and fields.
                            let fidList = extractFidsListFromForm(obj.formMeta, obj.tableFields);
                            if (fidList && fidList.length > 0) {

                                //  ensure the fid list is ordered
                                fidList.sort(function(a, b) {
                                    return a - b;
                                });

                                //  convert the fid array into a delimited string that will get added to the request as a query parameter
                                let columnList = collectionUtils.convertListToDelimitedString(fidList, constants.REQUEST_PARAMETER.LIST_DELIMITER);
                                requestHelper.addQueryParameter(req, constants.REQUEST_PARAMETER.COLUMNS, columnList);

                                //  get the records and fields
                                recordsApi.fetchSingleRecordAndFields(req).then(
                                    function(resp) {
                                        obj.record = resp.record;
                                        obj.fields = resp.fields;
                                        resolve(obj);
                                    },
                                    function(err) {
                                        let errObj = {};
                                        if (err) {
                                            errObj.statusCode = err.statusCode;
                                            errObj.message = err.statusMessage;
                                            errObj.body = JSON.parse(err.body);
                                        }
                                        reject(errObj);
                                    }
                                );
                            } else {
                                //  no fids on the form; just return the form meta data and empty records and fields
                                resolve(obj);
                            }
                        },
                        function(error) {
                            let errObj = {};
                            if (error) {
                                errObj.statusCode = error.statusCode;
                                errObj.message = error.statusMessage;
                                errObj.body = JSON.parse(error.body);
                            }
                            reject(errObj);
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
