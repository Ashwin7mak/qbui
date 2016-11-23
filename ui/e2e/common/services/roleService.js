(function() {
    'use strict';
    //Bluebird Promise library
    var promise = require('bluebird');
    //Node.js assert library
    var assert = require('assert');
    //App generator module
    var appGenerator = require('../../../test_generators/app.generator.js');
    module.exports = function(recordBase) {
        var roleService = {
            /**
             * Update FieldRights to an application role. Modifies the read and modify access of the fields in a table
             * @param appId
             * @param roleId
             * @param tableId
             * @param fieldId
             * @param modifyAccess (set to true or false)
             * @param readAccess (set to true or false)
             */
            createFieldRightsForAppRole: function(appId, roleId, tableId, fieldId, modifyAccess, readAccess) {
                var fieldRightsJSON = {
                    "modifyAccess": Boolean(modifyAccess),
                    "readAccess": Boolean(readAccess)
                };
                var rolesEndpoint = recordBase.apiBase.resolveAppRoleFieldRightsEndpoint(appId, roleId, tableId, fieldId);
                return recordBase.apiBase.executeRequest(rolesEndpoint, 'POST', fieldRightsJSON);
            },

            /**
             * Function that creates JSON for roleId reportId map for custdefaulthomepage POST
             */
            createRoleReportMapJSON: function(roleId, report_Id) {
                var jsonStr = '{"' + roleId + '":"' + report_Id + '"}';
                return JSON.parse(jsonStr);
            },

        };
        return roleService;
    };
}());
