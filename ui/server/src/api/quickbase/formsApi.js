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
        let appsApi = require('./appsApi')(config);
        let reportsApi = require('./reportsApi')(config);
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
                            let elementsToRemove = [];
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

                                        // search the tableFields array for the field element by id
                                        // set the formFieldElement to the table setting for required
                                        // tableFields[].required

                                        //  add the field if defined on the table
                                        if (tableField) {
                                            //  NOTE: jira MC-1687 is work to remove the 'required' constraint attribute from
                                            //  the form.  For now, set the FormFieldElement.required to the field setting until
                                            //  that work is complete so that the UI will continue to work today.  Part of that
                                            //  jira should include reworking the UI to no longer reference this form attribute
                                            //  but instead reference the fields object to determine whether input is required.
                                            element.FormFieldElement.required = tableField.required || false;
                                            let required = element.FormFieldElement.required;
                                            fidList.push({id: fieldId, required: required});
                                        } else {
                                            elementsToRemove.push(elementKey);
                                            log.warn("Fid " + fieldId + " defined on form " + form.formId + " but not found in table (app:" + form.appId + ";table:" + form.tableId + "). Skipping..");
                                        }
                                    }
                                }
                            }
                            // remove elements with fields not found in table
                            section.elements = lodash.omitBy(section.elements, (val, key) => {
                                return elementsToRemove.indexOf(key) !== -1;
                            });
                        }
                    }
                }
            }

            return fidList;
        }

        function getBuiltInFieldsFids(tableFields) {
            let tableFieldsFidList = [];
            for (let fld in tableFields) {
                let fldElement = tableFields[fld];
                if (fldElement.builtIn) {
                    tableFieldsFidList.push({id: fldElement.id, required: false});
                }
            }
            return tableFieldsFidList;
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
             * Allows you to override the appsApi object for unit tests.
             * @param requestRequestOverride
             */
            setAppsApiObject: function(obj) {
                appsApi = obj;
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

                const formUrl = routeHelper.getFormsRoute(req.url, requestHelper.getRequestEeHostEnable());

                if (requestHelper.getRequestEeHostEnable()) {
                    opts.url = requestHelper.getRequestEeHost() + formUrl;
                } else {
                    opts.url = requestHelper.getRequestJavaHost() + formUrl;
                }
                //  ensure any request parameters are appended..
                let search = url.parse(req.url).search;
                if (search) {
                    opts.url += search;
                }

                // FormMeta element returned by the experience engine will contain child report elements. Fetch the
                // form meta instance and add relationships to the form meta instance.
                return this.fetchRelationshipsForForm(req, opts);
            },

            /**
             * This function executes the request to fetch the formMetaData and add app relationships to the form.
             * @param req
             * @param opts
             * @returns {Promise}
             */
            fetchRelationshipsForForm: (req, opts) => {
                const promises = [requestHelper.executeRequest(req, opts), appsApi.getRelationshipsForApp(req)];
                return Promise.all(promises).then(response => {
                    const formMeta = JSON.parse(response[0].body);
                    const relationships = response[1] || [];
                    if (relationships.length) {
                        formMeta.relationships = relationships;
                    }
                    return formMeta;
                });
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
            fetchFormComponents: function(req, fetchRecord) {

                return new Promise(function(resolve, reject) {
                    //  fetch the form meta data and fields on the table
                    var fetchRequests = [this.fetchFormMetaData(req), this.fetchTableFields(req)];
                    Promise.all(fetchRequests).then(
                        function(response) {
                            //  create return object with the form meta data
                            let obj = {
                                formMeta: response[0],
                                tableFields: JSON.parse(response[1].body)
                            };

                            // If form object has a relationship defined, attach the default child reportId to each
                            // relationship object.
                            if (lodash.get(obj, 'formMeta.relationships.length')) {
                                // collect all childTableIds
                                let childTableIds = obj.formMeta.relationships.map(rel => rel.detailTableId);
                                childTableIds = lodash.uniq(childTableIds);
                                // find default reportId for each child
                                const defaultReportIdPromises = childTableIds.map(childTableId => reportsApi.fetchDefaultReportId(req, childTableId));

                                return Promise.all(defaultReportIdPromises).then(defaultReportIds => {
                                    // The id in childTableIds corresponds to the response array
                                    const idToReportMap = {};
                                    childTableIds.forEach((childTableId, idx) => {
                                        idToReportMap[childTableId] = defaultReportIds[idx];
                                    });

                                    // attach the defaultReportId to each relationship object
                                    obj.formMeta.relationships = obj.formMeta.relationships.map(relationship => {
                                        relationship.childDefaultReportId = idToReportMap[relationship.detailTableId];
                                        return relationship;
                                    });

                                    return obj;
                                });
                            } else {
                                return obj;
                            }
                        }).then(obj => {
                            obj.record = [];
                            obj.fields = [];

                            //  extract into list all the fields defined on the form.  If any fields, will query
                            //  for record and fields; otherwise will return just the form meta data and empty
                            //  object for records and fields.
                            let fidList = extractFidsListFromForm(obj.formMeta, obj.tableFields);

                            if (obj.formMeta.includeBuiltIns) {
                                let builtInFieldsFids = getBuiltInFieldsFids(obj.tableFields);
                                fidList.push.apply(fidList, builtInFieldsFids);
                            }

                            if (fidList && fidList.length > 0) {

                                //  ensure the fid list is ordered
                                fidList.sort(function(a, b) {
                                    return a.id - b.id;
                                });
                                let fids = fidList.map(lodash.property('id'));

                                //  convert the fid array into a delimited string that will get added to the request as a query parameter
                                let columnList = collectionUtils.convertListToDelimitedString(fids, constants.REQUEST_PARAMETER.LIST_DELIMITER);
                                requestHelper.addQueryParameter(req, constants.REQUEST_PARAMETER.COLUMNS, columnList);

                                if (fetchRecord) {
                                    //  get the records and fields
                                    recordsApi.fetchSingleRecordAndFields(req).then(
                                        function(resp) {
                                            obj.record = resp.record;
                                            obj.fields = resp.fields;
                                            //  NOTE: do not override the 'required' field constraint with the setting defined on the
                                            //  form.  jira MC-1687 is work to remove that attribute from the form.
                                            resolve(obj);
                                        },
                                        function(err) {
                                            reject(err);
                                        }
                                    );
                                } else {
                                    recordsApi.fetchFields(req).then(
                                        function(resp) {
                                            obj.fields = JSON.parse(resp.body);
                                            //  NOTE: do not override the 'required' field constraint with the setting defined on the
                                            //  form.  jira MC-1687 is work to remove that attribute from the form.
                                            resolve(obj);
                                        },
                                        function(err) {
                                            reject(err);
                                        }
                                    );
                                }
                            } else {
                                //  no fids on the form; just return the form meta data and empty records and fields
                                resolve(obj);
                            }
                        },
                        function(error) {
                            reject(error);
                        }
                    ).catch(function(ex) {
                        requestHelper.logUnexpectedError('formsApi...fetchFormComponents', ex, true);
                        reject(ex);
                    });
                }.bind(this));
            },

            /**
             *
             */
            createForm: function(req) {
                return new Promise((resolve, reject) => {
                    let opts = requestHelper.setOptions(req);
                    opts.url = requestHelper.getRequestEeHost() + routeHelper.getFormsRoute(req.url, true);
                    requestHelper.executeRequest(req, opts).then(
                        (response) => {
                            resolve(response);
                        },
                        (error) => {
                            log.error({req: req}, "formsApi.createForm(): Error creating form on EE");
                            reject(error);
                        }
                    ).catch((ex) => {
                        requestHelper.logUnexpectedError('formsApi.createForm(): unexpected error creating form on EE', ex, true);
                        reject(ex);
                    });
                });
            }
        };

        return formsApi;
    };

}());
