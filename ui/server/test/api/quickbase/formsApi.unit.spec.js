'use strict';

var config = {
    javaHost: 'http://javaHost',
    SSL_KEY : {
        private    : 'privateKey',
        cert       : 'cert',
        requireCert: true
    }
};
var sinon = require('sinon');
var assert = require('assert');
var requestHelper = require('./../../../src/api/quickbase/requestHelper')(config);
var formsApi = require('../../../src/api/quickbase/formsApi')(config);
var recordsApi = require('../../../src/api/quickbase/recordsApi')(config);
let errorCodes = require('../../../src/api/errorCodes');
let errorStatus = 403;

/**
 * Unit tests for report apis
 */
describe('Validate FormsApi unit tests', function() {
    var req = {
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

        var executeReqStub;
        beforeEach(function() {
            executeReqStub = sinon.stub(requestHelper, "executeRequest");
            formsApi.setRequestHelperObject(requestHelper);
        });

        afterEach(function() {
            executeReqStub.restore();
        });

        it('success return results ', function(done) {
            req.url = '/apps/123/tables/456?format=display';

            var targetObject = "[{formMeta: [id:1]}]";
            executeReqStub.returns(Promise.resolve(targetObject));
            var promise = formsApi.fetchFormMetaData(req);

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

        it('fail return results ', function(done) {
            req.url = '/apps/123/tables/456';
            var error_message = "fail unit test case execution";

            executeReqStub.returns(Promise.reject(new Error(error_message)));
            var promise = formsApi.fetchFormMetaData(req);

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
     * Unit test fetch table fields api
     */
    describe('validate fetchTableFields api', function() {

        var executeReqStub;
        beforeEach(function() {
            executeReqStub = sinon.stub(requestHelper, "executeRequest");
            formsApi.setRequestHelperObject(requestHelper);
        });

        afterEach(function() {
            executeReqStub.restore();
        });

        it('success return results ', function(done) {
            req.url = '/apps/123/tables/456';

            var targetObject = '[{"id":1}]';
            executeReqStub.returns(Promise.resolve(targetObject));
            var promise = formsApi.fetchTableFields(req);

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
            var error_message = "fail unit test case execution";

            executeReqStub.returns(Promise.reject(new Error(error_message)));
            var promise = formsApi.fetchTableFields(req);

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

        var fetchFormMetaStub;
        var fetchTableFieldsStub;
        var fetchRecordStub;
        var addQuerySpy;
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

            var body = '{"formId": 1,"tableId": "0wbfabsaaaaac","appId": "0wbfabsaaaaab",' +
                '"tabs": {"0": {"orderIndex": 0,"title": "nameMdhfp1464879524917",' +
                '"sections": {"0": {"orderIndex": 0}}' +
                '}}' +   // close tabs
                '}';
            var bodyFields = '[{"id":1}]';
            var expectedSuccessResponse = {
                formMeta: JSON.parse(body),
                tableFields: JSON.parse(bodyFields),
                record: [],
                fields: []
            };

            fetchFormMetaStub.returns(Promise.resolve({body:body}));
            fetchTableFieldsStub.returns(Promise.resolve({body:bodyFields}));
            fetchRecordStub.returns(Promise.resolve({record: expectedSuccessResponse.record, fields: expectedSuccessResponse.fields}));

            var promise = formsApi.fetchFormComponents(req);
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

        it('success return results with fids in table', function(done) {
            req.url = '/apps/123/tables/456';

            var body = '{"formId": 1,"tableId": "0wbfabsaaaaac","appId": "0wbfabsaaaaab",' +
                '"tabs": {"0": {"orderIndex": 0,"title": "nameMdhfp1464879524917",' +
                '"sections": {"0": {"orderIndex": 0,' +
                '"elements": {"1": {"FormFieldElement": {"displayText": "g6e5k9ySac7EhVscoc5pHKhAJ1skg7F8zIZlHW8hFuZqq486fz","fieldId": 3}},' +
                '"2": {"FormFieldElement": {"displayText": "FFWJ4RpUxV5HioEb1G5pHKhAJ1skg7F8zIZlHW8hFuZqhVCqvE","fieldId": 2}},' +
                '"3": {"FormFieldElement": {"displayText": "FFWJ4RpUxV5HioEb1G5pHKhAJ1skg7F8zIZlHW8hFuZqhVCqvE","fieldId": ""}},' +
                '"4": {"FormTextElement": {"displayText": "FFWJ4RpUxV5HioEb1GeipR3EGbmGC6fycKb1kMHlJAvWhVCqvE"}}}' +
                '}}' +   // close sections
                '}}' +   // close tabs
                '}';
            var bodyFields = '[{"id":3},{"id":2}]';
            var expectedSuccessResponse = {
                formMeta: JSON.parse(body),
                tableFields: JSON.parse(bodyFields),
                record: 'record1',
                fields: 'field1'
            };

            fetchFormMetaStub.returns(Promise.resolve({body:body}));
            fetchTableFieldsStub.returns(Promise.resolve({body:bodyFields}));
            fetchRecordStub.returns(Promise.resolve({record: expectedSuccessResponse.record, fields: expectedSuccessResponse.fields}));

            var promise = formsApi.fetchFormComponents(req);
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

            var body = '{"formId": 1,"tableId": "0wbfabsaaaaac","appId": "0wbfabsaaaaab",' +
                '"tabs": {"0": {"orderIndex": 0,"title": "nameMdhfp1464879524917",' +
                '"sections": {"0": {"orderIndex": 0,' +
                '"elements": {"1": {"FormFieldElement": {"displayText": "g6e5k9ySac7EhVscoc5pHKhAJ1skg7F8zIZlHW8hFuZqq486fz","fieldId": 3}},' +
                '"2": {"FormFieldElement": {"displayTextWithDeletedFid": "FFWJ4RpUxV5HioEb1G5pHKhAJ1skg7F8zIZlHW8hFuZqhVCqvE","fieldId": "2"}},' +
                '"3": {"FormTextElement": {"displayText": "FFWJ4RpUxV5HioEb1GeipR3EGbmGC6fycKb1kMHlJAvWhVCqvE"}}}' +
                '}}' +   // close sections
                '}}' +   // close tabs
                '}';
            var bodyFields = '[{"id":3}]';
            var expectedSuccessResponse = {
                formMeta: JSON.parse(body),
                tableFields: JSON.parse(bodyFields),
                record: 'record1',
                fields: 'field1'
            };

            fetchFormMetaStub.returns(Promise.resolve({body:body}));
            fetchTableFieldsStub.returns(Promise.resolve({body:bodyFields}));
            fetchRecordStub.returns(Promise.resolve({record: expectedSuccessResponse.record, fields: expectedSuccessResponse.fields}));

            var promise = formsApi.fetchFormComponents(req);
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

            var error_message = {
                status:errorStatus,
                message: 'error',
                body: '{"msg":"fail unit test case execution"}'
            };
            var body = '{"formId":"1"}';
            var bodyFields = '[{"id":1}]';
            var expectedSuccessResponse = {
                formMeta: JSON.parse(body),
                tableFields: JSON.parse(bodyFields),
                record: [{recordData:2}],
                fields: [{fieldData:3}]
            };

            fetchFormMetaStub.returns(Promise.reject(new Error(error_message)));
            fetchTableFieldsStub.returns(Promise.resolve({body:bodyFields}));
            fetchRecordStub.returns(Promise.resolve({record: expectedSuccessResponse.record, fields: expectedSuccessResponse.fields}));

            var promise = formsApi.fetchFormComponents(req);

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

            var error_message = {
                status:errorStatus,
                message: 'error',
                body: '{"msg":"NOT_CONNECTED"}'
            };
            var body = '{"formId": 1,"tableId": "0wbfabsaaaaac","appId": "0wbfabsaaaaab",' +
                '"tabs": {"0": {"orderIndex": 0,"title": "nameMdhfp1464879524917",' +
                '"sections": {"0": {"orderIndex": 0,' +
                '"elements": {"1": {"FormFieldElement": {"displayText": "g6e5k9ySac7EhVscoc5pHKhAJ1skg7F8zIZlHW8hFuZqq486fz","fieldId": 3}},' +
                '"2": {"FormTextElement": {"displayText": "FFWJ4RpUxV5HioEb1GeipR3EGbmGC6fycKb1kMHlJAvWhVCqvE"}}}' +
                '}}' +   // close sections
                '}}' +   // close tabs
                '}';
            var bodyFields = '[{"id":3}]';

            fetchFormMetaStub.returns(Promise.resolve({body:body}));
            fetchTableFieldsStub.returns(Promise.resolve({body:bodyFields}));
            fetchRecordStub.returns(Promise.reject(error_message));

            var promise = formsApi.fetchFormComponents(req);

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

            var promise = formsApi.fetchFormComponents(req);

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

            var promise = formsApi.fetchFormComponents(req);

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
});
