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
             * Given a list of user with fixed user ID
             */
            generateDefaultUserList: function(userIdList) {

                let users = userGenerator.generatePopulatedDefaultUsers(userIdList);

                return recordBase.apiBase.createBulkUser(users).then(function(result) {
                    var id = JSON.parse(result.body);
                });
            }
        };
        return userService;
    };
}());
