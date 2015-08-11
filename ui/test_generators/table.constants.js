/**
 * field.constants.js holds all constants associated with field types throughout the entire hierarchy
 * divided by hierarchy
 * Created by cschneider1 on 5/29/15.
 */
(function() {
    var consts = require('../server/api/constants');

    //These are constants common to all fields
    module.exports = Object.freeze({

        /******************************************************************/
        /*                  TABLE JSON KEYS                               */
        /******************************************************************/
        ID         : 'id',
        APP_ID     : 'appId',
        NAME       : 'name',
        TABLE_ALIAS: 'tableAlias',
        FIELDS     : 'fields'
    });

}());
