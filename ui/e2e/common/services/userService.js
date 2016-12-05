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

            /**
             * Given an app, generate a list of users with fixed user ID
             */
            generateDefaultUserList: function(appId) {
                const userIdList = [1000001, 1000002, 1000003, 1000004, 1000005];

                let users = userGenerator.generatePopulatedDefaultUsers(userIdList);

                recordBase.apiBase.createBulkUser(users);
            }
        };
        return userService;
    };
}());
