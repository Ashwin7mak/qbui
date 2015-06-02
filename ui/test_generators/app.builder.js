/**
 * app.builder.js allows you to chain together commands to build an app piecemeal
 * Created by cschneider1 on 6/2/15.
 */
(function () {
    var appConstants = require('./app.constants');
    var _ = require('lodash');

    //These are constants common to all fields
    module.exports = {

        builder: function () {
            var appUnderConstruction = {};
            var appTables = [];
            var appRelationships = [];

            return {
                build: function () {
                    appUnderConstruction[appConstants.TABLES] = appTables;
                    appUnderConstruction[appRelationships.RELATIONSHIPS] = appRelationships;
                    return appUnderConstruction;
                },

                cloneIntoBuilder: function (app) {
                    appUnderConstruction[appConstants.ID] = app[appConstants.ID];
                    appUnderConstruction[appConstants.NAME] = app[appConstants.NAME];
                    appUnderConstruction[appConstants.LAST_ACCESSED] = app[appConstants.LAST_ACCESSED];
                    appUnderConstruction[appConstants.DATE_FORMAT] = app[appConstants.DATE_FORMAT];
                    appUnderConstruction[appConstants.TIME_ZONE] = app[appConstants.TIME_ZONE]

                    appTables = _.cloneDeep(app[appConstants.TABLES]);

                    appRelationships = _.cloneDeep(app[appConstants.TABLES]);
                    return this;
                },

                /************************************************************/
                /*                      Field Properties                    */
                /************************************************************/

                withId: function (id) {
                    appUnderConstruction[appConstants.ID] = id;
                    return this;
                },

                withName: function (name) {
                    appUnderConstruction[appConstants.NAME] = name;
                    return this;
                },

                withLastAccessed: function (lastAccessed) {
                    appUnderConstruction[appConstants.LAST_ACCESSED] = lastAccessed;
                    return this;
                },

                withDateFormat: function (dateFormat) {
                    appUnderConstruction[appConstants.DATE_FORMAT] = dateFormat;
                    return this;
                },

                withTimeZone: function (timeZone) {
                    appUnderConstruction[appConstants.TIME_ZONE] = timeZone;
                    return this;
                },

                withTable : function(table){
                    appTables.push(table);
                    return this;
                },

                withAdditionalTables : function(tables){
                    appTables.concat(tables)
                },

                withTables : function(tables){
                    appTables = tables;
                },

                withRelationship : function(relationship){
                    appRelationships.push(relationship);
                    return this;
                },

                withAdditionalRelationships : function(relationships){
                    appTables.concat(relationships)
                },

                withRelationships : function(relationships){
                    appTables = relationships;
                }
            }
        }
    }
}());