/**
 * relationship.builder.js allows you to chain together commands to build a relationship piecemeal
 * Created by cschneider1 on 6/2/15.
 */
(function () {
    var relationshipConstants = require('./relationship.constants');
    var _ = require('lodash');

    //These are constants common to all relationships
    module.exports = {

        builder: function () {
            var relationshipUnderConstruction = {};

            return {
                build: function () {
                    return relationshipUnderConstruction;
                },

                cloneIntoBuilder: function (relationship) {
                    relationshipUnderConstruction[relationshipConstants.ID] = relationship[relationshipConstants.ID];
                    relationshipUnderConstruction[relationshipConstants.APP_ID] = relationship[relationshipConstants.APP_ID];
                    relationshipUnderConstruction[relationshipConstants.DESCRIPTION] = relationship[relationshipConstants.DESCRIPTION];
                    relationshipUnderConstruction[relationshipConstants.MASTER_APP_ID] = relationship[relationshipConstants.MASTER_APP_ID];
                    relationshipUnderConstruction[relationshipConstants.MASTER_TABLE_ID] = relationship[relationshipConstants.MASTER_TABLE_ID]
                    relationshipUnderConstruction[relationshipConstants.MASTER_FIELD_ID] = relationship[relationshipConstants.MASTER_FIELD_ID]
                    relationshipUnderConstruction[relationshipConstants.DETAIL_APP_ID] = relationship[relationshipConstants.DETAIL_APP_ID]
                    relationshipUnderConstruction[relationshipConstants.DETAIL_TABLE_ID] = relationship[relationshipConstants.DETAIL_TABLE_ID]
                    relationshipUnderConstruction[relationshipConstants.DETAIL_FIELD_ID] = relationship[relationshipConstants.DETAIL_FIELD_ID]
                    relationshipUnderConstruction[relationshipConstants.REFERENTIAL_INTEGRITY] = relationship[relationshipConstants.REFERENTIAL_INTEGRITY]
                    relationshipUnderConstruction[relationshipConstants.CASCADE_DELETE] = relationship[relationshipConstants.CASCADE_DELETE]

                    return this;
                },

                /************************************************************/
                /*                  Relationship Properties                 */
                /************************************************************/

                withId: function (id) {
                    relationshipUnderConstruction[relationshipConstants.ID] = id;
                    return this;
                },

                withAppId: function (appId) {
                    relationshipUnderConstruction[relationshipConstants.APP_ID] = appId;
                    return this;
                },

                withDescription: function (description) {
                    relationshipUnderConstruction[relationshipConstants.DESCRIPTION] = description;
                    return this;
                },

                withMasterAppId: function (masterAppId) {
                    relationshipUnderConstruction[relationshipConstants.MASTER_APP_ID] = masterAppId;
                    return this;
                },

                withMasterTableId: function (masterTableId) {
                    relationshipUnderConstruction[relationshipConstants.MASTER_TABLE_ID] = masterTableId;
                    return this;
                },

                withMasterFieldId : function(masterFieldId){
                    relationshipUnderConstruction[relationshipConstants.MASTER_FIELD_ID] = masterFieldId;
                    return this;
                },

                withDetailAppId : function(detailAppId){
                    relationshipUnderConstruction[relationshipConstants.DETAIL_APP_ID] = detailAppId;
                    return this;
                },

                withDetailTableId : function(detailTableId){
                    relationshipUnderConstruction[relationshipConstants.DETAIL_TABLE_ID] = detailTableId;
                    return this;
                },

                withDetailFieldId : function(detailFieldId){
                    relationshipUnderConstruction[relationshipConstants.REFERENTIAL_INTEGRITY] = referentialIntegrity;
                    return this;
                },

                withReferentialIntegrity : function(referentialIntegrity){
                    relationshipUnderConstruction[relationshipConstants.REFERENTIAL_INTEGRITY] = referentialIntegrity;
                    return this;
                },

                withCascadeDelete : function(cascadeDelete){
                    relationshipUnderConstruction[relationshipConstants.CASCADE_DELETE] = cascadeDelete;
                    return this;
                }

            }
        }
    }
}());