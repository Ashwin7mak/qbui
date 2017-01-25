/**
 * Relationship service module which contains methods for generating relationship JSON objects and interacting with the Node server layer
 * Created by xhe on 1/23/17.
 */
(function() {
    'use strict';
    //Bluebird Promise library
    var promise = require('bluebird');
    //Node.js assert library
    var assert = require('assert');
    var recordGenerator = require('../../../test_generators/record.generator.js');
    module.exports = function(recordBase) {
        var relationshipService = {
            /**
             * Creates one to one relationship between Master and Child tables
             *
             */
            createOneToOneRelationship: function(createApp, parentTable, childTable) {
                const FK_FIELD_NAME = 'Numeric Field';
                let RECORD_ID_NAME = 'Record ID#';
                let masterTableId = parentTable.id;
                let detailTableId = childTable.id;
                let masterTablePkField = null;
                let detailTableFkField = null;

                parentTable.fields.forEach(field => {
                    if (field.name === RECORD_ID_NAME) {
                        masterTablePkField = field;
                    }
                });

                childTable.fields.forEach(field => {
                    if (field.name === FK_FIELD_NAME) {
                        detailTableFkField = field;
                    }
                });

                const relationshipToCreate = {
                    appId        : createApp.id,
                    masterAppId  : createApp.id,
                    masterTableId: masterTableId,
                    masterFieldId: masterTablePkField.id,
                    detailAppId  : createApp.id,
                    detailTableId: detailTableId,
                    detailFieldId: detailTableFkField.id,
                    referentialIntegrity: false,
                    cascadeDelete: false,
                    description  : 'Referential integrity relationship between Master / Child Tables'
                };

                recordBase.createRelationship(relationshipToCreate).then(function(relResponse) {
                    var relationship = JSON.parse(relResponse.body);
                    console.log('Relationship Created with ID: ' + relationship.id);
                });
            }
        };
        return relationshipService;
    };
}());
