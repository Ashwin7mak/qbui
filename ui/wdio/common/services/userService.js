/**
 * User service module which contains methods for generating form JSON objects and interacting with the Node server layer
 * Created by xhe on Nov. 28, 2016.
 */
(function() {
    'use strict';
    var userGenerator = require('../../../test_generators/user.generator.js');
    module.exports = function(recordBase) {
        var userService = {
            /**
             * Create a user JSON data by using the pass-in parameter options
             */
            generateSingleUser: function(options) {
                let user = userGenerator.generatePopulatedUser(options);
                return user;
            },
            addDefaultUserListToApp: function(appId) {
                let userIdList = [];
                let users = userGenerator.generateDefaultAdminUsers();

                users.forEach(user => {
                    recordBase.apiBase.createSpecificUser(user).then(function(userResponse) {
                        let userId = JSON.parse(userResponse.body).id;
                        if (userId) {
                            userIdList.push(userId);
                            recordBase.apiBase.assignUsersToAppRole(appId, e2eConsts.DEFAULT_ADMIN_ROLE, [userId]).then(function(result) {
                                //console.log("User " + userId + " has been associated with admin role " + result.body);
                            });
                        }
                    });
                });

                return userIdList;
            }
        };
        return userService;
    };
}());
