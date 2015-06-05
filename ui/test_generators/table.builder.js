/**
 * Here are all of the functions useful in building a field.
 * They are structured using the builder pattern
 * Created by cschneider1 on 5/31/15.
 */
(function() {
    var consts = require('../server/api/constants');
    var tableConsts = require('./table.constants');

    //These are constants common to all fields
    module.exports = {

        builder : function(){
            var tableUnderConstruction = {};
            var tableFields = [];
            return {
                build : function() {
                    if(tableFields.length > 0) {
                        tableUnderConstruction[tableConsts.FIELDS] = tableFields;
                    }
                    return tableUnderConstruction;
                },

                cloneIntoBuilder: function (table) {
                    if(table[tableConsts.ID]) {
                        tableUnderConstruction[tableConsts.ID] = table[tableConsts.ID];
                    }

                    if(table[tableConsts.NAME]) {
                        tableUnderConstruction[tableConsts.NAME] = table[tableConsts.NAME];
                    }

                    if(table[tableConsts.APP_ID]) {
                        tableUnderConstruction[tableConsts.APP_ID] = table[tableConsts.APP_ID];
                    }

                    if(table[tableConsts.TABLE_ALIAS]) {
                        tableUnderConstruction[tableConsts.TABLE_ALIAS] = table[tableConsts.TABLE_ALIAS];
                    }

                    tableFields = _.cloneDeep(table[tableConsts.FIELDS]);

                    return this;
                },

                withId : function(id){
                    tableUnderConstruction[tableConsts.ID] = id;
                },

                withAppId : function(appId){
                    tableUnderConstruction[tableConsts.APP_ID] = appId;
                },

                withName : function(name){
                    tableUnderConstruction[tableConsts.NAME] = name;
                },

                withTableAlias : function(alias){
                    tableUnderConstruction[tableConsts.TABLE_ALIAS] = alias;
                },

                withField : function(field){
                    tableFields.push(field);
                    return this;
                },

                withAdditionalFields : function(fields){
                    tableFields.concat(fields)
                },

                withFields : function(fields){
                    tableFields = fields;
                }

            };
        }

    };

}());