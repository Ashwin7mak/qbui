/**
 * relationship.generator.js will generate valid json for a relationship object given a master and detail table id and
 * a master and detail field id
 * Created by cschneider1 on 5/28/15.
 */
(function () {
    var consts = require('../server/api/constants');
    var relationshipConstants = require('./relationship.constants');
    var relationshipBuilder = require('./relationship.builder');
    var tableConsts = require('./table.constants')
    var fieldConsts = require('./field.constants')
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
        generateRelationship: function (masterTable, detailTable) {
            var builderInstance = this.getRelationshipBuilder();
            var masterAppId = masterTable[tableConsts.APP_ID];
            var detailAppId = detailTable[tableConsts.APP_ID];
            var masterTableId = masterTable[tableConsts.ID];
            var detailTableId = detailTable[tableConsts.ID];

            var finalMasterField;
            var finalDetailField;
            var detailField;

            //loop over all of the fields in the master table and pick a matching master and detail field
            //start at the end of the list so that we can pick fields that are not recordId
            _.forEachRight(masterTable[tableConsts.FIELDS], function(masterField){

                detailField = pickDetailField(masterField, detailTable);

                if(!finalDetailField && detailField){
                    finalDetailField = detailField;
                    finalMasterField = masterField;
                }

            });

            if(typeof finalDetailField === 'undefined' || typeof finalMasterField === 'undefined'){
                console.error('Could not find any matching field types in these two tables!');
                throw new Error('Could not find any matching field types in these two tables!' + masterTable, detailTable);
            }

            builderInstance.withMasterAppId(masterAppId);
            builderInstance.withMasterTableId(masterTableId);
            builderInstance.withMasterFieldId(finalMasterField[fieldConsts.fieldKeys.TYPE]);
            builderInstance.withDetailAppId(detailAppId);
            builderInstance.withDetailTableId(detailTableId);
            builderInstance.withDetailFieldId(finalDetailField[fieldConsts.fieldKeys.TYPE]);
            builderInstance.withReferentialIntegrity(chance.bool());
            builderInstance.withCascadeDelete(chance.bool());

            return builderInstance.build();
        }

    };

    function pickDetailField(masterField, detailTable) {
        var fieldType = masterField[fieldConsts.fieldKeys.TYPE];

        var detailField;
        _.forEach(detailTable[tableConsts.FIELDS], function (candidateField) {
            //there is no way to break out of here, so just return quickly if we've found a good field
            if (typeof detailField === 'undefined') {
                return;
            }

            if (candidateField[fieldConsts.fieldKeys.TYPE] === fieldType) {
                detailField = candidateField;
            }
        });

        return detailField;
    }
}());