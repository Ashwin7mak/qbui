/**
 * relationship.generator.js will generate valid json for a relationship object given a master and detail table
 * Created by cschneider1 on 5/28/15.
 */
(function () {
    var relationshipConstants = require('./relationship.constants');
    var relationshipBuilder = require('./relationship.builder');
    var tableConsts = require('./table.constants')
    var fieldConsts = require('./field.constants')
    var appConsts = require('./app.constants')
    var Chance = require('chance');
    var chance = new Chance();
    var _ = require('lodash');


    module.exports = {

        /**
         * Retrieve the relationship builder to build a field peicemeal
         * @returns {*|{build, cloneIntoBuilder, withId, withAppId, withDescription, withMasterAppId,
         *     withMasterTableId, withMasterFieldId, withDetailAppId, withDetailTableId, withDetailFieldId,
         *     withReferentialIntegrity, withCascadeDelete}}
         */
        getRelationshipBuilder: function () {
            var builderInstance = relationshipBuilder.builder();
            return builderInstance;
        },

        /**
         * Return the string representation of the relationship object
         * @param relationship
         */
        relationshipToJsonString: function (relationship) {
            return JSON.stringify(relationship);
        },

        /**
         * Generate a relationship based on two existing tables that are extracted from the app by id. This method will fail if we are unable to find
         * a field with unique=true on the master table and a field of the same type on the detail table.
         * </p>
         * This relationship also relies on the fact that the app has been fully populated with id's as those are used
         * as reference within the relationship object.
         * @param app
         * @param masterTableId
         * @param detailTableId
         * @returns {*|{singleRun, autoWatch}}
         */
        generateRelationshipFromApp: function (app, masterTableId, detailTableId) {

            var tables = app[appConsts.TABLES];

            var masterTable;
            var detailTable;

            //loop over all of the fields in the master table and pick a matching master and detail field
            //start at the end of the list so that we can pick fields that are not recordId
            _.forEach(tables, function(table){
                if(table[tableConsts.ID] === masterTableId){
                    masterTable = table;
                }

                if(table[tableConsts.ID] === detailTableId){
                    detailTable = table;
                }
            });

            if(typeof masterTable === 'undefined' || typeof detailTable === 'undefined'){
                console.error('Could not find any matching tables for the ids provided!');
                throw new Error('Could not find any matching tables for the ids provided! masterTableId: '+ masterTableId +', detailTableId: ' + detailTableId +', app: ' + app );
            }

            return this.generateRelationship(masterTable, detailTable);
        },

        /**
         * Generate a relationship based on two existing tables. This method will fail if we are unable to find
         * a field with unique= true on the master table and a field of the same type on the detail table.
         * </p>
         * This relationship also relies on the fact that the app has been fully populated with id's as those are used
         * as reference within the relationship object.
         *
         * @param masterTable
         * @param detailTable
         * @returns {*|{singleRun, autoWatch}}
         */
        generateRelationship: function (masterTable, detailTable) {

            var finalMasterField;
            var finalDetailField;
            var detailField;
            var fieldType;

            //loop over all of the fields in the master table and pick a matching master and detail field
            //start at the end of the list so that we can pick fields that are not recordId
            _.eachRight(masterTable[tableConsts.FIELDS], function(masterField){
                fieldType = masterField[fieldConsts.TYPE];

                if(masterField[fieldConsts[fieldType].UNIQUE]) {
                    detailField = pickDetailField(masterField, detailTable);

                    if (!finalDetailField && detailField) {
                        finalDetailField = detailField;
                        finalMasterField = masterField;
                    }
                }
            });

            if(typeof finalDetailField === 'undefined' || typeof finalMasterField === 'undefined'){
                console.error('Could not find any matching field types in these two tables!');
                throw new Error('Could not find any matching field types in these two tables!' + masterTable, detailTable);
            }

            return this.generateRelationshipWithValues(chance.sentence({words: 5}), masterTable, finalMasterField, detailTable, finalDetailField, chance.bool(), chance.bool());
        },

        /**
         * Leverage the relationship builder to build a relationship with the specified values. This will not check for
         * undefined properties. Caller beware.
         * @param description
         * @param masterTable
         * @param masterField
         * @param detailTable
         * @param detailField
         * @param referentialIntegrity
         * @param cascadeDelete
         * @returns {*|{singleRun, autoWatch}}
         */
        generateRelationshipWithValues: function (description, masterTable, masterField, detailTable, detailField, referentialIntegrity, cascadeDelete) {
            var builderInstance = this.getRelationshipBuilder();
            var masterAppId = masterTable[tableConsts.APP_ID];
            var detailAppId = detailTable[tableConsts.APP_ID];
            var masterTableId = masterTable[tableConsts.ID];
            var detailTableId = detailTable[tableConsts.ID];

            builderInstance.withAppId(masterAppId);
            builderInstance.withDescription(description);
            builderInstance.withMasterAppId(masterAppId);
            builderInstance.withMasterTableId(masterTableId);
            builderInstance.withMasterFieldId(masterField[fieldConsts.ID]);
            builderInstance.withDetailAppId(detailAppId);
            builderInstance.withDetailTableId(detailTableId);
            builderInstance.withDetailFieldId(detailField[fieldConsts.ID]);
            builderInstance.withReferentialIntegrity(referentialIntegrity);
            builderInstance.withCascadeDelete(cascadeDelete);

            return builderInstance.build();
        },

        /**
         * Validate that all properties have been set and are of the correct type. This method will not check that
         * the table or field ids are valid and exist on the app. Caller beware.
         * @param relationship
         * @returns {boolean}
         */
        validateRelationshipProperties : function(relationship){

           var relationshipPropsValid = true;

            if(typeof relationship[relationshipConstants.MASTER_APP_ID] !== 'string'){
                relationshipPropsValid = false;
                console.error('The master appId of the relationship was not a string. Relationship: ' + JSON.stringify(relationship));
            }

            if(typeof relationship[relationshipConstants.MASTER_TABLE_ID] !== 'string'){
                relationshipPropsValid = false;
                console.error('The master tableId of the relationship was not a string. Relationship: ' + JSON.stringify(relationship));
            }

            if(typeof relationship[relationshipConstants.MASTER_FIELD_ID] !== 'number'){
                relationshipPropsValid = false;
                console.error('The master fieldId of the relationship was not a string. Relationship: ' + JSON.stringify(relationship));
            }

            if(typeof relationship[relationshipConstants.DETAIL_APP_ID] !== 'string'){
                relationshipPropsValid = false;
                console.error('The detail appId of the relationship was not a string. Relationship: ' + JSON.stringify(relationship));
            }

            if(typeof relationship[relationshipConstants.DETAIL_TABLE_ID] !== 'string'){
                relationshipPropsValid = false;
                console.error('The detail tableId of the relationship was not a string. Relationship: ' + JSON.stringify(relationship));
            }

            if(typeof relationship[relationshipConstants.DETAIL_FIELD_ID] !== 'number'){
                relationshipPropsValid = false;
                console.error('The detail fieldId of the relationship was not a number. Relationship: ' + JSON.stringify(relationship));
            }

            if(typeof relationship[relationshipConstants.REFERENTIAL_INTEGRITY] !== 'boolean'){
                relationshipPropsValid = false;
                console.error('The referential integrity on the relationship was not a boolean. Relationship: ' + JSON.stringify(relationship));
            }

            if(typeof relationship[relationshipConstants.CASCADE_DELETE] !== 'boolean'){
                relationshipPropsValid = false;
                console.error('The referential integrity on the relationship was not a boolean. Relationship: ' + JSON.stringify(relationship));
            }

            return relationshipPropsValid;
        }

    };

    /**
     * Given a master field chosen for a relationship. Find a corresponding field of the same type in the detail table.
     * This method will return undefined if no field of the correct type exists on the detail table.
     * @param masterField
     * @param detailTable
     * @returns {*}
     */
    function pickDetailField(masterField, detailTable) {
        var fieldType = masterField[fieldConsts.TYPE];

        return _.find(detailTable[tableConsts.FIELDS], function(candidateField){

            return candidateField[fieldConsts.TYPE] === fieldType;
        });
    }
}());