'use strict';

let config = {
    javaHost: 'http://javaHost',
    eeHost: 'http://eeHost',
    SSL_KEY : {
        private    : 'privateKey',
        cert       : 'cert',
        requireCert: true
    }
};
let sinon = require('sinon');
let assert = require('assert');
let requestHelper = require('./../../../src/api/quickbase/requestHelper')(config);
let reportsApi = require('../../../src/api/quickbase/reportsApi')(config);
let recordsApi = require('../../../src/api/quickbase/recordsApi')(config);
let errorCodes = require('../../../src/api/errorCodes');
let constants = require('../../../../common/src/constants');
/**
 * Unit tests for report apis
 */
describe('Validate ReportsApi unit tests', function() {

    /**
     * Unit test fetchReportMetaData api
     */
    describe('validate fetchReportMetaData api', function() {
        let req = {
            headers: {
                'tid': 'tid'
            },
            'Content-Type': 'content-type',
            'url': '',
            'method': 'get'
        };

        let metaResponse = {'body': '{"id":1}'};
        let fetchMetaData = Promise.resolve(metaResponse);

        let getExecuteRequestStub;
        let addQueryParamSpy;
        beforeEach(function() {
            req.url = '/testurl.com';
            reportsApi.setRequestHelper(requestHelper);
            getExecuteRequestStub = sinon.stub(requestHelper, "executeRequest");
            addQueryParamSpy = sinon.spy(requestHelper, "addQueryParameter");
        });
        afterEach(function() {
            getExecuteRequestStub.restore();
            addQueryParamSpy.restore();
            req.params = {};
        });
        it('Test success report meta data', function(done) {
            getExecuteRequestStub.returns(fetchMetaData);
            let promise = reportsApi.fetchReportMetaData(req);
            promise.then(
                function(response) {
                    assert.deepEqual(response, metaResponse);
                    assert.equal(addQueryParamSpy.called, false);
                    done();
                },
                function(error) {
                    done(new Error('Failure promise unexpectedly returned testing fetchReportMetaData success'));
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve fetchReportMetaData success: ' + JSON.stringify(errorMsg)));
            });
        });
        it('Test success report meta data with report defaults parameter set as method parameter', function(done) {
            getExecuteRequestStub.returns(fetchMetaData);
            let promise = reportsApi.fetchReportMetaData(req, 1, true);
            promise.then(
                function(response) {
                    assert.deepEqual(response, metaResponse);
                    assert.equal(addQueryParamSpy.calledWith(sinon.match.any, constants.REQUEST_PARAMETER.META_DATA.WITH_REPORT_DEFAULTS, true), true);
                    done();
                },
                function(error) {
                    done(new Error('Failure promise unexpectedly returned testing fetchReportMetaData success'));
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve fetchReportMetaData success: ' + JSON.stringify(errorMsg)));
            });
        });
        it('Test success report meta data with report defaults query param = true', function(done) {
            req.url += '?' + constants.REQUEST_PARAMETER.META_DATA.WITH_REPORT_DEFAULTS + '=true';
            getExecuteRequestStub.returns(fetchMetaData);
            let promise = reportsApi.fetchReportMetaData(req, 1);
            promise.then(
                function(response) {
                    assert.deepEqual(response, metaResponse);
                    assert.equal(addQueryParamSpy.calledWith(sinon.match.any, constants.REQUEST_PARAMETER.META_DATA.WITH_REPORT_DEFAULTS, true), true);
                    done();
                },
                function(error) {
                    done(new Error('Failure promise unexpectedly returned testing fetchReportMetaData success'));
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve fetchReportMetaData success: ' + JSON.stringify(errorMsg)));
            });
        });
        it('Test success report meta data with report defaults query param = false', function(done) {
            req.url += '?' + constants.REQUEST_PARAMETER.META_DATA.WITH_REPORT_DEFAULTS + '=false';
            getExecuteRequestStub.returns(fetchMetaData);
            let promise = reportsApi.fetchReportMetaData(req, 1);
            promise.then(
                function(response) {
                    assert.deepEqual(response, metaResponse);
                    assert.equal(addQueryParamSpy.called, true);
                    done();
                },
                function(error) {
                    done(new Error('Failure promise unexpectedly returned testing fetchReportMetaData success'));
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve fetchReportMetaData success: ' + JSON.stringify(errorMsg)));
            });
        });

        it('Test success report meta data with invalid report defaults query param', function(done) {
            getExecuteRequestStub.returns(fetchMetaData);
            let promise = reportsApi.fetchReportMetaData(req, 1, 'invalid');
            promise.then(
                function(response) {
                    assert.deepEqual(response, metaResponse);
                    assert.equal(addQueryParamSpy.called, false);
                    done();
                },
                function(error) {
                    done(new Error('Failure promise unexpectedly returned testing fetchReportMetaData success'));
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve fetchReportMetaData success: ' + JSON.stringify(errorMsg)));
            });
        });
        it('Test failure report meta data', function(done) {
            getExecuteRequestStub.returns(Promise.reject(new Error("error")));
            let promise = reportsApi.fetchReportMetaData(req);
            promise.then(
                function(response) {
                    done(new Error('Success promise unexpectedly return testing fetchReportMetaData failure'));
                },
                function(error) {
                    done();
                    assert.deepEqual(error, new Error("error"));
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve fetchReportMetaData failure: ' + JSON.stringify(errorMsg)));
            });
        });
    });

    /**
     * Unit test fetchFacets api
     */
    describe('validate fetchFacets api', function() {
        let executeReqSpy = null;
        let unexpectedSpy = null;
        let req = {
            headers: {
                'tid': 'tid'
            },
            'Content-Type': 'content-type',
            'url': '/testurl.com',
            'method': 'get'
        };
        let reportId = 1;

        beforeEach(function() {
            reportsApi.setRequestHelper(requestHelper);
            executeReqSpy = sinon.spy(requestHelper, "executeRequest");
            unexpectedSpy = sinon.spy(requestHelper, "logUnexpectedError");
        });
        afterEach(function() {
            executeReqSpy.restore();
            unexpectedSpy.restore();
        });

        it('Test success fetch facets', function(done) {
            let requestStub = sinon.stub();
            requestHelper.setRequestObject(requestStub);
            requestStub.yields(null, {statusCode: 200}, {'body': 'body'});
            let promise = reportsApi.fetchReportFacets(req, reportId);
            promise.then(
                function(response) {
                    done();
                    assert.deepEqual(response, {statusCode: 200});
                    assert(executeReqSpy.called);
                    assert.equal(unexpectedSpy.called, false);
                    let opts = executeReqSpy.args[0][1];
                    assert.equal(opts.headers['Content-Type'], 'application/json');
                },
                function(error) {
                    done(new Error("Unexpected promise error returned with test success"));
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve test success: ' + JSON.stringify(errorMsg)));
            });
        });
        it('Test fetch facets url ', function(done) {
            req.url = "/apps/1/tables/2/reports/1/reportResults";
            let requestStub = sinon.stub();
            requestHelper.setRequestObject(requestStub);
            requestStub.yields(null, {statusCode: 200}, {'body': 'body'});
            let promise = reportsApi.fetchReportFacets(req, reportId);
            promise.then(
                function(response) {
                    done();
                    assert.deepEqual(response, {statusCode: 200});
                    assert(executeReqSpy.called);
                    assert.equal(unexpectedSpy.called, false);
                    let opts = executeReqSpy.args[0][1];
                    assert.equal(opts.headers['Content-Type'], 'application/json');
                    let indexOfFacetsURL = opts.url.indexOf('reports/1/facets/results');
                    assert.notEqual(indexOfFacetsURL, -1);
                },
                function(error) {
                    done(new Error("Unexpected promise error returned with test facets url"));
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve test facets url: ' + JSON.stringify(errorMsg)));
            });
        });
        it('Test failure fetch facets', function(done) {
            req.url = "/apps/1/tables/2/reports/1/reportResults";
            let requestStub = sinon.stub();
            requestHelper.setRequestObject(requestStub);
            requestStub.yields(null, {body:'[{"code":' + errorCodes.UNKNOWN + '}]'});
            let promise = reportsApi.fetchReportFacets(req, reportId);
            promise.then(
                function(response) {
                    done();
                    assert.equal(response.errorCode, errorCodes.UNKNOWN);
                    assert(executeReqSpy.called);
                    assert.equal(unexpectedSpy.called, false);
                    let opts = executeReqSpy.args[0][1];
                    assert.equal(opts.headers['Content-Type'], 'application/json');
                },
                function(response) {
                    done(new Error("Unexpected promise error returned with test failure"));
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve test failure: ' + JSON.stringify(errorMsg)));
            });
        });
        it('Test unexpected exception fetch facets', function(done) {
            req.url = "/apps/1/tables/2/reports/1/reportResults";
            let requestStub = sinon.stub();
            requestHelper.setRequestObject(requestStub);
            requestStub.yields(null);
            let promise = reportsApi.fetchReportFacets(req, reportId);
            promise.then(
                function(response) {
                    done();
                    assert.equal(response.errorCode, errorCodes.UNKNOWN);
                    assert(executeReqSpy.called);
                    assert(unexpectedSpy.called);
                },
                function(response) {
                    done(new Error("Unexpected promise error response returned with test failure"));
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve test failure: ' + JSON.stringify(errorMsg)));
            });
        });
    });

    /**
     * Unit test fetchReportRecordsCount api
     */
    describe('validate fetchReportRecordsCount api', function() {
        let req = {
            headers: {
                'tid': 'tid'
            },
            'Content-Type': 'content-type',
            'url': '/testurl.com',
            'method': 'get'
        };
        let countResult = {count:1};
        let getExecuteRequestStub;
        let unexpectedSpy;
        beforeEach(function() {
            getExecuteRequestStub = sinon.stub(requestHelper, "executeRequest");
            unexpectedSpy = sinon.spy(requestHelper, "logUnexpectedError");
        });
        afterEach(function() {
            getExecuteRequestStub.restore();
            unexpectedSpy.restore();
        });
        it('Test success fetch report record count', function(done) {
            getExecuteRequestStub.returns(Promise.resolve(countResult));
            let promise = reportsApi.fetchReportRecordsCount(req);
            promise.then(
                function(response) {
                    assert.deepEqual(response, countResult);
                    assert.equal(unexpectedSpy.called, false);
                    done();
                },
                function(error) {
                    done(new Error('Failure promise unexpectedly returned testing fetchReportRecordsCount success'));
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve fetchReportRecordsCount success: ' + JSON.stringify(errorMsg)));
            });
        });
        it('Test failure fetch report record count', function(done) {
            getExecuteRequestStub.returns(Promise.reject(new Error("error")));
            let promise = reportsApi.fetchReportRecordsCount(req);
            promise.then(
                function(response) {
                    done(new Error('Success promise unexpectedly return testing fetchReportRecordsCount failure'));
                },
                function(error) {
                    done();
                    assert.deepEqual(error, new Error("error"));
                    assert.equal(unexpectedSpy.called, false);
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve fetchReportRecordsCount failure: ' + JSON.stringify(errorMsg)));
            });
        });
    });

    /**
     * Unit test fetchReportCount method
     */
    describe('validate fetchReportCount method', function() {
        let defaultUrl = '/testurl.com';
        let req = {
            headers: {
                'tid': 'tid'
            },
            'Content-Type': 'content-type',
            'url': defaultUrl,
            'method': 'get'
        };

        let countResult = {count:1};
        let reportId = 1;

        let getMetaDataStub;
        let getReportCountStub;
        let getRecordCountStub;
        reportsApi.setRecordsApi(recordsApi);

        beforeEach(function() {
            getMetaDataStub = sinon.stub(reportsApi, "fetchReportMetaData");
            getReportCountStub = sinon.stub(reportsApi, "fetchReportRecordsCount");
            getRecordCountStub = sinon.stub(recordsApi, "fetchCountForRecords");
        });
        afterEach(function() {
            getMetaDataStub.restore();
            getReportCountStub.restore();
            getRecordCountStub.restore();
            req.url = defaultUrl;
        });

        let testCases = [
            {name:'call records count with query and default', query:'{1.EX.test}', defaultQuery:'{2.EX.Y}', expectation: {metaDataSpy: true, recordsSpy: true, reportSpy: false}},
            {name:'call records count with query and null default', query:'{1.EX.test}', defaultQuery:null, expectation: {metaDataSpy: true, recordsSpy: true, reportSpy: false}},
            {name:'call records count with query and empty default', query:'{1.EX.test}', defaultQuery:'', expectation: {metaDataSpy: true, recordsSpy: true, reportSpy: false}},
            {name:'call reports count with null query', query:null, defaultQuery:'{2.EX.Y}', expectation: {metaDataSpy: false, recordsSpy: false, reportSpy: true}},
            {name:'call reports count with empty query', query:'', defaultQuery:'{2.EX.Y}', expectation: {metaDataSpy: false, recordsSpy: false, reportSpy: true}}
        ];

        testCases.forEach((test) => {
            it(test.name, function(done) {
                getMetaDataStub.returns(Promise.resolve({'body': '{"id":1,"query":"' + test.defaultQuery + '","sortList":[{"fieldId":1, "sortOrder":"ASC", "groupType":"EQUALS"},{"fieldId":1, "sortOrder":"DESC"}]}'}));
                getReportCountStub.returns(Promise.resolve('1'));
                getRecordCountStub.returns(Promise.resolve('2'));

                if (test.query) {
                    requestHelper.addQueryParameter(req, constants.REQUEST_PARAMETER.QUERY, test.query);
                }
                reportsApi.fetchReportCount(req, reportId);
                assert.equal(getMetaDataStub.called, test.expectation.metaDataSpy);
                assert.equal(getReportCountStub.called, test.expectation.reportSpy);
                done();
            });
        });
    });


    /**
     * Unit test fetchReportTableHomepage api
     */
    describe('validate fetchReportTableHomepage api', function() {
        let req = {
            headers: {
                'tid': 'tid'
            },
            'Content-Type': 'content-type',
            'url': 'apps/123/tables/456/homepagereportid',
            'method': 'get',
            params: null
        };

        let reportObj = {};

        let getExecuteRequestStub;
        let executeReqLogSpy;
        let fetchReportStub;

        let responseBody = '' +
            '{"name":"Activity Summary","description":"","type":"NEWSUMMARY","ownerId":null,"tableId":"bkqw6gbkb",' +
            '"id":44,"showDescriptionOnReport":false,"hideReport":false,"showSearchBox":false,' +
            '"fids":[142,167,10,112,8,109,58,145,51,87,88,146,147,166,1,2,3,4,5],"sortList":["7:V","142:FY"],' +
            '"facetFids":[142,7,167],"facetBehavior":"none","query":null,"allowEdit":true,"allowView":true,' +
            '"displayNewlyChangedRecords":false,"reportFormat":"","rolesWithGrantedAccess":[12,15,16],"summary":"show"}';

        beforeEach(function() {
            reportObj = {};
            getExecuteRequestStub = sinon.stub(requestHelper, "executeRequest");
            executeReqLogSpy = sinon.spy(requestHelper, "logUnexpectedError");
            fetchReportStub = sinon.stub(reportsApi, "fetchReport");
        });
        afterEach(function() {
            getExecuteRequestStub.restore();
            executeReqLogSpy.restore();
            fetchReportStub.restore();
        });
        it('Test success ', function(done) {
            getExecuteRequestStub.returns(Promise.resolve({body: 1}));
            fetchReportStub.returns(Promise.resolve('reportData'));
            reportsApi.setRequestHelper(requestHelper);

            let promise = reportsApi.fetchTableHomePageReport(req);
            promise.then(
                function(response) {
                    done();
                    assert.deepEqual(response, 'reportData');
                },
                function(error) {
                    done(new Error("promise error response returned when testing success"));
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve fetchTableHomePageReport success: ' + JSON.stringify(errorMsg)));
            });
        });

        it('Test report table homepage not defined ', function(done) {
            getExecuteRequestStub.returns(Promise.resolve({body: ''}));
            fetchReportStub.returns(Promise.resolve('reportData 1'));
            reportsApi.setRequestHelper(requestHelper);

            let promise = reportsApi.fetchTableHomePageReport(req);
            promise.then(
                function(response) {
                    done();
                    assert.deepEqual(response, 'reportData 1');
                },
                function(error) {
                    done(new Error("promise error response returned when testing table homepage zero" + JSON.stringify(error)));
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve fetchTableHomePageReport success when testing table homepage zero: ' + JSON.stringify(errorMsg)));
            });
        });

        it('Test report table homepage zero ', function(done) {
            getExecuteRequestStub.returns(Promise.resolve({body: '0'}));
            fetchReportStub.returns(Promise.resolve('reportData 1'));
            reportsApi.setRequestHelper(requestHelper);

            let promise = reportsApi.fetchTableHomePageReport(req);
            promise.then(
                function(response) {
                    done();
                    assert.deepEqual(response, 'reportData 1');
                },
                function(error) {
                    done(new Error("promise error response returned when testing undefined table homepage " + JSON.stringify(error)));
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve fetchTableHomePageReport success when testing undefined table homepage: ' + JSON.stringify(errorMsg)));
            });
        });

        it('Test report table homepage unexpected exception ', function(done) {
            getExecuteRequestStub.returns(Promise.resolve({body: {'1':'bad'}}));

            let promise = reportsApi.fetchTableHomePageReport(req);
            promise.then(
                function(response) {
                    done(new Error("promise success response returned when testing unexpected exception table homepage"));

                },
                function(error) {
                    assert(executeReqLogSpy.called);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve fetchTableHomePageReport success when testing undefined table homepage: ' + JSON.stringify(errorMsg)));
            });
        });


        it('Test failure on fetch report table home page', function(done) {
            getExecuteRequestStub.returns(Promise.resolve({body: responseBody}));

            let promise = reportsApi.fetchTableHomePageReport(req);
            promise.then(
                function(response) {
                    done(new Error("promise success response returned when testing failure"));
                },
                function(error) {
                    done();
                    assert.deepEqual(error, new Error("error"));
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve fetchReportComponent failure: ' + JSON.stringify(errorMsg)));
            });
        });

        it('Test failure on fetch table homepage report id and error body', function(done) {
            let errorObj = {
                body: 'error body'
            };
            getExecuteRequestStub.returns(Promise.reject(errorObj));

            let promise = reportsApi.fetchTableHomePageReport(req);
            promise.then(
                function(response) {
                    done(new Error("promise success response return when testing failure on reportId and error body"));
                },
                function(error) {
                    done();
                    assert.deepEqual(error, errorObj);
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve fetch table homepage failure when testing failure on reportId and error body: ' + JSON.stringify(errorMsg)));
            });
        });

        it('Test failure on fetch table homepage report id with error status message', function(done) {
            let errorObj = {
                statusMessage: 'error statusMessage'
            };
            getExecuteRequestStub.returns(Promise.reject(errorObj));

            let promise = reportsApi.fetchTableHomePageReport(req);
            promise.then(
                function(response) {
                    done(new Error("promise success response return when testing with error status message"));
                },
                function(error) {
                    done();
                    assert.deepEqual(error, errorObj);
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve fetch table homepage failure when testing with error status message: ' + JSON.stringify(errorMsg)));
            });
        });

        it('Test error on fetch table homepage report id', function(done) {
            getExecuteRequestStub.returns(Promise.resolve({body: 1}));
            fetchReportStub.returns(Promise.reject('error'));

            let promise = reportsApi.fetchTableHomePageReport(req);
            promise.then(
                function(response) {
                    done(new Error("promise success response returned when testing unexpected error on table home page"));
                },
                function(error) {
                    //  an error was thrown
                    done();
                    assert.ok(error);
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve fetch table homepage unexpected failure: ' + JSON.stringify(errorMsg)));
            });
        });
    });

    /**
     * Unit test fetchReport api
     */
    describe('validate fetchReport api', function() {
        let req = {
            headers: {
                'tid': 'tid'
            },
            'Content-Type': 'content-type',
            'url': 'testurl.com?format=display',
            'method': 'get'
        };
        reportsApi.setRecordsApi(recordsApi);
        let expectedSuccessResponse = {
            records: [],
            fields: [],
            groups: [],
            filteredCount: '1'
        };

        let fetchReportGroupingResultsPromise = Promise.resolve({'body': '{"records":null, "type":"GROUP", "groups":[{"summaryRef":{"summaries":["groupName"]}, "records":[[{"id":1, "value":"VP Operations"}, {"id":2, "value":1}]]}]}'});
        let fetchReportResultsPromise = Promise.resolve({'body': '[[ {"id":1, "value": 1234525, "sortList":"1:EQUALS"} ], [ {"id":2, "value": 1234567, "sortList":"1:EQUALS"} ]]'});
        let fetchFieldsPromise = Promise.resolve({'body': '[{ "id":1, "value": 123454, "datatypeAttributes": { "type": "TEXT"}, "display": "12-3454"}, { "id":2, "value": 123454, "datatypeAttributes": { "type": "TEXT"}, "display": "12-3454"}]'});
        let fetchFacetsPromise = Promise.resolve({body:'[[[{"id":142, "value":"2015-08-13"}], [{"id":142, "value":"2015-09-10"}]], [[{"id":7, "value":"Email Received"}], [{"id":7, "value":"Email Sent"}]]]'});
        let facetErrorCode = {errorCode:{id:1, msg:'test'}};
        let fetchFacetsPromiseError = Promise.resolve(facetErrorCode);
        let fetchFacetsPromiseEmpty = Promise.resolve({body:''});
        let fetchFacetsPromiseJunk = Promise.resolve({body:'junk'});
        let fetchMetaData = Promise.resolve({'body': '{"id":1,"sortList":[{"fieldId":1, "sortOrder":"ASC", "groupType":"EQUALS"},{"fieldId":1, "sortOrder":"DESC"}]}'});
        let fetchMetaDataWithQuery = Promise.resolve({'body': '{"id":1,"query":"1.EX.2", "sortList":[{"fieldId":1, "sortOrder":"ASC", "groupType":"EQUALS"},{"fieldId":1, "sortOrder":"DESC"}]}'});

        let fetchCountPromise = Promise.resolve({body:'1'});

        let getFieldsStub;
        let getFacetsStub;
        let getCountStub;
        let getMetaStub;
        let reportResultsStub;
        let executeReqLogSpy;

        beforeEach(function() {
            getFieldsStub = sinon.stub(reportsApi, "fetchFields");
            getFacetsStub = sinon.stub(reportsApi, "fetchReportFacets");
            getCountStub = sinon.stub(reportsApi, "fetchReportCount");
            getMetaStub = sinon.stub(reportsApi, "fetchReportMetaData");
            reportResultsStub = sinon.stub(requestHelper, "executeRequest");
            executeReqLogSpy = sinon.spy(requestHelper, "logUnexpectedError");
            reportsApi.setRequestHelper(requestHelper);
        });

        afterEach(function() {
            getFieldsStub.restore();
            getFacetsStub.restore();
            getCountStub.restore();
            getMetaStub.restore();
            reportResultsStub.restore();
            executeReqLogSpy.restore();
            req.url = 'testurl.com?format=display';
        });

        it('Test get report success - no facets', function(done) {
            req.method = 'get';

            reportResultsStub.returns(fetchReportResultsPromise);
            getFieldsStub.returns(fetchFieldsPromise);
            getCountStub.returns(fetchCountPromise);
            getMetaStub.returns(fetchMetaData);

            let promise = reportsApi.fetchReport(req, 1, false, true);
            promise.then(
                function(response) {
                    //  ensure fetchMetaData includes optional fetch table defaults
                    assert.equal(getMetaStub.calledWith(sinon.match.any, 1, true), true);
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return when testing get report success with no facets"));
                }
            );
        });

        it('Test get report success - no facets or useDefault specified', function(done) {
            req.method = 'get';

            reportResultsStub.returns(fetchReportResultsPromise);
            getFieldsStub.returns(fetchFieldsPromise);
            getCountStub.returns(fetchCountPromise);
            getMetaStub.returns(fetchMetaData);

            let promise = reportsApi.fetchReport(req, 1);
            promise.then(
                function(response) {
                    //  ensure fetchMetaData includes optional fetch table defaults
                    assert.equal(getMetaStub.calledWith(sinon.match.any, 1, true), true);
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return when testing get report success with no facets"));
                }
            );
        });

        it('Test get report success - with facets', function(done) {
            req.method = 'get';

            reportResultsStub.returns(fetchReportResultsPromise);
            getFieldsStub.returns(fetchFieldsPromise);
            getFacetsStub.returns(fetchFacetsPromise);
            getCountStub.returns(fetchCountPromise);
            getMetaStub.returns(fetchMetaData);

            let promise = reportsApi.fetchReport(req, 1, true, true);
            promise.then(
                function(response) {
                    //  ensure fetchMetaData includes optional fetch table defaults
                    assert.equal(getMetaStub.calledWith(sinon.match.any, 1, true), true);
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return when testing get report success with facets"));
                }
            );
        });

        it('Test get report success - with facets error', function(done) {
            req.method = 'get';

            reportResultsStub.returns(fetchReportResultsPromise);
            getFieldsStub.returns(fetchFieldsPromise);
            getFacetsStub.returns(fetchFacetsPromiseError);
            getCountStub.returns(fetchCountPromise);
            getMetaStub.returns(fetchMetaData);

            let promise = reportsApi.fetchReport(req, 1, true, true);
            promise.then(
                function(response) {
                    assert.deepEqual(response.facets, [facetErrorCode]);
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return when testing get report success with facets"));
                }
            );
        });

        it('Test get report success - with facets empty', function(done) {
            req.method = 'get';

            reportResultsStub.returns(fetchReportResultsPromise);
            getFieldsStub.returns(fetchFieldsPromise);
            getFacetsStub.returns(fetchFacetsPromiseEmpty);
            getCountStub.returns(fetchCountPromise);
            getMetaStub.returns(fetchMetaData);

            let promise = reportsApi.fetchReport(req, 1, true, true);
            promise.then(
                function(response) {
                    assert.deepEqual(response.facets, []);
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return when testing get report success with facets"));
                }
            );
        });

        it('Test get report success - with facets junk throwing error', function(done) {
            req.method = 'get';

            reportResultsStub.returns(fetchReportResultsPromise);
            getFieldsStub.returns(fetchFieldsPromise);
            getFacetsStub.returns(fetchFacetsPromiseJunk);
            getCountStub.returns(fetchCountPromise);
            getMetaStub.returns(fetchMetaData);

            let promise = reportsApi.fetchReport(req, 1, true, true);
            promise.then(
                function(response) {
                    assert.deepEqual(response.facets, []);
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return when testing get report success with facets"));
                }
            );
        });

        it('Test get report success with max row limit exceeded', function(done) {
            req.method = 'get';
            req.url += '&offset=0&numRows=' + (constants.PAGE.MAX_NUM_ROWS + 1);

            reportResultsStub.returns(fetchReportResultsPromise);
            getFieldsStub.returns(fetchFieldsPromise);
            getCountStub.returns(fetchCountPromise);
            getMetaStub.returns(fetchMetaData);

            let promise = reportsApi.fetchReport(req, 1, false, true);
            promise.then(
                function(response) {
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return when testing get report success with max row limit exceeded"));
                }
            );
        });

        it('Test get report success with grouping and empty facets', function(done) {
            req.method = 'get';

            reportResultsStub.returns(fetchReportGroupingResultsPromise);
            getFieldsStub.returns(fetchFieldsPromise);
            getCountStub.returns(fetchCountPromise);
            getMetaStub.returns(fetchMetaData);

            let promise = reportsApi.fetchReport(req, 1, false, true);
            promise.then(
                function(response) {
                    done();
                },
                function(error) {
                    done(new Error("error"));
                }
            );
        });

        it('Test get report error', function(done) {
            req.method = 'get';
            reportsApi.setRequestHelper(requestHelper);

            reportResultsStub.returns(Promise.reject(new Error("error")));
            getFieldsStub.returns(fetchFieldsPromise);
            getCountStub.returns(fetchCountPromise);
            getMetaStub.returns(fetchMetaData);

            let promise = reportsApi.fetchReport(req, 1, false, true);
            promise.then(
                function(response) {
                    done(new Error("Unexpected success promise return with test error from fetchReports"));
                },
                function(error) {
                    done();
                    assert.deepEqual(error, new Error("error"));
                }
            );
        });
        it('Test get report error with meta data failure', function(done) {
            req.method = 'get';
            reportsApi.setRequestHelper(requestHelper);

            reportResultsStub.returns(fetchReportResultsPromise);
            getFieldsStub.returns(fetchFieldsPromise);
            getCountStub.returns(fetchCountPromise);
            getMetaStub.returns(Promise.reject('metaError'));

            let promise = reportsApi.fetchReport(req, 1, false, true);
            promise.then(
                function(response) {
                    done(new Error("Unexpected success promise return with test meta data failure from fetchReports(Get request)"));
                },
                function(error) {
                    done();
                    assert.equal(error, 'metaError');
                }
            );
        });
        it('Test get report with unexpected exception', function(done) {
            req.method = 'get';
            reportsApi.setRequestHelper(requestHelper);

            reportResultsStub.returns({body:'bad object structure'});
            getFieldsStub.returns(fetchFieldsPromise);
            getCountStub.returns(fetchCountPromise);
            getMetaStub.returns(fetchMetaData);

            let promise = reportsApi.fetchReport(req, 1, false, true);
            promise.then(
                function(response) {
                    done(new Error("Unexpected success promise return with testing unexpected error from get fetchReports"));
                },
                function(error) {
                    assert(executeReqLogSpy.called);
                    done();
                }
            );
        });
        it('Test dynamic report success WITHOUT meta data overrides', function(done) {
            req.method = 'get';
            reportsApi.setRequestHelper(requestHelper);

            reportResultsStub.returns(fetchReportResultsPromise);
            getFieldsStub.returns(fetchFieldsPromise);
            getCountStub.returns(fetchCountPromise);
            getMetaStub.returns(fetchMetaData);

            let promise = reportsApi.fetchReport(req, 1, false, false);
            promise.then(
                function(response) {
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return with testing meta data override from fetchReports"));
                }
            );
        });
        it('Test dynamic report success with meta data failure', function(done) {
            req.method = 'get';
            reportsApi.setRequestHelper(requestHelper);

            reportResultsStub.returns(fetchReportResultsPromise);
            getFieldsStub.returns(fetchFieldsPromise);
            getCountStub.returns(fetchCountPromise);
            getMetaStub.returns(Promise.reject('meta error'));

            let promise = reportsApi.fetchReport(req, 1, false, false);
            promise.then(
                function(response) {
                    done(new Error("Unexpected success promise return with test meta data failure from fetchReports(post request)"));
                },
                function(error) {
                    done();
                    assert.ok(error);
                }
            );
        });
        it('Test dynamic report success WITH meta data overrides', function(done) {
            req.method = 'get';
            req.url += '&sortList=1:EQUALS&query=1.EX.test&columns=1';
            reportsApi.setRequestHelper(requestHelper);

            reportResultsStub.returns(fetchReportResultsPromise);
            getFieldsStub.returns(fetchFieldsPromise);
            getCountStub.returns(fetchCountPromise);
            getMetaStub.returns(fetchMetaData);

            let promise = reportsApi.fetchReport(req, 1, false, false);
            promise.then(
                function(response) {
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return with testing meta data override from fetchReports"));
                }
            );
        });
        it('Test dynamic report success WITH meta data overrides and default query', function(done) {
            req.method = 'get';
            req.url += '&sortList=1:EQUALS&query=1.EX.test&columns=1';
            reportsApi.setRequestHelper(requestHelper);

            reportResultsStub.returns(fetchReportResultsPromise);
            getFieldsStub.returns(fetchFieldsPromise);
            getCountStub.returns(fetchCountPromise);
            getMetaStub.returns(fetchMetaDataWithQuery);

            let promise = reportsApi.fetchReport(req, 1, false, false);
            promise.then(
                function(response) {
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return with testing meta data override from fetchReports"));
                }
            );
        });
        it('Test dynamic report success WITH NO meta data overrides but a default query', function(done) {
            req.method = 'get';
            req.url += '&sortList=1:EQUALS';
            reportsApi.setRequestHelper(requestHelper);

            reportResultsStub.returns(fetchReportResultsPromise);
            getFieldsStub.returns(fetchFieldsPromise);
            getCountStub.returns(fetchCountPromise);
            getMetaStub.returns(fetchMetaDataWithQuery);

            let promise = reportsApi.fetchReport(req, 1, false, false);
            promise.then(
                function(response) {
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return with testing meta data override from fetchReports"));
                }
            );
        });
        it('Test dynamic report with unexpected exception processing report results', function(done) {
            req.method = 'get';
            reportsApi.setRequestHelper(requestHelper);

            reportResultsStub.returns({body:'bad object structure'});
            getFieldsStub.returns(fetchFieldsPromise);
            getCountStub.returns(fetchCountPromise);
            getMetaStub.returns(fetchMetaData);

            let promise = reportsApi.fetchReport(req, 1, false, false);
            promise.then(
                function(response) {
                    done(new Error("Unexpected success promise return with testing unexpected error from dynamic fetchReports"));
                },
                function(error) {
                    assert(executeReqLogSpy.called);
                    done();
                }
            );
        });
        it('Test dynamic report with unexpected exception processing fields within report results', function(done) {
            req.method = 'get';
            reportsApi.setRequestHelper(requestHelper);

            reportResultsStub.returns(fetchReportResultsPromise);
            getFieldsStub.returns({body:'bad object structure'});
            getCountStub.returns(fetchCountPromise);
            getMetaStub.returns(fetchMetaData);

            let promise = reportsApi.fetchReport(req, 1, false, false);
            promise.then(
                function(response) {
                    done(new Error("Unexpected success promise return with testing unexpected error from dynamic fetchReports"));
                },
                function(error) {
                    assert(executeReqLogSpy.called);
                    done();
                }
            );
        });
    });

    describe("validate createReport function", function() {
        let req = {
            headers: {
                'tid': 'tid'
            },
            'Content-Type': 'content-type',
            'url': '',
            'method': 'get'
        };
        let executeReqStub = null;

        beforeEach(function() {
            executeReqStub = sinon.stub(requestHelper, "executeRequest");
            reportsApi.setRequestHelper(requestHelper);
            req.url = 'tables/123/reports';
            req.method = 'post';
            req.rawBody = {name: "test", type: 'TABLE'};
        });

        afterEach(function() {
            req.url = '';
            req.rawBody = {};
            executeReqStub.restore();
        });

        it('success return results ', function(done) {
            executeReqStub.returns(Promise.resolve({'body': '{"id": "1"}'}));
            let promise = reportsApi.createReport(req);

            promise.then(
                function(response) {
                    assert.deepEqual(response, 1);
                    done();
                },
                function(error) {
                    done(new Error("Unexpected failure promise return when testing createReport success"));
                }
            ).catch(function(errorMsg) {
                done(new Error('createReport: exception processing success test: ' + JSON.stringify(errorMsg)));
            });
        });

        it('fail return results ', function(done) {
            let error_message = "fail unit test case execution";

            executeReqStub.returns(Promise.reject(new Error(error_message)));
            let promise = reportsApi.createReport(req);

            promise.then(
                function() {
                    done(new Error("Unexpected success promise return when testing createReport failure"));
                },
                function(error) {
                    assert.equal(error, "Error: fail unit test case execution");
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('createReport: exception processing failure test: ' + JSON.stringify(errorMsg)));
            });
        });
    });
});
