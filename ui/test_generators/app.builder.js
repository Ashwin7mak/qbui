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
                    if(appTables.length > 0) {
                        appUnderConstruction[appConstants.TABLES] = appTables;
                    }

                    if(appRelationships.length > 0) {
                        appUnderConstruction[appRelationships.RELATIONSHIPS] = appRelationships;
                    }

                    return appUnderConstruction;
                },

                cloneIntoBuilder: function (app) {
                    if(app[appRelationships.ID]) {
                        appUnderConstruction[appConstants.ID] = app[appConstants.ID];
                    }

                    if(app[appRelationships.NAME]) {

                        appUnderConstruction[appConstants.NAME] = app[appConstants.NAME];
                    }
                    if(app[appRelationships.LAST_ACCESSED]) {

                        appUnderConstruction[appConstants.LAST_ACCESSED] = app[appConstants.LAST_ACCESSED];
                    }

                    if(app[appRelationships.DATE_FORMAT]) {

                        appUnderConstruction[appConstants.DATE_FORMAT] = app[appConstants.DATE_FORMAT];
                    }

                    if(app[appRelationships.TIME_ZONE]) {

                        appUnderConstruction[appConstants.TIME_ZONE] = app[appConstants.TIME_ZONE];
                    }

                    if(app[appRelationships.TABLES]) {
                        appTables = _.cloneDeep(app[appConstants.TABLES]);
                    }

                    if(app[appRelationships.RELATIONSHIPS]) {
                        appRelationships = _.cloneDeep(app[appConstants.RELATIONSHIPS]);
                    }

                    return this;
                },

                /************************************************************/
                /*                      App Properties                      */
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
                    return this;
                },

                withTables : function(tables){
                    appTables = tables;
                    return this;
                },

                withRelationship : function(relationship){
                    appRelationships.push(relationship);
                    return this;
                },

                withAdditionalRelationships : function(relationships){
                    appTables.concat(relationships);
                    return this;
                },

                withRelationships : function(relationships){
                    appTables = relationships;
                    return this;
                }
            }
        }
    }
}());