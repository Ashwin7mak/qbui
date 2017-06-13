/**
 * Relationship service module which contains methods for generating relationship JSON objects and interacting with the Node server layer
 * Created by xhe on 1/23/17.
 */
(function() {
    'use strict';
    // Bluebird Promise library
    var promise = require('bluebird');
    // Node.js assert library
    var assert = require('assert');
    // Logging library
    var log = require('../../../server/src/logger').getLogger();
    // Lodash library
    var _ = require('lodash');
    // Import constants file
    var consts = require('../../../common/src/constants.js');


    function getFieldName(table, fieldId) {
        let answer = '';
        if (table && table.fields) {
            let theField = table.fields.find(field => fieldId === field.id);
            if (theField) {
                answer = theField.name;
            }
        }
        return answer;
    }
    module.exports = function(recordBase) {
        var relationshipService = {
            /**
             * Creates one to one relationship between Master and Child tables
             * @param app - Created app JSON object returned from the API
             * @param parentTable - Parent table JSON object
             * @param childTable - Child table JSON object
             * @param detailFieldId - FieldId in child table to relate master and child table by
             * @param lookUpFieldId - FieldId in master table used to relate master and child table
             * @returns Promise function that resolves to the returned JSON obj of the create relationship API call
             */
            createOneToOneRelationship: function(app, parentTable, childTable, detailFieldId, lookUpFieldId,
                                                 description = 'Referential integrity relationship between Master / Child Tables') {
                const RECORD_ID_NAME = 'Record ID#';
                let masterTableId = parentTable.id;
                let detailTableId = childTable.id;
                let masterTablePkFieldId = lookUpFieldId;
                let detailTableFkFieldId = detailFieldId;
                let masterTableName = parentTable.name;
                let detailTableName = childTable.name;
                let masterFieldName = getFieldName(parentTable, masterTablePkFieldId);
                let detailFieldName = getFieldName(childTable, detailTableFkFieldId);

                parentTable.fields.forEach(field => {
                    if (masterTablePkFieldId === undefined && field.name === RECORD_ID_NAME) {
                        masterTablePkFieldId = field.id;
                    }
                });

                childTable.fields.forEach(field => {
                    if (detailTableFkFieldId === undefined && field.name === RECORD_ID_NAME) {
                        detailTableFkFieldId = field.id;
                    }
                });
                const relationshipToCreate = {
                    appId: app.id,
                    masterAppId: app.id,
                    masterTableName,
                    masterTableId,
                    masterFieldId: masterTablePkFieldId,
                    masterFieldName,
                    detailAppId: app.id,
                    detailTableName,
                    detailTableId,
                    detailFieldName,
                    detailFieldId: detailTableFkFieldId,
                    referentialIntegrity: false,
                    cascadeDelete: false,
                    description  : description
                };

                return recordBase.createRelationship(relationshipToCreate).then(function(relResponse) {
                    return JSON.parse(relResponse.body);
                }).catch(function(error) {
                    log.error('Error creating relationship');
                    return error;
                });
            },

            /**
             * Retrieves the relationships created for the sample app.
             */
            retrieveSavedRelationships: function(createdApp) {
                let appId = createdApp.id;
                let relationshipEndpoint = recordBase.apiBase.resolveRelationshipsEndpoint(appId);
                return recordBase.apiBase.executeRequest(relationshipEndpoint, consts.GET).then(function(result) {
                    return JSON.parse(result.body);
                }).catch(function(error) {
                    log.error('Error retrieving relationships');
                    return error;
                });
            },

            /**
             * Adds sections containing child report elements to a tab in the form associated with all tables
             * in the app
             * @param savedRelationships
             */
            addChildReportsToTableForms: function(createdApp, savedRelationships) {
                let appId = createdApp.id;
                let addChildReportElements = [];

                createdApp.tables.forEach((table) => {
                    addChildReportElements.push(function() {

                        const tableId = table.id;
                        let formsEndpoint = recordBase.apiBase.resolveFormsEndpoint(appId, tableId, 1);
                        let putFormsEndpoint = recordBase.apiBase.resolveFormsEndpoint(appId, tableId);

                        return recordBase.apiBase.executeRequest(formsEndpoint, consts.GET).then(function(formsResult) {
                            var form = JSON.parse(formsResult.body);
                            if (savedRelationships) {
                                savedRelationships.forEach((relationship, index) => {
                                    if (relationship.masterTableId === tableId) {
                                        const sections = form.tabs[0].sections;
                                        const length = Object.keys(sections).length;
                                        const childReportElement = {"ChildReportElement" : {relationshipId: index}};
                                        sections[length] = Object.assign(_.cloneDeep(sections[0]), {
                                            elements: {0: childReportElement},
                                            fields: [],
                                            orderIndex: length
                                        });
                                        const childTableName = _.find(createdApp.tables, {id:relationship.detailTableId}).name;
                                        sections[length].headerElement.FormHeaderElement.displayText = childTableName;
                                    }
                                });
                            }
                            return form;
                        }).then(function(updatedForm) {
                            return recordBase.apiBase.executeRequest(putFormsEndpoint, consts.PUT, updatedForm);
                        }).catch(function(error) {
                            log.error('Error adding child report to form');
                            log.error(error);
                            return error;
                        });
                    });
                });
                // Bluebird's promise.each function (executes each promise sequentially)
                return promise.each(addChildReportElements, function(queueItem) {
                    // This is an iterator that executes each Promise function in the array here
                    return queueItem();
                });
            }
        };
        return relationshipService;
    };
}());
