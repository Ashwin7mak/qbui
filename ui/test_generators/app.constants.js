/**
 * app.constants.js holds all constants associated with the app object
 * Created by cschneider1 on 5/29/15.
 */
(function() {
    module.exports = {
        APP_ID_LENGTH : 10,
        APP_NAME_LENGTH : 14,
        DATE_FORMATS : ['MM-dd-uu', 'MM-dd-uuuu', 'dd-MM-uuuu', 'dd-MM-uu', 'uuuu-MM-dd' ],
        //JSON CONSTANTS
        ID : 'id',
        NAME : 'name',
        LAST_ACCESSED : 'lastAccessed',
        DATE_FORMAT : 'dateFormat',
        TIME_ZONE : 'timeZone',
        TABLES : 'tables',
        RELATIONSHIPS : 'relationships'
    }

}());
