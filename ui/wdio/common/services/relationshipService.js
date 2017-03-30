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

    module.exports = function(recordBase) {
        var relationshipService = {
            /**
             * Creates one to one relationship between Master and Child tables
             * @param app - Created app JSON object returned from the API
             * @param parentTable - Parent table JSON object
             * @param childTable - Child table JSON object
             * @param detailFieldId - FieldId to relate master and child table by
             * @returns Promise function that resolves to the returned JSON obj of the create relationship API call
             */
            createOneToOneRelationship: function(app, parentTable, childTable, detailFieldId) {
                const FK_FIELD_NAME = 'Record ID#';
                let RECORD_ID_NAME = 'Record ID#';
                let masterTableId = parentTable.id;
                let detailTableId = childTable.id;
                let masterTablePkFieldId;
                let detailTableFkFieldId = detailFieldId;

                parentTable.fields.forEach(field => {
                    if (field.name === RECORD_ID_NAME) {
                        masterTablePkFieldId = field.id;
                    }
                });

                childTable.fields.forEach(field => {
                    if (detailTableFkFieldId === undefined && field.name === FK_FIELD_NAME) {
                        detailTableFkFieldId = field.id;
                    }
                });

                const relationshipToCreate = {
                    appId        : app.id,
                    masterAppId  : app.id,
                    masterTableId: masterTableId,
                    masterFieldId: masterTablePkFieldId,
                    detailAppId  : app.id,
                    detailTableId: detailTableId,
                    detailFieldId: detailTableFkFieldId,
                    referentialIntegrity: false,
                    cascadeDelete: false,
                    description  : 'Referential integrity relationship between Master / Child Tables'
                };

                recordBase.createRelationship(relationshipToCreate).then(function(relResponse) {
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
