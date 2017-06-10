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
                    return promise.reject(error);
                });
            }
        };
        return relationshipService;
    };
}());
