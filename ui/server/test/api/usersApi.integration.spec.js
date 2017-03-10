(function() {
    'use strict';
    var assert = require('assert');
    require('../../src/app');
    var config = require('../../src/config/environment');
    var apiBase = require('./api.base')(config);
    var recordBase = require('./recordApi.base')(config);
    var consts = require('../../../common/src/constants');
    var testConsts = require('./api.test.constants');
    var promise = require('bluebird');
    var ADMIN_USER_ID = "10000";

    /**
     * Integration test for user apis
     */
    describe('User api test cases', function() {

        before(function(done) {
            this.timeout(consts.INTEGRATION_TIMEOUT);
            apiBase.initialize().then(function() {
                done();
            });
        });


        it('Test getReqUser returns false for a new user', function(done) {
            apiBase.createUserAuthentication(ADMIN_USER_ID).then(function() {
                apiBase.createUser().then(function(userResponse) {
                    var user = JSON.parse(userResponse.body);
                    var userId = user.id;
                    apiBase.createUserAuthentication(userId).then(function() {
                        var getReqUserEndpoint = apiBase.resolveGetReqUserEndpoint();
                        apiBase.executeRequest(getReqUserEndpoint, consts.GET).then(function(result) {
                            assert.equal(JSON.parse(result.body).id, user.id);
                            done();
                        });
                    });
                });
            });
        });
        it('Test isReqUserAdmin returns true for administrator user', function(done) {
            apiBase.createUserAuthentication(ADMIN_USER_ID).then(function(response) {
                var getReqUserEndpoint = apiBase.resolveGetReqUserEndpoint();
                apiBase.executeRequest(getReqUserEndpoint, consts.GET).then(function(result) {
                    assert.equal(JSON.parse(result.body).id, ADMIN_USER_ID);
                    done();
                });
            });
        });

        //Cleanup the test realm after all tests in the block
        after(function(done) {
            //Realm deletion takes time, bump the timeout
            this.timeout(testConsts.INTEGRATION_TIMEOUT);
            recordBase.apiBase.cleanup().then(function() {
                done();
            });
        });
    });
}());
