/**
 * User service module which contains methods for generating form JSON objects and interacting with the Node server layer
 * Created by xhe on Nov. 28, 2016.
 */
(function() {
    'use strict';
    //Bluebird Promise library
    var promise = require('bluebird');
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

            generateDefaultUserList: function(appId) {
                let userIdList = [];
                let users = userGenerator.generateDefaultAdminUsers();

                users.forEach(user => {
                    recordBase.apiBase.createSpecificUser(user).then(function(userResponse) {
                        let userId = JSON.parse(userResponse.body).id;
                        userIdList.push(userId);

                        recordBase.apiBase.assignUsersToAppRole(appId, "12", [userId]).then(function(result) {
                            console.log("User " + userId + " has been associated with role 12" + result.body);
                        });
                    });
                });

                return userIdList;
            }
        };
        return userService;
    };
}());
