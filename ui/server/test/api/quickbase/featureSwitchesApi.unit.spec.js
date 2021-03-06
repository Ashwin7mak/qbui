'use strict';

let config = {legacyBase: '.legacyBase', javaHost: 'http://javaHost', SSL_KEY: {private: 'privateKey', cert: 'cert', requireCert: true}};
let sinon = require('sinon');
let assert = require('assert');
let requestHelper = require('./../../../src/api/quickbase/requestHelper')(config);
let routeHelper = require('../../../src/routes/routeHelper');
let featureSwitchesApi = require('../../../src/api/quickbase/featureSwitchesApi')(config, false);
let constants = require('../../../../common/src/constants');

/**
 * Unit tests for feature switches apis
 */
describe("Validate featureSwitchesApi", function() {
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

    beforeEach(function() {
        executeReqStub = sinon.stub(requestHelper, "executeRequest");
        featureSwitchesApi.setRequestHelperObject(requestHelper);
        req.url = '/featureSwitches';
        req.method = 'get';
    });

    afterEach(function() {
        req.method = 'get';
        req.url = '';
        executeReqStub.restore();
    });

    describe("validate getFeatureSwitchStates function", function() {

        it('success return results ', function(done) {
            executeReqStub.returns(Promise.resolve({'body': '[]'}));
            let promise = featureSwitchesApi.getFeatureSwitchStates(req, false);

            promise.then(
                function(response) {
                    assert.deepEqual(response, []);
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

    describe("validate getFeatureSwitches function", function() {

        it('success return results ', function(done) {
            executeReqStub.returns(Promise.resolve({'body': '[]'}));
            let promise = featureSwitchesApi.getFeatureSwitches(req, false);

            promise.then(
                function(response) {
                    assert.deepEqual(response, []);
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return when testing getFeatureSwitches success"));
                }
            ).catch(function(errorMsg) {
                done(new Error('getFeatureSwitches: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });
        it('fail return results ', function(done) {
            executeReqStub.returns(Promise.reject(new Error(error_message)));
            let promise = featureSwitchesApi.getFeatureSwitches(req, false);

            promise.then(
                function(response) {
                    done(new Error("Unexpected success promise return when testing getFeatureSwitches success"));
                },
                function(error) {
                    assert.equal(error, "Error: fail unit test case execution");
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('getFeatureSwitches: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });
    });

    describe("when createFeatureSwitch is called", function() {
        it('success return results ', function(done) {
            req.url = '/featureSwitches';
            req.body = {name: 'feature'};
            let targetObject = {'body': '{"id":1,"name":"feature"}'};
            executeReqStub.returns(Promise.resolve(targetObject));
            let promise = featureSwitchesApi.createFeatureSwitch(req);

            promise.then(
                function(feature) {
                    assert.deepEqual(feature.name, req.body.name);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('getFeatureSwitches: exception processing create test: ' + JSON.stringify(errorMsg)));
            });
        });
    });
    describe("when updateFeatureSwitch is called", function() {
        it('success return results ', function(done) {
            req.url = '/featureSwitches';
            req.body = {id:'id', name:'testFeature'};
            let targetObject = null;
            executeReqStub.returns(Promise.resolve(targetObject));
            let promise = featureSwitchesApi.updateFeatureSwitch(req, "id");

            promise.then(
                function(response) {
                    assert.deepEqual(response, targetObject);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('updateFeatureSwitch: exception processing update test: ' + JSON.stringify(errorMsg)));
            });
        });
    });

    describe("when deleteFeatureSwitches is called", function() {
        it('success return results ', function(done) {
            req.url = '/featureSwitches/bulk';
            req.body = {features: [{id:'id1'}, {id: 'id2'}]};
            let targetObject = null;
            executeReqStub.returns(Promise.resolve(targetObject));
            let promise = featureSwitchesApi.deleteFeatureSwitches(req);

            promise.then(
                function(response) {
                    assert.deepEqual(response, targetObject);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('getFeatureSwitches: exception processing delete test: ' + JSON.stringify(errorMsg)));
            });
        });
    });

    describe("when createFeatureSwitchOverride is called", function() {
        it('success return results ', function(done) {
            req.url = '/featureSwitches/id';
            req.body = {name:'testFeature'};
            let targetObject = {'body': '{"id":"id"}'};
            executeReqStub.returns(Promise.resolve(targetObject));
            let promise = featureSwitchesApi.createFeatureSwitchOverride(req, 'id');

            promise.then(
                function(response) {
                    assert.deepEqual(response, {id:'id'});
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('getFeatureSwitches: exception processing create override test: ' + JSON.stringify(errorMsg)));
            });
        });
    });

    describe("when updateFeatureSwitchOverride is called", function() {
        it('success return results ', function(done) {
            req.url = '/featureSwitches/id';
            req.body = {id:'id', name:'testFeature'};
            let targetObject = null;
            executeReqStub.returns(Promise.resolve(targetObject));
            let promise = featureSwitchesApi.updateFeatureSwitchOverride(req, "id");

            promise.then(
                function(response) {
                    assert.deepEqual(response, targetObject);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('getFeatureSwitches: exception processing update override test: ' + JSON.stringify(errorMsg)));
            });
        });
    });

    describe("when deleteFeatureSwitchOverrides is called", function() {
        it('success return results ', function(done) {
            req.url = '/featureSwitches/id/bulk';
            req.body = {overrides: [{id:'id1'}, {id: 'id2'}]};
            let targetObject = null;
            executeReqStub.returns(Promise.resolve(targetObject));
            let promise = featureSwitchesApi.deleteFeatureSwitchOverrides(req, ["a", "b", "c"]);

            promise.then(
                function(response) {
                    assert.deepEqual(response, targetObject);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('deleteFeatureSwitchOverrides: exception processing delete overrides test: ' + JSON.stringify(errorMsg)));
            });
        });
    });
});
