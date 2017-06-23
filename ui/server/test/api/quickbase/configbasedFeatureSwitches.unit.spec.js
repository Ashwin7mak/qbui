var assert = require('assert');
var sinon = require('sinon');
let config = {featureSwitchConfigOverride: 'someFile.json'};
const configBasedFSApi = require('../../../src/api/quickbase/configBasedFeatureSwitches')(config);

let constants = require('../../../../common/src/constants');

/**
 * Unit tests for configuration based feature switch api to get feature switch status
 */
describe("Validate configuration based featureSwitch Api", function() {
    let error_message = "fail unit test case execution";
    let req = {
        headers: {
            'Content-Type': 'content-type',
            'host': 'subdomain.domain.com:9000'
        },
        'url': '',
        'method': '',
        params: {
        },
        param: function(key) {
            if (key === 'format') {
                return 'raw';
            } else {
                throw new Error("Unexpected key", key);
            }
        }
    };
    let executeReqStub = null;

    let masterData = [
        {
            "name": "Feature C",
            "defaultOn": false,
            "description": "description",
            "RealmsOveride":[
                {
                    "realmId": "1234567",
                    "overrideStateOn": true
                },
                {
                    "realmId": "987654",
                    "overrideStateOn": true
                }
            ]
        },
        {
            "name": "Feature D",
            "defaultOn": true,
            "description": "description"
        },
        {
            "name": "Feature A",
            "defaultOn": true,
            "description": "description",
            "RealmsOveride":[
                {
                    "realmId": "1234567",
                    "overrideStateOn": false
                },
                {
                    "realmId": "987654",
                    "overrideStateOn": false
                }
            ]
        }
    ];

    let overRideData = [
        {
            "name": "Feature A",
            "defaultOn": true,
            "description": "description"
        },
        {
            "name": "Feature C",
            "defaultOn": true,
            "RealmsOveride":[
                {
                    "realmId": "1234567",
                    "overrideStateOn": false
                }
            ]
        },
        {
            "name": "Feature E",
            "defaultOn": true,
            "RealmsOveride":[
                {
                    "realmId": "1234567",
                    "overrideStateOn": false
                }
            ]
        }
    ];

    let loadConfigFileStub = null;

    beforeEach(function() {
        loadConfigFileStub = sinon.stub(configBasedFSApi, "loadConfigFile");
        loadConfigFileStub.onCall(0).returns(Promise.resolve(masterData));

        loadConfigFileStub.withArgs('someFile.json').onCall(0).returns(Promise.resolve([]));

    });

    afterEach(function() {
        loadConfigFileStub.restore();
    });

    describe("validate getFeatureSwitchStates function without env specific override - with and without realmOverride defined", function() {

        it('success return results ', function(done) {

            let promise = configBasedFSApi.getFeatureSwitchStates(req, '1234567');
            let switchesResponseData = [
                {"name":"Feature C", "status":true},
                {"name":"Feature D", "status":true},
                {"name":"Feature A", "status":false}
            ];
            promise.then(
                function(response) {
                    assert.deepEqual(response, switchesResponseData);
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return when testing getFeatureSwitchStates success"));
                }
            ).catch(function(errorMsg) {
                done(new Error('getFeatureSwitchStates: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });
    });


    describe("validate getFeatureSwitchStates function env specific override", function() {

        it('success return results ', function(done) {

            loadConfigFileStub.onCall(0).returns(Promise.resolve(masterData));
            loadConfigFileStub.withArgs('someFile.json').onCall(0).returns(Promise.resolve(overRideData));

            let promise = configBasedFSApi.getFeatureSwitchStates(req, '1234567');
            let switchesResponseData = [
                {"name":"Feature C", "status":false},
                {"name":"Feature D", "status":true},
                {"name":"Feature A", "status":true},
                {"name":"Feature E", "status":false}
            ];
            promise.then(
                function(response) {
                    assert.deepEqual(response, switchesResponseData);
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return when testing getFeatureSwitchStates success"));
                }
            ).catch(function(errorMsg) {
                done(new Error('getFeatureSwitchStates: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });
    });

    describe("Negative - expect failure when unable to read master json file ", function() {

        it('success return results ', function(done) {

            loadConfigFileStub.onCall(0).returns(Promise.reject(new Error(" invalid JSON")));

            let promise = configBasedFSApi.getFeatureSwitchStates(req, '1234567');
            let errorMessage = 'Could not read master feature switch configuration file due to: Error:  invalid JSON';
            promise.then(
                function(response) {
                    done(new Error("Unexpected success promise return when testing getFeatureSwitchStates - negative invalid master JSON "));
                },
                function(error) {
                    assert.deepEqual(error, errorMessage);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('getFeatureSwitchStates: exception processing  - negative invalid master JSON ' + JSON.stringify(errorMsg)));
            });
        });
    });

    describe("Negative  - expect failure when override file is configured but unable to read", function() {

        it('success return results ', function(done) {
            loadConfigFileStub.onCall(0).returns(Promise.resolve(masterData));
            loadConfigFileStub.withArgs('someFile.json').onCall(0).returns(Promise.reject(new Error(" invalid JSON")));

            let promise = configBasedFSApi.getFeatureSwitchStates(req, '1234567');
            let errorMessage = 'Could not read override feature switch configuration file due to: Error:  invalid JSON';
            promise.then(
                function(response) {
                    done(new Error("Unexpected success promise return when testing getFeatureSwitchStates - negative invalid override JSON "));
                },
                function(error) {
                    assert.deepEqual(error, errorMessage);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('getFeatureSwitchStates: exception processing  - negative invalid override JSON ' + JSON.stringify(errorMsg)));
            });
        });
    });

    describe("Negative  - expect failure when override file is configured but file name is null", function() {

        it('success return results ', function(done) {
            let configNew = {featureSwitchConfigOverride: '', masterOverrideTurnFeaturesOn:true};
            const configBasedFSApiNew = require('../../../src/api/quickbase/configBasedFeatureSwitches')(configNew);
            loadConfigFileStub = sinon.stub(configBasedFSApiNew, "loadConfigFile");

            loadConfigFileStub.onCall(0).returns(Promise.resolve(masterData));

            let promise = configBasedFSApi.getFeatureSwitchStates(req, '1234567');
            let errorMessage = 'Could not read override feature switch configuration file due to: Error:  invalid JSON';
            promise.then(
                function(response) {
                    done(new Error("Unexpected success promise return when testing getFeatureSwitchStates - negative invalid override JSON "));
                },
                function(error) {
                    assert.deepEqual(error, errorMessage);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('getFeatureSwitchStates: exception processing  - negative invalid override JSON ' + JSON.stringify(errorMsg)));
            });
        });
    });

    describe("validate getFeatureSwitchStates function - master override", function() {

        it('success return results ', function(done) {
            let configNew = {featureSwitchConfigOverride: 'someFile.json', masterOverrideTurnFeaturesOn:true};
            const configBasedFSApiNew = require('../../../src/api/quickbase/configBasedFeatureSwitches')(configNew);
            loadConfigFileStub = sinon.stub(configBasedFSApiNew, "loadConfigFile");

            loadConfigFileStub.onCall(0).returns(Promise.resolve(masterData));
            loadConfigFileStub.withArgs('someFile.json').onCall(0).returns(Promise.resolve(overRideData));

            let promise = configBasedFSApiNew.getFeatureSwitchStates(req, '1234567');
            let switchesResponseData = [
                {"name":"Feature C", "status":true},
                {"name":"Feature D", "status":true},
                {"name":"Feature A", "status":true},
                {"name":"Feature E", "status":true}
            ];
            promise.then(
                function(response) {
                    assert.deepEqual(response, switchesResponseData);
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return when testing getFeatureSwitchStates success"));
                }
            ).catch(function(errorMsg) {
                done(new Error('getFeatureSwitchStates: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });
    });
});



