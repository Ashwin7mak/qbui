'use strict';

let config = {
    javaHost: 'http://javaHost',
    eeHost: 'http://eeHost',
    eeHostEnable: false,
    SSL_KEY : {
        private    : 'privateKey',
        cert       : 'cert',
        requireCert: true
    }
};
let sinon = require('sinon');
let assert = require('assert');
let requestHelper = require('./../../../src/api/quickbase/requestHelper')(config);
let formsApi = require('../../../src/api/quickbase/formsApi')(config);
let recordsApi = require('../../../src/api/quickbase/recordsApi')(config);
let appsApi = require('../../../src/api/quickbase/appsApi')(config);
let errorCodes = require('../../../src/api/errorCodes');
let errorStatus = 403;

/**
 * Unit tests for report apis
 */
describe('Validate FormsApi unit tests', function() {
    let req = {
        headers: {
            'Content-Type': 'content-type'
        },
        'url': '',
        'method': 'get',
        params: {},
        param : function(key) {
            if (key === 'format') {
                return 'raw';
            } else {
                throw new Error("Unexpected key", key);
            }
        }
    };

    /**
     * Unit test fetch form meta data api
     */
    describe('validate fetchFormMetaData api', function() {

        let executeReqStub;
        // let getHydratedAppStub;
        let getRelationshipForAppStub;
        let getTablesForAppStub;
        beforeEach(function() {
            executeReqStub = sinon.stub(requestHelper, "executeRequest");
            formsApi.setRequestHelperObject(requestHelper);
            // getHydratedAppStub = sinon.stub(appsApi, "getHydratedApp");
            getRelationshipForAppStub = sinon.stub(appsApi, "getRelationshipsForApp");
            getTablesForAppStub = sinon.stub(appsApi, "getTablesForApp");
            formsApi.setAppsApiObject(appsApi);
        });

        afterEach(function() {
            executeReqStub.restore();
            // getHydratedAppStub.restore();
            getRelationshipForAppStub.restore();
            getTablesForAppStub.restore();
        });

        it('success return results ', function(done) {
            req.url = '/apps/123/tables/456?format=display';

            let targetObject = {formMeta:{id:1}};
            executeReqStub.returns(Promise.resolve({body: JSON.stringify(targetObject)}));
            // getHydratedAppStub.returns(Promise.resolve({body: '[{"appId":1}]'}));

            let promise = formsApi.fetchFormMetaData(req);

            promise.then(
                function(response) {
                    assert.deepEqual(response, targetObject);
                    done();
                },
                function(error) {
                    assert.fail('fail', 'success', 'fail response returned when success expected');
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve fetchFormMetaData success test: ' + JSON.stringify(errorMsg)));
            });

        });

        it('the correct rest endpoint is used (EE/Core) ', function(done) {
            req.url = '/apps/123/tables/456?format=display';

            let getRequestEeHostEnableStub = sinon.stub(requestHelper, "getRequestEeHostEnable");

            let getRequestEeHostSpy = sinon.spy(requestHelper, "getRequestEeHost");
            let getRequestJavaHostSpy = sinon.spy(requestHelper, "getRequestJavaHost");
            formsApi.setRequestHelperObject(requestHelper);

            let targetObject = '"[formMeta: {id:1}]"';
            executeReqStub.returns(Promise.resolve({body: targetObject}));
            // getHydratedAppStub.returns(Promise.resolve({body: '[{"appId":1}]'}));


            [true, false].forEach(eeEnableFlag => {
                getRequestEeHostEnableStub.returns(eeEnableFlag);

                let promise = formsApi.fetchFormMetaData(req);

                promise.then(
                    function(response) {
                        assert.deepEqual(response, "[formMeta: {id:1}]");
                        if (eeEnableFlag) {
                            assert(getRequestEeHostSpy.called);
                        } else {
                            assert(getRequestJavaHostSpy.called);
                        }
                    },
                    function(error) {
                        assert.fail('fail', 'success', 'fail response returned when success expected');

                    }
                );
            });


            done();
        });

        it('fail return results ', function(done) {
            req.url = '/apps/123/tables/456';
            let error_message = "fail unit test case execution";

            executeReqStub.returns(Promise.reject(new Error(error_message)));
            let promise = formsApi.fetchFormMetaData(req);

            promise.then(
                function(error) {
                    assert.fail('success', 'fail', 'success response returned when failure expected');
                    done();
                },
                function(error) {
                    //  just verify that the promise rejected; which error message is returned is insignificant
                    assert.ok(error);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve fetchFormMetaData failure test: ' + JSON.stringify(errorMsg)));
            });

        });

    });

    /**
     * Unit test for fetchRelationshipsForForm API
     */
    describe('validate fetchRelationshipsForForm api', function() {
        let executeReqStub;
        let getRelationshipForAppStub;

        beforeEach(function() {
            executeReqStub = sinon.stub(requestHelper, "executeRequest");
            formsApi.setRequestHelperObject(requestHelper);
            getRelationshipForAppStub = sinon.stub(appsApi, "getRelationshipsForApp");
        });

        afterEach(function() {
            executeReqStub.restore();
            getRelationshipForAppStub.restore();
        });

        it('success return results', function(done) {
            req.url = '/apps/123/tables/456?format=display';
            formsApi.setRequestHelperObject(requestHelper);

            let formMetaTarget = {id:1};
            let relationshipsTarget = [{id:1}, {id:2}];
            let responseObject = {id:1, relationships:[{id:1}, {id:2}]};

            executeReqStub.returns(Promise.resolve({body: JSON.stringify(formMetaTarget)}));
            getRelationshipForAppStub.returns(Promise.resolve(relationshipsTarget));

            let promise = formsApi.fetchRelationshipsForForm(req);

            promise.then(
                function(response) {
                    assert.deepEqual(response, responseObject);
                    done();
                },
                function(error) {
                    assert.fail('fail', 'success', 'fail response returned when success expected');
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve fetchRelationshipsForForm success test: ' + JSON.stringify(errorMsg)));
            });
        });

        it('fail return results', function(done) {
            req.url = '/apps/123/tables/456?format=display';
            let error_message = "fail unit test case execution";

            executeReqStub.returns(Promise.reject(new Error(error_message)));
            getRelationshipForAppStub.returns(Promise.reject(new Error(error_message)));
            let promise = formsApi.fetchRelationshipsForForm(req);

            promise.then(
                function(error) {
                    assert.fail('success', 'fail', 'success response returned when failure expected');
                    done();
                },
                function(error) {
                    //  just verify that the promise rejected; which error message is returned is insignificant
                    assert.ok(error);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve fetchRelationshipsForForm failure test: ' + JSON.stringify(errorMsg)));
            });
        });
    });

    /**
     * Unit test fetch table fields api
     */
    describe('validate fetchTableFields api', function() {

        let executeReqStub;
        beforeEach(function() {
            executeReqStub = sinon.stub(requestHelper, "executeRequest");
            formsApi.setRequestHelperObject(requestHelper);
        });

        afterEach(function() {
            executeReqStub.restore();
        });

        it('success return results ', function(done) {
            req.url = '/apps/123/tables/456';

            let targetObject = '[{"id":1}]';
            executeReqStub.returns(Promise.resolve(targetObject));
            let promise = formsApi.fetchTableFields(req);

            promise.then(
                function(response) {
                    assert.deepEqual(response, targetObject);
                    done();
                },
                function(error) {
                    assert.fail('fail', 'success', 'fail response returned when success expected');
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve fetchTableFields success test: ' + JSON.stringify(errorMsg)));
            });

        });

        it('fail return results ', function(done) {
            req.url = '/apps/123/tables/456';
            let error_message = "fail unit test case execution";

            executeReqStub.returns(Promise.reject(new Error(error_message)));
            let promise = formsApi.fetchTableFields(req);

            promise.then(
                function(error) {
                    assert.fail('success', 'fail', 'success response returned when failure expected');
                    done();
                },
                function(error) {
                    //  just verify that the promise rejected; which error message is returned is insignificant
                    assert.ok(error);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve fetchTableFields failure test: ' + JSON.stringify(errorMsg)));
            });

        });

    });

    /**
     * Unit test fetch form components api
     */
    describe('validate fetchFormComponents api', function() {

        let fetchFormMetaStub;
        let fetchTableFieldsStub;
        let fetchRecordStub;
        let addQuerySpy;

        const formMeta = () => {
            return {
                "formId": 1,
                "tableId": "0wbfabsaaaaac",
                "appId": "0wbfabsaaaaab",
                "includeBuiltIns": true,
                "tabs": {
                    "0": {
                        "orderIndex": 0,
                        "title": "nameMdhfp1464879524917",
                        "sections": {
                            "0": {
                                "orderIndex": 0,
                                "elements": {
                                    "1": {
                                        "FormFieldElement": {
                                            "displayText": "g6e5k9ySac7EhVscoc5pHKhAJ1skg7F8zIZlHW8hFuZqq486fz",
                                            "fieldId": 3,
                                            "required": false
                                        }
                                    },
                                    "2": {
                                        "FormFieldElement": {
                                            "displayText": "FFWJ4RpUxV5HioEb1G5pHKhAJ1skg7F8zIZlHW8hFuZqhVCqvE",
                                            "fieldId": 2,
                                            "required": false
                                        }
                                    },
                                    "3": {
                                        "FormFieldElement": {
                                            "displayText": "FFWJ4RpUxV5HioEb1G5pHKhAJ1skg7F8zIZlHW8hFuZqhVCqvE",
                                            "fieldId": "",
                                            "required": false
                                        }
                                    },
                                    "4": {
                                        "FormTextElement": {
                                            "displayText": "FFWJ4RpUxV5HioEb1GeipR3EGbmGC6fycKb1kMHlJAvWhVCqvE",
                                            "required": true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            };
        };

        beforeEach(function() {
            fetchFormMetaStub = sinon.stub(formsApi, "fetchFormMetaData");
            fetchTableFieldsStub = sinon.stub(formsApi, "fetchTableFields");
            fetchRecordStub = sinon.stub(recordsApi, "fetchSingleRecordAndFields");
            formsApi.setRecordsApiObject(recordsApi);

            addQuerySpy = sinon.spy(requestHelper, "addQueryParameter");
            formsApi.setRequestHelperObject(requestHelper);
        });

        afterEach(function() {
            fetchFormMetaStub.restore();
            fetchTableFieldsStub.restore();
            fetchRecordStub.restore();
            addQuerySpy.restore();
        });

        it('success return results without elements', function(done) {
            req.url = '/apps/123/tables/456';

            const formNoElements = formMeta();
            delete formNoElements.tabs[0].sections[0].elements;

            let bodyFields = '[{"id":1}]';
            let expectedSuccessResponse = {
                formMeta: formNoElements,
                tableFields: JSON.parse(bodyFields),
                record: [],
                fields: []
            };

            fetchFormMetaStub.returns(Promise.resolve(formNoElements));
            fetchTableFieldsStub.returns(Promise.resolve({body:bodyFields}));
            fetchRecordStub.returns(Promise.resolve({record: expectedSuccessResponse.record, fields: expectedSuccessResponse.fields}));

            let promise = formsApi.fetchFormComponents(req, true);
            promise.then(
                function(response) {
                    assert.deepEqual(response, expectedSuccessResponse);
                    assert(addQuerySpy.callCount === 0, true);
                    done();
                },
                function(error) {
                    assert.fail('fail', 'success', 'failure response returned when success expected');
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve fetchFormComponents success test: ' + JSON.stringify(errorMsg)));
            });

        });

        it('success return results with fids in table including built-ins', function(done) {
            req.url = '/apps/123/tables/456';

            let bodyFields = '[{"id":3,"required":false},{"id":2,"required":false},{"id":1,"builtIn":true,"required":true}]';
            let expectedSuccessResponse = {
                formMeta: formMeta(),
                tableFields: JSON.parse(bodyFields),
                record: 'record1',
                fields: JSON.parse('[{"id":2}]')
            };

            fetchFormMetaStub.returns(Promise.resolve(formMeta()));
            fetchTableFieldsStub.returns(Promise.resolve({body:bodyFields}));
            fetchRecordStub.returns(Promise.resolve({record: expectedSuccessResponse.record, fields: expectedSuccessResponse.fields}));

            let promise = formsApi.fetchFormComponents(req, true);
            promise.then(
                function(response) {
                    assert.deepEqual(response, expectedSuccessResponse);
                    assert(addQuerySpy.calledOnce);
                    done();
                },
                function(error) {
                    assert.fail('fail', 'success', 'failure response returned when success expected');
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve fetchFormComponents success test: ' + JSON.stringify(errorMsg)));
            });

        });

        it('success return results with fid not in table', function(done) {
            req.url = '/apps/123/tables/456';

            let bodyFields = '[{"id":3}]';
            let expectedSuccessResponse = {
                formMeta: formMeta(),
                tableFields: JSON.parse(bodyFields),
                record: 'record1',
                fields: JSON.parse('[{"id":2}]')
            };

            fetchFormMetaStub.returns(Promise.resolve(formMeta()));
            fetchTableFieldsStub.returns(Promise.resolve({body:bodyFields}));
            fetchRecordStub.returns(Promise.resolve({record: expectedSuccessResponse.record, fields: expectedSuccessResponse.fields}));

            let promise = formsApi.fetchFormComponents(req, true);
            promise.then(
                function(response) {
                    assert.deepEqual(response, expectedSuccessResponse);
                    assert(addQuerySpy.calledOnce);
                    done();
                },
                function(error) {
                    assert.fail('fail', 'success', 'failure response returned when success expected');
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve fetchFormComponents success test: ' + JSON.stringify(errorMsg)));
            });

        });

        it('return results with fetchFormMetaData failure', function(done) {
            req.url = '/apps/123/tables/456';

            let error_message = {
                status:errorStatus,
                message: 'error',
                body: '{"msg":"fail unit test case execution"}'
            };
            let body = '{"formId":"1"}';
            let bodyFields = '[{"id":1}]';
            let expectedSuccessResponse = {
                formMeta: JSON.parse(body),
                tableFields: JSON.parse(bodyFields),
                record: [{recordData:2}],
                fields: [{fieldData:3}]
            };

            fetchFormMetaStub.returns(Promise.reject(new Error(error_message)));
            fetchTableFieldsStub.returns(Promise.resolve({body:bodyFields}));
            fetchRecordStub.returns(Promise.resolve({record: expectedSuccessResponse.record, fields: expectedSuccessResponse.fields}));

            let promise = formsApi.fetchFormComponents(req, true);

            promise.then(
                function(response) {
                    assert.fail('success', 'fail', 'success response returned when failure expected');
                    done();
                },
                function(error) {
                    //  just verify that the promise rejected; which error message is returned is insignificant
                    assert.ok(error);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve fetchFormComponents fail fetchFormMetaData test: ' + JSON.stringify(errorMsg)));
            });

        });

        it('return results with fetchSingleRecordAndFields failure', function(done) {
            req.url = '/apps/123/tables/456';

            let error_message = {
                status:errorStatus,
                message: 'error',
                body: '{"msg":"NOT_CONNECTED"}'
            };

            let bodyFields = '[{"id":3}]';

            fetchFormMetaStub.returns(Promise.resolve(formMeta()));
            fetchTableFieldsStub.returns(Promise.resolve({body:bodyFields}));
            fetchRecordStub.returns(Promise.reject(error_message));

            let promise = formsApi.fetchFormComponents(req, true);

            promise.then(
                function(response) {
                    assert.fail('success', 'fail', 'success response returned when failure expected');
                    done();
                },
                function(error) {
                    //  just verify that the promise rejected; which error message is returned is insignificant
                    assert.ok(error);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve fetchFormComponents fail fetchFormMetaData test: ' + JSON.stringify(errorMsg)));
            });

        });

        it('return results with both fetchSingleRecordAndFields and fetchFormMetaData failure', function(done) {
            req.url = '/apps/123/tables/456';

            fetchFormMetaStub.returns(Promise.reject({message:'someError', status:errorStatus}));
            fetchTableFieldsStub.returns(Promise.reject({message:'someError', status:errorStatus}));
            fetchRecordStub.returns(Promise.reject({message:'someError', status:errorStatus}));

            let promise = formsApi.fetchFormComponents(req, true);

            promise.then(
                function(response) {
                    assert.fail('success', 'fail', 'success response returned when failure expected');
                    done();
                },
                function(error) {
                    //  just verify that the promise rejected; which error message is returned is insignificant
                    assert.ok(error);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve fetchFormComponents fail fetchFormMetaData test: ' + JSON.stringify(errorMsg)));
            });

        });

        it('return results with fetchFormMetaData unexpected failure', function(done) {
            req.url = '/apps/123/tables/456';

            fetchFormMetaStub.returns(Promise.resolve('bad object'));
            fetchTableFieldsStub.returns(Promise.resolve({}));
            fetchRecordStub.returns(Promise.resolve({}));

            let promise = formsApi.fetchFormComponents(req, true);

            promise.then(
                function(response) {
                    assert.fail('success', 'fail', 'success response returned when failure expected');
                    done();
                },
                function(error) {
                    //  just verify that the promise rejected; which error message is returned is insignificant
                    assert.ok(error);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve fetchFormComponents fail fetchFormMetaData test: ' + JSON.stringify(errorMsg)));
            });

        });

    });

    describe("validate createField function", function() {
        let executeReqStub = null;

        beforeEach(function() {
            executeReqStub = sinon.stub(requestHelper, "executeRequest");
            formsApi.setRequestHelperObject(requestHelper);
            req.url = 'tables/123/forms';
            req.method = 'post';
            req.rawBody = {name: "test"};
        });

        afterEach(function() {
            req.url = '';
            req.rawBody = {};
            executeReqStub.restore();
        });

        it('success return results ', function(done) {
            executeReqStub.returns(Promise.resolve({'body': '{"id": "11"}'}));
            let promise = formsApi.createForm(req);

            promise.then(
                function(response) {
                    assert.deepEqual(response, {'body': '{"id": "11"}'});
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return when testing createForm success"));
                }
            ).catch(function(errorMsg) {
                done(new Error('createForm: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });

        it('fail return results ', function(done) {
            let error_message = "fail unit test case execution";

            executeReqStub.returns(Promise.reject(new Error(error_message)));
            let promise = formsApi.createForm(req);

            promise.then(
                function() {
                    done(new Error("Unexpected success promise return when testing createForm failure"));
                },
                function(error) {
                    assert.equal(error, "Error: fail unit test case execution");
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('createForm: exception processing failure test: ' + JSON.stringify(errorMsg)));
            });
        });
    });
});
