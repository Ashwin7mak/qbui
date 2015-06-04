/**
 * relationship.generator.js will generate valid json for a relationship object given a master and detail table id and
 * a master and detail field id
 * Created by cschneider1 on 5/28/15.
 */
(function () {
    var relationshipConstants = require('./relationship.constants');
    var relationshipBuilder = require('./relationship.builder');
    var tableConsts = require('./table.constants')
    var fieldConsts = require('./field.constants')
    var appConsts = require('./app.constants')
    var rawValueGenerator = require('./rawValue.generator');
    var Chance = require('chance');
    var chance = new Chance();
    var _ = require('lodash');


    module.exports = {

        getRelationshipBuilder: function () {
            var builderInstance = relationshipBuilder.builder();
            return builderInstance;
        },


        relationshipToJsonString: function (relationship) {
            return JSON.stringify(relationship);
        },

        /**
         * Generate an app object with a specified number of tables. Fields on those tables will be generated at random
         * @param numTables
         * @returns {*|{singleRun, autoWatch}} the app object
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
         * Generate an app object with a specified number of tables. Fields on those tables will be generated at random
         * @param numTables
         * @returns {*|{singleRun, autoWatch}} the app object
         */
        generateRelationship: function (masterTable, detailTable) {

            var finalMasterField;
            var finalDetailField;
            var detailField;

            //loop over all of the fields in the master table and pick a matching master and detail field
            //start at the end of the list so that we can pick fields that are not recordId
            _.eachRight(masterTable[tableConsts.FIELDS], function(masterField){
                if(masterField[fieldConsts.scalarFieldKeys.UNIQUE]) {
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
         * Generate an app object with a specified number of tables. Fields on those tables will be generated at random
         * @param numTables
         * @returns {*|{singleRun, autoWatch}} the app object
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
            builderInstance.withMasterFieldId(masterField[fieldConsts.fieldKeys.ID]);
            builderInstance.withDetailAppId(detailAppId);
            builderInstance.withDetailTableId(detailTableId);
            builderInstance.withDetailFieldId(detailField[fieldConsts.fieldKeys.ID]);
            builderInstance.withReferentialIntegrity(referentialIntegrity);
            builderInstance.withCascadeDelete(cascadeDelete);

            return builderInstance.build();
        },

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

    function pickDetailField(masterField, detailTable) {
        var fieldType = masterField[fieldConsts.fieldKeys.TYPE];

        var detailField;
        _.forEach(detailTable[tableConsts.FIELDS], function (candidateField) {
            //there is no way to break out of here, so just return quickly if we've found a good field
            if (typeof detailField !== 'undefined') {
                return;
            }

            if (candidateField[fieldConsts.fieldKeys.TYPE] === fieldType) {
                detailField = candidateField;
            }
        });

        return detailField;
    }
}());