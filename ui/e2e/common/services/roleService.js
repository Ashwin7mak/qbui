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
             * Generate application role with random name and description. Sets the provided role right and access type if provided.
             * @param accessType    role access type
             * @param fieldRights   role field rights
             * @param reportRights  role report rights
             * @param tableRights   role table rights
             * @return  application role with access rights provided
             */
            createAppRole: function(appId, roleName, tableRights, fieldRights, reportRights, accessType) {
                var createAppRoleJSON = {
                    "name": roleName,
                    "description": "This is an app role with access type: " + accessType + " and name: " + roleName,
                    "tableRights": tableRights,
                    "fieldRights": fieldRights,
                    "reportRights": reportRights,
                    "access": accessType,

                };
                var createAppRoleEndpoint = recordBase.apiBase.resolveCreateAppRolesEndpoint(appId);
                return recordBase.apiBase.executeRequest(createAppRoleEndpoint, 'POST', createAppRoleJSON);
            },

            createTableRightsForAppRole: function(appId, roleId, tableId, canAdd, canDelete, viewRight, modifyRight) {
                var tableRightsJSON = {
                    "canAdd": canAdd,
                    "canDelete": canDelete,
                    "canCreateSharedReports": false,
                    "canEditFieldProps": false,
                    "viewRight": viewRight,
                    "modifyRight": modifyRight
                };
                var rolesEndpoint = recordBase.apiBase.resolveAppRoleTableRightsEndpoint(appId, roleId, tableId);
                return recordBase.apiBase.executeRequest(rolesEndpoint, 'POST', tableRightsJSON);
            },

            createFieldRightsForAppRole: function(appId, roleId, tableId, fieldId, modifyAccess, readAccess) {
                var fieldRightsJSON = {
                    "modifyAccess": modifyAccess,
                    "readAccess": readAccess,
                };
                var rolesEndpoint = recordBase.apiBase.resolveAppRoleFieldRightsEndpoint(appId, roleId, tableId, fieldId);
                return recordBase.apiBase.executeRequest(rolesEndpoint, 'POST', fieldRightsJSON);
            },

            buildTableRightsJSON: function(canAdd, canDelete, viewRight, modifyRight) {
                var tableRightsJSON = {
                    "canAdd": canAdd,
                    "canDelete": canDelete,
                    "canCreateSharedReports": false,
                    "canEditFieldProps": false,
                    "viewRight": viewRight,
                    "modifyRight": modifyRight
                };

                return JSON.stringify(tableRightsJSON);
            }

        };
        return roleService;
    };
}());
