(function() {
    'use strict';
    var assert = require('assert');
    require('../../src/app');
    var config = require('../../src/config/environment');
    var log = require('../../src/logger').getLogger();
    var recordBase = require('./recordApi.base')(config);
    var consts = require('../../../common/src/constants');
    var testConsts = require('./api.test.constants');
    var errorCodes = require('../../src/api/errorCodes');

    describe('Validate FeatureSwitchApi integration tests', function() {
        // Set timeout for all tests in the spec file
        this.timeout(testConsts.INTEGRATION_TIMEOUT);


        // Cleanup the test realm after all tests in the block
        after(function(done) {
            //Realm deletion takes time, bump the timeout
            this.timeout(testConsts.INTEGRATION_TIMEOUT);
            recordBase.apiBase.cleanup().then(function() {
                done();
            });
        });

        it('Verify API call POST featureSwitch', function(done) {
            var awsEndpoint = recordBase.apiBase.resolveFeatureSwitchEndpoint();
            var JSON = {
                id: 1,
                name: 'Feature A',
                team: 'Cthulu',
                description: 'Demo feature switch',
                defaultOn: true,
                overrides: []
            };
            //Create a feature Switch
            recordBase.apiBase.executeAWSRequest(awsEndpoint, consts.POST, JSON).then(function(requestResult) {
                assert.equal(requestResult.statusCode, 200);
                var featureSwitchId = requestResult.body;
                console.log("feature switch id is: " + featureSwitchId);
                done();
            }).catch(function(error) {
                log.error(JSON.stringify(error));
                done();
            });

        });


    });

}());
